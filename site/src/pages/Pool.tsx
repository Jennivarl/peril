import { useMemo, useState } from "react";
import { Footer, Header } from "../components/Chrome";
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
  if (today < p.window_start) return { label: "PENDING", style: "bg-[rgba(124,58,237,0.12)] border-[#6d28d9] text-[#5b21b6]" };
  if (today < p.window_end) return { label: "ACTIVE", style: "bg-accent-tint border-accent-line text-accent-text" };
  return { label: "CLOSABLE", style: "bg-[#e9e4f4] border-[#aca7b8] text-[#67626f]" };
}

function StatBox({ label, value, sub, tone = "plain" }: { label: string; value: string; sub: string; tone?: "plain" | "free" | "locked" }) {
  const figure = tone === "free" ? "text-accent-text" : tone === "locked" ? "peril-grad-text" : "text-[#16141b]";
  const edge = tone === "free" ? "border-accent-line" : tone === "locked" ? "border-[#6d28d9]" : "border-[#e3ddf0]";
  return (
    <div className={`bg-[#ffffff] border ${edge} border-solid content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-w-px p-[20px] relative rounded-[8px]`} data-name="stat-box">
      <p className="font-mono font-normal relative shrink-0 text-[#67626f] text-[11px] w-full m-0">{label}</p>
      <p className="font-mono font-extrabold relative shrink-0 text-[24px] w-full m-0"><span className={figure}>{value}</span></p>
      <p className="font-serif font-normal not-italic relative shrink-0 text-[#787384] text-[12px] w-full m-0">{sub}</p>
    </div>
  );
}

function Row({ label, value, tone = "text-[#16141b]" }: { label: string; value: string; tone?: string }) {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full gap-[12px]">
      <p className="font-serif font-normal not-italic relative shrink-0 text-[#67626f] m-0">{label}</p>
      <p className={`font-mono font-bold relative shrink-0 m-0 ${tone}`}>{value}</p>
    </div>
  );
}

export default function Pool() {
  const reserves = usePolled(readReserves, 60000);
  const policies = usePolled(readPolicies, 60000);
  const { account } = useAccount();
  const funder = queryFunder() ?? account;
  const position = usePolled(() => (funder ? readSharesOf(funder) : Promise.resolve(null)), 60000, [funder]);
  const balance = usePolled(() => (account ? readBalance(account) : Promise.resolve(null)), 60000, [account]);

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
    if (!funder) return "Sign in with the account that holds the shares.";
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
    <div className="bg-[#faf8fd] content-stretch flex flex-col items-start min-h-screen mx-auto max-w-[1440px] relative size-full" data-name="peril-pool">
      <Header active="/pool" />

      <div className="content-stretch flex flex-col gap-[20px] items-start pb-[40px] pt-[48px] px-[120px] relative shrink-0 w-full" data-name="pool-hero">
        <div className="bg-accent-tint border border-accent-line border-solid content-stretch flex items-start px-[12px] py-[4px] relative rounded-[100px] shrink-0">
          <p className="font-mono font-bold leading-[normal] relative shrink-0 text-accent-text text-[12px] whitespace-nowrap m-0">OPEN UNDERWRITING POOL</p>
        </div>
        <h1 className="font-serif font-extrabold leading-[normal] not-italic relative shrink-0 text-[40px] text-[#16141b] m-0">The Capital Pool</h1>
        <p className="font-serif font-normal leading-[22px] not-italic relative shrink-0 text-[#67626f] text-[16px] max-w-[790px] m-0">
          Every policy is fully backed before it is sold. Anyone can fund the pool and receive shares of it: premiums from cover that never pays raise what a share is worth, and payouts lower it.
        </p>

        <div className="[word-break:break-word] content-stretch flex gap-[16px] items-start leading-[normal] relative shrink-0 w-full" data-name="stats-row">
          <StatBox label="TOTAL POOL LIQUIDITY" value={r ? `${gen(pool)} GEN` : unknown} sub="" />
          <StatBox label="LOCKED COVER COLLATERAL" value={r ? `${gen(locked)} GEN` : unknown} sub={policies.data ? `Backing ${open.length} open ${open.length === 1 ? "policy" : "policies"}` : "…"} tone="locked" />
          <StatBox label="FREE LIQUIDITY CAPACITY" value={r ? `${gen(free)} GEN` : unknown} sub={r ? `${freeShare.toFixed(1)}% of the pool is free` : "…"} tone="free" />
          <StatBox label="UTILIZATION RATE" value={r ? `${lockedShare.toFixed(2)}%` : unknown} sub="Share of the pool backing open cover" />
        </div>

        <div className="peril-glass border border-solid content-stretch flex flex-wrap gap-[28px] items-center p-[20px] relative rounded-[12px] shrink-0 w-full" data-name="gauge-box">
          {/*
            The share of the pool that is working, drawn as a half dial. The
            arc is computed from the live figure, not a fixed path: at p of the
            way round, the end point is (cx + r cos a, cy - r sin a) for
            a = 180 - 180p degrees, so the sweep always matches the number
            printed inside it. With no reading, only the empty track is drawn.
          */}
          <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="utilisation-dial">
            {(() => {
              const R = 96;
              const CX = 132;
              const CY = 118;
              const p = r ? Math.max(0, Math.min(100, lockedShare)) / 100 : 0;
              const a = ((180 - 180 * p) * Math.PI) / 180;
              const x = CX + R * Math.cos(a);
              const y = CY - R * Math.sin(a);
              return (
                <svg width="264" height="142" viewBox="0 0 264 142" role="img" aria-label={r ? `${lockedShare.toFixed(2)}% of the pool is backing open cover` : "Utilisation unavailable"}>
                  <path d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`} fill="none" stroke="#e9e4f4" strokeWidth="18" strokeLinecap="round" />
                  {r && p > 0 && (
                    <path d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${x.toFixed(2)} ${y.toFixed(2)}`} fill="none" stroke="#6d28d9" strokeWidth="18" strokeLinecap="round" />
                  )}
                  <text x={CX} y={CY - 30} textAnchor="middle" className="font-mono" fontSize="28" fontWeight="700" fill="#16141b">
                    {r ? `${lockedShare.toFixed(2)}%` : "…"}
                  </text>
                  <text x={CX} y={CY - 12} textAnchor="middle" className="font-mono" fontSize="10" fill="#67626f">OF THE POOL IS WORKING</text>
                  <text x={CX - R} y={CY + 20} textAnchor="middle" className="font-mono" fontSize="10" fill="#787384">0%</text>
                  <text x={CX + R} y={CY + 20} textAnchor="middle" className="font-mono" fontSize="10" fill="#787384">100%</text>
                </svg>
              );
            })()}
          </div>

          <div className="content-stretch flex flex-[1_0_0] flex-col gap-[12px] items-start justify-center min-w-[380px] relative">
            <p className="font-serif font-normal leading-[normal] not-italic relative shrink-0 text-[#787384] text-[11px] w-full m-0">
              * Funds backing open cover cannot be withdrawn. Redemptions are paid only from free funds, so the money a policyholder may be owed never leaves.
            </p>
          </div>
      </div>
      </div>

      <div className="content-stretch flex gap-[24px] items-start pb-[48px] px-[120px] relative shrink-0 w-full" data-name="pool-interactive">
        <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-start min-w-px relative" data-name="forms-grid">
          <div className="peril-glass border border-solid content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px p-[24px] relative rounded-[12px]" data-name="fund-card">
            <p className="font-mono font-extrabold leading-[normal] relative shrink-0 text-accent-text text-[16px] w-full m-0">Deposit Capital</p>
            <p className="font-serif font-normal leading-[normal] not-italic relative shrink-0 text-[#67626f] text-[13px] w-full m-0">
              Fund the pool so it can back more cover, and take a share of every premium that never pays out.
            </p>
            <label className="content-stretch flex flex-col gap-[6px] items-start leading-[normal] relative shrink-0 w-full">
              <span className="content-stretch flex font-mono font-normal items-start justify-between relative shrink-0 text-[11px] w-full whitespace-nowrap">
                <span className="text-[#67626f]">GEN Amount</span>
                <span className="text-[#787384]">
                  {account ? `Wallet: ${balance.data ? gen(balance.data) : "…"} GEN` : "Account: not signed in"}
                </span>
              </span>
              <span className="bg-[#faf8fd] border border-[#e3ddf0] border-solid content-stretch flex gap-[8px] items-center p-[12px] relative rounded-[6px] shrink-0 w-full focus-within:border-accent-line">
                <input inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} className="flex-[1_0_0] bg-transparent border-0 outline-none font-mono font-bold min-w-px text-[14px] text-[#16141b] p-0" aria-label="GEN to deposit" />
                <span className="font-mono font-normal text-[#67626f] text-[13px]">GEN</span>
              </span>
            </label>
            <div className="content-stretch flex items-start justify-between relative shrink-0 text-[12px] w-full whitespace-nowrap">
              <p className="font-serif text-[#67626f] m-0">Projected Shares</p>
              <p className="font-mono text-accent-text m-0">{minted !== null ? `${gen(minted, 4)} shares` : "…"}</p>
            </div>
            <button type="button" disabled={Boolean(fundProblem) || !walletAvailable() || busy !== null || !r} onClick={() => act("fund")} className="peril-cta border-0 content-stretch flex items-start justify-center p-[12px] relative rounded-[6px] shrink-0 w-full disabled:opacity-50" data-name="deposit-cta">
              <span className="font-mono font-extrabold leading-[normal] text-[#ffffff] text-[13px] whitespace-nowrap">{busy === "fund" ? <><span className="peril-ring" aria-hidden="true" /> CONFIRM IN YOUR WALLET</> : "DEPOSIT GEN TO POOL"}</span>
            </button>
            <p className="font-serif font-normal leading-[16px] not-italic relative shrink-0 text-[#787384] text-[11px] w-full m-0">
              {`Shares are minted at the pool's full value, currently ${perShareFull} GEN per share, so you pay for premiums already earned. There is no deposit fee.`}
            </p>
            {fundProblem && amount.trim() !== "" && <p className="font-serif text-[#5b21b6] text-[11px] m-0">{fundProblem}</p>}
          </div>

          <div className="peril-glass border border-solid content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px p-[24px] relative rounded-[12px]" data-name="withdraw-card">
            <p className="font-mono font-extrabold leading-[normal] relative shrink-0 text-[16px] text-[#16141b] w-full m-0">Withdraw Capital</p>
            <p className="font-serif font-normal leading-[normal] not-italic relative shrink-0 text-[#67626f] text-[13px] w-full m-0">
              Redeem shares for GEN. Only funds not backing open cover can be withdrawn.
            </p>
            <label className="content-stretch flex flex-col gap-[6px] items-start leading-[normal] relative shrink-0 w-full">
              <span className="content-stretch flex font-mono font-normal items-start justify-between relative shrink-0 text-[11px] w-full whitespace-nowrap">
                <span className="text-[#67626f]">Shares to Burn</span>
                <button type="button" onClick={() => setBurn(gen(held, 18).replace(/,/g, "").replace(/\.?0+$/, ""))} disabled={held === 0n} className="bg-transparent border-0 p-0 text-[#787384] hover:text-accent-text text-[11px] font-mono disabled:hover:text-[#787384]">
                  Held: {position.data ? gen(held, 4) : funder ? "…" : "–"} (MAX)
                </button>
              </span>
              <span className="bg-[#faf8fd] border border-[#e3ddf0] border-solid content-stretch flex gap-[8px] items-center p-[12px] relative rounded-[6px] shrink-0 w-full focus-within:border-accent-line">
                <input inputMode="decimal" value={burn} placeholder="0.00" onChange={(e) => setBurn(e.target.value)} className="flex-[1_0_0] bg-transparent border-0 outline-none font-mono font-bold min-w-px text-[14px] text-[#16141b] placeholder:text-[#787384] p-0" aria-label="Shares to burn" />
                <span className="font-mono font-normal text-[#67626f] text-[13px]">shares</span>
              </span>
            </label>
            <div className="content-stretch flex items-start justify-between relative shrink-0 text-[#67626f] text-[12px] w-full whitespace-nowrap">
              <p className="font-serif m-0">Est. GEN Payout</p>
              <p className="font-mono m-0">{burnValue !== null ? `${gen(burnValue, 4)} GEN` : "0.00 GEN"}</p>
            </div>
            <button type="button" disabled={Boolean(withdrawProblem) || burnUnits === null || burnUnits <= 0n || !walletAvailable() || busy !== null} onClick={() => act("withdraw")} className="bg-[#f1edfa] border border-[#e3ddf0] border-solid content-stretch flex items-start justify-center p-[12px] relative rounded-[6px] shrink-0 w-full enabled:hover:border-accent-line disabled:opacity-60" data-name="withdraw-cta">
              <span className="font-mono font-extrabold leading-[normal] text-[#67626f] text-[13px] whitespace-nowrap">{busy === "withdraw" ? <><span className="peril-ring" aria-hidden="true" /> CONFIRM IN YOUR WALLET</> : "WITHDRAW CAPITAL"}</span>
            </button>
            {withdrawProblem && (
              <div className="bg-[rgba(124,58,237,0.12)] border border-[#6d28d9] border-solid content-stretch flex items-start p-[10px] relative rounded-[6px] shrink-0 w-full" role="alert">
                <p className="flex-[1_0_0] font-serif font-normal leading-[14px] min-w-px not-italic text-[#5b21b6] text-[11px] m-0">{withdrawProblem}</p>
              </div>
            )}
            <p className="font-serif font-normal leading-[16px] not-italic relative shrink-0 text-[#787384] text-[11px] w-full m-0">
              Leaving while cover is open leaves your part of the locked funds to the funders who stay and carry that risk.
            </p>
          </div>
        </div>

        <div className="peril-glass border border-solid content-stretch flex flex-col gap-[20px] items-start p-[32px] relative rounded-[12px] shrink-0 w-[440px]" data-name="position-sidebar">
          <p className="font-serif font-bold leading-[normal] not-italic relative shrink-0 text-[20px] text-[#16141b] w-full m-0">Your Funder Position</p>
          <div className="bg-[#f1edfa] border border-[#e3ddf0] border-solid content-stretch flex items-start p-[12px] relative rounded-[6px] shrink-0 w-full">
            <p className="flex-[1_0_0] font-mono font-normal leading-[normal] min-w-px text-accent-text text-[13px] m-0">
              {funder ? `shares_of(${short(funder, 10, 4)})` : "Sign in, or add ?funder=0x… to the link"}
            </p>
          </div>
          <div className="content-stretch flex flex-col gap-[12px] items-start leading-[normal] relative shrink-0 text-[13px] w-full whitespace-nowrap">
            <Row label="Total Share Balance" value={position.data ? `${gen(held, 4)} shares` : funder ? "…" : "–"} />
            <Row label="Redeemable Value Now" value={position.data ? `${gen(position.data.redeemable, 4)} GEN` : funder ? "…" : "–"} tone="text-accent-text" />
            <Row label="Pool Ownership" value={position.data && total > 0n ? `${ownership.toFixed(2)}%` : "–"} />
            <Row label="Pool Value per Share" value={`${perShareFull} GEN`} tone="text-[#67626f]" />
            <Row label="Redeemable per Share" value={`${perShareNow} GEN`} tone="text-accent-text" />
          </div>
          <div className="bg-[#e3ddf0] h-px relative shrink-0 w-full" />
          <div className="content-stretch flex flex-col font-normal gap-[6px] items-start relative shrink-0 text-[#67626f] w-full">
            <p className="font-mono leading-[normal] text-[11px] uppercase whitespace-nowrap m-0">Share Mechanics</p>
            <p className="font-serif leading-[18px] not-italic text-[12px] m-0">
              Premiums raise what a share is worth and payouts lower it. Shares redeem only against funds not backing open cover, so withdrawing before a known payout gains nothing. Expired cover returns to the free funds when anyone calls close on it.
            </p>
          </div>
          {failure && <p className="font-serif text-[#5b21b6] text-[12px] leading-[17px] m-0" role="alert">{failure}</p>}
          {sent && (
            <p className="font-serif text-[#67626f] text-[12px] leading-[17px] m-0" role="status">
              {"Submitted "}
              <a href={txUrl(sent)} target="_blank" rel="noreferrer" className="font-mono text-accent-text">{short(sent, 8, 6)}</a>
              {". Shares update once the network accepts it; withdrawn GEN arrives when it finalises, about 30 seconds later."}
            </p>
          )}
        </div>
      </div>

      <div className="content-stretch flex flex-col gap-[20px] items-start pb-[80px] px-[120px] relative shrink-0 w-full" data-name="exposure-section">
        <p className="font-mono font-normal leading-[normal] relative shrink-0 text-accent-text text-[12px] uppercase whitespace-nowrap m-0">{`Active Pool Risk & Exposure Breakdown`}</p>
        <div className="peril-glass border border-solid content-stretch flex flex-col items-start relative rounded-[12px] shrink-0 w-full" data-name="table-box">
          <div className="bg-[#f1edfa] border border-[#e3ddf0] border-solid content-stretch flex font-serif font-semibold items-start leading-[normal] not-italic p-[16px] relative shrink-0 text-[#67626f] text-[13px] w-full">
            {["POLICY ID", "SERVICE", "UTC WINDOW", "LOCKED RESERVES", "THRESHOLD"].map((h) => (
              <p key={h} className="flex-[1_0_0] min-w-px relative m-0">{h}</p>
            ))}
            <p className="relative shrink-0 w-[120px] m-0">STATUS</p>
          </div>
          {!policies.data && (
            <div className="border border-[#e3ddf0] border-solid p-[16px] w-full">
              <p className="font-mono text-[#67626f] text-[13px] m-0">{policies.error ? `Could not read open cover: ${policies.error}` : "Reading open cover from Studio Next…"}</p>
            </div>
          )}
          {policies.data && open.length === 0 && (
            <div className="border border-[#e3ddf0] border-solid p-[16px] w-full">
              <p className="font-mono text-[#67626f] text-[13px] m-0">The pool is backing no open cover right now.</p>
            </div>
          )}
          {open.map((p) => {
            const e = exposure(p);
            return (
              <a key={p.policy_id} href={`#/policy?id=${encodeURIComponent(p.policy_id)}`} className="border border-[#e3ddf0] border-solid content-stretch flex items-center p-[16px] relative shrink-0 w-full no-underline hover:bg-[#efe8da]">
                <span className="flex-[1_0_0] font-mono font-normal leading-[normal] min-w-px text-[13px] text-[#16141b]">{p.policy_id}</span>
                <span className="flex-[1_0_0] font-serif font-normal leading-[normal] min-w-px text-[13px] text-[#16141b]">{serviceName(p.cover)}</span>
                <span className="flex-[1_0_0] font-mono font-normal leading-[normal] min-w-px text-[#67626f] text-[13px]">{day(p.window_start)} - {day(p.window_end)}</span>
                <span className="flex-[1_0_0] font-mono font-bold leading-[normal] min-w-px text-[13px]"><span className="peril-grad-text">{gen(p.payout)} GEN</span></span>
                <span className="flex-[1_0_0] font-mono font-normal leading-[normal] min-w-px text-[#67626f] text-[13px]">{p.threshold_minutes} mins</span>
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
