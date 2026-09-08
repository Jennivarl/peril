"""
The arithmetic PERIL settles on. No model, no network, no chain.

Everything here is a pure function over strings and integers, which is the
point. A payout is decided by subtracting two timestamps and comparing the
result to a number the buyer agreed to in advance. There is no judgement
call anywhere in this file, so every validator reaches the same answer for
the same inputs by construction rather than by agreement.

That is deliberate and it is the whole reason the design works. Asking
several independent models to score something out of a hundred produces
several different numbers and the transaction fails. Asking them to fetch a
document and then doing integer arithmetic on it does not.
"""


# Statuspage timestamps look like 2026-09-07T14:25:18.000Z, occasionally
# with an offset instead of Z. Only these two shapes are accepted; anything
# else is refused rather than guessed at, because a misparsed timestamp
# silently changes a payout.
_ISO_MIN = len("2026-09-07T14:25:18Z")


def _days_from_civil(y: int, m: int, d: int) -> int:
    """
    Days since 1970-01-01 for a proleptic Gregorian date.

    Hand-rolled rather than taken from `datetime`, for two reasons. The GenVM
    standard library is a subset and leaning on it invites a surprise at
    deploy time, and this is integer-only arithmetic with no locale, no
    timezone database and no floating point, so it cannot drift between one
    validator and another.

    This is Howard Hinnant's days_from_civil, which is exact across the
    whole range and handles leap years and centuries correctly.
    """
    y -= 1 if m <= 2 else 0
    era = (y if y >= 0 else y - 399) // 400
    yoe = y - era * 400
    doy = (153 * (m + (-3 if m > 2 else 9)) + 2) // 5 + d - 1
    doe = yoe * 365 + yoe // 4 - yoe // 100 + doy
    return era * 146097 + doe - 719468


def _int(text: str) -> int:
    """Strict integer parse. Empty or non-numeric raises rather than coercing."""
    if not text or not text.isdigit():
        raise ValueError("not a number: " + repr(text))
    return int(text)


def parse_iso(stamp: str) -> int:
    """
    An ISO-8601 UTC timestamp as whole seconds since the epoch.

    Fractional seconds are discarded rather than rounded. Statuspage reports
    milliseconds, and rounding could move a duration across a threshold by a
    single second, which is a payout decided by a rounding rule nobody
    agreed to. Truncating is arbitrary too, but it is arbitrary in a way
    that is written down and always favours the same side.

    Only UTC is accepted. An offset such as +02:00 is refused rather than
    converted, because a source that starts emitting offsets has changed its
    format and that deserves a failed settlement and a human look, not a
    silent reinterpretation.
    """
    s = (stamp or "").strip()
    if len(s) < _ISO_MIN or s[4] != "-" or s[7] != "-" or s[10] != "T":
        raise ValueError("not an ISO-8601 UTC timestamp: " + repr(stamp))
    if not s.endswith("Z"):
        raise ValueError("only UTC timestamps ending in Z are accepted: " + repr(stamp))
    if s[13] != ":" or s[16] != ":":
        raise ValueError("malformed time component: " + repr(stamp))

    year = _int(s[0:4])
    month = _int(s[5:7])
    day = _int(s[8:10])
    hour = _int(s[11:13])
    minute = _int(s[14:16])
    second = _int(s[17:19])

    if not (1 <= month <= 12) or not (1 <= day <= 31):
        raise ValueError("date out of range: " + repr(stamp))
    # 60 is allowed: UTC leap seconds are real and a source may emit one.
    if hour > 23 or minute > 59 or second > 60:
        raise ValueError("time out of range: " + repr(stamp))

    return _days_from_civil(year, month, day) * 86400 + hour * 3600 + minute * 60 + second


def parse_date(day: str) -> int:
    """A bare YYYY-MM-DD as seconds since the epoch, at midnight UTC."""
    s = (day or "").strip()
    if len(s) != 10 or s[4] != "-" or s[7] != "-":
        raise ValueError("not a YYYY-MM-DD date: " + repr(day))
    return _days_from_civil(_int(s[0:4]), _int(s[5:7]), _int(s[8:10])) * 86400


def outage_minutes(created_at: str, resolved_at: str) -> int:
    """
    How long the incident lasted, in whole minutes, rounded down.

    Rounding down means a 59 minute 59 second outage does not clear a sixty
    minute threshold. That is the conservative direction: it refuses a
    borderline payout rather than granting one, and a buyer can price around
    a rule that is written down.
    """
    start = parse_iso(created_at)
    end = parse_iso(resolved_at)
    if end < start:
        raise ValueError("incident resolved before it started")
    return (end - start) // 60


# The four ways a settlement can end. Strings rather than an enum so the
# value stored on chain reads the same as the value in a test.
PAYS = "pays"
UNDER_THRESHOLD = "under_threshold"
OUTSIDE_WINDOW = "outside_window"
UNRESOLVED = "unresolved"


class Assessment:
    """
    The result of measuring one incident against one policy.

    A plain class rather than a dataclass because the bundle that gets
    deployed is a single file and the fewer decorators it depends on the
    fewer ways it can fail to load.
    """

    def __init__(self, outcome: str, minutes: int, reason: str):
        self.outcome = outcome
        self.minutes = minutes
        self.reason = reason

    @property
    def pays(self) -> bool:
        return self.outcome == PAYS


def assess(
    created_at: str,
    resolved_at: str,
    window_start: str,
    window_end: str,
    threshold_minutes: int,
) -> Assessment:
    """
    Decide whether one incident triggers one policy.

    Three questions in order, cheapest first, and each one can only refuse:

      Is the incident over? An incident still in progress has no duration
      yet. Settling on a partial outage would let a claimant settle early
      during a long failure and take a smaller payout than they were owed,
      or settle repeatedly as it grew.

      Did it start inside the covered window? The window is half open,
      [start, end), so an incident beginning at the exact instant a window
      closes belongs to the next one and cannot be claimed twice.

      Was it long enough? Compared against the threshold the buyer agreed
      to when the policy was written, which is the only number in this whole
      decision that a human chose.
    """
    if not (resolved_at or "").strip():
        return Assessment(
            UNRESOLVED,
            0,
            "the incident is still open, so it has no final duration to measure",
        )

    minutes = outage_minutes(created_at, resolved_at)
    began = parse_iso(created_at)

    if began < parse_date(window_start) or began >= parse_date(window_end):
        return Assessment(
            OUTSIDE_WINDOW,
            minutes,
            "the incident began outside the covered window",
        )

    if minutes < threshold_minutes:
        return Assessment(
            UNDER_THRESHOLD,
            minutes,
            f"{minutes} minutes is under the {threshold_minutes} minute threshold",
        )

    return Assessment(
        PAYS,
        minutes,
        f"{minutes} minutes meets the {threshold_minutes} minute threshold",
    )
