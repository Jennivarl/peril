import { useEffect, useState } from "react";
import { LIFECYCLE, PERIL, REPO, addressUrl, readReserves, short, txStatus, txUrl } from "../lib/chain";
import { useAccount, useLastTx, usePolled } from "../lib/hooks";
import { privyEnabled } from "../lib/privy";
import { walletAvailable, walletError } from "../lib/wallet";
import { PrivyControls } from "./PrivyControls";

/**
 * The header, lifecycle tracker and footer from the Figma frames, shared by
 * every page. Classes are the Figma export's, unchanged; only the values are
 * live.
 */

const TABS: { path: string; label: string; name: string }[] = [
  { path: "/", label: "Home", name: "tab-home" },
  { path: "/explore", label: "Explore", name: "tab-explore" },
  { path: "/buy", label: "Buy Cover", name: "tab-buy" },
  { path: "/my-cover", label: "My Cover", name: "tab-my" },
  { path: "/pool", label: "The Pool", name: "tab-pool" },
  { path: "/how", label: "How It Works", name: "tab-how" },
  { path: "/evidence", label: "Evidence", name: "tab-evidence" },
  { path: "/limits", label: "Limits", name: "tab-limits" },
];

/** Shown only when there is an account, so a stranger sees no dead tab. */
const ACCOUNT_TAB = { path: "/profile", label: "Account", name: "tab-profile" };

export function Header({ active }: { active: string }) {
  const reserves = usePolled(readReserves, 60000);
  const { account, connectWallet } = useAccount();
  const [walletProblem, setWalletProblem] = useState<string | null>(null);

  const onConnect = async () => {
    setWalletProblem(null);
    try {
      await connectWallet();
    } catch (e) {
      setWalletProblem(walletError(e));
    }
  };

  return (
    <div className="bg-[#faf8fd] content-stretch flex lg:h-[72px] items-center justify-between px-[16px] lg:px-[40px] relative shrink-0 w-full flex-wrap gap-y-[10px] py-[12px] lg:py-0" data-name="shared-header">
      <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="brand-group">
        <a href="#/" className="content-stretch flex gap-[8px] items-center relative shrink-0 no-underline" data-name="wordmark">
          {/* Option 08: one word, two halves. The risk in ink, the cover in violet. */}
          <span className="peril-wordmark leading-[normal] text-[34px] whitespace-nowrap">
            per<span className="text-[#7c3aed]">il</span>
          </span>
          {/* A square full stop in ink, set on the baseline. */}
          <span className="bg-[#16141b] h-[9px] inline-block self-end mb-[7px] w-[9px]" aria-hidden="true" />
        </a>
      </div>
      <nav className="bg-[#faf8fd] border border-[#e3ddf0] border-solid content-stretch flex gap-[4px] items-start p-[4px] relative rounded-[8px] shrink-0 order-3 lg:order-none w-full lg:w-auto overflow-x-auto peril-scroll" data-name="nav-tabs">
        {(account ? [...TABS, ACCOUNT_TAB] : TABS).map((t) => {
          const on = t.path === active;
          return (
            <a
              key={t.path}
              href={`#${t.path}`}
              aria-current={on ? "page" : undefined}
              className={`${on ? "bg-[#ffffff]" : "bg-[rgba(0,0,0,0)] hover:bg-[#ffffff]"} content-stretch flex items-start px-[16px] py-[8px] relative rounded-[6px] shrink-0 no-underline`}
              data-name={t.name}
            >
              <span className={`[word-break:break-word] font-serif ${on ? "font-semibold text-accent-text" : "font-normal text-[#67626f]"} leading-[normal] not-italic relative shrink-0 text-[13px] whitespace-nowrap`}>
                {t.label}
              </span>
            </a>
          );
        })}
      </nav>
      <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="wallet-group">
        {privyEnabled ? (
          <PrivyControls />
        ) : account ? (
          <a href={addressUrl(account)} target="_blank" rel="noreferrer" className="peril-cta content-stretch flex items-start relative shrink-0 no-underline" data-name="connect-btn">
            <span className="[word-break:break-word] leading-[normal] relative shrink-0 whitespace-nowrap">
              {short(account, 4, 4)}
            </span>
          </a>
        ) : (
          <button
            type="button"
            onClick={onConnect}
            disabled={!walletAvailable()}
            title={walletAvailable() ? (walletProblem ?? "Create an account to buy cover or fund the pool") : "No wallet found in this browser"}
            className={`${walletAvailable() ? "peril-cta border-0" : "bg-[#e9e4f4] border border-[#e3ddf0] border-solid px-[22px] py-[12px] rounded-[9999px]"} content-stretch flex items-start relative shrink-0`}
            data-name="connect-btn"
          >
            <span className={`[word-break:break-word] font-mono font-bold leading-[normal] relative shrink-0 ${walletAvailable() ? "" : "text-[#67626f] text-[13px]"} whitespace-nowrap`}>
              {walletAvailable() ? "CONNECT WALLET" : "NO WALLET"}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

/** Each stage in plain words, shown when a node is hovered or focused. */
const STEPS: Record<(typeof LIFECYCLE)[number], { label: string; hint: string }> = {
  PENDING: { label: "Pending", hint: "Submitted and waiting for a leader to pick it up." },
  PROPOSING: { label: "Propose", hint: "The leader runs the call and proposes a result." },
  COMMITTING: { label: "Commit", hint: "Validators run it themselves and commit their votes." },
  REVEALING: { label: "Reveal", hint: "Validators reveal their votes." },
  LEADER_REVEALING: { label: "Leader", hint: "The leader reveals its result." },
  ACCEPTED: { label: "Accepted", hint: "A majority agreed. State is updated; it can still be appealed." },
  FINALIZED: { label: "Finalized", hint: "The appeal window passed. Final, and any payout is sent." },
};

/** States that are not on the happy path, shown as a warning pill instead of a node. */
const OFF_PATH_TONE: Record<string, string> = {
  CANCELED: "border-[#d946ef] text-[#a21caf] bg-[rgba(217,70,239,0.12)]",
  UNDETERMINED: "border-[#d946ef] text-[#a21caf] bg-[rgba(217,70,239,0.12)]",
  LEADER_TIMEOUT: "border-[#6d28d9] text-[#5b21b6] bg-[rgba(124,58,237,0.10)]",
  VALIDATORS_TIMEOUT: "border-[#6d28d9] text-[#5b21b6] bg-[rgba(124,58,237,0.10)]",
  APPEAL_COMMITTING: "border-[#6d28d9] text-[#5b21b6] bg-[rgba(124,58,237,0.10)]",
  APPEAL_REVEALING: "border-[#6d28d9] text-[#5b21b6] bg-[rgba(124,58,237,0.10)]",
};

const TERMINAL = new Set(["FINALIZED", "CANCELED", "UNDETERMINED"]);

/** The consensus lifecycle of the last transaction this browser submitted, as read from the chain. */
export function TxTracker() {
  const tx = useLastTx();
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    setStatus(null);
    if (!tx) return;
    let alive = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const run = async () => {
      try {
        const s = await txStatus(tx);
        if (!alive) return;
        setStatus(s);
        if (TERMINAL.has(s)) return;
      } catch {
        // A failed poll is not a failed transaction. Keep asking.
      }
      if (alive) timer = setTimeout(run, 10000);
    };
    run();
    return () => {
      alive = false;
      if (timer) clearTimeout(timer);
    };
  }, [tx]);

  // Before a transaction exists there is no lifecycle to show, and a row of
  // dead steps across every page is just furniture.
  if (!tx) return null;

  const at = status ? LIFECYCLE.indexOf(status as (typeof LIFECYCLE)[number]) : -1;
  const offPath = status && at < 0 && status !== "UNKNOWN" ? status : null;
  const pill = offPath
      ? { text: offPath.replace(/_/g, " "), tone: OFF_PATH_TONE[offPath] ?? "border-[#aca7b8] text-[#67626f] bg-transparent" }
      : status === "FINALIZED"
        ? { text: "FINALIZED", tone: "border-accent-line text-accent-text bg-accent-tint" }
        : at >= 0
          ? { text: "IN PROGRESS", tone: "border-accent-line text-accent-text bg-accent-tint" }
          : { text: "CHECKING", tone: "border-[#aca7b8] text-[#67626f] bg-transparent" };

  return (
    <div className="bg-[rgba(247,243,232,0.9)] border-[rgba(22,20,27,0.1)] border-b border-solid content-stretch flex items-center justify-between px-[16px] lg:px-[40px] py-[12px] relative shrink-0 w-full" data-name="tx-tracker">
      <div className="[word-break:break-word] content-stretch flex font-mono font-normal gap-[10px] items-center leading-[normal] relative shrink-0 text-[11px] whitespace-nowrap" data-name="tracker-left">
        <p className="relative shrink-0 text-[#67626f] uppercase m-0">Consensus lifecycle</p>
        <span className={`${pill.tone} border border-solid px-[8px] py-[2px] rounded-[100px] text-[10px] tracking-[0.04em]`} data-name="status-pill">
          {pill.text}
        </span>
        <a href={txUrl(tx)} target="_blank" rel="noreferrer" className="relative shrink-0 text-accent-text no-underline hover:underline" title="Open this transaction in the explorer">
          {short(tx, 6, 4)}
        </a>
      </div>
      <ol className="content-stretch flex items-center list-none m-0 p-0 relative shrink-0" data-name="tracker-steps">
        {LIFECYCLE.map((step, i) => {
          const reached = at >= 0 && i <= at;
          const current = at >= 0 && i === at;
          const { label, hint } = STEPS[step];
          return (
            <li key={step} className="content-stretch flex items-center relative shrink-0" data-name={`step-${i}`}>
              {i > 0 && (
                <span
                  className={`block h-[2px] w-[28px] rounded-full ${reached ? "bg-[linear-gradient(90deg,#6d28d9,#a855f7)]" : "bg-[rgba(255,255,255,0.08)]"}`}
                  aria-hidden="true"
                />
              )}
              <span
                tabIndex={0}
                title={hint}
                aria-current={current ? "step" : undefined}
                className="group content-stretch flex flex-col gap-[4px] items-center px-[6px] relative rounded-[6px] outline-none focus-visible:ring-1 focus-visible:ring-[#7c3aed]"
              >
                <span
                  className={`block rounded-full size-[10px] border border-solid transition-colors ${
                    reached ? "bg-accent border-accent-line peril-node-on" : "bg-[#f1edfa] border-[rgba(22,20,27,0.28)] group-hover:border-[rgba(124,58,237,0.6)]"
                  }`}
                />
                <span className={`font-mono text-[10px] leading-none whitespace-nowrap ${current ? "text-accent-text" : reached ? "text-[#67626f]" : "text-[#67626f] group-hover:text-[#16141b]"}`}>
                  {label}
                </span>
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function Footer() {
  return (
    <div className="[word-break:break-word] bg-[#faf8fd] content-stretch flex font-mono font-normal justify-between leading-[normal] mt-auto px-[16px] lg:px-[40px] py-[32px] relative shrink-0 text-[12px] w-full whitespace-normal lg:whitespace-nowrap flex-col lg:flex-row gap-[10px] items-start lg:items-center" data-name="footer">
      <p className="relative shrink-0 text-[#67626f] m-0">
        PERIL Parametric Downtime Protection © 2026. GenLayer Studio Next. Testnet GEN, no dollar value.{" "}
        <a href={REPO} target="_blank" rel="noreferrer" className="text-[#67626f] underline">Source</a>
      </p>
      <a href={addressUrl(PERIL)} target="_blank" rel="noreferrer" className="relative shrink-0 text-[#787384] no-underline hover:text-[#67626f]">
        Contract Address: {short(PERIL, 7, 4)}
      </a>
    </div>
  );
}
