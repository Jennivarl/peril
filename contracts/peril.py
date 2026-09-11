# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }
"""
PERIL. Cover against a service you depend on going down.

You buy cover on a named service for a window of up to a week, starting
tomorrow at the earliest. If the provider publishes an incident inside your
window that it rated major or critical, and that lasted at least the
threshold you chose, the pool pays you. There is no claim to file and nobody
who can refuse you, because nothing in the decision is a matter of opinion.

The whole settlement is: fetch one incident record, read two timestamps and
the provider's own severity rating, subtract, compare. Every validator does
the same arithmetic on the same document and gets the same answer, which is
why this converges where a contract asking several models to grade something
would not.

Four things are deliberately not negotiable by whoever calls it.

The buyer cannot name a URL. They pick a service from a registry fixed at
deployment, and the contract builds the address it fetches. A caller who
supplies the address the judge reads has appointed themselves the judge.

The buyer cannot set the price. Each service is sold only at the thresholds
and multiples in _COVERS, derived from that provider's own twelve month
history by deploy/price_table.py. A multiple the seller or buyer could pick
per sale would need an underwriter's judgement, which this design removes.

The buyer cannot insure the past. Cover starts the day after it is bought,
so an outage that has already happened, or is already under way, can never
be claimed.

The claimant names an incident by id, but never supplies its contents.
Those are fetched, and every validator fetches them again independently.

Funders own the pool in shares. Premiums raise what a share is worth and
payouts lower it. A share can be redeemed only against funds not backing
open cover, so nobody can leave with money a policyholder may be owed.
"""

from dataclasses import dataclass

from genlayer import *

from contracts.policy import SERIOUS, assess, parse_date

# The registry and the price list, derived by deploy/price_table.py from
# twelve months of each provider's published history (run 2026-09-11; the
# raw incidents are in deploy/price_table.json). Threshold in minutes maps
# to the payout multiple. Only rows where a week of cover has at most a 25%
# chance of paying are offered, so the pool expects to keep at least half
# of what it takes in. Cloudflare and OpenAI publish no history to price
# from, and are left out rather than guessed at.
_COVERS = {
    "github": ("www.githubstatus.com", {240: 2, 480: 3, 720: 6, 1440: 8}),
    "discord": ("discordstatus.com", {120: 2, 240: 5, 480: 8, 720: 8, 1440: 8}),
    "vercel": ("www.vercel-status.com", {120: 2, 240: 3, 480: 5, 720: 5, 1440: 6}),
    "netlify": ("www.netlifystatus.com", {60: 2, 120: 2, 240: 4, 480: 4, 720: 4, 1440: 6}),
    "npm": ("status.npmjs.org", {60: 6, 120: 8, 240: 8, 480: 8, 720: 8, 1440: 8}),
}

_DAY = 86400
# The pricing assumes at most a week of exposure per policy.
_MAX_WINDOW_DAYS = 7
# How far ahead cover can be bought. Longer would tie up the pool's capacity
# on policies that have not started.
_MAX_LEAD_DAYS = 30

STATE_OPEN = "open"
STATE_PAID = "paid"
STATE_CLOSED = "closed"

_BLANK = {"id": "", "created_at": "", "resolved_at": "", "impact": ""}


def _fields_from_incident(body: str) -> dict:
    """
    The fields a settlement depends on, and nothing else.

    Deliberately narrow. A Statuspage response carries fields that move
    between requests, including the page's own updated_at, so comparing
    whole bodies would make honest validators disagree about a record that
    had not changed. A body that is not the expected JSON counts as
    unreadable rather than raising, so a broken page fails the settlement
    cleanly instead of burning every validator round on an exception.
    """
    import json

    try:
        data = json.loads(body)
    except Exception:
        return dict(_BLANK)
    incident = data.get("incident") if isinstance(data, dict) else None
    if not isinstance(incident, dict):
        return dict(_BLANK)
    return {
        "id": str(incident.get("id") or ""),
        "created_at": str(incident.get("created_at") or ""),
        "resolved_at": str(incident.get("resolved_at") or ""),
        "impact": str(incident.get("impact") or ""),
    }


def _read_incident(url: str) -> dict:
    page = ""
    try:
        resp = gl.nondet.web.get(url)
        if resp.status < 400:
            page = (resp.body or b"").decode("utf-8", errors="replace")
    except Exception:
        page = ""
    if not page.strip():
        return dict(_BLANK)
    return _fields_from_incident(page)


@allow_storage
@dataclass
class Policy:
    cover: str
    host: str
    window_start: str
    window_end: str
    threshold_minutes: u256
    multiple: u256
    premium: u256
    payout: u256
    holder: Address
    state: str
    # Filled in at settlement. Empty until then.
    incident_id: str
    impact: str
    outcome: str
    minutes: u256
    reason: str


class Peril(gl.Contract):
    policies: TreeMap[str, Policy]
    ids: DynArray[str]
    # Value committed to open policies. The pool can only sell cover it
    # could actually pay, so this is checked before every sale.
    locked: u256
    pool: u256
    # Ownership of the pool, keyed by lowercase hex address.
    shares: TreeMap[str, u256]
    total_shares: u256

    def __init__(self):
        self.locked = u256(0)
        self.pool = u256(0)
        self.total_shares = u256(0)

    # ----------------------------------------------------------------
    # the pool
    # ----------------------------------------------------------------

    @gl.public.write.payable
    def fund(self) -> dict:
        """
        Add to the pool that pays claims, in exchange for shares of it.

        Shares are minted at the pool's full value, as if all open cover
        will expire unpaid. A new funder therefore pays for their part of
        any premium already earned, and cannot buy in cheaply ahead of
        policies closing. The +1 terms keep the first deposit and a pool
        emptied by payouts well defined.
        """
        amount = gl.message.value
        if amount <= 0:
            raise gl.vm.UserError("send value with this call")
        minted = amount * (self.total_shares + 1) // (self.pool + 1)
        if minted <= 0:
            raise gl.vm.UserError("too small to buy a share of this pool")
        key = gl.message.sender_address.as_hex.lower()
        self.shares[key] = u256(self.shares.get(key, u256(0)) + minted)
        self.total_shares = u256(self.total_shares + minted)
        self.pool = u256(self.pool + amount)
        return {"minted": str(minted), **self.reserves()}

    @gl.public.write
    def withdraw(self, shares: int) -> dict:
        """
        Redeem shares for their part of the funds not backing open cover.

        Valued at the pool's free funds only. What backs an open policy may
        still be owed to its holder, so a funder who leaves early leaves
        their part of it to the funders who stay and carry that risk. This
        also means spotting a qualifying outage before it is settled and
        withdrawing first gains nothing: the payout was never in the free
        funds. The last shares cannot leave while cover is open, or the
        funds behind that cover would belong to nobody.
        """
        n = int(shares)
        key = gl.message.sender_address.as_hex.lower()
        held = int(self.shares.get(key, u256(0)))
        if n <= 0 or n > held:
            raise gl.vm.UserError(f"you hold {held} shares")
        if n == int(self.total_shares) and self.locked > 0:
            raise gl.vm.UserError(
                "the last shares can leave once no cover is open"
            )
        value = n * (self.pool - self.locked) // self.total_shares
        if value <= 0:
            raise gl.vm.UserError("those shares redeem for nothing right now")

        self.shares[key] = u256(held - n)
        self.total_shares = u256(self.total_shares - n)
        self.pool = u256(self.pool - value)
        _pay(gl.message.sender_address, value)
        return {"redeemed": str(value), **self.reserves()}

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
        Buy cover. The value sent is the premium; the payout is the
        registry's multiple for this service and threshold, locked from the
        pool for as long as the policy runs.

        `cover` is a key into the registry, not an address. The contract
        resolves it to a host itself.
        """
        key = policy_id.strip().lower()
        if not key:
            raise gl.vm.UserError("name the policy")
        if key in self.policies:
            raise gl.vm.UserError(f"policy already exists: {key}")

        name = cover.strip().lower()
        if name not in _COVERS:
            raise gl.vm.UserError(
                "not a covered service; call covered() for the list"
            )
        host, prices = _COVERS[name]

        threshold = int(threshold_minutes)
        if threshold not in prices:
            offered = ", ".join(str(t) for t in sorted(prices))
            raise gl.vm.UserError(
                f"{name} is sold at thresholds of {offered} minutes"
            )
        multiple = prices[threshold]

        # Parsing here rather than at settlement means a malformed window is
        # refused at the counter, when the buyer can still fix it.
        start = parse_date(window_start)
        end = parse_date(window_end)
        today = _today()
        if start <= today:
            raise gl.vm.UserError(
                "cover starts tomorrow at the earliest, so a known outage "
                "cannot be insured"
            )
        if start > today + _MAX_LEAD_DAYS * _DAY:
            raise gl.vm.UserError(
                f"cover can be bought at most {_MAX_LEAD_DAYS} days ahead"
            )
        if end <= start:
            raise gl.vm.UserError("the window must end after it starts")
        if end - start > _MAX_WINDOW_DAYS * _DAY:
            raise gl.vm.UserError(
                f"a window is at most {_MAX_WINDOW_DAYS} days"
            )

        premium = gl.message.value
        if premium <= 0:
            raise gl.vm.UserError("send the premium with this call")
        payout = u256(premium * multiple)

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
            cover=name,
            host=host,
            window_start=window_start.strip(),
            window_end=window_end.strip(),
            threshold_minutes=u256(threshold),
            multiple=u256(multiple),
            premium=premium,
            payout=payout,
            holder=gl.message.sender_address,
            state=STATE_OPEN,
            incident_id="",
            impact="",
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
            return _read_incident(url)

        def validator_fn(leaders_res) -> bool:
            if not isinstance(leaders_res, gl.vm.Return):
                return False
            leader = leaders_res.calldata
            mine = _read_incident(url)
            if not mine["created_at"]:
                # Unreadable for me too, so the only claim I can honestly
                # agree with is that nothing was read.
                return str(leader["created_at"]) == ""
            return all(str(leader[f]) == mine[f] for f in _BLANK)

        found = gl.vm.run_nondet_unsafe(leader_fn, validator_fn)

        created = str(found["created_at"])
        resolved = str(found["resolved_at"])
        impact = str(found["impact"])
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

        # Deterministic from here. Every node holds the same fields, so each
        # reaches the same verdict as ordinary contract code.
        verdict = assess(
            created,
            resolved,
            impact,
            deal.window_start,
            deal.window_end,
            int(deal.threshold_minutes),
        )

        deal.incident_id = ref
        deal.impact = impact
        deal.outcome = verdict.outcome
        deal.minutes = u256(verdict.minutes)
        deal.reason = verdict.reason

        if verdict.pays:
            deal.state = STATE_PAID
            self.locked = u256(self.locked - deal.payout)
            self.pool = u256(self.pool - deal.payout)
            self.policies[key] = deal
            # State is settled before any value moves.
            _pay(deal.holder, deal.payout)
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
        if _today() < parse_date(deal.window_end):
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
        """Every service on sale, its host, and its price list."""
        return [
            {
                "cover": name,
                "host": host,
                "serious": list(SERIOUS),
                "max_window_days": _MAX_WINDOW_DAYS,
                "multiples": {str(t): m for t, m in sorted(prices.items())},
            }
            for name, (host, prices) in sorted(_COVERS.items())
        ]

    @gl.public.view
    def reserves(self) -> dict:
        """What the pool holds, what it owes, and what it could still sell."""
        return {
            "pool": str(self.pool),
            "locked": str(self.locked),
            "free": str(self.pool - self.locked),
            "total_shares": str(self.total_shares),
        }

    @gl.public.view
    def shares_of(self, holder: str) -> dict:
        """A funder's shares, and what they would redeem for right now."""
        key = _hex(holder)
        held = int(self.shares.get(key, u256(0)))
        total = int(self.total_shares)
        value = held * int(self.pool - self.locked) // total if total else 0
        return {"shares": str(held), "redeemable": str(value)}


def _today() -> int:
    """
    Midnight UTC of the transaction's date.

    Read from the transaction rather than from a wall clock. `gl.message`
    carries no time, but `gl.message_raw` has a `datetime` string that is
    part of the message itself, so every validator in a round sees the same
    value. Observed on Bradbury as '2026-09-11T14:59:46Z'. Only the date is
    used: windows start and end at midnight, so a day is all the precision
    any rule here needs.
    """
    stamp = str(gl.message_raw["datetime"])
    if len(stamp) < 10:
        raise gl.vm.UserError("the transaction carried no usable date")
    return parse_date(stamp[:10])


def _hex(address) -> str:
    """Calldata turns address-shaped strings into Address; accept both."""
    if hasattr(address, "as_hex"):
        return address.as_hex.lower()
    return str(address).strip().lower()


@gl.evm.contract_interface
class _Wallet:
    """A plain account on the EVM side: nothing to call, only to pay."""

    class View:
        pass

    class Write:
        pass


def _pay(to: Address, amount: int) -> None:
    """
    The one place value leaves the contract.

    Through the EVM interface, not gl.get_contract_at(...).emit_transfer.
    Tested on Bradbury on 2026-09-11 by paying one wallet three ways from
    one contract: the EVM transfer of 0.011 GEN arrived, while GenVM message
    transfers of 0.012 on accepted and 0.013 on finalized never did, hours
    after finalizing. A GenVM message is addressed to a GenVM contract, and
    a policyholder or funder is a plain wallet.
    """
    _Wallet(to).emit_transfer(value=u256(amount))


def _as_dict(key: str, deal: Policy) -> dict:
    return {
        "policy_id": key,
        "cover": deal.cover,
        "host": deal.host,
        "window_start": deal.window_start,
        "window_end": deal.window_end,
        "threshold_minutes": deal.threshold_minutes,
        "multiple": deal.multiple,
        "premium": str(deal.premium),
        "payout": str(deal.payout),
        "holder": deal.holder.as_hex,
        "state": deal.state,
        "incident_id": deal.incident_id,
        "impact": deal.impact,
        "outcome": deal.outcome,
        "minutes": deal.minutes,
        "reason": deal.reason,
    }
