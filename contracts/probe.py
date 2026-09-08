# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }
"""
A throwaway probe, not the product.

It answers the one question the whole of PERIL rests on: can validators
independently fetch a Statuspage incident and agree on what it says?

If they can, everything else is ordinary engineering. If they cannot, the
design is wrong and it is better to know that in an hour than in week two.

Two things make this cheaper than it looks, and both are deliberate.

There is no model call anywhere. A resolved incident is a settled record
with two fixed timestamps, so the question "how long was this outage" is
subtraction, not judgement. Nothing here needs an opinion, so nothing here
can produce two different opinions.

The validator compares the two timestamps it fetched against the two the
leader reported, and nothing else. Not the whole response body, which
carries fields like the page's own updated_at that move between requests
and would make honest validators disagree about a record that had not
changed.
"""

import json

from genlayer import *


def _incident_times(body: str) -> dict:
    """
    Pull the two timestamps out of a Statuspage incident response.

    Deliberately narrow. It reads exactly the fields a settlement depends on
    and ignores everything else, so a source adding or reordering fields
    cannot change what a validator sees.
    """
    data = json.loads(body)
    incident = data.get("incident") or {}
    return {
        "id": str(incident.get("id") or ""),
        "created_at": str(incident.get("created_at") or ""),
        "resolved_at": str(incident.get("resolved_at") or ""),
    }


class Probe(gl.Contract):
    last: str

    def __init__(self):
        self.last = ""

    @gl.public.write
    def read_incident(self, url: str) -> str:
        """
        Fetch one incident and record its timestamps.

        The fetch is `get` rather than `render`: a plain HTTP request returns
        the same bytes to every validator, while a rendered page depends on
        script timing and lets two honest validators disagree about the page
        rather than about the incident. It also does not follow redirects,
        so a moved endpoint fails loudly instead of resolving somewhere else.
        """

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
            return _incident_times(page)

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
                # I could not read it either, so the only claim I can honestly
                # agree with is that nothing was readable.
                return str(leader["created_at"]) == ""

            mine = _incident_times(page)
            return (
                str(leader["id"]) == mine["id"]
                and str(leader["created_at"]) == mine["created_at"]
                and str(leader["resolved_at"]) == mine["resolved_at"]
            )

        got = gl.vm.run_nondet_unsafe(leader_fn, validator_fn)
        self.last = (
            str(got["id"])
            + " | "
            + str(got["created_at"])
            + " | "
            + str(got["resolved_at"])
        )
        return self.last

    @gl.public.view
    def get_last(self) -> str:
        return self.last
