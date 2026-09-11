"""
The deployed bundle, run for real in-process by genlayer-test's direct
mode. No chain and no network: status pages answer with real incident
records saved in fixtures/, the transaction date is set per test, and
outgoing transfers are captured instead of sent. Needs conftest.py's
Windows patch.

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

GITHUB = "www.githubstatus.com"
DISCORD = "discordstatus.com"

# All real, all saved from the providers' own APIs on 2026-09-11.
LONG = "zkxwbgr0cnmx"  # GitHub, critical, 455 min, began 2026-08-17 13:40Z
MID = "y1t7p9fzrlj2"  # GitHub, critical, 169 min, began 2026-08-26 15:11Z
MINOR = "5bn0vk444m1w"  # GitHub, minor, 1206 min, began 2026-08-26 23:37Z
VOICE = "d82z44sn4fpx"  # Discord, major, 140 min, began 2026-09-10 21:21 -07:00

BUYER = b"\xb0" * 20
OTHER = b"\xc0" * 20
FUNDER = b"\xf0" * 20
SECOND = b"\xf1" * 20
POOL = 10_000
PREMIUM = 100


def fixture(ref: str) -> dict:
    name = next(FIXTURES.glob(f"*_{ref}.json"))
    return json.loads(name.read_text(encoding="utf-8"))


def serve(vm, ref: str, body=None, status: int = 200, host: str = GITHUB) -> None:
    """Answer the incident URL for `ref` with `body`, the real record by default."""
    vm.clear_mocks()
    if body is None:
        body = fixture(ref)
    text = body if isinstance(body, str) else json.dumps(body)
    pattern = host.replace(".", r"\.") + r"/api/v2/incidents/" + ref + r"\.json"
    vm.mock_web(pattern, {"status": status, "body": text})


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
        for kind in ("PostMessage", "EthSend"):
            if kind in request:
                msg = request[kind]
                sent.append({"to": bytes(msg["address"].as_bytes), "value": int(msg["value"]), "kind": kind})
                return {"ok": None}
        return None

    direct_vm._gl_call_hook = hook
    return sent


def fund(vm, contract, amount, who=FUNDER):
    vm.value = amount
    try:
        with vm.prank(who):
            return contract.fund()
    finally:
        vm.value = 0


@pytest.fixture
def peril(direct_vm, direct_deploy, transfers):
    contract = direct_deploy(BUNDLE)
    direct_vm.strict_mocks = False
    set_date(direct_vm, "2026-08-10T12:00:00Z")
    fund(direct_vm, contract, POOL)
    return contract


def buy(vm, peril, policy_id="p1", premium=PREMIUM, who=BUYER, **kw):
    """Default: GitHub, 4 hours, the week of 11 to 18 August, which holds LONG."""
    args = dict(
        cover="github",
        window_start="2026-08-11",
        window_end="2026-08-18",
        threshold_minutes=240,
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


def test_the_registry_is_the_priced_table(direct_deploy):
    fresh = direct_deploy(BUNDLE)
    covers = {c["cover"]: c for c in fresh.covered()}
    assert set(covers) == {"github", "discord", "vercel", "netlify", "npm"}
    assert covers["github"]["host"] == GITHUB
    assert covers["github"]["multiples"] == {"240": 2, "480": 3, "720": 6, "1440": 8}
    assert fresh.count() == 0
    assert fresh.reserves()["pool"] == "0"


# --------------------------------------------------------------------
# claims
# --------------------------------------------------------------------


def test_a_long_serious_outage_pays_the_holder(direct_vm, peril, transfers):
    buy(direct_vm, peril)
    set_date(direct_vm, "2026-08-17T22:00:00Z")
    serve(direct_vm, LONG)

    got = peril.settle("p1", LONG)

    assert got["state"] == "paid"
    assert got["outcome"] == "pays"
    assert got["minutes"] == 455
    assert got["impact"] == "critical"

    # Exactly one transfer, of exactly the payout, to the buyer.
    assert transfers == [{"to": BUYER, "value": PREMIUM * 2, "kind": "EthSend"}]
    assert peril.reserves()["pool"] == str(POOL + PREMIUM - PREMIUM * 2)
    assert peril.reserves()["locked"] == "0"
    assert direct_vm.run_validator() is True


def test_the_same_outage_is_under_a_higher_tier(direct_vm, peril, transfers):
    """455 minutes clears the 4 hour tier but not the 8 hour one."""
    buy(direct_vm, peril, threshold_minutes=480)
    serve(direct_vm, LONG)

    got = peril.settle("p1", LONG)

    assert got["state"] == "open"
    assert got["outcome"] == "under_threshold"
    assert got["payout"] == str(PREMIUM * 3)
    assert transfers == []


def test_a_short_serious_outage_does_not_pay(direct_vm, peril, transfers):
    buy(direct_vm, peril, window_start="2026-08-20", window_end="2026-08-27")
    serve(direct_vm, MID)

    got = peril.settle("p1", MID)

    assert got["state"] == "open"
    assert got["outcome"] == "under_threshold"
    assert got["minutes"] == 169
    assert transfers == []
    assert direct_vm.run_validator() is True


def test_a_long_minor_outage_does_not_pay(direct_vm, peril, transfers):
    """Twenty hours, but the provider rated it minor. Its rating decides."""
    buy(direct_vm, peril, window_start="2026-08-20", window_end="2026-08-27")
    serve(direct_vm, MINOR)

    got = peril.settle("p1", MINOR)

    assert got["state"] == "open"
    assert got["outcome"] == "not_serious"
    assert got["impact"] == "minor"
    assert got["minutes"] == 1206
    assert transfers == []


def test_a_page_with_a_time_zone_offset_settles_in_utc(direct_vm, peril, transfers):
    """
    Discord wrote 21:21 on the 10th at -07:00, which is 04:21 UTC on the
    11th. A window starting the 11th covers it; one ending the 11th does not.
    """
    set_date(direct_vm, "2026-09-09T12:00:00Z")
    buy(direct_vm, peril, "late", cover="discord", threshold_minutes=120,
        window_start="2026-09-11", window_end="2026-09-18")
    buy(direct_vm, peril, "early", cover="discord", threshold_minutes=120,
        window_start="2026-09-10", window_end="2026-09-11")
    serve(direct_vm, VOICE, host=DISCORD)

    assert peril.settle("early", VOICE)["outcome"] == "outside_window"
    got = peril.settle("late", VOICE)
    assert got["state"] == "paid"
    assert got["minutes"] == 140
    assert transfers[0]["value"] == PREMIUM * 2


def test_a_refused_policy_can_still_pay_on_a_later_outage(direct_vm, peril, transfers):
    buy(direct_vm, peril, window_start="2026-08-17", window_end="2026-08-24")
    minor = fixture(LONG)
    minor["incident"]["impact"] = "minor"
    serve(direct_vm, LONG, minor)
    assert peril.settle("p1", LONG)["outcome"] == "not_serious"

    # The provider upgrades its rating; the same incident now pays.
    serve(direct_vm, LONG)
    assert peril.settle("p1", LONG)["state"] == "paid"
    assert len(transfers) == 1


def test_the_payout_goes_to_the_buyer_not_whoever_settles(direct_vm, peril, transfers):
    buy(direct_vm, peril, who=BUYER)
    serve(direct_vm, LONG)

    with direct_vm.prank(OTHER):
        peril.settle("p1", LONG)

    assert transfers[0]["to"] == BUYER
    # The EVM path: the only one observed to deliver to a plain wallet.
    assert transfers[0]["kind"] == "EthSend"


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
    live = fixture(LONG)
    live["incident"]["resolved_at"] = None
    live["incident"]["status"] = "investigating"
    serve(direct_vm, LONG, live)

    got = peril.settle("p1", LONG)

    assert got["state"] == "open"
    assert got["outcome"] == "unresolved"
    assert transfers == []


def test_an_incident_outside_the_window_settles_nothing(direct_vm, peril, transfers):
    buy(direct_vm, peril, window_start="2026-08-20", window_end="2026-08-27")
    serve(direct_vm, LONG)

    got = peril.settle("p1", LONG)

    assert got["state"] == "open"
    assert got["outcome"] == "outside_window"
    assert transfers == []


def test_a_host_answering_with_a_different_incident_is_refused(direct_vm, peril, transfers):
    """The record fetched for one id must be that id, not the host's latest."""
    buy(direct_vm, peril)
    serve(direct_vm, "abc123", fixture(LONG))

    with direct_vm.expect_revert("not the incident that was requested"):
        peril.settle("p1", "abc123")
    assert transfers == []
    assert peril.get_policy("p1")["state"] == "open"


@pytest.mark.parametrize(
    "body, status",
    [("not found", 404), ("down", 503), ("<html>maintenance</html>", 200), ("[1, 2]", 200), ('{"incident": "x"}', 200)],
)
def test_an_unreadable_incident_is_refused(direct_vm, peril, transfers, body, status):
    """Including a 200 that is not the expected JSON: that is unreadable too."""
    buy(direct_vm, peril)
    serve(direct_vm, "nosuch1", body, status=status)

    with direct_vm.expect_revert("could not be read"):
        peril.settle("p1", "nosuch1")
    assert transfers == []


@pytest.mark.parametrize("bad", ["../status", "zkxwbgr0cnmx.json", "a/b", "", "  "])
def test_an_incident_id_that_could_leave_the_path_is_refused(direct_vm, peril, bad):
    buy(direct_vm, peril)
    with direct_vm.expect_revert("alphanumeric"):
        peril.settle("p1", bad)


# --------------------------------------------------------------------
# the validator side
# --------------------------------------------------------------------


def settled_honestly(vm, peril, ref=MID):
    buy(vm, peril, window_start="2026-08-20", window_end="2026-08-27")
    serve(vm, ref)
    peril.settle("p1", ref)
    return fixture(ref)["incident"]


def test_a_validator_rejects_a_leader_who_stretches_the_times(direct_vm, peril):
    real = settled_honestly(direct_vm, peril)
    lie = {"id": MID, "created_at": "2026-08-26T11:00:00.000Z",
           "resolved_at": real["resolved_at"], "impact": real["impact"]}
    assert direct_vm.run_validator(leader_result=lie) is False


def test_a_validator_rejects_a_leader_who_upgrades_the_rating(direct_vm, peril):
    real = settled_honestly(direct_vm, peril, MINOR)
    lie = {"id": MINOR, "created_at": real["created_at"],
           "resolved_at": real["resolved_at"], "impact": "critical"}
    assert direct_vm.run_validator(leader_result=lie) is False


def test_a_validator_rejects_a_leader_who_claims_it_could_not_read(direct_vm, peril):
    """Hiding a readable record would let a leader block a payout."""
    settled_honestly(direct_vm, peril)
    blank = {"id": "", "created_at": "", "resolved_at": "", "impact": ""}
    assert direct_vm.run_validator(leader_result=blank) is False


def test_a_validator_rejects_a_leader_that_errored(direct_vm, peril):
    settled_honestly(direct_vm, peril)
    assert direct_vm.run_validator(leader_error=Exception("boom")) is False


def test_a_validator_ignores_fields_that_move_between_requests(direct_vm, peril):
    """
    The page's own updated_at and the incident's name and updates change
    without the outage changing. Honest validators must still agree.
    """
    settled_honestly(direct_vm, peril)
    moved = fixture(MID)
    moved["page"]["updated_at"] = "2026-09-12T00:00:00.000Z"
    moved["incident"]["updated_at"] = "2026-09-12T00:00:00.000Z"
    moved["incident"]["name"] = "renamed later"
    moved["incident"]["incident_updates"] = []
    serve(direct_vm, MID, moved)

    assert direct_vm.run_validator() is True


def test_a_validator_rejects_when_the_record_itself_changed(direct_vm, peril):
    settled_honestly(direct_vm, peril)
    edited = fixture(MID)
    edited["incident"]["resolved_at"] = "2026-08-26T23:00:00.000Z"
    serve(direct_vm, MID, edited)

    assert direct_vm.run_validator() is False


def test_a_validator_agrees_that_nothing_was_read_when_it_cannot_read_either(direct_vm, peril):
    buy(direct_vm, peril)
    serve(direct_vm, "nosuch1", "down", status=503)
    with direct_vm.expect_revert("could not be read"):
        peril.settle("p1", "nosuch1")

    blank = {"id": "", "created_at": "", "resolved_at": "", "impact": ""}
    assert direct_vm.run_validator(leader_result=blank) is True


# --------------------------------------------------------------------
# buying
# --------------------------------------------------------------------


def test_buying_records_the_policy_and_locks_the_payout(direct_vm, peril):
    got = buy(direct_vm, peril, threshold_minutes=720)

    assert got["state"] == "open"
    assert got["cover"] == "github"
    assert got["host"] == GITHUB
    assert got["multiple"] == 6
    assert got["payout"] == str(PREMIUM * 6)
    assert got["holder"].lower() == "0x" + BUYER.hex()
    assert peril.count() == 1
    assert peril.reserves()["locked"] == str(PREMIUM * 6)
    assert peril.reserves()["pool"] == str(POOL + PREMIUM)


def test_the_past_cannot_be_insured(direct_vm, peril):
    """
    Bought on the 18th, a window from the 11th would cover LONG, an outage
    already over. That is the purchase this rule exists to refuse.
    """
    set_date(direct_vm, "2026-08-18T09:00:00Z")
    with direct_vm.expect_revert("starts tomorrow at the earliest"):
        buy(direct_vm, peril)


def test_cover_cannot_start_today(direct_vm, peril):
    """An outage already under way this morning must not be insurable."""
    set_date(direct_vm, "2026-08-11T23:59:00Z")
    with direct_vm.expect_revert("starts tomorrow at the earliest"):
        buy(direct_vm, peril)


def test_cover_can_start_tomorrow(direct_vm, peril):
    set_date(direct_vm, "2026-08-10T23:59:59Z")
    assert buy(direct_vm, peril)["state"] == "open"


@pytest.mark.parametrize(
    "kw, message",
    [
        ({"cover": "cloudflare"}, "not a covered service"),
        ({"cover": "www.githubstatus.com"}, "not a covered service"),
        ({"threshold_minutes": 60}, "sold at thresholds of 240, 480, 720, 1440"),
        ({"threshold_minutes": 300}, "sold at thresholds"),
        ({"window_start": "2026-08-11", "window_end": "2026-08-19"}, "at most 7 days"),
        ({"window_start": "2026-09-10", "window_end": "2026-09-12"}, "at most 30 days ahead"),
        ({"window_start": "2026-08-15", "window_end": "2026-08-15"}, "must end after it starts"),
        ({"window_start": "2026-08-15", "window_end": "2026-08-12"}, "must end after it starts"),
        ({"premium": 0}, "send the premium"),
    ],
)
def test_bad_purchases_are_refused(direct_vm, peril, kw, message):
    with direct_vm.expect_revert(message):
        buy(direct_vm, peril, **kw)
    assert peril.count() == 0


def test_a_malformed_window_is_refused(direct_vm, peril):
    with direct_vm.expect_revert():
        buy(direct_vm, peril, window_start="11 Aug 2026")


def test_a_policy_id_cannot_be_reused_or_blank(direct_vm, peril):
    buy(direct_vm, peril)
    with direct_vm.expect_revert("already exists"):
        buy(direct_vm, peril)
    with direct_vm.expect_revert("name the policy"):
        buy(direct_vm, peril, policy_id="  ")


def test_the_pool_will_not_sell_cover_it_cannot_pay(direct_vm, direct_deploy):
    thin = direct_deploy(BUNDLE)
    set_date(direct_vm, "2026-08-10T12:00:00Z")
    fund(direct_vm, thin, 500)

    # 100 premium at the 24 hour tier buys 800 of cover; the pool holds 600.
    with direct_vm.expect_revert("cannot cover this payout"):
        buy(direct_vm, thin, threshold_minutes=1440)
    assert thin.reserves()["locked"] == "0"


def test_solvency_counts_cover_already_sold(direct_vm, peril):
    # Each 4 hour sale adds 100 and locks 200, so free funds fall by 100 a
    # sale. The hundredth still fits, because its own premium brings free
    # funds back up to exactly its payout; the hundred and first does not.
    for n in range(100):
        buy(direct_vm, peril, policy_id=f"p{n}")
    assert peril.reserves()["free"] == "0"
    with direct_vm.expect_revert("cannot cover this payout"):
        buy(direct_vm, peril, policy_id="p100")


# --------------------------------------------------------------------
# closing
# --------------------------------------------------------------------


def test_a_policy_cannot_close_while_its_window_runs(direct_vm, peril):
    buy(direct_vm, peril)
    set_date(direct_vm, "2026-08-17T23:59:59Z")
    with direct_vm.expect_revert("has not closed yet"):
        peril.close("p1")


def test_closing_after_the_window_releases_the_cover(direct_vm, peril, transfers):
    buy(direct_vm, peril)
    set_date(direct_vm, "2026-08-18T00:00:00Z")

    got = peril.close("p1")

    assert got["state"] == "closed"
    assert peril.reserves()["locked"] == "0"
    # The premium stays with the pool; nothing is paid out.
    assert peril.reserves()["pool"] == str(POOL + PREMIUM)
    assert transfers == []


def test_a_closed_policy_cannot_be_settled(direct_vm, peril, transfers):
    buy(direct_vm, peril)
    set_date(direct_vm, "2026-08-19T00:00:00Z")
    peril.close("p1")

    serve(direct_vm, LONG)
    with direct_vm.expect_revert("already closed"):
        peril.settle("p1", LONG)
    assert transfers == []


def test_an_outage_in_the_window_can_be_settled_after_it_ends(direct_vm, peril, transfers):
    """The window decides which outages count, not when the claim is made."""
    buy(direct_vm, peril)
    set_date(direct_vm, "2026-09-01T00:00:00Z")
    serve(direct_vm, LONG)

    assert peril.settle("p1", LONG)["state"] == "paid"
    assert len(transfers) == 1


# --------------------------------------------------------------------
# funding and withdrawing
# --------------------------------------------------------------------


def test_the_first_deposit_mints_one_share_per_unit(direct_vm, peril):
    assert peril.shares_of("0x" + FUNDER.hex()) == {"shares": str(POOL), "redeemable": str(POOL)}
    assert peril.reserves()["total_shares"] == str(POOL)


def test_funding_needs_value(direct_vm, peril):
    with direct_vm.expect_revert("send value"):
        peril.fund()


def test_premiums_earned_belong_to_the_funders(direct_vm, peril, transfers):
    """A policy that expires unpaid leaves its premium in the pool, for the funders."""
    buy(direct_vm, peril)
    set_date(direct_vm, "2026-08-18T00:00:00Z")
    peril.close("p1")

    with direct_vm.prank(FUNDER):
        peril.withdraw(POOL)

    assert transfers == [{"to": FUNDER, "value": POOL + PREMIUM, "kind": "EthSend"}]
    assert peril.reserves()["pool"] == "0"


def test_a_later_funder_pays_for_premiums_already_earned(direct_vm, peril):
    buy(direct_vm, peril)
    # Pool 10,100 against 10,000 shares: a share now costs 1.01.
    got = fund(direct_vm, peril, 1_010, who=SECOND)
    assert int(got["minted"]) == 1_000


def test_withdrawals_cannot_touch_funds_backing_open_cover(direct_vm, peril, transfers):
    # Pool 10,100 with 200 locked: 9,900 free across 10,000 shares.
    buy(direct_vm, peril)
    with direct_vm.prank(FUNDER):
        got = peril.withdraw(5_000)

    assert got["redeemed"] == "4950"
    assert int(peril.reserves()["free"]) >= 0
    assert int(peril.reserves()["pool"]) >= int(peril.reserves()["locked"])


def test_the_last_shares_wait_for_open_cover(direct_vm, peril):
    buy(direct_vm, peril)
    with direct_vm.prank(FUNDER):
        with direct_vm.expect_revert("once no cover is open"):
            peril.withdraw(POOL)


def test_leaving_before_a_known_payout_gains_nothing(direct_vm, peril, transfers):
    """
    Two equal funders. A qualifying outage is public before anyone settles.
    One withdraws first; the other stays through the payout. They end up
    with the same amount, because the payout was never in the free funds.
    """
    fund(direct_vm, peril, POOL, who=SECOND)
    buy(direct_vm, peril)

    with direct_vm.prank(FUNDER):
        early = int(peril.withdraw(POOL)["redeemed"])

    serve(direct_vm, LONG)
    peril.settle("p1", LONG)

    stayed = int(peril.shares_of("0x" + SECOND.hex())["redeemable"])
    assert early == stayed


@pytest.mark.parametrize("n", [0, -1, POOL + 1])
def test_you_can_only_redeem_shares_you_hold(direct_vm, peril, n):
    with direct_vm.prank(FUNDER):
        with direct_vm.expect_revert("you hold"):
            peril.withdraw(n)


def test_a_stranger_holds_no_shares(direct_vm, peril):
    with direct_vm.prank(OTHER):
        with direct_vm.expect_revert("you hold 0 shares"):
            peril.withdraw(1)
