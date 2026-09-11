"""
The deployed bundle, run for real in-process by genlayer-test's direct
mode. No chain and no network: Statuspage answers come from real incident
records saved in fixtures/, and outgoing transfers are captured instead of
sent. Needs conftest.py's Windows patch.

Each settle test also runs the validator side, because a leader that
reaches the right answer proves nothing if an honest validator would
refuse it, or if a dishonest leader would get through.
"""

import json
import sys
from pathlib import Path

import pytest

BUNDLE = str(Path(__file__).resolve().parent.parent / "contracts" / "peril_bundle.py")
FIXTURES = Path(__file__).resolve().parent / "fixtures"

LONG = "z16209cfb1xv"  # 289 minutes, 2026-09-07
SHORT = "pgn7y7hgd25l"  # 49 minutes, 2026-09-07

BUYER = b"\xb0" * 20
OTHER = b"\xc0" * 20
POOL = 10_000
PREMIUM = 100


def incident_url(ref: str) -> str:
    return r"www\.cloudflarestatus\.com/api/v2/incidents/" + ref + r"\.json"


def record(ref: str) -> dict:
    return json.loads((FIXTURES / f"cloudflare_{ref}.json").read_text(encoding="utf-8"))


def serve(vm, ref: str, body=None, status: int = 200) -> None:
    """Answer the incident URL for `ref` with `body`, the real record by default."""
    vm.clear_mocks()
    if body is None:
        body = record(ref)
    text = body if isinstance(body, str) else json.dumps(body)
    vm.mock_web(incident_url(ref), {"status": status, "body": text})


def set_date(vm, stamp: str) -> None:
    """
    Move the transaction date. `warp` only updates the value injected at
    deploy, so the already-imported message is updated too.
    """
    vm.warp(stamp)
    gl = sys.modules.get("genlayer.gl")
    if gl is not None and getattr(gl, "message_raw", None) is not None:
        gl.message_raw["datetime"] = stamp


@pytest.fixture
def transfers(direct_vm):
    """Every transfer the contract emits, captured rather than sent."""
    sent = []

    def hook(vm, request):
        if "PostMessage" in request:
            sent.append(request["PostMessage"])
            return {"ok": None}
        return None

    direct_vm._gl_call_hook = hook
    return sent


@pytest.fixture
def peril(direct_vm, direct_deploy, transfers):
    contract = direct_deploy(BUNDLE)
    direct_vm.strict_mocks = False
    direct_vm.value = POOL
    contract.fund()
    direct_vm.value = 0
    return contract


def buy(vm, peril, policy_id="p1", premium=PREMIUM, who=BUYER, **kw):
    args = dict(
        cover="cloudflare",
        window_start="2026-09-01",
        window_end="2026-10-01",
        threshold_minutes=60,
    )
    args.update(kw)
    vm.value = premium
    try:
        with vm.prank(who):
            return peril.buy(policy_id, **args)
    finally:
        vm.value = 0


# --------------------------------------------------------------------
# deploying
# --------------------------------------------------------------------


def test_the_bundle_deploys_with_its_registry(direct_deploy):
    fresh = direct_deploy(BUNDLE)
    assert len(fresh.covered()) == 7
    assert "cloudflare:www.cloudflarestatus.com" in fresh.covered()
    assert fresh.count() == 0
    assert fresh.reserves()["pool"] == "0"


# --------------------------------------------------------------------
# the demo pair
# --------------------------------------------------------------------


def test_a_long_outage_pays_the_holder(direct_vm, peril, transfers):
    buy(direct_vm, peril)
    serve(direct_vm, LONG)

    got = peril.settle("p1", LONG)

    assert got["state"] == "paid"
    assert got["outcome"] == "pays"
    assert got["minutes"] == 289
    assert got["incident_id"] == LONG

    # Exactly one transfer, of exactly the payout, to the buyer, on
    # finalisation.
    assert len(transfers) == 1
    sent = transfers[0]
    assert sent["value"] == PREMIUM * 10
    assert sent["address"].as_bytes == BUYER
    assert sent["on"] == "finalized"

    assert peril.reserves() == {
        "pool": str(POOL + PREMIUM - PREMIUM * 10),
        "locked": "0",
        "free": str(POOL + PREMIUM - PREMIUM * 10),
        "multiple": "10",
    }
    assert direct_vm.run_validator() is True


def test_a_short_outage_does_not_pay_and_the_policy_stays_open(direct_vm, peril, transfers):
    buy(direct_vm, peril)
    serve(direct_vm, SHORT)

    got = peril.settle("p1", SHORT)

    assert got["state"] == "open"
    assert got["outcome"] == "under_threshold"
    assert got["minutes"] == 49
    assert transfers == []
    assert peril.reserves()["locked"] == str(PREMIUM * 10)
    assert direct_vm.run_validator() is True


def test_a_refused_policy_can_still_pay_on_a_later_outage(direct_vm, peril, transfers):
    buy(direct_vm, peril)
    serve(direct_vm, SHORT)
    peril.settle("p1", SHORT)

    serve(direct_vm, LONG)
    got = peril.settle("p1", LONG)

    assert got["state"] == "paid"
    assert len(transfers) == 1


def test_the_payout_goes_to_the_buyer_not_whoever_settles(direct_vm, peril, transfers):
    buy(direct_vm, peril, who=BUYER)
    serve(direct_vm, LONG)

    with direct_vm.prank(OTHER):
        peril.settle("p1", LONG)

    assert transfers[0]["address"].as_bytes == BUYER


def test_a_paid_policy_cannot_be_paid_again(direct_vm, peril, transfers):
    buy(direct_vm, peril)
    serve(direct_vm, LONG)
    peril.settle("p1", LONG)

    with direct_vm.expect_revert("already paid"):
        peril.settle("p1", LONG)
    assert len(transfers) == 1


# --------------------------------------------------------------------
# records that must not settle anything
# --------------------------------------------------------------------


def test_an_unresolved_incident_settles_nothing(direct_vm, peril, transfers):
    buy(direct_vm, peril)
    live = record(LONG)
    live["incident"]["resolved_at"] = None
    live["incident"]["status"] = "investigating"
    serve(direct_vm, LONG, live)

    got = peril.settle("p1", LONG)

    assert got["state"] == "open"
    assert got["outcome"] == "unresolved"
    assert transfers == []


def test_an_incident_outside_the_window_settles_nothing(direct_vm, peril, transfers):
    buy(direct_vm, peril, window_start="2026-10-01", window_end="2026-11-01")
    serve(direct_vm, LONG)

    got = peril.settle("p1", LONG)

    assert got["state"] == "open"
    assert got["outcome"] == "outside_window"
    assert transfers == []


def test_a_host_answering_with_a_different_incident_is_refused(direct_vm, peril, transfers):
    """The record fetched for one id must be that id, not the host's latest."""
    buy(direct_vm, peril)
    serve(direct_vm, "abc123", record(LONG))

    with direct_vm.expect_revert("not the incident that was requested"):
        peril.settle("p1", "abc123")
    assert transfers == []
    assert peril.get_policy("p1")["state"] == "open"


def test_an_unreadable_incident_is_refused(direct_vm, peril, transfers):
    buy(direct_vm, peril)
    serve(direct_vm, "nosuch1", "not found", status=404)

    with direct_vm.expect_revert("could not be read"):
        peril.settle("p1", "nosuch1")
    assert transfers == []


@pytest.mark.parametrize("bad", ["../status", "z16209cfb1xv.json", "a/b", "", "  "])
def test_an_incident_id_that_could_leave_the_path_is_refused(direct_vm, peril, bad):
    buy(direct_vm, peril)
    with direct_vm.expect_revert("alphanumeric"):
        peril.settle("p1", bad)


# --------------------------------------------------------------------
# the validator side
# --------------------------------------------------------------------


def test_a_validator_rejects_a_leader_who_lies_about_the_times(direct_vm, peril):
    buy(direct_vm, peril)
    serve(direct_vm, SHORT)
    peril.settle("p1", SHORT)

    stretched = {
        "id": SHORT,
        "created_at": "2026-09-07T11:02:52.000Z",
        "resolved_at": "2026-09-07T13:52:48.345Z",
    }
    assert direct_vm.run_validator(leader_result=stretched) is False


def test_a_validator_rejects_a_leader_who_claims_it_could_not_read(direct_vm, peril):
    """Hiding a readable record would let a leader block a payout."""
    buy(direct_vm, peril)
    serve(direct_vm, LONG)
    peril.settle("p1", LONG)

    blank = {"id": "", "created_at": "", "resolved_at": ""}
    assert direct_vm.run_validator(leader_result=blank) is False


def test_a_validator_rejects_a_leader_that_errored(direct_vm, peril):
    buy(direct_vm, peril)
    serve(direct_vm, LONG)
    peril.settle("p1", LONG)

    assert direct_vm.run_validator(leader_error=Exception("boom")) is False


def test_a_validator_ignores_fields_that_move_between_requests(direct_vm, peril):
    """
    The page's own updated_at and the incident's update list change without
    the outage changing. Honest validators must still agree.
    """
    buy(direct_vm, peril)
    serve(direct_vm, LONG)
    peril.settle("p1", LONG)

    moved = record(LONG)
    moved["page"]["updated_at"] = "2026-09-12T00:00:00.000Z"
    moved["incident"]["updated_at"] = "2026-09-12T00:00:00.000Z"
    moved["incident"]["name"] = "renamed later"
    serve(direct_vm, LONG, moved)

    assert direct_vm.run_validator() is True


def test_a_validator_rejects_when_the_record_itself_changed(direct_vm, peril):
    buy(direct_vm, peril)
    serve(direct_vm, LONG)
    peril.settle("p1", LONG)

    edited = record(LONG)
    edited["incident"]["resolved_at"] = "2026-09-07T15:00:00.000Z"
    serve(direct_vm, LONG, edited)

    assert direct_vm.run_validator() is False


def test_a_validator_agrees_that_nothing_was_read_when_it_cannot_read_either(direct_vm, peril):
    buy(direct_vm, peril)
    serve(direct_vm, "nosuch1", "down", status=503)
    with direct_vm.expect_revert("could not be read"):
        peril.settle("p1", "nosuch1")

    blank = {"id": "", "created_at": "", "resolved_at": ""}
    assert direct_vm.run_validator(leader_result=blank) is True


# --------------------------------------------------------------------
# buying
# --------------------------------------------------------------------


def test_buying_records_the_policy_and_locks_the_payout(direct_vm, peril):
    got = buy(direct_vm, peril)

    assert got["state"] == "open"
    assert got["host"] == "www.cloudflarestatus.com"
    assert got["payout"] == str(PREMIUM * 10)
    assert got["holder"].lower() == "0x" + BUYER.hex()
    assert peril.count() == 1
    assert peril.reserves()["locked"] == str(PREMIUM * 10)
    assert peril.reserves()["pool"] == str(POOL + PREMIUM)


@pytest.mark.parametrize(
    "kw, message",
    [
        ({"cover": "www.cloudflarestatus.com"}, "not a covered service"),
        ({"cover": "stripe"}, "not a covered service"),
        ({"threshold_minutes": 14}, "threshold must be between"),
        ({"threshold_minutes": 1441}, "threshold must be between"),
        ({"window_start": "2026-10-01", "window_end": "2026-09-01"}, "must end after it starts"),
        ({"window_start": "2026-09-01", "window_end": "2026-09-01"}, "must end after it starts"),
        ({"premium": 0}, "send the premium"),
    ],
)
def test_bad_purchases_are_refused(direct_vm, peril, kw, message):
    with direct_vm.expect_revert(message):
        buy(direct_vm, peril, **kw)
    assert peril.count() == 0


def test_a_malformed_window_is_refused(direct_vm, peril):
    with direct_vm.expect_revert():
        buy(direct_vm, peril, window_start="1 Sept 2026")


def test_a_policy_id_cannot_be_reused(direct_vm, peril):
    buy(direct_vm, peril)
    with direct_vm.expect_revert("already exists"):
        buy(direct_vm, peril)


def test_the_pool_will_not_sell_cover_it_cannot_pay(direct_vm, direct_deploy):
    thin = direct_deploy(BUNDLE)
    direct_vm.value = 500
    thin.fund()
    direct_vm.value = 0

    # 100 premium buys 1000 of cover; the pool holds 500 + 100.
    with direct_vm.expect_revert("cannot cover this payout"):
        buy(direct_vm, thin)
    assert thin.reserves()["locked"] == "0"


def test_solvency_counts_cover_already_sold(direct_vm, peril):
    # POOL 10,000. Each sale adds 100 and locks 1,000, so free cover falls
    # by 900 a sale and the twelfth would leave 100 against a 1,000 payout.
    for n in range(11):
        buy(direct_vm, peril, policy_id=f"p{n}")
    with direct_vm.expect_revert("cannot cover this payout"):
        buy(direct_vm, peril, policy_id="p11")


def test_funding_needs_value(direct_vm, peril):
    with direct_vm.expect_revert("send value"):
        peril.fund()


# --------------------------------------------------------------------
# closing
# --------------------------------------------------------------------


def test_a_policy_cannot_close_while_its_window_runs(direct_vm, peril):
    buy(direct_vm, peril)
    set_date(direct_vm, "2026-09-30T23:59:59Z")
    with direct_vm.expect_revert("has not closed yet"):
        peril.close("p1")


def test_closing_after_the_window_releases_the_cover(direct_vm, peril, transfers):
    buy(direct_vm, peril)
    set_date(direct_vm, "2026-10-01T00:00:00Z")

    got = peril.close("p1")

    assert got["state"] == "closed"
    assert peril.reserves()["locked"] == "0"
    # The premium stays with the pool; nothing is paid out.
    assert peril.reserves()["pool"] == str(POOL + PREMIUM)
    assert transfers == []


def test_a_closed_policy_cannot_be_settled(direct_vm, peril, transfers):
    buy(direct_vm, peril)
    set_date(direct_vm, "2026-10-02T00:00:00Z")
    peril.close("p1")

    serve(direct_vm, LONG)
    with direct_vm.expect_revert("already closed"):
        peril.settle("p1", LONG)
    assert transfers == []


def test_an_outage_in_the_window_can_be_settled_after_it_ends(direct_vm, peril, transfers):
    """The window decides which outages count, not when the claim is made."""
    buy(direct_vm, peril)
    set_date(direct_vm, "2026-10-15T00:00:00Z")
    serve(direct_vm, LONG)

    assert peril.settle("p1", LONG)["state"] == "paid"
    assert len(transfers) == 1
