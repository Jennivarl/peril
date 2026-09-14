# next/arc: USDC payouts on Arc (paused, not part of the submission)

> **Status: design work in progress. Nothing in this folder is deployed,
> tested, or used by PERIL today.** The live product is the GEN contract in
> [`contracts/`](../../contracts), described in the [main README](../../README.md).
> This folder exists so the next step is visible, not so it can be judged as
> finished.

## The idea

GEN is a test token. The people who would actually buy outage cover hold
dollars. The next version adds a second pool that takes premiums and pays
claims in USDC on [Arc](https://docs.arc.io), while GenLayer keeps making the
decision. The GEN pool stays exactly as it is: Arc is extra reach, not a
replacement.

## Why it needs a relay, stated plainly

Arc cannot read a status page, and it cannot check what GenLayer validators
agreed. As of September 2026 there is no trustless message route from
GenLayer to Arc: GenLayer's Bradbury testnet is not a Circle CCTP domain, and
LayerZero lists Arc mainnet only, not testnet. So something has to carry a
verdict across. The design limits what that relay can do:

- **It cannot change who is paid or how much.** The vault records the
  holder and the payout when the cover is bought.
- **It cannot pay a claim GenLayer refused without it being provable.**
  Every payout on Arc cites the key of the verdict it came from, and anyone
  can read that verdict on GenLayer.
- **What it is trusted for is showing up.** If it stops relaying, payouts
  wait. That is the one trust this design adds, and it is written here
  rather than hidden.

If a trustless route between GenLayer and Arc appears, the relay can be
replaced without moving anyone's funds.

## What is here

```
genlayer/sources.py   the covered services and the consensus read of an incident,
                      factored out of contracts/peril.py so both contracts share it
genlayer/judge.py     PerilJudge: measures a claim against policy terms and stores
                      the verdict, keyed by the full terms so nobody can squat a
                      policy's record with the wrong ones. Holds no money.
vault/                Foundry project for the Arc vault. Empty so far.
```

## Still to do

1. Move `sources.py` into `contracts/`, refactor `peril.py` to import it, and
   bundle and test the judge with the same direct-mode tests as the GEN
   contract.
2. Write the vault in Solidity with Foundry tests: shares, solvency, the
   purchase rules (cover starts tomorrow, 7 day windows, the same price
   table), pay once, and a relay-only settle that records the verdict key.
3. Write the relay: watch claim requests on Arc, call the judge on GenLayer,
   and settle on Arc only for a verdict that pays.
4. Deploy on Arc testnet (chain id 5042002, USDC at
   `0x3600000000000000000000000000000000000000`, 6 decimals).
