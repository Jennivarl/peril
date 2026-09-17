import { useEffect, useMemo, useState } from "react";
import { Footer, Header } from "../components/Chrome";
import { daysBetween, gen, readPolicies, short, todayUtc, txUrl, type Policy } from "../lib/chain";
import { serviceName } from "../lib/evidence";
import { setLastTx, useAccount, usePolled } from "../lib/hooks";
import { PrivyLoginButton } from "../components/PrivyControls";
import { privyEnabled } from "../lib/privy";
import { settleClaim, walletAvailable, walletError } from "../lib/wallet";

/**
 * The Figma my-cover frame, wired to the contract. It lists the cover held by
 * the connected wallet (or by any address given as ?holder=0x..., so a visitor
 * without a wallet can still look), and lets anyone make a claim: the contract
 * allows anyone to settle, and pays only the holder.
 */

const SERIOUS = ["major", "critical"];

type Incident = {
  id: string;
  name: string;
  created_at: string;
  resolved_at: string | null;
  impact: string;
};

type Verdict = "Eligible" | "Under Threshold" | "Not Serious" | "Outside Window" | "Unresolved";

const VERDICT_STYLE: Record<Verdict, string> = {
  Eligible: "bg-accent-tint border-accent-line text-accent-text",
  "Under Threshold": "bg-[rgba(124,58,237,0.12)] border-[#6d28d9] text-[#5b21b6]",
  "Not Serious": "bg-[rgba(75,85,99,0.1)] border-[#aca7b8] text-[#67626f]",
  "Outside Window": "bg-[rgba(75,85,99,0.1)] border-[#aca7b8] text-[#787384]",
  Unresolved: "bg-[rgba(75,85,99,0.1)] border-[#aca7b8] text-[#67626f]",
};

const OUTCOME_LABEL: Record<string, string> = {
  under_threshold: "Under threshold",
  not_serious: "Not serious",
  outside_window: "Outside window",
  unresolved: "Unresolved",
  pays: "Pays",
};

/** Whole seconds, as the contract truncates fractional seconds before subtracting. */
const secs = (iso: string) => Math.floor(Date.parse(iso) / 1000);
const midnight = (day: string) => Date.parse(`${day}T00:00:00Z`) / 1000;

/** The contract's assess(), in the same order, for a preview only. The chain decides. */
function judge(inc: Incident, p: Policy): { verdict: Verdict; minutes: number | null } {
  if (!inc.resolved_at) return { verdict: "Unresolved", minutes: null };
  const began = secs(inc.created_at);
  const minutes = Math.floor((secs(inc.resolved_at) - began) / 60);
  if (began < midnight(p.window_start) || began >= midnight(p.window_end)) return { verdict: "Outside Window", minutes };
  if (!SERIOUS.includes((inc.impact || "").toLowerCase())) return { verdict: "Not Serious", minutes };
  if (minutes < p.threshold_minutes) return { verdict: "Under Threshold", minutes };
  return { verdict: "Eligible", minutes };
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function utcStamp(iso: string, withDate: boolean) {
  const d = new Date(iso);
  const hm = `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
  return withDate ? `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}, ${hm}` : hm;
}

function stateOf(p: Policy): { label: string; note: string; tone: string } {
  const today = todayUtc();
  if (p.state === "paid") return { label: "Paid", note: "Claim settled", tone: "text-accent-text" };
  if (p.state === "closed") return { label: "Closed", note: "Window ended with no qualifying outage", tone: "text-[#67626f]" };
  if (today < p.window_start) {
    const n = daysBetween(today, p.window_start);
    return { label: "Pending", note: `Starts in ${n} ${n === 1 ? "day" : "days"}`, tone: "text-[#16141b]" };
  }
  if (today < p.window_end) {
    const n = daysBetween(today, p.window_end);
    return { label: "Active", note: `Running, ${n} ${n === 1 ? "day" : "days"} left`, tone: "text-[#16141b]" };
  }
  return { label: "Ended", note: "Still claimable for outages that began inside it", tone: "text-accent-text" };
}

function queryHolder(): string | null {
  const q = window.location.hash.split("?")[1];
  const h = q ? new URLSearchParams(q).get("holder") : null;
  return h && /^0x[0-9a-fA-F]{40}$/.test(h) ? h : null;
}

const same = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();

export default function MyCover() {
  const { account, connectWallet } = useAccount();
  const viewing = queryHolder() ?? account;
  const policies = usePolled(readPolicies, 60000);

  const mine = useMemo(
    () => (viewing && policies.data ? policies.data.filter((p) => same(p.holder, viewing)) : []),
    [policies.data, viewing],
  );
  const open = mine.filter((p) => p.state === "open");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = mine.find((p) => p.policy_id === selectedId) ?? open[0] ?? null;

  const cover = open.reduce((s, p) => s + BigInt(p.payout), 0n);
  const paid = mine.filter((p) => p.state === "paid").reduce((s, p) => s + BigInt(p.payout), 0n);
  const refused = mine.find((p) => p.policy_id === selected?.policy_id && p.outcome && p.outcome !== "pays") ?? mine.find((p) => p.outcome && p.outcome !== "pays");

  const [incidents, setIncidents] = useState<{ list?: Incident[]; error?: string; at?: Date }>({});
  useEffect(() => {
    if (!selected) return;
    let alive = true;
    setIncidents({});
    fetch(`https://${selected.host}/api/v2/incidents.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((body: { incidents?: Incident[] }) => {
        if (alive) setIncidents({ list: body.incidents ?? [], at: new Date() });
      })
      .catch((e: unknown) => {
        if (alive) setIncidents({ error: e instanceof Error ? e.message : String(e) });
      });
    return () => {
      alive = false;
    };
  }, [selected?.policy_id, selected?.host]);

  const judged = useMemo(() => {
    if (!selected || !incidents.list) return [];
    const order: Verdict[] = ["Eligible", "Under Threshold", "Not Serious", "Unresolved", "Outside Window"];
    const lo = midnight(selected.window_start) - 7 * 86400;
    const hi = midnight(selected.window_end) + 7 * 86400;
    return incidents.list
      .filter((i) => {
        const t = secs(i.created_at);
        return t >= lo && t < hi;
      })
      .map((i) => ({ inc: i, ...judge(i, selected) }))
      .sort((a, b) => order.indexOf(a.verdict) - order.indexOf(b.verdict))
      .slice(0, 6);
  }, [incidents.list, selected]);

  const [manualId, setManualId] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [sent, setSent] = useState<string | null>(null);
  const [failure, setFailure] = useState<string | null>(null);

  const settle = async (policyId: string, incidentId: string) => {
    setBusy(incidentId);
    setFailure(null);
    setSent(null);
    try {
      const tx = await settleClaim(policyId, incidentId);
      setLastTx(tx);
      setSent(tx);
    } catch (e) {
      setFailure(walletError(e));
    } finally {
      setBusy(null);
    }
  };

  const manualOk = /^[A-Za-z0-9]+$/.test(manualId.trim());

  return (
    <div className="bg-[#faf8fd] content-stretch flex flex-col items-start min-h-screen mx-auto max-w-[1440px] relative size-full" data-name="peril-my-cover">
      <Header active="/my-cover" />

      <div className="content-stretch flex gap-[32px] items-start p-[40px] relative shrink-0 w-full" data-name="my-cover-content">
        <div className="content-stretch flex flex-[1_0_0] flex-col gap-[24px] items-start min-w-px relative" data-name="portfolio-container">
          <div className="content-stretch flex items-end justify-between w-full gap-[16px]">
            <h1 className="[word-break:break-word] font-serif font-extrabold leading-[normal] not-italic relative shrink-0 text-[28px] text-[#16141b] whitespace-nowrap m-0">
              Your Covered Policies
            </h1>
            {viewing && (
              <p className="font-mono text-[#67626f] text-[12px] m-0">
                {queryHolder() && !(account && same(account, viewing)) ? "Viewing " : "Wallet "}
                {short(viewing, 6, 4)}
              </p>
            )}
          </div>

          {!viewing ? (
            <div className="peril-glass border border-solid flex flex-col gap-[12px] items-start p-[24px] rounded-[8px] w-full">
              <p className="font-serif text-[#16141b] text-[16px] m-0">Create an account to see the cover it holds.</p>
              <p className="font-serif text-[#67626f] text-[13px] leading-[18px] m-0">
                Or view any wallet by adding its address to the link, like #/my-cover?holder=0x…
              </p>
              {privyEnabled ? (
                <PrivyLoginButton className="peril-cta border-0 px-[16px] py-[8px] rounded-[6px] disabled:opacity-50" label="CREATE ACCOUNT" />
              ) : (
                <button
                  type="button"
                  disabled={!walletAvailable()}
                  onClick={() => connectWallet().catch(() => undefined)}
                  className="peril-cta border-0 px-[16px] py-[8px] rounded-[6px] disabled:opacity-50"
                >
                  <span className="font-mono font-bold text-[#ffffff] text-[13px]">{walletAvailable() ? "CONNECT WALLET" : "NO WALLET FOUND"}</span>
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="[word-break:break-word] content-stretch flex gap-[16px] items-start leading-[normal] relative shrink-0 w-full whitespace-nowrap" data-name="metrics-row">
                {[
                  { label: "ACTIVE POLICIES", value: policies.data ? `${open.length} ${open.length === 1 ? "contract" : "contracts"}` : "…", accent: false },
                  { label: "TOTAL COVER", value: policies.data ? `${gen(cover)} GEN` : "…", accent: false },
                  { label: "PAID TO YOU", value: policies.data ? `${gen(paid)} GEN` : "…", accent: true },
                ].map((m, i) => (
                  <div key={m.label} className={`bg-[#ffffff] border ${m.accent ? "border-accent-line" : "border-[#e3ddf0]"} border-solid content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-w-px p-[20px] relative rounded-[8px]`} data-name={`m-card-${i}`}>
                    <p className="font-serif font-normal not-italic relative shrink-0 text-[#67626f] text-[12px] m-0">{m.label}</p>
                    <p className={`font-mono font-extrabold relative shrink-0 text-[24px] m-0 ${m.accent ? "text-accent-text" : "text-[#16141b]"}`}>{m.value}</p>
                  </div>
                ))}
              </div>

              <div className="peril-glass border border-solid content-stretch flex flex-col items-start relative rounded-[12px] shrink-0 w-full" data-name="my-table-container">
                <div className="[word-break:break-word] bg-[#f1edfa] border border-[#e3ddf0] border-solid content-stretch flex font-serif font-semibold items-start leading-[normal] not-italic p-[16px] relative shrink-0 text-[#67626f] text-[12px] w-full" data-name="my-table-head">
                  {["SERVICE", "WINDOW (UTC)", "THRESHOLD", "PREMIUM", "PAYOUT", "STATE"].map((h) => (
                    <p key={h} className="flex-[1_0_0] min-w-px relative m-0">{h}</p>
                  ))}
                  <p className="relative shrink-0 w-[140px] m-0">ACTION</p>
                </div>
                {!policies.data && (
                  <div className="border border-[#e3ddf0] border-solid p-[16px] w-full">
                    <p className="font-mono text-[#67626f] text-[13px] m-0">
                      {policies.error ? `Could not read policies from Studio Next: ${policies.error}` : "Reading policies from Studio Next…"}
                    </p>
                  </div>
                )}
                {policies.data && mine.length === 0 && (
                  <div className="border border-[#e3ddf0] border-solid p-[16px] w-full flex items-center justify-between">
                    <p className="font-mono text-[#67626f] text-[13px] m-0">This wallet holds no cover yet.</p>
                    <a href="#/buy" className="font-mono font-bold text-accent-text text-[12px]">BUY COVER</a>
                  </div>
                )}
                {mine.map((p) => {
                  const s = stateOf(p);
                  const isSel = selected?.policy_id === p.policy_id;
                  return (
                    <div key={p.policy_id} className={`border ${isSel ? "border-accent-line" : "border-[#e3ddf0]"} border-solid content-stretch flex items-center p-[16px] relative shrink-0 w-full`} data-name={`row-${p.policy_id}`}>
                      <p className="[word-break:break-word] flex-[1_0_0] font-serif font-semibold leading-[normal] min-w-px not-italic relative text-[13px] text-[#16141b] m-0">
                        {serviceName(p.cover)}
                        <span className="block font-mono font-normal text-[#787384] text-[11px]">{p.policy_id}</span>
                      </p>
                      <p className="[word-break:break-word] flex-[1_0_0] font-mono font-normal leading-[normal] min-w-px relative text-[#67626f] text-[13px] m-0">
                        {p.window_start.slice(5)} - {p.window_end.slice(5)}
                      </p>
                      <p className="[word-break:break-word] flex-[1_0_0] font-mono font-normal leading-[normal] min-w-px relative text-[#67626f] text-[13px] m-0">{p.threshold_minutes} mins</p>
                      <p className="[word-break:break-word] flex-[1_0_0] font-mono font-normal leading-[normal] min-w-px relative text-[#67626f] text-[13px] m-0">{gen(p.premium)} GEN</p>
                      <p className="[word-break:break-word] flex-[1_0_0] font-mono font-bold leading-[normal] min-w-px relative text-accent-text text-[13px] m-0">{gen(p.payout)} GEN</p>
                      <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col font-serif font-normal gap-[4px] items-start leading-[normal] min-w-px not-italic relative" data-name="td-6">
                        <p className={`relative shrink-0 ${s.tone} text-[13px] whitespace-nowrap m-0`}>{s.label}</p>
                        <p className="relative shrink-0 text-[#787384] text-[11px] m-0">{s.note}</p>
                      </div>
                      <div className="content-stretch flex items-start relative shrink-0 w-[140px]" data-name="td-7">
                        {p.state === "open" ? (
                          <button
                            type="button"
                            onClick={() => setSelectedId(p.policy_id)}
                            className={`${isSel ? "peril-cta border-[rgba(0,0,0,0)]" : "bg-[rgba(0,0,0,0)] border-accent-line"} border border-solid content-stretch flex flex-[1_0_0] items-start justify-center min-w-px px-[12px] py-[6px] relative rounded-[6px]`}
                          >
                            <span className={`[word-break:break-word] font-mono font-bold leading-[normal] relative shrink-0 text-[11px] whitespace-nowrap ${isSel ? "text-[#ffffff]" : "text-accent-text"}`}>
                              {isSel ? "CLAIMING" : "CLAIM PAYOUT"}
                            </span>
                          </button>
                        ) : (
                          <a href={`#/policy?id=${encodeURIComponent(p.policy_id)}`} className="bg-[rgba(0,0,0,0)] border border-[#e3ddf0] border-solid content-stretch flex flex-[1_0_0] items-start justify-center min-w-px px-[12px] py-[6px] relative rounded-[6px] no-underline">
                            <span className="[word-break:break-word] font-mono font-bold leading-[normal] relative shrink-0 text-[11px] text-[#16141b] whitespace-nowrap">VIEW</span>
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {refused && (
                <div className="[word-break:break-word] peril-glass border border-solid content-stretch flex flex-col gap-[12px] items-start p-[20px] relative rounded-[8px] shrink-0 w-full" data-name="rejection-panel">
                  <p className="font-serif font-bold leading-[normal] not-italic relative shrink-0 text-[#5b21b6] text-[14px] whitespace-nowrap m-0">
                    LAST REFUSED CLAIM (stored on the contract for {refused.policy_id})
                  </p>
                  <div className="content-stretch flex font-mono font-normal items-start justify-between leading-[normal] relative shrink-0 text-[#67626f] text-[12px] w-full whitespace-nowrap" data-name="Frame">
                    <p className="relative shrink-0 m-0">Outcome: {OUTCOME_LABEL[refused.outcome] ?? refused.outcome}</p>
                    <p className="relative shrink-0 m-0">Duration: {refused.minutes} minutes</p>
                    <p className="relative shrink-0 m-0">Impact: {refused.impact || "none"}</p>
                    <p className="relative shrink-0 m-0">Incident: {refused.incident_id}</p>
                  </div>
                  <p className="font-mono font-normal leading-[16px] min-w-full relative shrink-0 text-[#787384] text-[12px] w-[min-content] m-0">
                    {`Contract reason: "${refused.reason}". The cover stays open for a later outage.`}
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        <div className="peril-glass border border-solid content-stretch flex flex-col gap-[20px] items-start p-[24px] relative rounded-[12px] shrink-0 w-[400px]" data-name="incident-picker-drawer">
          <div className="[word-break:break-word] content-stretch flex flex-col gap-[6px] items-start leading-[normal] relative shrink-0 w-full" data-name="Frame">
            <p className="font-mono font-normal relative shrink-0 text-accent-text text-[11px] m-0">INCIDENT PICKER</p>
            <p className="font-serif font-bold not-italic relative shrink-0 text-[18px] text-[#16141b] m-0">
              {selected ? `Claim on ${selected.policy_id}` : "Verify Live Incidents"}
            </p>
          </div>

          {!selected ? (
            <p className="font-serif text-[#67626f] text-[13px] leading-[18px] m-0">
              {viewing ? "No open cover to claim on. Paid and closed policies cannot be claimed again." : "Create an account, or add ?holder= to the link, to pick a policy."}
            </p>
          ) : (
            <>
              <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="Frame">
                <p className="[word-break:break-word] font-serif font-normal leading-[normal] not-italic relative shrink-0 text-[#67626f] text-[11px] whitespace-nowrap m-0">SOURCE ENDPOINT</p>
                <div className="bg-[#f1edfa] border border-[#e3ddf0] border-solid content-stretch flex items-start p-[10px] relative rounded-[6px] shrink-0 w-full min-w-0">
                  <p className="[word-break:break-word] font-mono font-normal leading-[normal] overflow-hidden relative text-[#67626f] text-[11px] text-ellipsis whitespace-nowrap m-0">{`https://${selected.host}/api/v2/incidents.json`}</p>
                </div>
              </div>
              <div className="content-stretch flex flex-wrap gap-[6px] items-center justify-between relative shrink-0 w-full" data-name="Frame">
                <p className="[word-break:break-word] font-serif font-normal leading-[normal] not-italic relative text-[#67626f] text-[12px] m-0">
                  Previewed in your browser. The chain decides.
                </p>
                <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Frame">
                  <div className="relative shrink-0 size-[6px]">
                    <span className={`absolute block inset-0 max-w-none size-full rounded-full ${incidents.error ? "bg-[#7c3aed]" : incidents.list ? "bg-accent-line" : "bg-[#66626d]"}`} />
                  </div>
                  <p className={`[word-break:break-word] font-mono font-normal leading-[normal] relative shrink-0 text-[11px] whitespace-nowrap m-0 ${incidents.error ? "text-[#5b21b6]" : "text-accent-text"}`}>
                    {incidents.error ? "Could not load" : incidents.list ? `Loaded ${utcStamp(incidents.at!.toISOString(), false)} UTC` : "Loading…"}
                  </p>
                </div>
              </div>

              <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="incident-list">
                {incidents.error && (
                  <p className="font-serif text-[#67626f] text-[12px] leading-[17px] m-0">
                    {`The status page could not be read from this browser (${incidents.error}). You can still claim by pasting the incident id from the provider's status page below.`}
                  </p>
                )}
                {incidents.list && judged.length === 0 && (
                  <p className="font-serif text-[#67626f] text-[12px] leading-[17px] m-0">No incidents near this window in the provider&apos;s recent list.</p>
                )}
                {judged.map(({ inc, verdict, minutes }) => (
                  <div key={inc.id} className="bg-[#f1edfa] border border-[#e3ddf0] border-solid content-stretch flex flex-col gap-[8px] items-start p-[16px] relative rounded-[8px] shrink-0 w-full" data-name={`inc-${inc.id}`}>
                    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Frame">
                      <a href={`https://${selected.host}/incidents/${inc.id}`} target="_blank" rel="noreferrer" className="font-mono font-normal leading-[normal] text-[#67626f] text-[11px] whitespace-nowrap no-underline hover:text-[#16141b]">
                        {inc.id}
                      </a>
                      <div className={`${VERDICT_STYLE[verdict]} border border-solid content-stretch flex items-start px-[6px] py-[2px] relative rounded-[4px] shrink-0`}>
                        <p className="[word-break:break-word] font-serif font-semibold leading-[normal] not-italic relative shrink-0 text-[10px] whitespace-nowrap m-0">{verdict}</p>
                      </div>
                    </div>
                    <p className="[word-break:break-word] font-serif font-bold leading-[normal] not-italic relative shrink-0 text-[14px] text-[#16141b] w-full m-0">{inc.name}</p>
                    <p className="[word-break:break-word] font-mono font-normal leading-[normal] relative shrink-0 text-[#787384] text-[11px] m-0">
                      {utcStamp(inc.created_at, true)} - {inc.resolved_at ? utcStamp(inc.resolved_at, false) : "ongoing"} UTC · {inc.impact || "none"}
                    </p>
                    <p className="[word-break:break-word] font-mono font-normal leading-[normal] relative shrink-0 text-accent-text text-[12px] whitespace-nowrap m-0">
                      {minutes === null ? "Still open" : `Duration: ${minutes} minutes`}
                    </p>
                    {verdict === "Eligible" && (
                      <button
                        type="button"
                        disabled={!walletAvailable() || busy !== null}
                        onClick={() => settle(selected.policy_id, inc.id)}
                        className="peril-cta border-0 content-stretch flex items-start justify-center py-[8px] relative rounded-[6px] shrink-0 w-full disabled:opacity-50"
                        data-name="settle-btn"
                      >
                        <span className="[word-break:break-word] font-mono font-extrabold leading-[normal] relative shrink-0 text-[#ffffff] text-[11px] whitespace-nowrap">
                          {busy === inc.id ? <><span className="peril-ring" aria-hidden="true" /> CONFIRM IN YOUR WALLET</> : `Settle(${selected.policy_id}, ${inc.id})`}
                        </span>
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-[8px] w-full border-t border-[#e3ddf0] pt-[16px]">
                <p className="font-serif text-[#67626f] text-[11px] m-0">OR PASTE AN INCIDENT ID</p>
                <div className="flex gap-[8px] w-full">
                  <input
                    value={manualId}
                    onChange={(e) => setManualId(e.target.value)}
                    placeholder="e.g. zkxwbgr0cnmx"
                    className="bg-[#f1edfa] border border-[#e3ddf0] border-solid rounded-[6px] px-[10px] py-[8px] font-mono text-[12px] text-[#16141b] flex-1 min-w-0 outline-none focus:border-accent-line"
                    aria-label="Incident id"
                  />
                  <button
                    type="button"
                    disabled={!manualOk || !walletAvailable() || busy !== null}
                    onClick={() => settle(selected.policy_id, manualId.trim())}
                    className="bg-[rgba(0,0,0,0)] border border-accent-line border-solid rounded-[6px] px-[12px] py-[8px] disabled:opacity-40"
                  >
                    <span className="font-mono font-bold text-accent-text text-[11px]">SETTLE</span>
                  </button>
                </div>
              </div>

              {!walletAvailable() && (
                <p className="font-serif text-[#67626f] text-[12px] leading-[17px] m-0">A wallet is needed to send a claim. Anyone may settle; the payout only ever goes to the holder.</p>
              )}
              {failure && <p className="font-serif text-[#5b21b6] text-[12px] leading-[17px] m-0" role="alert">{failure}</p>}
              {sent && (
                <p className="font-serif text-[#67626f] text-[12px] leading-[17px] m-0" role="status">
                  {"Claim submitted "}
                  <a href={txUrl(sent)} target="_blank" rel="noreferrer" className="font-mono text-accent-text">{short(sent, 8, 6)}</a>
                  {". The verdict lands in a few minutes; a payout reaches the holder when the transaction finalises, 30 seconds after that on Studio Next."}
                </p>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
