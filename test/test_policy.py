"""
Tests for the arithmetic a payout depends on.

Everything PERIL decides comes out of this file, so these are the tests that
actually matter. The contract around it fetches a document and stores a
result; the question of whether someone is owed money is settled here, and
it is settled without a model, a network or a chain.

The fixtures are real. Both incidents were fetched from Cloudflare's public
status API on 2026-09-08 and anyone can look them up.
"""

import pytest

from contracts.policy import (
    OUTSIDE_WINDOW,
    PAYS,
    UNDER_THRESHOLD,
    UNRESOLVED,
    _days_from_civil,
    assess,
    outage_minutes,
    parse_date,
    parse_iso,
)

# www.cloudflarestatus.com/api/v2/incidents/z16209cfb1xv.json
LONG_CREATED = "2026-09-07T14:25:18.000Z"
LONG_RESOLVED = "2026-09-07T19:14:29.265Z"
LONG_MINUTES = 289

# www.cloudflarestatus.com/api/v2/incidents/pgn7y7hgd25l.json
SHORT_CREATED = "2026-09-07T13:02:52.000Z"
SHORT_RESOLVED = "2026-09-07T13:52:48.345Z"
SHORT_MINUTES = 49  # 49m56s, four seconds short of fifty


# --------------------------------------------------------------------
# the calendar
# --------------------------------------------------------------------


def test_epoch_is_zero():
    assert _days_from_civil(1970, 1, 1) == 0


def test_known_dates():
    assert _days_from_civil(1970, 1, 2) == 1
    assert _days_from_civil(1969, 12, 31) == -1
    assert _days_from_civil(2000, 3, 1) == 11017
    assert _days_from_civil(2026, 9, 7) == 20703


def test_leap_years_including_the_century_rule():
    """
    2000 was a leap year and 1900 was not, which is the case a naive
    "divisible by four" implementation gets wrong. Getting it wrong shifts
    a date by a day and a day is 1440 minutes of a threshold.
    """
    assert _days_from_civil(2000, 3, 1) - _days_from_civil(2000, 2, 28) == 2
    assert _days_from_civil(1900, 3, 1) - _days_from_civil(1900, 2, 28) == 1
    assert _days_from_civil(2024, 3, 1) - _days_from_civil(2024, 2, 28) == 2


# --------------------------------------------------------------------
# parsing
# --------------------------------------------------------------------


def test_parses_a_real_statuspage_timestamp():
    assert parse_iso(LONG_CREATED) == _days_from_civil(2026, 9, 7) * 86400 + 14 * 3600 + 25 * 60 + 18


def test_fractional_seconds_are_dropped_not_rounded():
    """
    .265 would round up to the next second. Rounding could push a duration
    across a threshold, so a payout would turn on a rule nobody agreed to.
    """
    assert parse_iso("2026-09-07T19:14:29.265Z") == parse_iso("2026-09-07T19:14:29Z")
    assert parse_iso("2026-09-07T19:14:29.999Z") == parse_iso("2026-09-07T19:14:29Z")


def test_a_leap_second_is_accepted():
    parse_iso("2016-12-31T23:59:60Z")


@pytest.mark.parametrize(
    "bad",
    [
        "",
        "not a date",
        "2026-09-07",
        "2026-09-07T14:25:18+02:00",
        "2026-09-07 14:25:18Z",
        "2026-13-07T14:25:18Z",
        "2026-09-07T25:25:18Z",
        "20260907T142518Z",
    ],
)
def test_refuses_anything_it_does_not_recognise(bad):
    """
    A source that changes format should fail loudly. Silently
    reinterpreting it is how a payout gets decided by a parser bug.
    """
    with pytest.raises(ValueError):
        parse_iso(bad)


def test_parse_date_is_midnight_utc():
    assert parse_date("2026-09-07") == _days_from_civil(2026, 9, 7) * 86400


# --------------------------------------------------------------------
# duration
# --------------------------------------------------------------------


def test_the_real_cloudflare_incidents():
    assert outage_minutes(LONG_CREATED, LONG_RESOLVED) == LONG_MINUTES
    assert outage_minutes(SHORT_CREATED, SHORT_RESOLVED) == SHORT_MINUTES


def test_minutes_round_down():
    """
    A 59 minute 59 second outage does not clear a sixty minute threshold.
    Rounding down refuses the borderline case rather than granting it.
    """
    assert outage_minutes("2026-01-01T00:00:00Z", "2026-01-01T00:59:59Z") == 59
    assert outage_minutes("2026-01-01T00:00:00Z", "2026-01-01T01:00:00Z") == 60


def test_an_incident_cannot_end_before_it_starts():
    with pytest.raises(ValueError):
        outage_minutes("2026-09-07T19:00:00Z", "2026-09-07T14:00:00Z")


def test_duration_spanning_midnight_and_a_month_boundary():
    assert outage_minutes("2026-08-31T23:30:00Z", "2026-09-01T00:30:00Z") == 60


# --------------------------------------------------------------------
# the decision
# --------------------------------------------------------------------


def w(created, resolved, threshold=60, start="2026-09-01", end="2026-10-01"):
    return assess(created, resolved, start, end, threshold)


def test_a_long_outage_pays():
    got = w(LONG_CREATED, LONG_RESOLVED)
    assert got.outcome == PAYS
    assert got.pays
    assert got.minutes == LONG_MINUTES
    assert "289" in got.reason and "60" in got.reason


def test_a_short_outage_does_not():
    got = w(SHORT_CREATED, SHORT_RESOLVED)
    assert got.outcome == UNDER_THRESHOLD
    assert not got.pays
    assert got.minutes == SHORT_MINUTES


def test_exactly_the_threshold_pays():
    """The buyer agreed to "at least", so the boundary itself is covered."""
    got = w("2026-09-07T00:00:00Z", "2026-09-07T01:00:00Z", threshold=60)
    assert got.outcome == PAYS
    assert got.minutes == 60


def test_one_minute_short_does_not():
    got = w("2026-09-07T00:00:00Z", "2026-09-07T00:59:00Z", threshold=60)
    assert got.outcome == UNDER_THRESHOLD


def test_an_open_incident_cannot_settle():
    """
    Settling mid-outage would let a claimant take a smaller payout than they
    were owed, or settle again and again as the outage grew.
    """
    got = w(LONG_CREATED, "")
    assert got.outcome == UNRESOLVED
    assert got.minutes == 0


def test_an_incident_before_the_window_is_refused():
    got = w("2026-08-31T23:00:00Z", "2026-09-01T06:00:00Z")
    assert got.outcome == OUTSIDE_WINDOW


def test_an_incident_after_the_window_is_refused():
    got = w("2026-10-01T00:00:00Z", "2026-10-01T09:00:00Z")
    assert got.outcome == OUTSIDE_WINDOW


def test_the_window_is_half_open():
    """
    An incident beginning at the exact instant a window closes belongs to
    the next window, so consecutive policies cannot both claim it.
    """
    assert w("2026-09-01T00:00:00Z", "2026-09-01T09:00:00Z").outcome == PAYS
    assert w("2026-10-01T00:00:00Z", "2026-10-01T09:00:00Z").outcome == OUTSIDE_WINDOW


def test_membership_is_decided_by_when_it_started_not_when_it_ended():
    """
    An outage that begins inside the window and runs past the end is
    covered in full. Splitting it would mean a policy paying for part of an
    outage, and there is no honest place to put the boundary.
    """
    got = w("2026-09-30T22:00:00Z", "2026-10-01T04:00:00Z")
    assert got.outcome == PAYS
    assert got.minutes == 360


def test_the_outcome_is_the_same_however_many_times_it_is_asked():
    """
    Every validator runs this on the same inputs and must reach the same
    answer, so it has to be a pure function of its arguments and nothing
    else. No clock, no randomness, no ambient state.
    """
    first = w(LONG_CREATED, LONG_RESOLVED)
    for _ in range(50):
        again = w(LONG_CREATED, LONG_RESOLVED)
        assert (again.outcome, again.minutes, again.reason) == (
            first.outcome,
            first.minutes,
            first.reason,
        )
