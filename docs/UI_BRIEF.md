# PERIL: everything the site needs

Written for whoever builds the front end (and for the Figma work that comes
first). It says what each page is for, what it shows, where every number
comes from, what a visitor can do, and what has to happen when things go
wrong. It does not tell you what it should look like.

Nothing here is invented: every field named below is returned by the live
contract, and the rules the forms must enforce are the rules the contract
enforces.

---

## 1. The product, in the words the site should use

PERIL sells cover against a service you depend on going down.

You pick a service, a week, and how long an outage has to last. You pay a
premium. If that provider publishes an outage inside your week that it rated
major or critical, and it lasted at least as long as you chose, the pool pays
you a fixed multiple of your premium. Nobody approves the claim. The contract
reads the provider's own status page and does arithmetic.

Three sentences worth repeating anywhere on the site:

- **No claim form, no assessor, nobody who can say no.**
- **The provider is the source, not us.** We read their published incident.
- **The price is not our opinion.** It comes from their last twelve months.

Words to use consistently: **cover** (not "policy" in marketing copy, though
the contract calls it that), **premium**, **payout**, **threshold**,
**window**, **pool**, **funder**, **claim/settle**.

---

## 2. Facts and addresses

| Thing | Value |
|---|---|
| Contract | `0xb6CC1Fdf94795ED1e57FE931AB48e63888C1e440` |
| Network | GenLayer Bradbury testnet |
| Chain id | 4221, hex `0x107d` |
| RPC | `https://rpc-bradbury.genlayer.com` |
| Explorer, address | `https://explorer-bradbury.genlayer.com/address/{address}` |
| Explorer, transaction | `https://explorer-bradbury.genlayer.com/tx/{txId}` |
| Currency | GEN, 18 decimals, testnet only |
| Repo | `github.com/Jennivarl/peril` |

The site is read-only until someone wants to spend money, so a visitor with
no wallet must be able to see everything except the buttons that sign.

---

## 3. Talking to the contract

This pattern is already proven in the QUORUM site and can be lifted:

```ts
// Reads. No wallet, no funds, nothing signed.
const [{ createClient, createAccount }, { testnetBradbury }] = await Promise.all([
  import("genlayer-js"),
  import("genlayer-js/chains"),
]);
const reader = createClient({ chain: testnetBradbury, account: createAccount() });
const covers = await reader.readContract({
  address: PERIL, functionName: "covered", args: [],
});
```

```ts
// Writes. The visitor's wallet signs; the site never holds a key.
const client = createClient({ chain: testnetBradbury, account: address });
const txId = await client.writeContract({
  address: PERIL,
  functionName: "buy",
  args: [policyId, cover, windowStart, windowEnd, thresholdMinutes],
  value: premiumInWei,          // only fund() and buy() take value
  consensusMaxRotations: 8,     // the default of 3 times out too often
});
```

Notes that will save hours:

- **`genlayer-js` is heavy.** Import it dynamically so the first paint does
  not wait for it.
- **`consensusMaxRotations: 8`.** Every timed-out write in this project ran
  out of rotations. The default is 3.
- **Wallet plumbing** is ordinary EIP-1193: `eth_requestAccounts`,
  `wallet_switchEthereumChain` to `0x107d`, and `wallet_addEthereumChain` if
  the chain is unknown. Error code 4001 means the visitor said no; that is
  not an error to report as one.
- **Amounts are wei**, as decimal strings. Always convert with BigInt, never
  with floats. `0.25 GEN` is `250000000000000000`.

### Transaction lifecycle, which the UI must show honestly

A write goes through several states, readable with the RPC method
`gen_getTransactionStatus`, params `[{ "txId": "0x..." }]`:

`Pending` → `Proposing` → `Committing` → `Revealing` → `LeaderRevealing` →
**`Accepted`** → `ReadyToFinalize` → **`Finalized`**

Two of those matter to a person:

- **Accepted** (usually 30 seconds to 3 minutes): the network agreed on the
  outcome. The policy now reads as paid, and the site can show the result.
- **Finalized** (about **30 minutes** later): **this is when money actually
  arrives in a wallet.**

So a payout screen must say both: "your claim is settled" at acceptance, and
"the GEN is in your wallet" only after finalisation. Measured on Bradbury:
median 30 minutes, worst seen 76.

`gen_getTransactionReceipt` with the same params returns `txExecutionResult`:
`1` means the call returned normally, `2` means the contract raised. A
transaction can be Accepted and still have failed, so check both.

---

## 4. Data the pages read

Every view below is a free call on the contract.

### `covered()` → the shop

```json
[{ "cover": "github",
   "host": "www.githubstatus.com",
   "serious": ["major", "critical"],
   "max_window_days": 7,
   "multiples": { "240": 2, "480": 3, "720": 6, "1440": 8 } }]
```

Five services, alphabetical: discord, github, netlify, npm, vercel. Keys of
`multiples` are threshold minutes as strings; values are the payout multiple.

### `reserves()` → the pool

```json
{ "pool": "4150000000000000000", "locked": "2000000000000000000",
  "free": "2150000000000000000", "total_shares": "3150000000000000000" }
```

All wei strings. `pool` is everything held, `locked` is committed to open
cover, `free` is what can still be sold against or withdrawn.

### `shares_of(address)` → a funder's position

```json
{ "shares": "3150000000000000000", "redeemable": "2150000000000000000" }
```

`redeemable` is what those shares would pay out right now, which is capped by
free funds by design.

### `policy_ids()`, `count()`, `get_policy(policy_id)`

```json
{ "policy_id": "github-w38", "cover": "github", "host": "www.githubstatus.com",
  "window_start": "2026-09-13", "window_end": "2026-09-20",
  "threshold_minutes": 240, "multiple": 2,
  "premium": "250000000000000000", "payout": "500000000000000000",
  "holder": "0xB42883f040385fb5d581d5dE016D1d72E3C2A75A",
  "state": "open", "incident_id": "", "impact": "",
  "outcome": "", "minutes": 0, "reason": "" }
```

`state` is `open`, `paid` or `closed`. After a settlement attempt the last
five fields are filled in even when nothing was paid, which is what lets a
policy page show its history of attempts.

`outcome` is one of:

| outcome | means | policy after |
|---|---|---|
| `pays` | long enough, serious enough, inside the window | paid |
| `under_threshold` | real outage, too short | stays open |
| `not_serious` | provider rated it none, minor or maintenance | stays open |
| `outside_window` | began before or after the cover | stays open |
| `unresolved` | still going, so it has no final length | stays open |

`reason` is a plain sentence written by the contract, for example
`"455 minutes meets the 240 minute threshold"`. **Show it verbatim.** It is
the contract's own explanation and it is better than anything the UI could
paraphrase.

---

## 5. Actions

| Action | Call | Value | Who |
|---|---|---|---|
| Add to the pool | `fund()` | premium in wei | anyone |
| Take money out | `withdraw(shares)` | none | funders |
| Buy cover | `buy(policy_id, cover, window_start, window_end, threshold_minutes)` | premium in wei | anyone |
| Make a claim | `settle(policy_id, incident_id)` | none | anyone |
| Release expired cover | `close(policy_id)` | none | anyone |

### Rules the buy form must enforce before it lets anyone sign

The contract enforces all of these and will refuse the transaction. The form
should refuse first, so nobody pays gas to be told no.

1. `policy_id` non-empty, and not already taken. Lowercased and trimmed by
   the contract, so treat `Github-W38` and `github-w38` as the same. Check
   with `policy_ids()`.
2. `cover` must be one of the five from `covered()`.
3. `threshold_minutes` must be a key in that service's `multiples`. Present
   these as a choice, never a free number field.
4. `window_start` must be **strictly after today (UTC)**. The earliest legal
   start is tomorrow. This is the rule that stops anyone insuring an outage
   they already know about.
5. `window_start` at most **30 days** ahead.
6. `window_end` after `window_start`, by at most **7 days**.
7. Dates are `YYYY-MM-DD`, UTC, and a window runs from midnight to midnight.
8. Premium above zero, and the pool must be able to pay: `free + premium >=
   premium x multiple`. Read `reserves()` and say so before they sign, for
   example "this pool can currently back a premium up to 2.15 GEN at 2x".

### Settle

Takes a policy id and an incident id. The incident id is the code in the
provider's own status URL, for example `zkxwbgr0cnmx` in
`https://www.githubstatus.com/incidents/zkxwbgr0cnmx`. It must be
alphanumeric.

The UI can make this much friendlier than typing a code: fetch the
provider's `https://{host}/api/v2/incidents.json` in the browser, list the
recent incidents for that service, mark which ones look eligible (resolved,
rated major or critical, began inside the window, lasted at least the
threshold), and let the holder pick one. **Say clearly that this preview is
the site's arithmetic and the chain decides.** The contract will refetch and
its answer is the one that counts.

### Error messages the contract can return

Show these plainly. They are written to be readable:

- `not a covered service; call covered() for the list`
- `github is sold at thresholds of 240, 480, 720, 1440 minutes`
- `cover starts tomorrow at the earliest, so a known outage cannot be insured`
- `cover can be bought at most 30 days ahead`
- `a window is at most 7 days`
- `the window must end after it starts`
- `the pool cannot cover this payout; fund it or buy less`
- `policy already exists: {id}`
- `send the premium with this call`
- `incident id must be alphanumeric`
- `that incident could not be read from {host}`
- `the record returned is not the incident that was requested`
- `policy is already paid: {id}`
- `the covered window has not closed yet`
- `you hold {n} shares`
- `the last shares can leave once no cover is open`
- `those shares redeem for nothing right now`

---

## 6. The pages

### 6.1 Home

**Job:** in ten seconds, make a stranger understand that this pays out
automatically, and show that it is real and running.

Content:

- The one-line pitch and the three sentences from section 1.
- **Live numbers, from `reserves()`:** pool size, cover currently sold
  (`locked`), capacity left (`free`). Format as GEN with 2 to 4 decimals.
- **The shop preview**, from `covered()`: five services with their cheapest
  qualifying tier, for example "GitHub, 4 hours or longer, pays 2x".
- **What is running right now:** the open policies from `policy_ids()` and
  `get_policy`, with service, window, threshold, payout, state. Four are
  live today (see section 9).
- A short "how it decides" strip: fetch the incident, read the times and the
  rating, subtract, compare. Four steps, no jargon.
- Links: contract on the explorer, repo, the pricing evidence.

States: numbers load asynchronously, so a skeleton is needed; if the chain
is unreachable, say "could not reach Bradbury" rather than showing zeros.
Zero and unknown are different facts and the site should never confuse them.

### 6.2 Buy cover

**Job:** turn "I depend on GitHub" into a signed policy in under a minute.

Flow: pick service → pick how long an outage must last → pick the week →
enter premium → review → connect wallet → sign → watch.

- **Service picker** from `covered()`. For each, show the host it reads and
  how many serious outages it had in the last twelve months (section 7), so
  the choice is informed.
- **Threshold picker**: the tiers from `multiples`, each showing the payout
  multiple. Label them in hours, not minutes: 1h, 2h, 4h, 8h, 12h, 24h.
- **Window picker**: a date range, defaulting to tomorrow plus seven days.
  Disable today and anything earlier, with the reason on screen: cover
  cannot start today, so nobody can insure an outage already under way.
- **Premium input** in GEN, converted to wei. Show the payout live as the
  premium changes: `premium x multiple`.
- **Review panel** stating the whole deal in a sentence: "If
  www.githubstatus.com publishes an outage it rates major or critical,
  beginning between 13 and 20 September, that lasts 4 hours or more, this
  pays 0.5 GEN."
- **Capacity warning** if the premium exceeds what the pool can back.
- **Policy id**: generate something readable (`github-2026-09-13`) but let
  them edit it, and check it is free.

After signing: show the transaction id with an explorer link, poll the
status, and explain the wait. Accepted means the policy exists.

### 6.3 My cover

**Job:** the holder's view. What am I covered for, and can I claim?

- List policies where `holder` is the connected wallet. There is no view
  that filters by holder, so read `policy_ids()` and `get_policy` for each,
  then filter client-side. Cache it; the list is small.
- Each row: service, window, threshold, premium, payout, state, and a status
  line that is honest about time. Before the window: "starts in 2 days".
  During: "running, 4 days left". After: "window closed, still claimable
  against outages that began inside it".
- **Claim button** on any open policy, opening the incident picker from
  section 5.
- If a settlement was attempted and refused, show `outcome`, `minutes`,
  `impact` and `reason`, and make clear the cover is still live.

### 6.4 Policy detail

Everything from `get_policy`, plus:

- A link to the incident on the provider's own site once one has been
  settled against: `https://{host}/incidents/{incident_id}`.
- The measured duration next to the threshold, so the decision is visible.
- For a paid policy: the payout, and the two-stage truth about the money
  (settled now, in the wallet after finalisation).
- The contract's `reason` sentence, quoted.

### 6.5 The pool

**Job:** let anyone underwrite, and make the risk legible.

- `reserves()` as a chart or bar: free versus locked.
- **Fund**: amount in GEN, calls `fund()`. Explain in one line what a share
  is: a claim on the pool that grows with premiums and shrinks with payouts.
- **Your position** from `shares_of(address)`: shares held, what they are
  worth now, and the share of the pool as a percentage.
- **Withdraw**: an amount of shares, calls `withdraw(shares)`. State the two
  rules on screen: you can only take out against funds not backing open
  cover, and the last shares wait until no cover is open.
- **Open cover table**: what the pool is currently exposed to, so a funder
  can see the risk they are taking.
- Honest framing: this is testnet GEN, and the pool can lose money. Say it.

### 6.6 How it works

The explainer page. Long-form is fine here.

- The settlement in four steps, with the actual URL shape shown:
  `https://www.githubstatus.com/api/v2/incidents/{id}.json`.
- **Why validators agree:** they all fetch the same document and compare only
  four fields (id, created_at, resolved_at, impact), because a status page
  changes fields that have nothing to do with the outage.
- **The four things a caller cannot touch:** the URL, the price, the past,
  the evidence. One short paragraph each, from the README.
- **What a lying node cannot do:** stretch the times, upgrade the rating,
  claim the page was unreadable, or crash its way to a payout. Each is
  rejected by honest validators, and each has a test.
- A worked example with real numbers: GitHub incident `zkxwbgr0cnmx`,
  critical, began 17 August 13:40 UTC, resolved 21:15, 455 minutes, clears
  a 4 hour threshold, pays 2x. Also that the same outage does **not** clear
  the 8 hour tier, which shows the tiers are real.

### 6.7 Pricing and evidence

**Job:** prove the prices are not made up.

- The full table (section 7) with every tier for every service.
- The method in plain words: twelve months of the provider's own history,
  keep only major and critical, measure each one, count how often one lasted
  at least T minutes, add three phantom outages so a clean year is not
  treated as a guarantee, and set the multiple so the expected payout stays
  under half the premium.
- **Why Cloudflare and OpenAI are missing**: their status pages publish no
  history, so there is nothing honest to price from. This is a strength of
  the argument, not an omission to hide.
- Link to `deploy/price_table.json`, which holds the raw incident list.

### 6.8 Limits

A short page that says what PERIL cannot do, in its own voice:

- The provider is the oracle. A provider that under-reports pays out less.
- If the status page is unreachable, a claim fails and can be retried.
- Outages cluster, and the pricing assumes they do not. The margin covers
  that; it is not a proof of solvency.
- Testnet only. The GEN is not money.

Having this page is part of the pitch. Most projects hide this.

---

## 7. The price table

| Service | Host | Serious outages, 12 months | 1h | 2h | 4h | 8h | 12h | 24h |
|---|---|---|---|---|---|---|---|---|
| GitHub | www.githubstatus.com | 77 | | | 2x | 3x | 6x | 8x |
| Discord | discordstatus.com | 34 | | 2x | 5x | 8x | 8x | 8x |
| Vercel | www.vercel-status.com | 30 | | 2x | 3x | 5x | 5x | 6x |
| Netlify | www.netlifystatus.com | 23 | 2x | 2x | 4x | 4x | 4x | 6x |
| npm | status.npmjs.org | 4 | 6x | 8x | 8x | 8x | 8x | 8x |

Blank means not sold at that length: it would trigger too often to be worth
more than the premium. Read the live values from `covered()` rather than
hard-coding these, so the site cannot drift from the contract.

---

## 8. Formatting rules

- **GEN**: wei ÷ 10^18. Show 2 decimals in summaries, up to 6 where exact
  amounts matter. Never round a payout up.
- **Dates**: the contract works in UTC and windows run midnight to midnight.
  Always label times UTC. Do not localise a window's dates: a policy for the
  13th means UTC.
- **Durations**: minutes from the contract. Show as `7h 35m (455 minutes)`.
- **Addresses**: truncate to `0xb6CC…e440` and link to the explorer.
- **Thresholds**: hours in the interface, minutes in anything technical.
- Never invent a status. If a field is empty, the settlement has not been
  attempted.

---

## 9. What is live right now (12 September 2026)

Four real policies, bought before their window opened, funded with real
testnet GEN from `0xb42883f040385fb5d581d5de016d1d72e3c2a75a`:

| policy_id | service | threshold | premium | payout | window |
|---|---|---|---|---|---|
| github-w38 | GitHub | 4h | 0.25 | 0.5 | 13 to 20 Sept |
| discord-w38 | Discord | 2h | 0.25 | 0.5 | 13 to 20 Sept |
| vercel-w38 | Vercel | 2h | 0.25 | 0.5 | 13 to 20 Sept |
| netlify-w38 | Netlify | 1h | 0.25 | 0.5 | 13 to 20 Sept |

Pool: 4.15 GEN, 2.0 locked, 2.15 free, 3.15 shares, all held by that wallet.

The site should show these as they are: live cover, waiting on the world. If
one pays before the deadline, that page becomes the demo. If none does, the
honest line is that no qualifying outage happened, which is also what the
product is supposed to do.

---

## 10. Build notes

- Static site, no backend. Everything comes from the chain or from the
  provider's public API, both callable from the browser.
- Status page APIs allow cross-origin requests, so the incident picker can
  fetch them directly.
- Read-heavy pages should render before `genlayer-js` loads.
- Keep a committed snapshot of the four policies and the pool as a fallback,
  and label it when it is used. Bradbury goes down; a page about reliability
  showing a spinner forever makes the wrong argument. QUORUM's site does
  exactly this and it is worth copying.
- Deploy: GitHub Pages from the repo, same as QUORUM.
