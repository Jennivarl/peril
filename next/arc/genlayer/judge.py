# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }
"""
The PERIL judge. Decides claims for the USDC pool on Arc.

The money for that pool lives on Arc, which cannot read a web page or check
what GenLayer validators agreed. So the decision is made here, the same way
the GEN contract makes it, and stored where anyone can read it. A relay then
carries a paying verdict to the Arc vault, and every payout on Arc cites the
verdict key it came from, so a payout without a matching verdict here is
public proof that the relay cheated.

This contract holds no money and pays nobody. It only measures.

Verdicts are keyed by the full terms of the policy, not by its id alone:

    {vault}:{policy number}|{cover}|{window start}|{window end}|{threshold}

so nobody can reach a policy first with the wrong terms and occupy its
record. The relay builds the key from the terms the Arc vault stored at
purchase, and an auditor can rebuild it the same way.
"""

from dataclasses import dataclass

from genlayer import *

from contracts.policy import assess, parse_date
from contracts.sources import _COVERS, _incident_by_consensus

_DAY = 86400
_MAX_WINDOW_DAYS = 7


@allow_storage
@dataclass
class Verdict:
    key: str
    policy_ref: str
    cover: str
    host: str
    window_start: str
    window_end: str
    threshold_minutes: u256
    incident_id: str
    impact: str
    outcome: str
    minutes: u256
    reason: str
    pays: bool
    attempts: u256


class PerilJudge(gl.Contract):
    verdicts: TreeMap[str, Verdict]
    keys: DynArray[str]

    def __init__(self):
        pass

    @gl.public.write
    def judge(
        self,
        policy_ref: str,
        cover: str,
        window_start: str,
        window_end: str,
        threshold_minutes: int,
        incident_id: str,
    ) -> dict:
        """
        Measure one published incident against one set of policy terms.

        Callable by anyone: the relay, the policyholder, or a stranger. The
        outcome depends only on the incident record and the terms, so the
        caller has nothing to bias. A verdict that pays is final and cannot
        be overwritten; one that does not pay can be tried again against a
        later incident, exactly as on the GEN contract.
        """
        ref = policy_ref.strip().lower()
        if not ref:
            raise gl.vm.UserError("name the policy this verdict is for")

        name = cover.strip().lower()
        if name not in _COVERS:
            raise gl.vm.UserError("not a covered service")
        host, prices = _COVERS[name]

        threshold = int(threshold_minutes)
        if threshold not in prices:
            offered = ", ".join(str(t) for t in sorted(prices))
            raise gl.vm.UserError(
                f"{name} is sold at thresholds of {offered} minutes"
            )

        start_text = window_start.strip()
        end_text = window_end.strip()
        start = parse_date(start_text)
        end = parse_date(end_text)
        if end <= start or end - start > _MAX_WINDOW_DAYS * _DAY:
            raise gl.vm.UserError("a window runs forward, for at most 7 days")

        incident = incident_id.strip()
        if not incident or not incident.isalnum():
            raise gl.vm.UserError("incident id must be alphanumeric")

        key = _key(ref, name, start_text, end_text, threshold)
        previous = self.verdicts.get(key, None)
        if previous is not None and previous.pays:
            raise gl.vm.UserError("this policy already has a paying verdict")

        found = _incident_by_consensus(host, incident)
        if not str(found["created_at"]):
            raise gl.vm.UserError(
                "that incident could not be read from " + host
            )
        if str(found["id"]) != incident:
            raise gl.vm.UserError(
                "the record returned is not the incident that was requested"
            )

        verdict = assess(
            str(found["created_at"]),
            str(found["resolved_at"]),
            str(found["impact"]),
            start_text,
            end_text,
            threshold,
        )

        attempts = int(previous.attempts) + 1 if previous is not None else 1
        record = Verdict(
            key=key,
            policy_ref=ref,
            cover=name,
            host=host,
            window_start=start_text,
            window_end=end_text,
            threshold_minutes=u256(threshold),
            incident_id=incident,
            impact=str(found["impact"]),
            outcome=verdict.outcome,
            minutes=u256(verdict.minutes),
            reason=verdict.reason,
            pays=verdict.pays,
            attempts=u256(attempts),
        )
        if previous is None:
            self.keys.append(key)
        self.verdicts[key] = record
        return _as_dict(record)

    @gl.public.view
    def get_verdict(self, key: str) -> dict:
        return _as_dict(self.verdicts[key.strip().lower()])

    @gl.public.view
    def verdict_for(
        self,
        policy_ref: str,
        cover: str,
        window_start: str,
        window_end: str,
        threshold_minutes: int,
    ) -> dict:
        """The verdict for these exact terms, or an empty outcome if none."""
        key = _key(
            policy_ref.strip().lower(),
            cover.strip().lower(),
            window_start.strip(),
            window_end.strip(),
            int(threshold_minutes),
        )
        found = self.verdicts.get(key, None)
        if found is None:
            return {"key": key, "outcome": "", "pays": False, "attempts": 0}
        return _as_dict(found)

    @gl.public.view
    def verdict_keys(self) -> list:
        return [k for k in self.keys]

    @gl.public.view
    def count(self) -> int:
        return len(self.keys)


def _key(ref: str, cover: str, start: str, end: str, threshold: int) -> str:
    return f"{ref}|{cover}|{start}|{end}|{threshold}"


def _as_dict(v: Verdict) -> dict:
    return {
        "key": v.key,
        "policy_ref": v.policy_ref,
        "cover": v.cover,
        "host": v.host,
        "window_start": v.window_start,
        "window_end": v.window_end,
        "threshold_minutes": v.threshold_minutes,
        "incident_id": v.incident_id,
        "impact": v.impact,
        "outcome": v.outcome,
        "minutes": v.minutes,
        "reason": v.reason,
        "pays": v.pays,
        "attempts": v.attempts,
    }
