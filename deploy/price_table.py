"""
Derive each cover's terms from the provider's own published history.

PERIL has no underwriter, so the price cannot be anybody's judgement. It is
fixed at deployment from this script's output, and anyone can rerun the
script and check the table in contracts/peril.py against it.

For every covered service it reads twelve months of the status page's
history, keeps only incidents the provider itself rated major or critical,
fetches each one for its exact start and end, and counts how often one
lasting at least T minutes began, for T in THRESHOLDS.

A policy runs for at most seven days, so the worst case the pool sells is a
full week at the lowest threshold offered. With a weekly rate L, the chance
of at least one qualifying outage in a week is 1 - exp(-L) (a Poisson
assumption: outages treated as independent, which clustering violates, so
the margin below matters). L counts PAD phantom outages on top of the real
ones, so a clean record is not priced as a guarantee. The payout multiple
is the largest whole number that keeps the expected payout under half the
premium:

    multiple = floor(0.5 / P), capped at MAX_MULTIPLE

Only thresholds reaching a multiple of 2 are offered. Services whose status
page publishes no history (Cloudflare and OpenAI, checked 2026-09-11: their
history.json returns 404) cannot be priced this way and are not offered.

Run: python deploy/price_table.py
"""

import json
import math
import sys
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from contracts.policy import parse_iso  # noqa: E402

HOSTS = {
    "cloudflare": "www.cloudflarestatus.com",
    "github": "www.githubstatus.com",
    "openai": "status.openai.com",
    "discord": "discordstatus.com",
    "vercel": "www.vercel-status.com",
    "netlify": "www.netlifystatus.com",
    "npm": "status.npmjs.org",
}
SERIOUS = ("major", "critical")
THRESHOLDS = (60, 120, 240, 480, 720, 1440)
MONTHS = 12
WINDOW_DAYS = 7
MAX_MULTIPLE = 20
# Loss ratio ceiling: expected payout as a share of premium at worst case.
LOSS_RATIO = 0.5
# Phantom outages added to every count. A year with no eight hour outage
# does not mean one cannot happen, and pricing it as impossible would sell
# the maximum multiple on luck. Three is the usual 95% bound for a count of
# zero, and it shrinks in relative terms as real history accumulates.
PAD = 3


def get(url: str):
    req = urllib.request.Request(url, headers={"User-Agent": "peril-pricing"})
    with urllib.request.urlopen(req, timeout=40) as r:
        return json.loads(r.read().decode("utf-8"))


def serious_codes(host: str) -> tuple:
    """Incident ids rated major or critical over the last MONTHS months."""
    codes, months = [], []
    page = 1
    while len(months) < MONTHS:
        data = get(f"https://{host}/history.json?page={page}")
        batch = data.get("months") or []
        if not batch:
            break
        for m in batch:
            if len(months) >= MONTHS:
                break
            months.append(f"{m['name']} {m['year']}")
            for i in m.get("incidents") or []:
                if i.get("impact") in SERIOUS:
                    codes.append(i["code"])
        page += 1
    return codes, months


def incident(host: str, code: str):
    try:
        i = get(f"https://{host}/api/v2/incidents/{code}.json")["incident"]
    except Exception:
        return None
    if i.get("impact") not in SERIOUS or not i.get("resolved_at"):
        return None
    start = parse_iso(i["created_at"])
    return start, (parse_iso(i["resolved_at"]) - start) // 60


def price(name: str, host: str) -> dict:
    codes, months = serious_codes(host)
    with ThreadPoolExecutor(8) as pool:
        rows = [r for r in pool.map(lambda c: incident(host, c), codes) if r]
    weeks = len(months) * 30.44 / WINDOW_DAYS
    terms = {"cover": name, "host": host, "months": months, "serious": len(rows)}
    rates = {}
    offered = {}
    for t in THRESHOLDS:
        seen = sum(1 for _, m in rows if m >= t)
        rate = (seen + PAD) / weeks
        p = 1 - math.exp(-rate)
        multiple = min(MAX_MULTIPLE, math.floor(LOSS_RATIO / p))
        rates[t] = {"seen": seen, "per_week": round(rate, 3), "p_week": round(p, 3), "multiple": multiple}
        if multiple >= 2:
            offered[t] = multiple
    terms["by_threshold"] = rates
    terms["offered"] = offered
    # The raw evidence, so the table can be checked without refetching.
    terms["incidents"] = sorted(rows)
    return terms


if __name__ == "__main__":
    out = []
    for name, host in HOSTS.items():
        try:
            t = price(name, host)
        except Exception as e:
            t = {"cover": name, "host": host, "error": str(e)[:120]}
        out.append(t)
        if "error" in t:
            print(f"{name:10} ERROR {t['error']}")
        else:
            rows = "  ".join(f"{k}m:{v}x" for k, v in t["offered"].items()) or "nothing"
            print(f"{name:10} {t['serious']:4} serious in {len(t['months'])} months -> {rows}")
    Path(__file__).with_name("price_table.json").write_text(
        json.dumps(out, indent=2) + "\n", encoding="utf-8"
    )
