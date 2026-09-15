import { useMemo, useState } from "react";
import { Footer, Header, TxTracker } from "../components/Chrome";
import { day, gen, readBalance, readPolicies, readReserves, readSharesOf, short, toWei, todayUtc, txUrl, type Policy } from "../lib/chain";
import { serviceName } from "../lib/evidence";
import { setLastTx, useAccount, usePolled } from "../lib/hooks";
import { fundPool, walletAvailable, walletError, withdrawShares } from "../lib/wallet";

/**
 * The Figma pool frame, wired to the contract. Share maths mirrors fund() and
 * withdraw() exactly, so the previews match what the contract will do:
 *
 *   minted = amount * (total_shares + 1) // (pool + 1)
 *   value  = shares * (pool - locked) // total_shares
 */

function queryFunder(): string | null {
  const q = window.location.hash.split("?")[1];
  const f = q ? new URLSearchParams(q).get("funder") : null;
  return f && /^0x[0-9a-fA-F]{40}$/.test(f) ? f : null;
}

const pct = (part: bigint, whole: bigint) => (whole > 0n ? Number((part * 10000n) / whole) / 100 : 0);

function parse(text: string): bigint | null {
  try {
    return toWei(text);
  } catch {
    return null;
  }
}

function exposure(p: Policy): { label: string; style: string } {
  const today = todayUtc();
  if (today < p.window_start) return { label: "PENDING", style: "bg-[rgba(138,180,248,0.1)] border-[#8ab4f8] text-[#8ab4f8]" };
  if (today < p.window_end) return { label: "ACTIVE", style: "bg-accent-tint border-accent-line text-accent-text" };
  return { label: "CLOSABLE", style: "bg-[#1c1f26] border-[#4b5563] text-[#9ca3af]" };
}

function StatBox({ label, value, sub, accent }: { label: string; value: string; sub: string; accent?: boolean }) {
  return (
    <div className={`bg-[#121418] border ${accent ? "border-accent-line" : "border-[#1e222a]"} border-solid content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-w-px p-[20px] relative rounded-[8px]`} data-name="stat-box">
      <p className="font-mono font-normal relative shrink-0 text-[#9ca3af] text-[11px] w-full m-0">{label}</p>
      <p className={`font-mono font-extrabold relative shrink-0 text-[24px] w-full m-0 ${accent ? "text-accent-text" : "text-white"}`}>{value}</p>
      <p className="font-serif font-normal not-italic relative shrink-0 text-[#4b5563] text-[12px] w-full m-0">{sub}</p>
    </div>
  );
}

function Row({ label, value, tone = "text-white" }: { label: string; value: string; tone?: string }) {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full gap-[12px]">
      <p className="font-serif font-normal not-italic relative shrink-0 text-[#9ca3af] m-0">{label}</p>
      <p className={`font-mono font-bold relative shrink-0 m-0 ${tone}`}>{value}</p>
    </div>
  );
}

export default function Pool() {
  const reserves = usePolled(readReserves, 20000);
  const policies = usePolled(readPolicies, 30000);
  const { account } = useAccount();
  const funder = queryFunder() ?? account;
  const position = usePolled(() => (funder ? readSharesOf(funder) : Promise.resolve(null)), 20000, [funder]);
  const balance = usePolled(() => (account ? readBalance(account) : Promise.resolve(null)), 30000, [account]);

  const r = reserves.data;
  const pool = r ? BigInt(r.pool) : 0n;
  const locked = r ? BigInt(r.locked) : 0n;
  const free = r ? BigInt(r.free) : 0n;
  const total = r ? BigInt(r.total_shares) : 0n;
  const open = policies.data?.filter((x) => x.state === "open") ?? [];
  const unknown = reserves.error && !r ? "unavailable" : "…";

  const [amount, setAmount] = useState("1");
  const [burn, setBurn] = useState("");
  const [busy, setBusy] = useState<"fund" | "withdraw" | null>(null);
  const [sent, setSent] = useState<string | null>(null);
  const [failure, setFailure] = useState<string | null>(null);

  const amountWei = parse(amount);
  const minted = r && amountWei !== null && amountWei > 0n ? (amountWei * (total + 1n)) / (pool + 1n) : null;

  const held = position.data ? BigInt(position.data.shares) : 0n;
  const burnUnits = parse(burn);
  const burnValue = r && burnUnits !== null && burnUnits > 0n && total > 0n ? (burnUnits * (pool - locked)) / total : null;

  const fundProblem = amountWei === null || amountWei <= 0n ? "Enter an amount of GEN to deposit." : minted === 0n ? "Too small to buy a share of this pool." : null;

  const withdrawProblem = useMemo(() => {
    if (!funder) return "Connect the wallet that holds the shares.";
    if (burnUnits === null || burnUnits <= 0n) return null;
    if (burnUnits > held) return `You hold ${gen(held, 4)} shares.`;
    if (burnUnits === total && locked > 0n) return "The last shares can leave once no cover is open.";
    if (burnValue === 0n) return "Those shares redeem for nothing right now.";
    return null;
  }, [funder, burnUnits, held, total, locked, burnValue]);

  const act = async (kind: "fund" | "withdraw") => {
    setBusy(kind);
    setFailure(null);
    setSent(null);
    try {
      const tx = kind === "fund" ? await fundPool(amountWei!) : await withdrawShares(burnUnits!);
      setLastTx(tx);
      setSent(tx);
    } catch (e) {
      setFailure(walletError(e));
    } finally {
      setBusy(null);
    }
  };

  const freeShare = pct(free, pool);
  const lockedShare = pct(locked, pool);
  const ownership = total > 0n ? pct(held, total) : 0;
  const perShareFull = total > 0n ? gen((pool * 10n ** 18n) / total, 4) : "–";
  const perShareNow = total > 0n ? gen(((pool - locked) * 10n ** 18n) / total, 4) : "–";

  return (
    <div className="bg-[#090a0c] content-stretch flex flex-col items-start relative size-full" data-name="peril-pool">
      <Header active="/pool" />
      <TxTracker />

      <div className="content-stretch flex flex-col gap-[20px] items-start pb-[40px] pt-[48px] px-[120px] relative shrink-0 w-full" data-name="pool-hero">
        <div className="bg-accent-tint border border-accent-line border-solid content-stretch flex items-start px-[12px] py-[4px] relative rounded-[100px] shrink-0">
          <p className="font-mono font-bold leading-[normal] relative shrink-0 text-accent-text text-[12px] whitespace-nowrap m-0">OPEN UNDERWRITING POOL</p>
        </div>
        <h1 className="font-serif font-extrabold leading-[normal] not-italic relative shrink-0 text-[40px] text-white m-0">The Capital Pool</h1>
        <p className="font-serif font-normal leading-[22px] not-italic relative shrink-0 text-[#9ca3af] text-[16px] max-w-[790px] m-0">
          Every policy is fully backed before it is sold. Anyone can fund the pool and receive shares of it: premiums from cover that never pays raise what a share is worth, and payouts lower it.
        </p>

        <div className="[word-break:break-word] content-stretch flex gap-[16px] items-start leading-[normal] relative shrink-0 w-full" data-name="stats-row">
          <StatBox label="TOTAL POOL LIQUIDITY" value={r ? `${gen(pool)} GEN` : unknown} sub="Testnet GEN, no dollar value" />
          <StatBox label="LOCKED COVER COLLATERAL" value={r ? `${gen(locked)} GEN` : unknown} sub={policies.data ? `Backing ${open.length} open ${open.length === 1 ? "policy" : "policies"}` : "…"} accent />
          <StatBox label="FREE LIQUIDITY CAPACITY" value={r ? `${gen(free)} GEN` : unknown} sub={r ? `${freeShare.toFixed(1)}% of the pool is free` : "…"} />
          <StatBox label="UTILIZATION RATE" value={r ? `${lockedShare.toFixed(2)}%` : unknown} sub="Share of the pool backing open cover" />
        </div>

        <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-col gap-[12px] items-start p-[20px] relative rounded-[12px] shrink-0 w-full" data-name="gauge-box">
          <div className="content-stretch flex flex-wrap gap-[8px] items-start justify-between relative shrink-0 w-full">
            <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
              <div className="relative shrink-0 size-[8px]"><span className="absolute block inset-0 max-w-none size-full rounded-full bg-accent-line peril-pulse" /></div>
              <p className="font-mono font-normal leading-[normal] relative shrink-0 text-[12px] text-white whitespace-nowrap m-0">
                Free Liquidity: {r ? `${gen(free)} GEN (${freeShare.toFixed(2)}%)` : unknown}
              </p>
            </div>
            <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
              <div className="relative shrink-0 size-[8px]"><span className="absolute block inset-0 max-w-none size-full rounded-full bg-[#8ab4f8]" /></div>
              <p className="font-mono font-normal leading-[normal] relative shrink-0 text-[#8ab4f8] text-[12px] whitespace-nowrap m-0">
                Locked Collateral: {r ? `${gen(locked)} GEN (${lockedShare.toFixed(2)}%)` : unknown}
              </p>
            </div>
          </div>
          <div className="bg-[#1c1f26] content-stretch flex h-[24px] items-start overflow-clip relative rounded-[6px] shrink-0 w-full" data-name="gauge-track" role="img" aria-label={`${freeShare}% free, ${lockedShare}% locked`}>
            <div className="bg-accent h-full relative shrink-0" style={{ width: `${freeShare}%` }} />
            <div className="bg-[#8ab4f8] h-full relative shrink-0" style={{ width: `${lockedShare}%` }} />
          </div>
          <p className="font-serif font-normal leading-[normal] not-italic relative shrink-0 text-[#4b5563] text-[11px] w-full m-0">
            * Funds backing open cover cannot be withdrawn. Redemptions are paid only from free funds, so the money a policyholder may be owed never leaves.
          </p>
        </div>
      </div>

      <div className="content-stretch flex gap-[24px] items-start pb-[48px] px-[120px] relative shrink-0 w-full" data-name="pool-interactive">
        <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-start min-w-px relative" data-name="forms-grid">
          <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px p-[24px] relative rounded-[12px]" data-name="fund-card">
            <p className="font-mono font-extrabold leading-[normal] relative shrink-0 text-accent-text text-[16px] w-full m-0">[+] Deposit Capital</p>
            <p className="font-serif font-normal leading-[normal] not-italic relative shrink-0 text-[#9ca3af] text-[13px] w-full m-0">
              Fund the pool so it can back more cover, and take a share of every premium that never pays out.
            </p>
            <label className="content-stretch flex flex-col gap-[6px] items-start leading-[normal] relative shrink-0 w-full">
              <span className="content-stretch flex font-mono font-normal items-start justify-between relative shrink-0 text-[11px] w-full whitespace-nowrap">
                <span className="text-[#9ca3af]">GEN Amount</span>
                <span className="text-[#4b5563]">
                  {account ? `Wallet: ${balance.data ? gen(balance.data) : "…"} GEN` : "Wallet: not connected"}
                </span>
              </span>
              <span className="bg-[#090a0c] border border-[#1e222a] border-solid content-stretch flex gap-[8px] items-center p-[12px] relative rounded-[6px] shrink-0 w-full focus-within:border-accent-line">
                <input inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} className="flex-[1_0_0] bg-transparent border-0 outline-none font-mono font-bold min-w-px text-[14px] text-white p-0" aria-label="GEN to deposit" />
                <span className="font-mono font-normal text-[#9ca3af] text-[13px]">GEN</span>
              </span>
            </label>
            <div className="content-stretch flex items-start justify-between relative shrink-0 text-[12px] w-full whitespace-nowrap">
              <p className="font-serif text-[#9ca3af] m-0">Projected Shares</p>
              <p className="font-mono text-accent-text m-0">{minted !== null ? `${gen(minted, 4)} shares` : "…"}</p>
            </div>
            <button type="button" disabled={Boolean(fundProblem) || !walletAvailable() || busy !== null || !r} onClick={() => act("fund")} className="bg-accent border-0 content-stretch flex items-start justify-center p-[12px] relative rounded-[6px] shrink-0 w-full disabled:opacity-50" data-name="deposit-cta">
              <span className="font-mono font-extrabold leading-[normal] text-[#090a0c] text-[13px] whitespace-nowrap">{busy === "fund" ? "CONFIRM IN YOUR WALLET…" : "DEPOSIT GEN TO POOL"}</span>
            </button>
            <p className="font-serif font-normal leading-[16px] not-italic relative shrink-0 text-[#4b5563] text-[11px] w-full m-0">
              {`Shares are minted at the pool's full value, currently ${perShareFull} GEN per share, so you pay for premiums already earned. There is no deposit fee.`}
            </p>
            {fundProblem && amount.trim() !== "" && <p className="font-serif text-[#ff3b30] text-[11px] m-0">{fundProblem}</p>}
          </div>

          <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px p-[24px] relative rounded-[12px]" data-name="withdraw-card">
            <p className="font-mono font-extrabold leading-[normal] relative shrink-0 text-[#ff3b30] text-[16px] w-full m-0">[-] Withdraw Capital</p>
            <p className="font-serif font-normal leading-[normal] not-italic relative shrink-0 text-[#9ca3af] text-[13px] w-full m-0">
              Redeem shares for GEN. Only funds not backing open cover can be withdrawn.
            </p>
            <label className="content-stretch flex flex-col gap-[6px] items-start leading-[normal] relative shrink-0 w-full">
              <span className="content-stretch flex font-mono font-normal items-start justify-between relative shrink-0 text-[11px] w-full whitespace-nowrap">
                <span className="text-[#9ca3af]">Shares to Burn</span>
                <button type="button" onClick={() => setBurn(gen(held, 18).replace(/,/g, "").replace(/\.?0+$/, ""))} disabled={held === 0n} className="bg-transparent border-0 p-0 text-[#4b5563] hover:text-accent-text text-[11px] font-mono disabled:hover:text-[#4b5563]">
                  Held: {position.data ? gen(held, 4) : funder ? "…" : "–"} (MAX)
                </button>
              </span>
              <span className="bg-[#090a0c] border border-[#1e222a] border-solid content-stretch flex gap-[8px] items-center p-[12px] relative rounded-[6px] shrink-0 w-full focus-within:border-accent-line">
                <input inputMode="decimal" value={burn} placeholder="0.00" onChange={(e) => setBurn(e.target.value)} className="flex-[1_0_0] bg-transparent border-0 outline-none font-mono font-bold min-w-px text-[14px] text-white placeholder:text-[#4b5563] p-0" aria-label="Shares to burn" />
                <span className="font-mono font-normal text-[#9ca3af] text-[13px]">shares</span>
              </span>
            </label>
            <div className="content-stretch flex items-start justify-between relative shrink-0 text-[#9ca3af] text-[12px] w-full whitespace-nowrap">
              <p className="font-serif m-0">Est. GEN Payout</p>
              <p className="font-mono m-0">{burnValue !== null ? `${gen(burnValue, 4)} GEN` : "0.00 GEN"}</p>
            </div>
            <button type="button" disabled={Boolean(withdrawProblem) || burnUnits === null || burnUnits <= 0n || !walletAvailable() || busy !== null} onClick={() => act("withdraw")} className="bg-[#14171f] border border-[#1e222a] border-solid content-stretch flex items-start justify-center p-[12px] relative rounded-[6px] shrink-0 w-full enabled:hover:border-[#ff3b30] disabled:opacity-60" data-name="withdraw-cta">
              <span className="font-mono font-extrabold leading-[normal] text-[#9ca3af] text-[13px] whitespace-nowrap">{busy === "withdraw" ? "CONFIRM IN YOUR WALLET…" : "WITHDRAW CAPITAL"}</span>
            </button>
            {withdrawProblem && (
              <div className="bg-[rgba(255,59,48,0.12)] border border-[#ff3b30] border-solid content-stretch flex items-start p-[10px] relative rounded-[6px] shrink-0 w-full" role="alert">
                <p className="flex-[1_0_0] font-serif font-normal leading-[14px] min-w-px not-italic text-[#ff3b30] text-[11px] m-0">{withdrawProblem}</p>
              </div>
            )}
            <p className="font-serif font-normal leading-[16px] not-italic relative shrink-0 text-[#4b5563] text-[11px] w-full m-0">
              Leaving while cover is open leaves your part of the locked funds to the funders who stay and carry that risk.
            </p>
          </div>
        </div>

        <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-col gap-[20px] items-start p-[32px] relative rounded-[12px] shrink-0 w-[440px]" data-name="position-sidebar">
          <p className="font-serif font-bold leading-[normal] not-italic relative shrink-0 text-[20px] text-white w-full m-0">Your Funder Position</p>
          <div className="bg-[#14171f] border border-[#1e222a] border-solid content-stretch flex items-start p-[12px] relative rounded-[6px] shrink-0 w-full">
            <p className="flex-[1_0_0] font-mono font-normal leading-[normal] min-w-px text-accent-text text-[13px] m-0">
              {funder ? `shares_of(${short(funder, 10, 4)})` : "Connect a wallet, or add ?funder=0x… to the link"}
            </p>
          </div>
          <div className="content-stretch flex flex-col gap-[12px] items-start leading-[normal] relative shrink-0 text-[13px] w-full whitespace-nowrap">
            <Row label="Total Share Balance" value={position.data ? `${gen(held, 4)} shares` : funder ? "…" : "–"} />
            <Row label="Redeemable Value Now" value={position.data ? `${gen(position.data.redeemable, 4)} GEN` : funder ? "…" : "–"} tone="text-accent-text" />
            <Row label="Pool Ownership" value={position.data && total > 0n ? `${ownership.toFixed(2)}%` : "–"} />
            <Row label="Pool Value per Share" value={`${perShareFull} GEN`} tone="text-[#9ca3af]" />
            <Row label="Redeemable per Share" value={`${perShareNow} GEN`} tone="text-accent-text" />
          </div>
          <div className="bg-[#1e222a] h-px relative shrink-0 w-full" />
          <div className="content-stretch flex flex-col font-normal gap-[6px] items-start relative shrink-0 text-[#9ca3af] w-full">
            <p className="font-mono leading-[normal] text-[11px] uppercase whitespace-nowrap m-0">Share Mechanics</p>
            <p className="font-serif leading-[18px] not-italic text-[12px] m-0">
              Premiums raise what a share is worth and payouts lower it. Shares redeem only against funds not backing open cover, so withdrawing before a known payout gains nothing. Expired cover returns to the free funds when anyone calls close on it.
            </p>
          </div>
          {failure && <p className="font-serif text-[#ff3b30] text-[12px] leading-[17px] m-0" role="alert">{failure}</p>}
          {sent && (
            <p className="font-serif text-[#9ca3af] text-[12px] leading-[17px] m-0" role="status">
              {"Submitted "}
              <a href={txUrl(sent)} target="_blank" rel="noreferrer" className="font-mono text-accent-text">{short(sent, 8, 6)}</a>
              {". Shares update once the network accepts it; withdrawn GEN arrives when it finalises, about 30 seconds later."}
            </p>
          )}
        </div>
      </div>

      <div className="content-stretch flex flex-col gap-[20px] items-start pb-[80px] px-[120px] relative shrink-0 w-full" data-name="exposure-section">
        <p className="font-mono font-normal leading-[normal] relative shrink-0 text-accent-text text-[12px] uppercase whitespace-nowrap m-0">{`Active Pool Risk & Exposure Breakdown`}</p>
        <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-col items-start relative rounded-[12px] shrink-0 w-full" data-name="table-box">
          <div className="bg-[#14171f] border border-[#1e222a] border-solid content-stretch flex font-serif font-semibold items-start leading-[normal] not-italic p-[16px] relative shrink-0 text-[#9ca3af] text-[13px] w-full">
            {["POLICY ID", "SERVICE", "UTC WINDOW", "LOCKED RESERVES", "THRESHOLD"].map((h) => (
              <p key={h} className="flex-[1_0_0] min-w-px relative m-0">{h}</p>
            ))}
            <p className="relative shrink-0 w-[120px] m-0">STATUS</p>
          </div>
          {!policies.data && (
            <div className="border border-[#1e222a] border-solid p-[16px] w-full">
              <p className="font-mono text-[#9ca3af] text-[13px] m-0">{policies.error ? `Could not read open cover: ${policies.error}` : "Reading open cover from Studio Next…"}</p>
            </div>
          )}
          {policies.data && open.length === 0 && (
            <div className="border border-[#1e222a] border-solid p-[16px] w-full">
              <p className="font-mono text-[#9ca3af] text-[13px] m-0">The pool is backing no open cover right now.</p>
            </div>
          )}
          {open.map((p) => {
            const e = exposure(p);
            return (
              <a key={p.policy_id} href={`#/policy?id=${encodeURIComponent(p.policy_id)}`} className="border border-[#1e222a] border-solid content-stretch flex items-center p-[16px] relative shrink-0 w-full no-underline hover:bg-[#14171f]">
                <span className="flex-[1_0_0] font-mono font-normal leading-[normal] min-w-px text-[13px] text-white">{p.policy_id}</span>
                <span className="flex-[1_0_0] font-serif font-normal leading-[normal] min-w-px text-[13px] text-white">{serviceName(p.cover)}</span>
                <span className="flex-[1_0_0] font-mono font-normal leading-[normal] min-w-px text-[#9ca3af] text-[13px]">{day(p.window_start)} - {day(p.window_end)}</span>
                <span className="flex-[1_0_0] font-mono font-bold leading-[normal] min-w-px text-accent-text text-[13px]">{gen(p.payout)} GEN</span>
                <span className="flex-[1_0_0] font-mono font-normal leading-[normal] min-w-px text-[#9ca3af] text-[13px]">{p.threshold_minutes} mins</span>
                <span className="content-stretch flex items-start relative shrink-0 w-[120px]">
                  <span className={`${e.style} border border-solid content-stretch flex items-start px-[8px] py-[2px] relative rounded-[4px] shrink-0`}>
                    <span className="font-mono font-normal leading-[normal] text-[11px] whitespace-nowrap">{e.label}</span>
                  </span>
                </span>
              </a>
            );
          })}
        </div>
      </div>

      <Footer />
    </div>
  );
}
