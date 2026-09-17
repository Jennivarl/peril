import { useEffect, useMemo, useState } from "react";
import { Footer, Header } from "../components/Chrome";
import { ProviderIcon } from "../components/ProviderIcon";
import {
  addDays,
  daysBetween,
  gen,
  hours,
  readCovered,
  readPolicyIds,
  readReserves,
  short,
  toWei,
  todayUtc,
  txUrl,
} from "../lib/chain";
import { serviceName } from "../lib/evidence";
import { setLastTx, useAccount, usePolled } from "../lib/hooks";
import { buyCover, walletAvailable, walletError } from "../lib/wallet";

/**
 * The Figma buy-cover frame as a working form. Every choice is read from the
 * contract, and every rule the contract enforces is checked here first, so
 * nobody pays gas to be told no.
 */

const MAX_LEAD_DAYS = 30;
const MAX_WINDOW_DAYS = 7;

/** The outage length a catalogue row asked for, if it named one. */
function queryTier(): number | null {
  const q = window.location.hash.split("?")[1];
  const raw = q ? new URLSearchParams(q).get("tier") : null;
  const n = raw ? Number(raw) : NaN;
  return Number.isInteger(n) && n > 0 ? n : null;
}

function queryCover(): string | null {
  const q = window.location.hash.split("?")[1];
  return q ? new URLSearchParams(q).get("cover") : null;
}

const inputBox =
  "peril-glass border border-solid rounded-[6px] w-full p-[12px] font-mono font-normal text-[14px] text-[#16141b] outline-none focus:border-accent-line [color-scheme:dark]";

export default function BuyCover() {
  const covers = usePolled(readCovered, 0);
  const reserves = usePolled(readReserves, 60000);
  const ids = usePolled(readPolicyIds, 60000);
  const { account } = useAccount();

  const today = todayUtc();
  const tomorrow = addDays(today, 1);

  const [cover, setCover] = useState<string | null>(queryCover());
  const [threshold, setThreshold] = useState<number | null>(queryTier());
  const [start, setStart] = useState(tomorrow);
  const [end, setEnd] = useState(addDays(tomorrow, MAX_WINDOW_DAYS));
  const [premium, setPremium] = useState("0.25");
  const [policyId, setPolicyId] = useState("");
  const [idTouched, setIdTouched] = useState(false);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState<string | null>(null);
  const [failure, setFailure] = useState<string | null>(null);

  const list = covers.data ?? [];
  const selected = list.find((c) => c.cover === cover) ?? list[0];
  const tiers = selected ? Object.keys(selected.multiples).map(Number).sort((a, b) => a - b) : [];
  const tier = threshold !== null && tiers.includes(threshold) ? threshold : tiers[0];
  const multiple = selected && tier !== undefined ? selected.multiples[String(tier)] : undefined;

  // Keep the chosen cover valid once the list arrives, and suggest a readable id.
  useEffect(() => {
    if (selected && cover !== selected.cover) setCover(selected.cover);
  }, [selected, cover]);
  useEffect(() => {
    if (!idTouched && selected) setPolicyId(`${selected.cover}-${start}`);
  }, [selected, start, idTouched]);

  const premiumWei = useMemo(() => {
    try {
      return toWei(premium);
    } catch {
      return null;
    }
  }, [premium]);
  const payoutWei = premiumWei !== null && multiple ? premiumWei * BigInt(multiple) : null;

  const key = policyId.trim().toLowerCase();
  const taken = ids.data ? ids.data.includes(key) : undefined;

  const free = reserves.data ? BigInt(reserves.data.free) : null;
  // Solvency: free + premium must cover premium x multiple, so the largest
  // premium the pool can back is free / (multiple - 1).
  const maxPremium = free !== null && multiple && multiple > 1 ? free / BigInt(multiple - 1) : null;

  const problem = (() => {
    if (!selected || tier === undefined) return "Choose a service and an outage length.";
    if (start <= today) return "Cover starts tomorrow at the earliest, so a known outage cannot be insured.";
    if (daysBetween(today, start) > MAX_LEAD_DAYS) return `Cover can be bought at most ${MAX_LEAD_DAYS} days ahead.`;
    if (end <= start) return "The window must end after it starts.";
    if (daysBetween(start, end) > MAX_WINDOW_DAYS) return `A window is at most ${MAX_WINDOW_DAYS} days.`;
    if (premiumWei === null || premiumWei <= 0n) return "Enter a premium in GEN.";
    if (!key) return "Name the policy.";
    if (taken) return `The policy name "${key}" is already taken.`;
    if (maxPremium !== null && premiumWei > maxPremium) {
      return `The pool cannot back this payout right now. At ${multiple}x it can back a premium up to ${gen(maxPremium, 4)} GEN.`;
    }
    return null;
  })();

  const canBuy = !problem && walletAvailable() && !busy && reserves.data !== undefined;

  const onBuy = async () => {
    if (!selected || tier === undefined || premiumWei === null) return;
    setBusy(true);
    setFailure(null);
    setSent(null);
    try {
      const tx = await buyCover(key, selected.cover, start, end, tier, premiumWei);
      setLastTx(tx);
      setSent(tx);
    } catch (e) {
      setFailure(walletError(e));
    } finally {
      setBusy(false);
    }
  };

  const days = daysBetween(start, end);

  return (
    <div className="bg-[#faf8fd] content-stretch flex flex-col items-start min-h-screen mx-auto max-w-[1440px] relative size-full" data-name="peril-buy-cover">
      <Header active="/buy" />

      <div className="content-stretch flex gap-[32px] items-start p-[40px] relative shrink-0 w-full" data-name="workspace-container">
        <div className="content-stretch flex flex-[1_0_0] flex-col gap-[24px] items-start min-w-px relative" data-name="params-form">
          <h1 className="[word-break:break-word] font-serif font-extrabold leading-[normal] not-italic relative shrink-0 text-[28px] text-[#16141b] whitespace-nowrap m-0">
            Configure Parametric Cover
          </h1>

          <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full" data-name="step-1">
            <p className="[word-break:break-word] font-mono font-normal leading-[normal] relative shrink-0 text-[#67626f] text-[11px] uppercase whitespace-nowrap m-0">
              Step 1: Select Service Target
            </p>
            <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full" data-name="radio-grid" role="radiogroup">
              {!covers.data && (
                <p className="font-mono text-[#67626f] text-[13px] m-0">
                  {covers.error ? `Could not read the price list: ${covers.error}` : "Reading the price list from Studio Next…"}
                </p>
              )}
              {list.map((c) => {
                const on = selected?.cover === c.cover;
                return (
                  <button
                    key={c.cover}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => {
                      setCover(c.cover);
                      setThreshold(null);
                    }}
                    className={`${on ? "bg-accent-deeper border-accent-line" : "bg-[#ffffff] border-[#e3ddf0] hover:border-[#aca7b8]"} border border-solid content-stretch flex flex-[1_0_0] gap-[8px] items-center min-w-px px-[16px] py-[12px] relative rounded-[8px] text-left`}
                    data-name={`radio-${c.cover}`}
                  >
                    <span className={`${on ? "" : "opacity-55"} content-stretch flex items-center justify-center shrink-0 size-[18px]`} data-name="logo">
                      <ProviderIcon cover={c.cover} size={17} />
                    </span>
                    <span className={`[word-break:break-word] font-serif font-semibold leading-[normal] not-italic relative shrink-0 text-[14px] whitespace-nowrap ${on ? "text-[#16141b]" : "text-[#67626f]"}`}>
                      {serviceName(c.cover)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="[word-break:break-word] content-stretch flex flex-col gap-[10px] items-start leading-[normal] relative shrink-0 w-full whitespace-nowrap" data-name="step-2">
            <p className="font-mono font-normal relative shrink-0 text-[#67626f] text-[11px] uppercase m-0">
              Step 2: Downtime Threshold Duration
            </p>
            <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full" data-name="segments" role="radiogroup">
              {tiers.map((t) => {
                const on = t === tier;
                return (
                  <button
                    key={t}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setThreshold(t)}
                    className={`${on ? "bg-accent-deeper border-accent-line" : "bg-[#ffffff] border-[#e3ddf0] hover:border-[#aca7b8]"} border border-solid content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-center min-w-px p-[12px] relative rounded-[8px]`}
                    data-name={`seg-${hours(t)}`}
                  >
                    <span className={`font-mono font-bold relative shrink-0 text-[16px] ${on ? "text-[#16141b]" : "text-[#67626f]"}`}>{hours(t)}</span>
                    <span className={`font-mono font-normal relative shrink-0 text-[11px] ${on ? "text-accent-text" : "text-[#787384]"}`}>
                      pays {selected?.multiples[String(t)]}x
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full" data-name="step-3">
            <p className="[word-break:break-word] font-mono font-normal leading-[normal] relative shrink-0 text-[#67626f] text-[11px] uppercase whitespace-nowrap m-0">
              Step 3: UTC Date Window Limits
            </p>
            <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full" data-name="date-inputs">
              <label className="content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-start min-w-px relative">
                <span className="[word-break:break-word] font-serif font-normal leading-[normal] not-italic relative shrink-0 text-[#67626f] text-[12px] whitespace-nowrap">
                  Start Window (UTC, from 00:00)
                </span>
                <input
                  type="date"
                  className={inputBox}
                  value={start}
                  min={tomorrow}
                  max={addDays(today, MAX_LEAD_DAYS)}
                  onChange={(e) => {
                    const s = e.target.value;
                    setStart(s);
                    if (s && (end <= s || daysBetween(s, end) > MAX_WINDOW_DAYS)) setEnd(addDays(s, MAX_WINDOW_DAYS));
                  }}
                />
              </label>
              <label className="content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-start min-w-px relative">
                <span className="[word-break:break-word] font-serif font-normal leading-[normal] not-italic relative shrink-0 text-[#67626f] text-[12px] whitespace-nowrap">
                  End Window (UTC, until 00:00)
                </span>
                <input
                  type="date"
                  className={inputBox}
                  value={end}
                  min={start ? addDays(start, 1) : undefined}
                  max={start ? addDays(start, MAX_WINDOW_DAYS) : undefined}
                  onChange={(e) => setEnd(e.target.value)}
                />
              </label>
            </div>
            <div className="bg-[#f1edfa] content-stretch flex items-start p-[12px] relative rounded-[6px] shrink-0 w-full" data-name="rules-box">
              <p className="[word-break:break-word] flex-[1_0_0] font-serif font-normal leading-[16px] min-w-px not-italic relative text-[#67626f] text-[12px] m-0">
                • Cover starts tomorrow (UTC) at the earliest, so an outage already under way cannot be insured. • Start at most 30 days ahead. • A window runs at most 7 days.
              </p>
            </div>
          </div>

          <div className="[word-break:break-word] content-stretch flex flex-col gap-[10px] items-start leading-[normal] relative shrink-0 w-full whitespace-nowrap" data-name="step-4">
            <p className="font-mono font-normal relative shrink-0 text-[#67626f] text-[11px] uppercase m-0">Step 4: Premium Capital Commit</p>
            <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full" data-name="premium-calculator">
              <label className="content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-start min-w-px relative">
                <span className="font-serif font-normal not-italic relative shrink-0 text-[#67626f] text-[12px]">Premium Amount (GEN)</span>
                <span className="peril-glass border border-solid content-stretch flex gap-[8px] items-center p-[12px] relative rounded-[6px] shrink-0 w-full focus-within:border-accent-line">
                  <input
                    inputMode="decimal"
                    value={premium}
                    onChange={(e) => setPremium(e.target.value)}
                    className="bg-transparent border-0 outline-none font-mono font-bold text-[14px] text-[#16141b] w-full p-0"
                    aria-label="Premium in GEN"
                  />
                  <span className="font-mono font-normal relative shrink-0 text-[#67626f] text-[12px]">GEN</span>
                </span>
              </label>
              <p className="font-serif font-normal not-italic relative shrink-0 text-[#67626f] text-[24px] m-0 pt-[18px]">=</p>
              <div className="content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-start min-w-px relative">
                <p className="font-serif font-normal not-italic relative shrink-0 text-[#67626f] text-[12px] m-0">Calculated Max Payout</p>
                <div className="bg-accent-tint border border-accent-line border-solid content-stretch flex gap-[8px] items-center p-[12px] relative rounded-[6px] shrink-0 text-accent-text w-full">
                  <p className="font-mono font-bold relative shrink-0 text-[14px] m-0">{payoutWei !== null ? gen(payoutWei, 4) : "…"}</p>
                  <p className="font-mono font-normal relative shrink-0 text-[12px] m-0">GEN ({multiple ?? "?"}x multiple)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full" data-name="step-5">
            <p className="[word-break:break-word] font-mono font-normal leading-[normal] relative shrink-0 text-[#67626f] text-[11px] uppercase whitespace-nowrap m-0">{`Step 5: Contract Identity & Check`}</p>
            <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-name="policy-id-line">
              <input
                className={`${inputBox} flex-[1_0_0] min-w-px`}
                value={policyId}
                onChange={(e) => {
                  setIdTouched(true);
                  setPolicyId(e.target.value);
                }}
                aria-label="Policy name"
              />
              <div
                className={`${!key ? "bg-[#e9e4f4] border-[#aca7b8] text-[#67626f]" : taken ? "bg-[rgba(124,58,237,0.12)] border-[#6d28d9] text-[#5b21b6]" : "bg-accent-deep border-accent-line text-accent-text"} border border-solid content-stretch flex items-start px-[16px] py-[12px] relative rounded-[6px] shrink-0`}
              >
                <p className="[word-break:break-word] font-mono font-normal leading-[normal] relative shrink-0 text-[13px] whitespace-nowrap m-0">
                  {!key ? "NAME IT" : taken === undefined ? "CHECKING" : taken ? "TAKEN" : "AVAILABLE"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="peril-glass border border-solid content-stretch flex flex-col gap-[24px] items-start p-[32px] relative rounded-[12px] shrink-0 w-[440px]" data-name="summary-panel">
          <p className="[word-break:break-word] font-serif font-bold leading-[normal] not-italic relative shrink-0 text-[20px] text-[#16141b] whitespace-nowrap m-0">Review Proposal</p>
          <div className="bg-[#f1edfa] border border-[#e3ddf0] border-solid content-stretch flex items-start p-[20px] relative rounded-[8px] shrink-0 w-full">
            <p className="[word-break:break-word] flex-[1_0_0] font-serif font-normal leading-[22px] min-w-px not-italic relative text-[15px] text-[#16141b] m-0">
              {"“If "}
              <span className="font-serif font-bold text-accent-text">{selected?.host ?? "the provider"}</span>
              {" publishes an outage it rates major or critical, beginning between "}
              <span className="font-serif font-bold">{start} 00:00 UTC</span>
              {" and "}
              <span className="font-serif font-bold">{end} 00:00 UTC</span>
              {", lasting "}
              <span className="font-serif font-bold text-accent-text">{tier !== undefined ? hours(tier) : "…"}</span>
              {" or more, this pays "}
              <span className="font-serif font-bold text-accent-text">{payoutWei !== null ? gen(payoutWei, 4) : "…"}</span>
              {" GEN.”"}
            </p>
          </div>

          {problem && (
            <div className="bg-[rgba(124,58,237,0.12)] border border-[#6d28d9] border-solid content-stretch flex gap-[12px] items-start p-[16px] relative rounded-[8px] shrink-0 w-full" data-name="warning-box" role="alert">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 mt-[1px]">
                <path d="M12 3 2 21h20L12 3z" />
                <path d="M12 10v5" />
                <path d="M12 18h.01" />
              </svg>
              <p className="[word-break:break-word] flex-[1_0_0] font-serif font-normal leading-[18px] min-w-px not-italic relative text-[#5b21b6] text-[13px] m-0">{problem}</p>
            </div>
          )}

          <div className="[word-break:break-word] content-stretch flex flex-col gap-[12px] items-start leading-[normal] relative shrink-0 text-[13px] w-full whitespace-nowrap" data-name="summary-list">
            {[
              ["Policy Premium", premiumWei !== null ? `${gen(premiumWei, 4)} GEN` : "…"],
              ["Max Potential Payout", payoutWei !== null ? `${gen(payoutWei, 4)} GEN` : "…"],
              ["Remaining Pool Capacity", reserves.data ? `${gen(reserves.data.free)} GEN` : reserves.error ? "unavailable" : "…"],
              ["Cover Length", days > 0 ? `${days} ${days === 1 ? "day" : "days"}` : "…"],
            ].map(([label, value]) => (
              <div key={label} className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="item">
                <p className="font-serif font-normal not-italic relative shrink-0 text-[#67626f] m-0">{label}</p>
                <p className="font-mono font-bold relative shrink-0 text-[#16141b] m-0">{value}</p>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={onBuy}
            disabled={!canBuy}
            className="peril-cta border-0 content-stretch flex items-start justify-center py-[16px] relative rounded-[8px] shrink-0 w-full disabled:opacity-50"
            data-name="purchase-cta"
          >
            <span className="[word-break:break-word] font-mono font-extrabold leading-[normal] relative shrink-0 text-[#ffffff] text-[15px] whitespace-nowrap">
              {busy ? <><span className="peril-ring" aria-hidden="true" /> CONFIRM IN YOUR WALLET</> : "BUY PARAMETRIC COVER"}
            </span>
          </button>

          {!walletAvailable() && (
            <p className="font-serif text-[#67626f] text-[13px] leading-[18px] m-0">Create an account to buy cover, no wallet needed. Everything else on this page works without one.</p>
          )}
          {walletAvailable() && !account && !problem && (
            <p className="font-serif text-[#67626f] text-[13px] leading-[18px] m-0">Your wallet will ask to connect and to switch to GenLayer Studio Next.</p>
          )}
          {failure && (
            <p className="font-serif text-[#5b21b6] text-[13px] leading-[18px] m-0" role="alert">{failure}</p>
          )}
          {sent && (
            <p className="font-serif text-[#67626f] text-[13px] leading-[18px] m-0" role="status">
              {"Submitted "}
              <a href={txUrl(sent)} target="_blank" rel="noreferrer" className="font-mono text-accent-text">{short(sent, 8, 6)}</a>
              {". Your cover exists once the network accepts it, usually within a few minutes; then find it in "}
              <a href="#/my-cover" className="text-accent-text">My Cover</a>.
            </p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
