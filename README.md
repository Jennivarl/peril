# PERIL

Cover against a service you depend on going down, settled by arithmetic
instead of by a claims department.

You buy cover on a named service for a window of up to a week. If that
provider publishes an incident inside your window that it rated major or
critical, and that lasted at least the threshold you chose, the pool pays
you. There is no claim form, no assessor, and nobody with the power to say
no, because nothing in the decision is a matter of opinion.

Built on [GenLayer](https://genlayer.com), on Studio Next (Consensus v0.6, GenVM v0.3).

| | |
|---|---|
| Contract | [`0xA9df0bc18628Ea161077190515aA039026C5D00A`](https://explorer-studio-dev.genlayer.com/address/0xA9df0bc18628Ea161077190515aA039026C5D00A) |
| Network | Studio Next, chain id 61997, `https://studio-next.genlayer.com/api` |
| Live site | [jennivarl.github.io/peril](https://jennivarl.github.io/peril/) |
| Earlier deployment | Bradbury testnet, [`0xb6CC1Fdf94795ED1e57FE931AB48e63888C1e440`](https://explorer-bradbury.genlayer.com/address/0xb6CC1Fdf94795ED1e57FE931AB48e63888C1e440), before the move to Studio Next |
| Tests | 133, `python -m pytest -q` |

---

## Why this works on a network of independent validators

The settlement is one fetch and some subtraction:

1. Fetch one incident record from the provider's own status API.
2. Read four fields: id, `created_at`, `resolved_at`, `impact`.
3. Subtract the timestamps. Compare to the threshold. Compare the rating.

Every validator fetches the same document and does the same integer
arithmetic, so they reach the same answer by construction rather than by
agreement. There is no model call anywhere in the settlement path. Asking
several language models to grade something produces several answers and the
transaction stalls; asking them to fetch a document and subtract does not.

Validators compare **only those four fields**, never the whole response. A
status page carries fields that move between requests, including the page's
own `updated_at` and the incident's update log, so comparing bodies would
make honest validators disagree about a record that had not changed.

The arithmetic lives in [`contracts/policy.py`](contracts/policy.py), which
imports nothing from GenLayer and can be read and tested on its own.

## Four things a caller cannot touch

**The URL.** The buyer picks a service by name from a registry fixed at
deployment, and the contract builds the address it fetches. A caller who
supplies the address the judge reads has appointed themselves the judge.

**The price.** Each service is sold only at the thresholds and multiples in
the published table, derived from that provider's own history. Nobody sets a
price per sale, so no underwriter's judgement enters.

**The past.** Cover starts the day after it is bought, so an outage that has
already happened, or is already under way, can never be insured. Without
this rule anyone could read a status page and buy a certainty.

**The evidence.** A claimant names an incident by id and never supplies its
contents. Those are fetched, and every validator fetches them again. The id
must be alphanumeric, so nobody can walk out of the incidents path, and the
record that comes back must carry the id that was asked for, so a host that
answers every path with its newest incident cannot settle a policy against
something nobody named.

## What is on sale, and why those prices

Only incidents the provider itself rates **major or critical** count. That
matters more than it sounds: Cloudflare publishes more than fifty incidents
a month lasting over an hour, nearly all of them minor and scoped to one
product in one region. Cover that paid on those would pay on every policy
ever sold.

[`deploy/price_table.py`](deploy/price_table.py) reads twelve months of each
provider's published history, keeps the serious incidents, fetches each one
for its exact start and end, and counts how often one lasting at least T
minutes began. With a weekly rate L, the chance of at least one in a week is
`1 - exp(-L)`, and the payout multiple is the largest whole number keeping
the expected payout under half the premium. Three phantom outages are added
to every count, so a clean year is not priced as a guarantee. The raw
evidence is saved in [`deploy/price_table.json`](deploy/price_table.json),
and the numbers below are reproducible by rerunning the script.

| Service | Serious outages, 12 months | 1h | 2h | 4h | 8h | 12h | 24h |
|---|---|---|---|---|---|---|---|
| GitHub | 77 | | | 2x | 3x | 6x | 8x |
| Discord | 34 | | 2x | 5x | 8x | 8x | 8x |
| Vercel | 30 | | 2x | 3x | 5x | 5x | 6x |
| Netlify | 23 | 2x | 2x | 4x | 4x | 4x | 6x |
| npm | 4 | 6x | 8x | 8x | 8x | 8x | 8x |

Longer outage, rarer event, bigger multiple. A blank means that combination
would pay too often to sell for more than the premium.

Cloudflare and OpenAI are **not** offered. Their status pages publish no
history to price from (`history.json` returns 404, checked 2026-09-11), and
guessing a price from three weeks of data would be pretending to know
something.

## The pool

Anyone can fund the pool and receive shares of it. Premiums raise what a
share is worth; payouts lower it. That is underwriting, and it is open to
anyone rather than to an appointed insurer.

Shares are minted at the pool's full value, so a new funder pays for their
part of any premium already earned and cannot buy in cheaply just before
policies expire. They are redeemed only against funds not backing open
cover, which has a useful consequence: spotting a qualifying outage before
anyone settles it and withdrawing first gains nothing, because that payout
was never part of the free funds. A funder who leaves while cover is open
leaves their part of it to the funders who stay and carry that risk. The
last shares cannot leave until no cover is open, or the money behind that
cover would belong to nobody.

The pool never sells cover it could not pay. Every sale checks that every
open policy could still be paid in full.

## The contract

Writes:

| Method | Who | What it does |
|---|---|---|
| `fund()` payable | anyone | Adds to the pool, mints shares |
| `withdraw(shares)` | funders | Redeems shares against free funds |
| `buy(policy_id, cover, window_start, window_end, threshold_minutes)` payable | anyone | Sells cover. Value sent is the premium |
| `settle(policy_id, incident_id)` | anyone | Measures one incident against one policy |
| `close(policy_id)` | anyone | Releases cover after the window has passed |

Views: `covered`, `reserves`, `shares_of`, `get_policy`, `policy_ids`,
`count`.

`settle` is deliberately callable by anyone. The outcome is fixed by the
incident record and the numbers the buyer already agreed to, so there is
nothing a caller can bias, and a privileged settler would reintroduce the
one thing this design removes: somebody who decides whether you get paid.

A settlement that does not qualify **leaves the policy open**. One incident
failing to clear the bar says nothing about the next, and closing it would
let anyone burn someone's cover on its first day by settling it against a
two minute blip.

Five outcomes are possible: `pays`, `under_threshold`, `not_serious`,
`outside_window`, `unresolved`. Each is stored on the policy with the
incident id, the measured minutes, the provider's rating, and a sentence
saying why.

## How money leaves

Through `_pay`, one function, using the EVM interface:

```python
_Wallet(to).emit_transfer(value=amount)
```

This is not a detail. The obvious call, `gl.get_contract_at(addr).emit_transfer(...)`,
sends a GenVM message, which is addressed to a GenVM contract and **never
reached a plain wallet on Bradbury**. Tested on 2026-09-11 by paying one
wallet three ways from one contract: the EVM transfer of 0.011 GEN arrived,
while message transfers of 0.012 on accepted and 0.013 on finalised did not,
hours after finalising.

On Studio Next the same EVM transfer works, with one condition: a
transaction that pays a wallet must reserve a fee for that outgoing payment,
or it fails with `fee no_matching_allocation`. The client gets that
reservation by simulating the call first (`estimateTransactionFeesForWrite`
in genlayer-js 2.0) and sending its fees with the write. Tested on
2026-09-15: a fresh wallet received exactly 0.1 GEN and the paying contract
fell from 1.0 to 0.9.

The fee simulation cannot run `buy`: it answers `execution failed` for it
even with valid arguments, while `settle` simulates normally. `buy` pays no
wallet and needs no reservation, so when the simulation fails the site sends
the network's standard fee instead. It never sends a zero fee, which the
consensus contract rejects.

State is always written before value moves, on every path, and transfers
settle on finalisation rather than acceptance, because state on this network
has been observed readable and then rolled back.

## Running the tests

```bash
pip install -r requirements.txt
python -m pytest -q
```

No network and no chain:

- [`test/test_policy.py`](test/test_policy.py) covers the arithmetic: the
  calendar, strict timestamp parsing including time zone offsets, durations,
  and every outcome. Fixtures are real incidents.
- [`test/test_peril.py`](test/test_peril.py) reads the source and asserts
  its shape: that state is written before value moves, that value can only
  reach a policy holder or a redeeming funder, that the URL comes from the
  registry, that the price comes from the table, and that no v0.2 SDK name
  survived the port.
- [`test/test_direct.py`](test/test_direct.py) runs the deployed bundle
  in-process with genlayer-test's direct mode, serving real saved status
  page responses, and checks both the leader's answer and what an honest
  validator would do with it, including four ways a dishonest leader could
  lie. It runs on the same GenVM engine Studio Next runs (`py-genlayer:5jycge...`,
  from `genvm-manager` release v0.6.0-rc3), which genlayer-test 0.30 downloads
  on first run (about 310 MB).

All 133 pass. On the v0.2 build, every test was checked by breaking the
contract on purpose, eleven different ways, and confirming the tests failed.

## Verified live on Studio Next

Every public path of the deployed contract, run on 2026-09-15 and checked
against the chain, not against the contract's own report:

| Step | Transaction | What was checked |
|---|---|---|
| Fund 5 GEN | [`0x3e54d287…`](https://explorer-studio-dev.genlayer.com/tx/0x3e54d287a1197849a7c897a0991f1adca339b8be619f9b8aed15a8b42a479aea) | 5 shares minted |
| Buy GitHub cover, 4 h, 16 to 23 Sept, 0.5 GEN | [`0xcaa539cb…`](https://explorer-studio-dev.genlayer.com/tx/0xcaa539cbad3aea12d3c022f1f27423d626efaf47f6e5946039ff0ddfb3ab8ba5) | 1 GEN locked, window accepted as starting tomorrow |
| Buy Discord cover, 2 h, 16 to 23 Sept, 0.5 GEN | [`0x71446ef2…`](https://explorer-studio-dev.genlayer.com/tx/0x71446ef24e26364a378757af135dc75919befdacd46b30054815ecf41afdedc0) | pool 6, locked 2, free 4 |
| Withdraw 0.1 shares | [`0x699fbda5…`](https://explorer-studio-dev.genlayer.com/tx/0x699fbda5317e2a5c765d8ff1cd84ea9e0b90ddf3612d783b060688db8c6bd35b) | contract balance fell from 6.00 to exactly 5.92 GEN |
| Settle GitHub cover against real incident `0rn90wk115q9` | [`0x1e206da5…`](https://explorer-studio-dev.genlayer.com/tx/0x1e206da59084f08d50c465254b568490320c20e0ced08883e69c15e5b212f306) | validators fetched GitHub's record and agreed; refused as `outside_window` (it began 13 Sept), policy still open, no GEN moved |
| **Settle the same cover against real incident `nlxnbqnkdzdl`** | [`0x0299eae1…`](https://explorer-studio-dev.genlayer.com/tx/0x0299eae1a6690ea1f513aa712e5f65034bb0279eacd962da0ff52574159fc433) | **paid**: GitHub rated it major and published 07:20 to 17:48 UTC on 16 Sept, 627 minutes against the 240 bought. The contract's balance fell from 5.92 to exactly 4.92 GEN |

The refusal and the payment are the same policy, the same contract and the
same four fields, three days apart: one outage began outside the window and
was refused, the next began inside it and paid. Neither needed anyone's
permission.

On 2026-09-17 the same contract sold cover from the live site to an account
created with an email, with no wallet extension: policy `discord-2026-09-18`,
readable with `get_policy`.

## Trying it

Live at **[jennivarl.github.io/peril](https://jennivarl.github.io/peril/)**.
Every page reads the live contract, with or without an account.

1. **Create an account** with an email. No wallet extension is needed: the
   site creates an in-browser wallet on GenLayer Studio Next and funds it
   with 5 testnet GEN from the network's faucet on first sign-in.
2. Pick a service on **Explore** or **Buy Cover**, choose an outage length
   and a window, and buy. The in-browser wallet signs, and the site sends the
   signed transaction straight to Studio Next.
3. Your policies are on **My Cover**. When a qualifying outage happens, claim
   it there by picking the incident; the site previews the verdict before
   you sign.
4. **Account** shows your balance and address, and can top up testnet GEN.

To run the site locally:

```bash
cd site
npm install
npm run dev
```

## Known limits, stated rather than hidden

**The provider is the oracle.** PERIL measures what a provider published
about itself. A provider that under-reports its own outages pays out less.
That is true of every parametric product, and the alternative is somebody
judging what really happened.

**Consensus needs the page to be readable.** If the status page is
unreachable when a claim is made, the settlement fails and the policy stays
open. Try again later.

**Rates come from a year of history.** Outages cluster, and a Poisson
assumption treats them as independent. The padding and the fifty percent
loss ratio are the margin for that; they are not a proof of solvency.

**Windows are capped at seven days** and cover can be bought at most thirty
days ahead, because the price table only assumes that much exposure.

**Closing has no grace period.** `close` is allowed from the day a window
ends. An outage that began inside the window but is still running then
cannot be claimed until the provider resolves it, and in that gap anyone can
close the policy. A few days' grace before `close` would fix this; it needs a
new deployment, so it is stated here instead.

## What comes next: paying out in USDC on Arc

GEN is a test token, and the people who would buy outage cover (dev teams,
SaaS companies, agents that depend on APIs) hold dollars. The next step is a
second pool that takes premiums and pays claims in USDC on
[Arc](https://docs.arc.io), with the decision still made here.

Arc cannot read a status page or check what GenLayer validators agreed, and
as of September 2026 there is no trustless message route from GenLayer to
Arc. So the design keeps GenLayer as the judge and states the one trust it
adds instead of hiding it:

- A judge contract on GenLayer measures claims exactly as this one does and
  stores each verdict under the full terms of the policy.
- A vault on Arc holds the USDC, and records the holder and the payout at
  purchase, so nothing downstream can change who is paid or how much.
- A relay carries a paying verdict to the vault. Every payout on Arc cites
  the verdict it came from, so a payout with no matching verdict is public
  proof the relay cheated. What the relay is trusted for is showing up.

The GEN pool stays exactly as it is. Arc is extra reach, not a replacement.
The work in progress lives in [`next/arc/`](next/arc/README.md), clearly
marked as paused and not part of what is deployed.

## Repository

```
contracts/policy.py         the arithmetic, no GenLayer import
contracts/peril.py          the contract
contracts/peril_bundle.py   generated, the file that deploys
deploy/build_bundle.py      inlines the modules, strips comments for the gas cap
deploy/price_table.py       derives the price table from published history
deploy/price_table.json     the raw evidence behind the table
test/                       tests and real status page fixtures
site/                       the front end, reading and writing the live contract
next/arc/                   PAUSED: USDC payouts on Arc, not deployed, not tested
```

Edit the modules, never the bundle: it is regenerated, and a test asserts it
matches its sources so a stale one cannot be deployed.

## Licence

MIT.
