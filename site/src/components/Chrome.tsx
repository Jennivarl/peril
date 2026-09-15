import { useEffect, useState } from "react";
import { LIFECYCLE, PERIL, REPO, addressUrl, gen, readReserves, short, txStatus, txUrl } from "../lib/chain";
import { useAccount, useLastTx, usePolled } from "../lib/hooks";
import { walletAvailable, walletError } from "../lib/wallet";

/**
 * The header, lifecycle tracker and footer from the Figma frames, shared by
 * every page. Classes are the Figma export's, unchanged; only the values are
 * live.
 */

const TABS: { path: string; label: string; name: string }[] = [
  { path: "/", label: "Home", name: "tab-home" },
  { path: "/buy", label: "Buy Cover", name: "tab-buy" },
  { path: "/my-cover", label: "My Cover", name: "tab-my" },
  { path: "/pool", label: "The Pool", name: "tab-pool" },
  { path: "/how", label: "How It Works", name: "tab-how" },
  { path: "/evidence", label: "Evidence", name: "tab-evidence" },
  { path: "/limits", label: "Limits", name: "tab-limits" },
];

export function Header({ active }: { active: string }) {
  const reserves = usePolled(readReserves, 60000);
  const { account, connectWallet } = useAccount();
  const [walletProblem, setWalletProblem] = useState<string | null>(null);

  const free = reserves.data
    ? `Pool free: ${gen(reserves.data.free)} GEN`
    : reserves.error
      ? "Pool: unavailable"
      : "Pool free: …";

  const onConnect = async () => {
    setWalletProblem(null);
    try {
      await connectWallet();
    } catch (e) {
      setWalletProblem(walletError(e));
    }
  };

  return (
    <div className="bg-[#121418] border-[#1e222a] border-b border-solid content-stretch flex h-[72px] items-center justify-between px-[40px] relative shrink-0 w-full" data-name="shared-header">
      <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="brand-group">
        <a href="#/" className="[word-break:break-word] font-mono font-extrabold leading-[0] relative shrink-0 text-[22px] text-white whitespace-nowrap no-underline">
          <span className="leading-[normal]">PERIL</span>
          <span className="leading-[normal] text-accent-text">.</span>
        </a>
        <div className="bg-[#1c1f26] border border-[#1e222a] border-solid content-stretch flex gap-[6px] items-center px-[10px] py-[4px] relative rounded-[4px] shrink-0" data-name="network-tag">
          <div className="relative shrink-0 size-[8px]" data-name="pulse-dot">
            <span className="absolute block inset-0 max-w-none size-full rounded-full bg-accent-line peril-pulse" />
          </div>
          <p className="[word-break:break-word] font-mono font-normal leading-[normal] relative shrink-0 text-accent-text text-[11px] whitespace-nowrap">
            Chain ID: 61997 | GenLayer Studio Next
          </p>
        </div>
      </div>
      <nav className="bg-[#090a0c] border border-[#1e222a] border-solid content-stretch flex gap-[4px] items-start p-[4px] relative rounded-[8px] shrink-0" data-name="nav-tabs">
        {TABS.map((t) => {
          const on = t.path === active;
          return (
            <a
              key={t.path}
              href={`#${t.path}`}
              aria-current={on ? "page" : undefined}
              className={`${on ? "bg-[#121418]" : "bg-[rgba(0,0,0,0)] hover:bg-[#121418]"} content-stretch flex items-start px-[16px] py-[8px] relative rounded-[6px] shrink-0 no-underline`}
              data-name={t.name}
            >
              <span className={`[word-break:break-word] font-serif ${on ? "font-semibold text-accent-text" : "font-normal text-[#9ca3af]"} leading-[normal] not-italic relative shrink-0 text-[13px] whitespace-nowrap`}>
                {t.label}
              </span>
            </a>
          );
        })}
      </nav>
      <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="wallet-group">
        <div className="bg-[#161b22] border border-[#1e222a] border-solid content-stretch flex items-start px-[12px] py-[6px] relative rounded-[6px] shrink-0" data-name="balance-chip" title={reserves.error ?? "Funds in the pool not backing open cover"}>
          <p className="[word-break:break-word] font-mono font-bold leading-[normal] relative shrink-0 text-[13px] text-white whitespace-nowrap">
            {free}
          </p>
        </div>
        {account ? (
          <a href={addressUrl(account)} target="_blank" rel="noreferrer" className="bg-accent content-stretch flex items-start px-[16px] py-[8px] relative rounded-[6px] shrink-0 no-underline" data-name="connect-btn">
            <span className="[word-break:break-word] font-mono font-bold leading-[normal] relative shrink-0 text-[#090a0c] text-[13px] whitespace-nowrap">
              {short(account, 4, 4)}
            </span>
          </a>
        ) : (
          <button
            type="button"
            onClick={onConnect}
            disabled={!walletAvailable()}
            title={walletAvailable() ? (walletProblem ?? "Connect a wallet to buy cover or fund the pool") : "No wallet found in this browser"}
            className="bg-accent border-0 content-stretch flex items-start px-[16px] py-[8px] relative rounded-[6px] shrink-0 disabled:opacity-60"
            data-name="connect-btn"
          >
            <span className="[word-break:break-word] font-mono font-bold leading-[normal] relative shrink-0 text-[#090a0c] text-[13px] whitespace-nowrap">
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
  CANCELED: "border-[#ff3b30] text-[#ff3b30] bg-[rgba(255,59,48,0.08)]",
  UNDETERMINED: "border-[#ff3b30] text-[#ff3b30] bg-[rgba(255,59,48,0.08)]",
  LEADER_TIMEOUT: "border-[#8ab4f8] text-[#8ab4f8] bg-[rgba(138,180,248,0.08)]",
  VALIDATORS_TIMEOUT: "border-[#8ab4f8] text-[#8ab4f8] bg-[rgba(138,180,248,0.08)]",
  APPEAL_COMMITTING: "border-[#8ab4f8] text-[#8ab4f8] bg-[rgba(138,180,248,0.08)]",
  APPEAL_REVEALING: "border-[#8ab4f8] text-[#8ab4f8] bg-[rgba(138,180,248,0.08)]",
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

  const at = status ? LIFECYCLE.indexOf(status as (typeof LIFECYCLE)[number]) : -1;
  const offPath = status && at < 0 && status !== "UNKNOWN" ? status : null;
  const pill = !tx
    ? { text: "IDLE", tone: "border-[rgba(255,255,255,0.1)] text-[#4b5563] bg-transparent" }
    : offPath
      ? { text: offPath.replace(/_/g, " "), tone: OFF_PATH_TONE[offPath] ?? "border-[#4b5563] text-[#9ca3af] bg-transparent" }
      : status === "FINALIZED"
        ? { text: "FINALIZED", tone: "border-accent-line text-accent-text bg-accent-tint" }
        : at >= 0
          ? { text: "IN PROGRESS", tone: "border-accent-line text-accent-text bg-accent-tint" }
          : { text: "CHECKING", tone: "border-[#4b5563] text-[#9ca3af] bg-transparent" };

  return (
    <div className="bg-[rgba(9,10,12,0.85)] border-[rgba(255,255,255,0.06)] border-b border-solid content-stretch flex items-center justify-between px-[40px] py-[12px] relative shrink-0 w-full" data-name="tx-tracker">
      <div className="[word-break:break-word] content-stretch flex font-mono font-normal gap-[10px] items-center leading-[normal] relative shrink-0 text-[11px] whitespace-nowrap" data-name="tracker-left">
        <p className="relative shrink-0 text-[#9ca3af] uppercase m-0">Consensus lifecycle</p>
        <span className={`${pill.tone} border border-solid px-[8px] py-[2px] rounded-[100px] text-[10px] tracking-[0.04em]`} data-name="status-pill">
          {pill.text}
        </span>
        {tx ? (
          <a href={txUrl(tx)} target="_blank" rel="noreferrer" className="relative shrink-0 text-accent-text no-underline hover:underline" title="Open this transaction in the explorer">
            {short(tx, 6, 4)}
          </a>
        ) : (
          <p className="relative shrink-0 text-[#4b5563] m-0">no transaction from this browser yet</p>
        )}
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
                  className={`block h-[2px] w-[28px] rounded-full ${reached ? "bg-[linear-gradient(90deg,#ff9500,#ffc56b)]" : "bg-[rgba(255,255,255,0.08)]"}`}
                  aria-hidden="true"
                />
              )}
              <span
                tabIndex={0}
                title={hint}
                aria-current={current ? "step" : undefined}
                className="group content-stretch flex flex-col gap-[4px] items-center px-[6px] relative rounded-[6px] outline-none focus-visible:ring-1 focus-visible:ring-[#ff9500]"
              >
                <span
                  className={`block rounded-full size-[10px] border border-solid transition-colors ${
                    reached ? "bg-accent border-accent-line peril-node-on" : "bg-[#0d1117] border-[rgba(255,255,255,0.18)] group-hover:border-[rgba(255,149,0,0.6)]"
                  } ${current && step !== "FINALIZED" ? "peril-pulse" : ""}`}
                />
                <span className={`font-mono text-[10px] leading-none whitespace-nowrap ${current ? "text-accent-text" : reached ? "text-[#9ca3af]" : "text-[#4b5563] group-hover:text-[#9ca3af]"}`}>
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
    <div className="[word-break:break-word] bg-[#121418] border-[#1e222a] border-solid border-t content-stretch flex font-mono font-normal items-center justify-between leading-[normal] px-[40px] py-[32px] relative shrink-0 text-[12px] w-full whitespace-nowrap" data-name="footer">
      <p className="relative shrink-0 text-[#9ca3af] m-0">
        PERIL Parametric Downtime Protection © 2026. GenLayer Studio Next Deployment.{" "}
        <a href={REPO} target="_blank" rel="noreferrer" className="text-[#9ca3af] underline">Source</a>
      </p>
      <a href={addressUrl(PERIL)} target="_blank" rel="noreferrer" className="relative shrink-0 text-[#4b5563] no-underline hover:text-[#9ca3af]">
        Contract Address: {short(PERIL, 7, 4)}
      </a>
    </div>
  );
}
