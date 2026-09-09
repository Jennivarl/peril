"""
Static safety checks on the contract that holds the pool.

None of this can be executed here, because it needs GenVM and a network.
What these tests do instead is read the source and assert its shape, which
is the right level for the things that actually matter in a contract
holding other people's money: the ordering of a state write against a
transfer, where value is allowed to go, and whether anything a caller sends
is trusted rather than checked.

The rules being enforced:

  state is written before value moves, on every path
  value can only ever reach the policy holder
  a policy settles once, and cannot be settled again
  the fetched address is built from the registry, never from the caller
  the pool cannot sell cover it could not pay
  the bundle that deploys matches the modules it was built from
"""

import ast
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "contracts" / "peril.py"
BUNDLE = ROOT / "contracts" / "peril_bundle.py"

EXPECTED_WRITE = {"fund", "buy", "settle", "close"}
EXPECTED_VIEW = {"get_policy", "policy_ids", "count", "covered", "reserves"}


def tree() -> ast.Module:
    return ast.parse(SOURCE.read_text(encoding="utf-8"))


def peril_class() -> ast.ClassDef:
    for node in tree().body:
        if isinstance(node, ast.ClassDef) and node.name == "Peril":
            return node
    raise AssertionError("Peril class is missing")


def methods() -> dict:
    out = {}
    for node in peril_class().body:
        if not isinstance(node, ast.FunctionDef):
            continue
        for dec in node.decorator_list:
            name = ast.unparse(dec)
            if name.endswith("gl.public.view"):
                out[node.name] = ("view", node)
            elif "gl.public.write" in name:
                out[node.name] = ("write", node)
    return out


def src(name: str) -> str:
    return ast.unparse(methods()[name][1])


# --------------------------------------------------------------------
# surface
# --------------------------------------------------------------------


def test_surface_is_what_is_documented():
    m = methods()
    assert {n for n, (k, _) in m.items() if k == "write"} == EXPECTED_WRITE
    assert {n for n, (k, _) in m.items() if k == "view"} == EXPECTED_VIEW


def test_only_the_two_methods_that_take_money_are_payable():
    """
    Anything payable can receive value. Settling and closing must not, or a
    caller could add funds the accounting never counted.
    """
    payable = set()
    for node in peril_class().body:
        if not isinstance(node, ast.FunctionDef):
            continue
        for dec in node.decorator_list:
            if ast.unparse(dec).endswith("payable"):
                payable.add(node.name)
    assert payable == {"fund", "buy"}


# --------------------------------------------------------------------
# where value can go
# --------------------------------------------------------------------


def transfer_targets() -> list:
    """Every expression this contract emits a transfer to."""
    found = []
    for node in ast.walk(peril_class()):
        if not isinstance(node, ast.Call):
            continue
        text = ast.unparse(node)
        if ".emit_transfer(" in text:
            inner = node.func
            if isinstance(inner, ast.Attribute) and isinstance(inner.value, ast.Call):
                found.append(ast.unparse(inner.value.args[0]))
    return found


def test_value_can_only_reach_the_policy_holder():
    """
    The pool pays the person who bought the cover, and nobody else. Not the
    caller, not the deployer, not an address from an argument.
    """
    targets = transfer_targets()
    assert targets, "no transfer found at all"
    assert set(targets) == {"deal.holder"}, targets


def test_state_is_written_before_value_moves():
    """
    The write that marks the policy paid must land before the transfer is
    emitted. Reversed, a failure between them leaves a policy that still
    reads as open with its money already gone.
    """
    body = src("settle")
    store = body.index("self.policies[key] = deal")
    transfer = body.index("emit_transfer")
    assert store < transfer, "transfer is emitted before the state is stored"


def test_the_transfer_settles_on_finalisation():
    """
    Accepted state on this network has been observed readable and then
    rolled back. Paying at acceptance can move real value out of a
    transaction that later ceases to exist.
    """
    body = src("settle")
    assert "emit_transfer(value=deal.payout)" in body
    assert "on='accepted'" not in body and 'on="accepted"' not in body


# --------------------------------------------------------------------
# what a caller is allowed to influence
# --------------------------------------------------------------------


def test_the_fetched_address_is_built_from_the_registry():
    """
    The single most important line in the contract. A caller who supplies
    the address the validators read has appointed themselves the judge, so
    the host comes from storage and only the incident id comes from the
    caller.
    """
    body = src("settle")
    assert "deal.host" in body, "the host is not taken from the stored policy"
    assert "'https://' + deal.host + '/api/v2/incidents/'" in body.replace('"', "'")
    # No argument may reach the URL except the incident reference itself.
    url_line = [l for l in body.split("\n") if "https://" in l][0]
    assert "policy_id" not in url_line


def test_the_incident_reference_is_constrained():
    """
    An id that could contain a slash or a dot would let a caller walk out of
    the incidents path and point the fetch at any document on that host.
    """
    body = src("settle")
    assert "isalnum()" in body


def test_the_record_returned_must_be_the_one_requested():
    """
    Without this, a host that answered every path with its newest incident
    would settle policies against something nobody asked for.
    """
    assert "returned_id != ref" in src("settle")


def test_the_buyer_cannot_name_a_host():
    """
    `cover` is a key into the registry, and an unknown key is refused rather
    than treated as an address.
    """
    body = src("buy")
    assert "not in self.covers" in body
    assert "self.covers[name]" in body


# --------------------------------------------------------------------
# settling once, and solvency
# --------------------------------------------------------------------


def test_a_policy_settles_once():
    for name in ("settle", "close"):
        assert "!= STATE_OPEN" in src(name), name


def test_a_refusal_leaves_the_policy_open():
    """
    One incident failing to clear the bar says nothing about the next. If a
    refusal closed the policy, anyone could burn someone's cover on its
    first day by settling it against a two minute blip.
    """
    body = src("settle")
    paid = body.index("STATE_PAID")
    # The only state assignment in settle is the paid one.
    assert body.count("deal.state =") == 1
    assert "deal.state = STATE_PAID" in body[paid - 20 : paid + 20]


def test_the_pool_cannot_sell_cover_it_could_not_pay():
    body = src("buy")
    assert "self.locked" in body and "payout" in body
    assert "cannot cover this payout" in body


def test_locked_cover_is_released_on_every_terminal_path():
    """
    Paid and closed both have to give the reservation back, or the pool
    slowly stops being able to sell anything even though it holds funds.
    """
    assert "self.locked - deal.payout" in src("settle")
    assert "self.locked - deal.payout" in src("close")


def test_closing_waits_for_the_window():
    """
    An incident that began before the window closed can still be settled
    after it, so releasing the cover early would strip a holder of a claim
    they were still entitled to make.
    """
    assert "_window_has_passed" in src("close")


def test_the_clock_comes_from_the_transaction_not_the_machine():
    """
    `gl.message_raw['datetime']` is part of the message, so every validator
    in a round reads the same value. A machine clock differs between them
    and the round would never agree.
    """
    body = SOURCE.read_text(encoding="utf-8")
    assert "gl.message_raw[\"datetime\"]" in body or "gl.message_raw['datetime']" in body
    assert "time.time()" not in body and "datetime.now" not in body


# --------------------------------------------------------------------
# the deployable file
# --------------------------------------------------------------------


def test_bundle_is_current():
    """
    The bundle is what deploys. If it drifts from the modules the tests
    cover, the tested code and the running code are different programs.
    """
    subprocess.run(
        [sys.executable, str(ROOT / "deploy" / "build_bundle.py")],
        check=True,
        capture_output=True,
    )
    from deploy.build_bundle import build

    assert BUNDLE.read_text(encoding="utf-8") == build()


def test_the_bundle_has_no_local_imports():
    """GenVM cannot see sibling modules, so any that survived would fail."""
    assert "from contracts." not in BUNDLE.read_text(encoding="utf-8")
