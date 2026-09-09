# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }
"""
PERIL. Cover against a service you depend on going down.

You buy cover on a named service for a window. If that service published an
outage inside your window that lasted longer than the threshold you agreed
to, the pool pays you. There is no claim to file and nobody who can refuse
you, because nothing in the decision is a matter of opinion.

The whole settlement is: fetch one incident record, read two timestamps,
subtract, compare. Every validator does the same arithmetic on the same
document and gets the same answer, which is why this converges where a
contract asking several models to grade something would not.

Three things are deliberately not negotiable by whoever calls it.

The buyer cannot name a URL. They pick a host from a registry fixed at
deployment, and the contract builds the address it fetches. A caller who
supplies the address the judge reads has appointed themselves the judge.

The buyer cannot write the rule. A policy is four numbers and a host, not
a sentence, so there is no prompt to slip an instruction into.

The claimant names an incident by id, but never supplies its contents.
Those are fetched, and every validator fetches them again independently.
"""

from dataclasses import dataclass

from genlayer import *

from contracts.policy import (
    OUTSIDE_WINDOW,
    PAYS,
    UNDER_THRESHOLD,
    UNRESOLVED,
    assess,
    parse_date,
)

# What a premium buys. Fixed at deployment rather than per policy, because a
# multiple the seller could set per sale is a price, and pricing risk needs
# an underwriter making judgements, which is exactly what this design is
# built to do without.
_PAYOUT_MULTIPLE = 10

# Bounds on a threshold. Below the floor a policy would pay out on ordinary
# blips that every service has weekly; above the ceiling it would never pay
# and the premium is simply taken.
_MIN_THRESHOLD = 15
_MAX_THRESHOLD = 1440

STATE_OPEN = "open"
STATE_PAID = "paid"
STATE_CLOSED = "closed"


def _times_from_incident(body: str) -> dict:
    """
    The two timestamps a settlement depends on, and nothing else.

    Deliberately narrow. A Statuspage response carries fields that move
    between requests, including the page's own updated_at, so comparing
    whole bodies would make honest validators disagree about a record that
    had not changed.
    """
    import json

    data = json.loads(body)
    incident = data.get("incident") or {}
    return {
        "id": str(incident.get("id") or ""),
        "created_at": str(incident.get("created_at") or ""),
        "resolved_at": str(incident.get("resolved_at") or ""),
    }


@allow_storage
@dataclass
class Policy:
    host: str
    window_start: str
    window_end: str
    threshold_minutes: u256
    premium: u256
    payout: u256
    holder: Address
    state: str
    # Filled in at settlement. Empty until then, and never written twice.
    incident_id: str
    outcome: str
    minutes: u256
    reason: str


class Peril(gl.Contract):
    covers: TreeMap[str, str]
    policies: TreeMap[str, Policy]
    ids: DynArray[str]
    # Value committed to open policies. The pool can only sell cover it
    # could actually pay, so this is checked before every sale.
    locked: u256
    pool: u256

    def __init__(self):
        # The registry. Fixed here, at deployment, where everyone can read
        # it and nobody can add to it later. Every one of these was fetched
        # and confirmed to answer on /api/v2/incidents/{id}.json.
        self.covers["cloudflare"] = "www.cloudflarestatus.com"
        self.covers["github"] = "www.githubstatus.com"
        self.covers["openai"] = "status.openai.com"
        self.covers["discord"] = "discordstatus.com"
        self.covers["vercel"] = "www.vercel-status.com"
        self.covers["netlify"] = "www.netlifystatus.com"
        self.covers["npm"] = "status.npmjs.org"
        self.locked = u256(0)
        self.pool = u256(0)

    # ----------------------------------------------------------------
    # the pool
    # ----------------------------------------------------------------

    @gl.public.write.payable
    def fund(self) -> dict:
        """
        Add to the pool that pays claims.

        Open to anyone. Whoever funds it takes the risk and keeps the
        premiums of policies that never trigger, which is underwriting.
        """
        amount = gl.message.value
        if amount <= 0:
            raise gl.vm.UserError("send value with this call")
        self.pool = u256(self.pool + amount)
        return {"pool": str(self.pool), "locked": str(self.locked)}

    # ----------------------------------------------------------------
    # buying cover
    # ----------------------------------------------------------------

    @gl.public.write.payable
    def buy(
        self,
        policy_id: str,
        cover: str,
        window_start: str,
        window_end: str,
        threshold_minutes: int,
    ) -> dict:
        """
        Buy cover. The value sent is the premium; the payout is a fixed
        multiple of it, locked from the pool for as long as the policy runs.

        `cover` is a key into the registry, not an address. The contract
        resolves it to a host itself.
        """
        key = policy_id.strip().lower()
        if key in self.policies:
            raise gl.vm.UserError(f"policy already exists: {key}")

        name = cover.strip().lower()
        if name not in self.covers:
            raise gl.vm.UserError(
                "not a covered service; call covered() for the list"
            )

        threshold = int(threshold_minutes)
        if threshold < _MIN_THRESHOLD or threshold > _MAX_THRESHOLD:
            raise gl.vm.UserError(
                f"threshold must be between {_MIN_THRESHOLD} and "
                f"{_MAX_THRESHOLD} minutes"
            )

        # Parsing here rather than at settlement means a malformed window is
        # refused at the counter, when the buyer can still fix it, instead
        # of silently producing a policy that can never settle.
        start = parse_date(window_start)
        end = parse_date(window_end)
        if end <= start:
            raise gl.vm.UserError("the window must end after it starts")

        premium = gl.message.value
        if premium <= 0:
            raise gl.vm.UserError("send the premium with this call")

        payout = u256(premium * _PAYOUT_MULTIPLE)

        # The premium joins the pool before solvency is checked, because it
        # is part of what backs this policy. What must hold afterwards is
        # that every open policy could still be paid in full.
        pool_after = u256(self.pool + premium)
        if pool_after - self.locked < payout:
            raise gl.vm.UserError(
                "the pool cannot cover this payout; fund it or buy less"
            )

        self.pool = pool_after
        self.locked = u256(self.locked + payout)

        deal = Policy(
            host=self.covers[name],
            window_start=window_start.strip(),
            window_end=window_end.strip(),
            threshold_minutes=u256(threshold),
            premium=premium,
            payout=payout,
            holder=gl.message.sender_address,
            state=STATE_OPEN,
            incident_id="",
            outcome="",
            minutes=u256(0),
            reason="",
        )
        self.policies[key] = deal
        self.ids.append(key)
        return _as_dict(key, deal)

    # ----------------------------------------------------------------
    # settling
    # ----------------------------------------------------------------

    @gl.public.write
    def settle(self, policy_id: str, incident_id: str) -> dict:
        """
        Measure one published incident against one policy.

        Callable by anyone. The outcome is fixed by the incident record and
        the numbers the buyer already agreed to, so there is nothing a
        caller could bias by being the one to ask. A privileged settler
        would reintroduce the very thing this removes: somebody who decides
        whether you get paid.
        """
        key = policy_id.strip().lower()
        deal = self.policies[key]
        if deal.state != STATE_OPEN:
            raise gl.vm.UserError(f"policy is already {deal.state}: {key}")

        ref = incident_id.strip()
        if not ref or not ref.isalnum():
            raise gl.vm.UserError("incident id must be alphanumeric")

        # Built from the registry host, never from anything the caller sent.
        url = "https://" + deal.host + "/api/v2/incidents/" + ref + ".json"

        def leader_fn():
            page = ""
            try:
                resp = gl.nondet.web.get(url)
                if resp.status < 400:
                    page = (resp.body or b"").decode("utf-8", errors="replace")
            except Exception:
                page = ""
            if not page.strip():
                return {"id": "", "created_at": "", "resolved_at": ""}
            return _times_from_incident(page)

        def validator_fn(leaders_res) -> bool:
            if not isinstance(leaders_res, gl.vm.Return):
                return False
            leader = leaders_res.calldata

            page = ""
            try:
                resp = gl.nondet.web.get(url)
                if resp.status < 400:
                    page = (resp.body or b"").decode("utf-8", errors="replace")
            except Exception:
                page = ""

            if not page.strip():
                # Unreadable for me too, so the only claim I can honestly
                # agree with is that nothing was read.
                return str(leader["created_at"]) == ""

            mine = _times_from_incident(page)
            return (
                str(leader["id"]) == mine["id"]
                and str(leader["created_at"]) == mine["created_at"]
                and str(leader["resolved_at"]) == mine["resolved_at"]
            )

        found = gl.vm.run_nondet_unsafe(leader_fn, validator_fn)

        created = str(found["created_at"])
        resolved = str(found["resolved_at"])
        returned_id = str(found["id"])

        if not created:
            raise gl.vm.UserError(
                "that incident could not be read from " + deal.host
            )
        # The record has to be the one that was asked for. Without this a
        # host that answers every path with its newest incident would settle
        # policies against something nobody named.
        if returned_id != ref:
            raise gl.vm.UserError(
                "the record returned is not the incident that was requested"
            )

        # Deterministic from here. Every node holds the same two timestamps,
        # so each reaches the same verdict as ordinary contract code without
        # another round of consensus.
        verdict = assess(
            created,
            resolved,
            deal.window_start,
            deal.window_end,
            int(deal.threshold_minutes),
        )

        deal.incident_id = ref
        deal.outcome = verdict.outcome
        deal.minutes = u256(verdict.minutes)
        deal.reason = verdict.reason

        if verdict.pays:
            deal.state = STATE_PAID
            self.locked = u256(self.locked - deal.payout)
            self.pool = u256(self.pool - deal.payout)
            self.policies[key] = deal
            # State is settled before any value moves, and the transfer is
            # emitted on finalisation so a transaction that later rolls back
            # cannot have moved real funds.
            gl.get_contract_at(deal.holder).emit_transfer(value=deal.payout)
        else:
            # A policy that does not pay stays open. One incident failing to
            # clear the bar says nothing about the next one, and closing it
            # here would let anyone burn a policy by settling it against a
            # two minute blip on its first day.
            self.policies[key] = deal

        return _as_dict(key, deal)

    @gl.public.write
    def close(self, policy_id: str) -> dict:
        """
        Release the cover behind a policy whose window has passed.

        Anyone may call it, because it only ever returns money to the pool
        and the window either has closed or has not. Without it the cover
        for every expired policy would stay locked forever and the pool
        would slowly stop being able to sell anything.
        """
        key = policy_id.strip().lower()
        deal = self.policies[key]
        if deal.state != STATE_OPEN:
            raise gl.vm.UserError(f"policy is already {deal.state}: {key}")

        # An incident that began before the window closed can still be
        # settled after it, so closing waits until nothing new can qualify.
        if not _window_has_passed(deal.window_end):
            raise gl.vm.UserError("the covered window has not closed yet")

        deal.state = STATE_CLOSED
        if not deal.reason:
            deal.reason = "the window closed with no qualifying outage"
        self.locked = u256(self.locked - deal.payout)
        self.policies[key] = deal
        return _as_dict(key, deal)

    # ----------------------------------------------------------------
    # reading
    # ----------------------------------------------------------------

    @gl.public.view
    def get_policy(self, policy_id: str) -> dict:
        key = policy_id.strip().lower()
        return _as_dict(key, self.policies[key])

    @gl.public.view
    def policy_ids(self) -> list:
        return [p for p in self.ids]

    @gl.public.view
    def count(self) -> int:
        return len(self.ids)

    @gl.public.view
    def covered(self) -> list:
        return [f"{name}:{host}" for name, host in self.covers.items()]

    @gl.public.view
    def reserves(self) -> dict:
        """What the pool holds, what it owes, and what it could still sell."""
        return {
            "pool": str(self.pool),
            "locked": str(self.locked),
            "free": str(self.pool - self.locked),
            "multiple": str(_PAYOUT_MULTIPLE),
        }


def _window_has_passed(window_end: str) -> bool:
    """
    Has the covered window closed?

    Read from the transaction rather than from a wall clock. `gl.message`
    carries no time, but `gl.message_raw` has a `datetime` string that is
    part of the message itself, so every validator in a round sees the same
    value. A machine clock would differ between them and the round would
    never agree.

    Only the date part is used. The exact time format of that field is not
    documented and a stricter parse would break the moment it changed
    shape, while a window always ends at midnight anyway, so a day is all
    the precision this decision needs.
    """
    stamp = str(gl.message_raw["datetime"])
    if len(stamp) < 10:
        raise gl.vm.UserError("the transaction carried no usable date")
    return parse_date(stamp[:10]) >= parse_date(window_end)


def _as_dict(key: str, deal: Policy) -> dict:
    return {
        "policy_id": key,
        "host": deal.host,
        "window_start": deal.window_start,
        "window_end": deal.window_end,
        "threshold_minutes": deal.threshold_minutes,
        "premium": str(deal.premium),
        "payout": str(deal.payout),
        "holder": deal.holder.as_hex,
        "state": deal.state,
        "incident_id": deal.incident_id,
        "outcome": deal.outcome,
        "minutes": deal.minutes,
        "reason": deal.reason,
    }
