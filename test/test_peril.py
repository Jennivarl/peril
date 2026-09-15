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
  value leaves through one function, to the policy holder or a redeeming funder
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

EXPECTED_WRITE = {"fund", "withdraw", "buy", "settle", "close"}
EXPECTED_VIEW = {"get_policy", "policy_ids", "count", "covered", "reserves", "shares_of"}


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


def module_function(name: str) -> ast.FunctionDef:
    for node in tree().body:
        if isinstance(node, ast.FunctionDef) and node.name == name:
            return node
    raise AssertionError(f"{name} is missing")


def pay_targets() -> dict:
    """Every method that moves value, and who it pays."""
    found = {}
    for name, (_, node) in methods().items():
        for call in ast.walk(node):
            if isinstance(call, ast.Call) and ast.unparse(call.func) == "_pay":
                found.setdefault(name, set()).add(ast.unparse(call.args[0]))
    return found


def test_value_leaves_through_one_function_only():
    """Every transfer goes through _pay, so there is one place to audit."""
    whole = SOURCE.read_text(encoding="utf-8")
    assert whole.count("emit_transfer(") == 1
    assert "emit_transfer(" in ast.unparse(module_function("_pay"))


def test_value_can_only_reach_the_policy_holder_or_a_redeeming_funder():
    """
    A claim pays the person who bought the cover, not whoever settles it.
    A redemption pays the funder whose shares were burned. Nothing else
    moves value, and no address comes from an argument.
    """
    assert pay_targets() == {
        "settle": {"deal.holder"},
        "withdraw": {"gl.message.sender_address"},
    }


def test_state_is_written_before_value_moves():
    """
    The write that marks the policy paid, or burns the shares, must land
    before the transfer is emitted. Reversed, a failure between them leaves
    state that still claims the money is there.
    """
    body = src("settle")
    assert body.index("self.policies[key] = deal") < body.index("_pay(")
    body = src("withdraw")
    assert body.index("self.total_shares = ") < body.index("_pay(")
    assert body.index("self.pool = ") < body.index("_pay(")


def test_payment_uses_the_evm_path():
    """
    gl.get_contract_at(...).emit_transfer never delivered to a plain wallet
    on Bradbury (tested 2026-09-11); the EVM interface did, and did again on
    Studio Next (2026-09-15).
    """
    fn = module_function("_pay")
    code = "\n".join(ast.unparse(stmt) for stmt in fn.body[1:])  # skip docstring
    assert "_Wallet(to).emit_transfer" in code
    assert "get_contract_at" not in code and "get_at" not in code


def test_the_transfer_settles_on_finalisation():
    """
    Accepted state on this network has been observed readable and then
    rolled back. Paying at acceptance can move real value out of a
    transaction that later ceases to exist.
    """
    body = ast.unparse(module_function("_pay"))
    assert "on='accepted'" not in body and 'on="accepted"' not in body


def test_withdrawals_only_reach_free_funds():
    """Money backing open cover may be owed to a holder, so it cannot leave."""
    body = src("withdraw")
    assert "self.pool - self.locked" in body
    assert "no cover is open" in body


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
    assert "not in _COVERS" in body
    assert "_COVERS[name]" in body


def test_the_price_comes_from_the_table_not_the_caller():
    """
    The multiple is looked up from the published table by service and
    threshold. A threshold the table does not list is refused, not priced.
    """
    body = src("buy")
    assert "multiple = prices[threshold]" in body
    assert "threshold not in prices" in body


def test_the_past_cannot_be_insured():
    """
    Cover starts the day after purchase. Without this, anyone could buy a
    policy for an outage that already happened and drain the pool.
    """
    body = src("buy")
    assert "_today()" in body
    assert "start <= today" in body


def test_a_window_is_at_most_a_week():
    """The price table assumes a week of exposure at most."""
    assert "_MAX_WINDOW_DAYS" in src("buy")


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
    assert "_today() < parse_date(deal.window_end)" in src("close")


def test_the_clock_comes_from_the_transaction_not_the_machine():
    """
    `gl.message.raw['datetime']` is part of the message, so every validator
    in a round reads the same value. A machine clock differs between them
    and the round would never agree.
    """
    body = SOURCE.read_text(encoding="utf-8")
    assert "gl.message.raw[\"datetime\"]" in body or "gl.message.raw['datetime']" in body
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


def test_the_runner_header_stands_alone():
    """
    GenVM reads the leading comment lines as the runner header. On Bradbury
    a stray comment line under it deployed as invalid_contract, "trailing
    characters at line 1 column 84", while passing lint and local tests.
    The v0.3 header is the version line, then Depends, then code.
    """
    lines = BUNDLE.read_text(encoding="utf-8").split("\n")
    assert lines[0] == "# v0.3.0"
    assert lines[1].startswith('# { "Depends": "py-genlayer:')
    assert not lines[2].lstrip().startswith("#")


def test_the_runner_pin_is_one_studio_next_runs():
    """
    Studio Next refused the pin in Studio's own examples (9b8kjy...) and
    Bradbury's (1jb45...) with "invalid_contract runner malformed", even for
    Studio's unmodified storage example. 5jycge... deployed and ran.
    Checked 2026-09-15 with gen_getContractSchemaForCode and real deploys.
    """
    header = BUNDLE.read_text(encoding="utf-8").split("\n")[1]
    assert "py-genlayer:5jycge4q8k23462jtb0b9fyey1s9qz928sz2nbrd9mg4sxqg2qng" in header


def test_no_v02_names_survive():
    """
    v0.3 renamed these, and u256 is no longer callable. Any that survived
    would fail on chain, not here.
    """
    body = SOURCE.read_text(encoding="utf-8")
    for old in ("from genlayer import *", "gl.Contract)", "allow_storage", "run_nondet_unsafe", "message_raw", "u256("):
        assert old not in body, old


def test_the_deploy_fits_under_the_gas_cap():
    """
    Bradbury drops any transaction above 16,777,216 gas without an error.
    Measured: 4.0 KB cost 4.32M gas and 21.2 KB cost 17.74M, about 780 gas a
    byte, so 18 KB keeps a deploy near 14.5M with room to spare.
    """
    assert len(BUNDLE.read_bytes()) < 18_000
