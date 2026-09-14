"""
The covered services, and how an incident record is read from them.

Shared by the GEN contract (peril.py) and the judge that decides claims for
the USDC pool on Arc (judge.py), so both read a provider's status page the
same way and neither can drift from the other.
"""

from genlayer import *

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


def _incident_by_consensus(host: str, ref: str) -> dict:
    """
    One incident record, agreed by the validators.

    The URL is built here from a registry host, never from anything a caller
    sent, and the id must already be checked alphanumeric so nobody can walk
    out of the incidents path. Each validator fetches the record itself and
    agrees only if all four fields match exactly.
    """
    url = "https://" + host + "/api/v2/incidents/" + ref + ".json"

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

    return gl.vm.run_nondet_unsafe(leader_fn, validator_fn)
