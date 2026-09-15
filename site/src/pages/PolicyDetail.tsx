import { Footer, Header, TxTracker } from "../components/Chrome";
import { PERIL, addressUrl, day, gen, hours, readPolicy, todayUtc, type Policy } from "../lib/chain";
import { serviceName } from "../lib/evidence";
import { usePolled } from "../lib/hooks";

/**
 * The Figma policy-detail frame, showing one policy exactly as the contract
 * stores it. The contract keeps the latest settlement attempt but not
 * transaction hashes, so this page says what it can prove and links to where
 * the rest can be checked.
 */

function queryId(): string {
  const q = window.location.hash.split("?")[1];
  return (q ? new URLSearchParams(q).get("id") : null)?.trim() ?? "";
}

const BADGE: Record<string, string> = {
  accent: "bg-accent-deep border-accent-line text-accent-text",
  blue: "bg-[rgba(138,180,248,0.1)] border-[#8ab4f8] text-[#8ab4f8]",
  grey: "bg-[#1c1f26] border-[#4b5563] text-[#9ca3af]",
};

function status(p: Policy): { label: string; tone: string } {
  if (p.state === "paid") return { label: "PAID", tone: "accent" };
  if (p.state === "closed") return { label: "CLOSED", tone: "grey" };
  const today = todayUtc();
  if (today < p.window_start) return { label: "PENDING", tone: "blue" };
  if (today < p.window_end) return { label: "ACTIVE", tone: "accent" };
  return { label: "ENDED", tone: "grey" };
}

const OUTCOME: Record<string, string> = {
  pays: "Pays",
  under_threshold: "Under threshold",
  not_serious: "Not serious",
  outside_window: "Outside window",
  unresolved: "Unresolved",
};

function Card({ n, label, value }: { n: number; label: string; value: string }) {
  return (
    <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-w-px p-[16px] relative rounded-[8px]" data-name={`param-${n}`}>
      <p className="font-serif font-normal not-italic relative shrink-0 text-[#9ca3af] text-[12px] m-0">{label}</p>
      <p className="font-mono font-bold relative shrink-0 text-[18px] text-white m-0">{value}</p>
    </div>
  );
}

function Stage({ mark, title, badge, tone, children }: { mark: string; title: string; badge: string; tone: "accent" | "blue" | "grey"; children: React.ReactNode }) {
  const ring = tone === "accent" ? "bg-accent-deep border-accent-line text-accent-text" : tone === "blue" ? "bg-[#131a26] border-[#8ab4f8] text-[#8ab4f8]" : "bg-[#1c1f26] border-[#4b5563] text-[#9ca3af]";
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
      <div className="content-stretch flex items-center justify-between relative shrink-0 w-full gap-[8px]">
        <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
          <div className={`${ring} border border-solid content-stretch flex items-center justify-center relative rounded-[12px] shrink-0 size-[24px]`}>
            <span className="font-mono font-extrabold leading-[normal] text-[12px]">{mark}</span>
          </div>
          <p className="font-serif font-bold leading-[normal] not-italic relative shrink-0 text-[15px] text-white m-0">{title}</p>
        </div>
        <div className={`${ring} border border-solid content-stretch flex items-start px-[8px] py-[2px] relative rounded-[4px] shrink-0`}>
          <p className="font-mono font-normal leading-[normal] relative shrink-0 text-[11px] whitespace-nowrap m-0">{badge}</p>
        </div>
      </div>
      <div className="font-serif font-normal leading-[18px] not-italic relative shrink-0 text-[#9ca3af] text-[13px] w-full">{children}</div>
    </div>
  );
}

export default function PolicyDetail() {
  const id = queryId();
  const policy = usePolled(() => readPolicy(id), 30000, [id]);
  const p = policy.data;
  const notFound = !p && policy.error && /KeyError|not found/i.test(policy.error);

  return (
    <div className="bg-[#090a0c] content-stretch flex flex-col items-start relative size-full" data-name="peril-policy-detail">
      <Header active="" />
      <TxTracker />

      {!p ? (
        <div className="flex flex-col gap-[12px] items-start p-[40px] w-full">
          <h1 className="font-mono font-extrabold text-[28px] text-white m-0">Policy: {id || "none given"}</h1>
          <p className="font-serif text-[#9ca3af] text-[15px] m-0">
            {!id
              ? "No policy id in the link."
              : notFound
                ? "The contract holds no policy with this id."
                : policy.error
                  ? `Could not read this policy from Studio Next: ${policy.error}`
                  : "Reading this policy from Studio Next…"}
          </p>
          <a href="#/" className="font-mono font-bold text-accent-text text-[13px]">BACK TO THE LEDGER</a>
        </div>
      ) : (
        (() => {
          const s = status(p);
          const tried = Boolean(p.incident_id);
          const scale = Math.max(p.minutes, p.threshold_minutes) * 1.1 || 1;
          const under = Math.min(p.minutes, p.threshold_minutes) / scale;
          const over = Math.max(0, p.minutes - p.threshold_minutes) / scale;
          const incidentPage = `https://${p.host}/incidents/${p.incident_id}`;
          return (
            <div className="content-stretch flex gap-[32px] items-start p-[40px] relative shrink-0 w-full" data-name="detail-content">
              <div className="content-stretch flex flex-[1_0_0] flex-col gap-[24px] items-start min-w-px relative" data-name="detail-main">
                <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="detail-meta-header">
                  <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
                    <p className="font-mono font-normal leading-[normal] relative shrink-0 text-accent-text text-[12px] whitespace-nowrap m-0">POLICY AS STORED ON THE CONTRACT</p>
                    <div className={`${BADGE[s.tone]} border border-solid content-stretch flex items-start px-[8px] py-[2px] relative rounded-[4px] shrink-0`}>
                      <p className="font-mono font-normal leading-[normal] relative shrink-0 text-[11px] whitespace-nowrap m-0">{s.label}</p>
                    </div>
                  </div>
                  <h1 className="[word-break:break-word] font-mono font-extrabold leading-[normal] relative shrink-0 text-[32px] text-white m-0">Policy: {p.policy_id}</h1>
                  <p className="font-mono font-normal leading-[normal] relative shrink-0 text-[#9ca3af] text-[13px] m-0">
                    {"Holder: "}
                    <a href={addressUrl(p.holder)} target="_blank" rel="noreferrer" className="text-[#9ca3af] underline">{p.holder}</a>
                  </p>
                  <p className="font-mono font-normal leading-[normal] relative shrink-0 text-[#9ca3af] text-[13px] m-0">
                    {serviceName(p.cover)} · {p.host} · {day(p.window_start)} - {day(p.window_end)} UTC
                  </p>
                </div>

                <div className="[word-break:break-word] content-stretch flex gap-[16px] items-start leading-[normal] relative shrink-0 w-full whitespace-nowrap" data-name="params-grid">
                  <Card n={0} label="Premium Paid" value={`${gen(p.premium)} GEN`} />
                  <Card n={1} label="Payout Multiple" value={`${p.multiple}x`} />
                  <Card n={2} label="Payout If It Triggers" value={`${gen(p.payout)} GEN`} />
                  <Card n={3} label="Outage Threshold" value={`${p.threshold_minutes} min (${hours(p.threshold_minutes)})`} />
                </div>

                <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-col gap-[20px] items-start p-[24px] relative rounded-[12px] shrink-0 w-full" data-name="evidence-panel">
                  <p className="font-serif font-bold leading-[normal] not-italic relative shrink-0 text-[16px] text-white whitespace-nowrap m-0">{`Evidence & Measurement`}</p>
                  {!tried ? (
                    <div className="flex flex-col gap-[10px] items-start">
                      <p className="font-serif text-[#9ca3af] text-[14px] leading-[20px] m-0">No claim has been settled against this policy yet.</p>
                      {p.state === "open" && (
                        <a href={`#/my-cover?holder=${p.holder}`} className="font-mono font-bold text-accent-text text-[12px]">CHECK LIVE INCIDENTS FOR THIS POLICY</a>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="[word-break:break-word] content-stretch flex font-normal items-center justify-between leading-[normal] relative shrink-0 text-[14px] w-full whitespace-nowrap">
                        <p className="font-serif not-italic relative shrink-0 text-[#9ca3af] m-0">Measured outage vs policy threshold:</p>
                        <p className="font-mono relative shrink-0 text-accent-text m-0">{p.minutes} minutes / {p.threshold_minutes} minute threshold</p>
                      </div>
                      <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full">
                        <div className="[word-break:break-word] content-stretch flex font-mono font-normal items-start justify-between leading-[normal] relative shrink-0 text-[11px] w-full whitespace-nowrap">
                          <p className="relative shrink-0 text-[#9ca3af] m-0">THRESHOLD ({p.threshold_minutes}m)</p>
                          <p className="relative shrink-0 text-accent-text m-0">MEASURED OUTAGE ({p.minutes}m)</p>
                        </div>
                        <div className="bg-[#1c1f26] content-stretch flex h-[24px] items-start overflow-clip relative rounded-[4px] shrink-0 w-full" role="img" aria-label={`${p.minutes} minutes measured against a ${p.threshold_minutes} minute threshold`}>
                          <div className="bg-[#8ab4f8] h-full relative shrink-0" style={{ width: `${under * 100}%` }} />
                          <div className="bg-accent h-full relative shrink-0" style={{ width: `${over * 100}%` }} />
                          <div className="absolute top-0 bottom-0 w-[2px] bg-white" style={{ left: `${(p.threshold_minutes / scale) * 100}%` }} />
                        </div>
                      </div>
                      <div className="bg-[#14171f] border border-[#1e222a] border-solid content-stretch flex items-start p-[16px] relative rounded-[6px] shrink-0 w-full">
                        <p className="[word-break:break-word] font-mono font-normal leading-[normal] relative text-[13px] text-white m-0">{`“${p.reason}”`}</p>
                      </div>
                      <div className="[word-break:break-word] content-stretch flex font-normal gap-[16px] items-start leading-[normal] relative shrink-0 w-full whitespace-nowrap">
                        {[
                          ["OUTCOME", OUTCOME[p.outcome] ?? p.outcome],
                          ["PROVIDER'S RATING", p.impact || "none"],
                          ["SOURCE INCIDENT ID", p.incident_id],
                        ].map(([k, v]) => (
                          <div key={k} className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative">
                            <p className="font-serif not-italic relative shrink-0 text-[#9ca3af] text-[11px] m-0">{k}</p>
                            <p className="font-mono relative shrink-0 text-[13px] text-white m-0">{v}</p>
                          </div>
                        ))}
                        <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative">
                          <p className="font-serif not-italic relative shrink-0 text-[#9ca3af] text-[11px] m-0">{"PROVIDER'S INCIDENT PAGE"}</p>
                          <a href={incidentPage} target="_blank" rel="noreferrer" className="font-mono relative shrink-0 text-accent-text text-[13px] truncate max-w-full">{`${p.host}/incidents/${p.incident_id}`}</a>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-col gap-[24px] items-start p-[32px] relative rounded-[12px] shrink-0 w-[440px]" data-name="detail-sidebar">
                <p className="font-serif font-bold leading-[normal] not-italic relative shrink-0 text-[18px] text-white whitespace-nowrap m-0">Two-Stage Payout</p>

                {p.state === "paid" ? (
                  <Stage mark="✓" title="Verdict Accepted" badge="PAID" tone="accent">
                    The validators agreed the outage qualified, and the contract marked this policy paid. That agreement usually lands within a few minutes of the claim.
                  </Stage>
                ) : tried ? (
                  <Stage mark="×" title="Claim Refused" badge="COVER OPEN" tone="blue">
                    The last claim did not qualify, so nothing was paid. The cover stays open for a later outage inside its window.
                  </Stage>
                ) : (
                  <Stage mark="·" title="No Claim Yet" badge={p.state === "closed" ? "CLOSED" : "WAITING"} tone="grey">
                    {p.state === "closed" ? "The window closed with no qualifying outage and the cover was released back to the pool." : "Nobody has settled a claim against this policy."}
                  </Stage>
                )}

                <div className="bg-[#1e222a] h-px relative shrink-0 w-full" />

                <Stage mark={p.state === "paid" ? "⧗" : "–"} title="GEN in the Holder's Wallet" badge={p.state === "paid" ? "ON FINALITY" : "NOT DUE"} tone={p.state === "paid" ? "blue" : "grey"}>
                  {p.state === "paid" ? (
                    <>
                      {"The payout is sent when the claim's transaction finalises, which on Studio Next is a 30 second window after acceptance. "}
                      <a href={addressUrl(p.holder)} target="_blank" rel="noreferrer" className="text-accent-text">Check the holder&apos;s balance on the explorer.</a>
                    </>
                  ) : (
                    "Only a paid policy sends GEN. Money only ever goes to the holder above."
                  )}
                </Stage>

                <div className="bg-[#1e222a] h-px relative shrink-0 w-full" />

                <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="audit-panel">
                  <p className="font-mono font-normal leading-[normal] relative shrink-0 text-[#4b5563] text-[11px] uppercase whitespace-nowrap m-0">Raw Contract Data</p>
                  <p className="font-mono text-[#9ca3af] text-[11px] leading-[16px] m-0">
                    {"Contract: "}
                    <a href={addressUrl(PERIL)} target="_blank" rel="noreferrer" className="text-[#9ca3af] underline">{PERIL}</a>
                    <br />
                    {`Read with: get_policy("${p.policy_id}")`}
                  </p>
                  <pre className="bg-[#14171f] rounded-[6px] p-[12px] m-0 w-full whitespace-pre-wrap [overflow-wrap:anywhere] font-mono text-[#9ca3af] text-[11px] leading-[16px]">
                    {JSON.stringify(p, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          );
        })()
      )}

      <Footer />
    </div>
  );
}
