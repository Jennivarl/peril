import { Footer, Header, TxTracker } from "../components/Chrome";
import { day, gen, hours, readCovered, readPolicies, readReserves, todayUtc, type Policy } from "../lib/chain";
import { SERIOUS_OUTAGES_12M, serviceName, serviceTile } from "../lib/evidence";
import { usePolled } from "../lib/hooks";

/**
 * The Figma home frame, wired to the live contract. Layout and classes are the
 * export's; every figure is read from the chain, and copy that claimed things
 * the contract does not do has been corrected.
 */

const BADGE = {
  accent: "bg-accent-tint border-accent-line text-accent-text",
  blue: "bg-[rgba(138,180,248,0.1)] border-[#8ab4f8] text-[#8ab4f8]",
  grey: "bg-[#1c1f26] border-[#4b5563] text-[#9ca3af]",
};

function policyStatus(p: Policy): { label: string; tone: keyof typeof BADGE } {
  if (p.state === "paid") return { label: "PAID", tone: "accent" };
  if (p.state === "closed") return { label: "CLOSED", tone: "grey" };
  const today = todayUtc();
  if (today < p.window_start) return { label: "PENDING", tone: "blue" };
  if (today < p.window_end) return { label: "ACTIVE", tone: "accent" };
  return { label: "ENDED", tone: "grey" };
}

function Stat({ name, label, value, sub }: { name: string; label: string; value: string; sub: string }) {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0" data-name={name}>
      <p className="font-mono font-normal relative shrink-0 text-[#9ca3af] text-[11px] m-0">{label}</p>
      <p className="font-mono font-extrabold relative shrink-0 text-accent-text text-[24px] m-0">{value}</p>
      <p className="font-serif font-normal not-italic relative shrink-0 text-[#4b5563] text-[12px] m-0">{sub}</p>
    </div>
  );
}

function Principle({ n, title, children }: { n: string; title: string; children: string }) {
  return (
    <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px p-[28px] relative rounded-[12px]" data-name={`principle-${n}`}>
      <p className="font-mono font-extrabold leading-[normal] relative shrink-0 text-accent-text text-[14px] whitespace-nowrap m-0">[{n}]</p>
      <p className="font-serif font-bold leading-[normal] not-italic relative shrink-0 text-[20px] text-white whitespace-nowrap m-0">{title}</p>
      <p className="font-serif font-normal leading-[22px] min-w-full not-italic relative shrink-0 text-[#9ca3af] text-[14px] w-[min-content] m-0">{children}</p>
    </div>
  );
}

function Step({ n, title, children }: { n: string; title: string; children: string }) {
  return (
    <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[12px] items-start min-w-px p-[20px] relative rounded-[8px]" data-name={`step-card-${n}`}>
      <div className="content-stretch flex items-center justify-between leading-[normal] relative shrink-0 w-full whitespace-nowrap" data-name="Frame">
        <p className="font-serif font-extrabold not-italic relative shrink-0 text-[14px] text-white m-0">{title}</p>
        <p className="font-mono font-normal relative shrink-0 text-accent-text text-[12px] m-0">[{n}]</p>
      </div>
      <p className="font-serif font-normal leading-[18px] not-italic relative shrink-0 text-[#9ca3af] text-[13px] w-full m-0">{children}</p>
    </div>
  );
}

function LedgerNote({ children }: { children: string }) {
  return (
    <div className="border border-[#1e222a] border-solid content-stretch flex items-start p-[16px] relative shrink-0 w-full">
      <p className="font-mono font-normal leading-[normal] relative text-[#9ca3af] text-[13px] m-0">{children}</p>
    </div>
  );
}

export default function Home() {
  const reserves = usePolled(readReserves, 20000);
  const covers = usePolled(readCovered, 0);
  const policies = usePolled(readPolicies, 30000);

  const r = reserves.data;
  const unknown = reserves.error && !r ? "unavailable" : "…";
  const open = policies.data?.filter((p) => p.state === "open").length;
  const freePct =
    r && BigInt(r.pool) > 0n ? `${(Number((BigInt(r.free) * 10000n) / BigInt(r.pool)) / 100).toFixed(1)}% of the pool is free` : "nothing in the pool yet";

  return (
    <div className="bg-[#090a0c] content-stretch flex flex-col items-start relative size-full" data-name="peril-home">
      <Header active="/" />
      <TxTracker />

      <div className="content-stretch flex flex-col gap-[24px] items-center pb-[64px] pt-[80px] px-[120px] relative shrink-0 w-full" data-name="hero-section">
        <div className="bg-accent-tint border border-accent-line border-solid content-stretch flex items-start px-[12px] py-[4px] relative rounded-[100px] shrink-0" data-name="pill-tag">
          <p className="[word-break:break-word] font-mono font-bold leading-[normal] relative shrink-0 text-accent-text text-[12px] whitespace-nowrap m-0">
            PARAMETRIC OUTAGE COVER ON GENLAYER
          </p>
        </div>
        <h1 className="[word-break:break-word] font-serif font-extrabold leading-[60px] not-italic relative shrink-0 text-[52px] text-center text-white w-[880px] m-0">
          No claim forms. No assessors. Automated service downtime cover.
        </h1>
        <p className="[word-break:break-word] font-serif font-normal leading-[28px] not-italic relative shrink-0 text-[#9ca3af] text-[18px] text-center w-[700px] m-0">
          {"Validators read the provider's own status page, measure the outage, and pay your wallet when it breaks the threshold you bought. Nobody approves the claim, and nobody can refuse it."}
        </p>
      </div>

      <div className="[word-break:break-word] content-stretch flex gap-[24px] items-start pb-[80px] px-[120px] relative shrink-0 w-full" data-name="principles-container">
        <Principle n="01" title="Parametric Triggers">
          {"No human adjusters. Your cover pays when the provider's own status page shows an outage it rated major or critical, lasting at least the threshold you chose."}
        </Principle>
        <Principle n="02" title="Deterministic Consensus">
          GenLayer validators each fetch the incident themselves and agree on four fields: its id, when it started, when it ended, and its severity.
        </Principle>
        <Principle n="03" title="Automatic Settlement">
          The payout is fixed when you buy and locked in the pool. When a claim qualifies it goes to your wallet, and nobody can change who is paid or how much.
        </Principle>
      </div>

      <div className="[word-break:break-word] bg-[#0d1117] border-[#1e222a] border-b border-solid border-t content-stretch flex items-start justify-between leading-[normal] px-[120px] py-[24px] relative shrink-0 w-full whitespace-nowrap" data-name="reserves-ribbon">
        <Stat name="stat-0" label="TOTAL POOL SIZE" value={r ? `${gen(r.pool)} GEN` : unknown} sub="Testnet GEN, no dollar value" />
        <Stat
          name="stat-1"
          label="ACTIVE COVERAGE"
          value={r ? `${gen(r.locked)} GEN` : unknown}
          sub={open === undefined ? "…" : `${open} open ${open === 1 ? "policy" : "policies"}`}
        />
        <Stat name="stat-2" label="AVAILABLE CAPACITY" value={r ? `${gen(r.free)} GEN` : unknown} sub={r ? freePct : "…"} />
      </div>

      <div className="content-stretch flex flex-col gap-[24px] items-start pb-[40px] pt-[80px] px-[120px] relative shrink-0 w-full" data-name="matrix-section">
        <div className="[word-break:break-word] content-stretch flex items-center justify-between leading-[normal] relative shrink-0 w-full whitespace-nowrap" data-name="Frame">
          <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0" data-name="Frame">
            <p className="font-mono font-normal relative shrink-0 text-accent-text text-[12px] m-0">AVAILABLE COVERAGE TARGETS</p>
            <p className="font-serif font-extrabold not-italic relative shrink-0 text-[28px] text-white m-0">{`Supported Providers & Live Rates`}</p>
          </div>
          <p className="font-serif font-normal not-italic relative shrink-0 text-[#9ca3af] text-[14px] m-0">Pick a provider to set up cover</p>
        </div>
        <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full" data-name="shop-grid">
          {!covers.data && (
            <p className="font-mono text-[#9ca3af] text-[13px] m-0">
              {covers.error ? `Could not read the price list from Studio Next: ${covers.error}` : "Reading the price list from Studio Next…"}
            </p>
          )}
          {covers.data?.map((c) => {
            const tiers = Object.keys(c.multiples).map(Number).sort((a, b) => a - b);
            const cheapest = tiers[0];
            return (
              <div key={c.cover} className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px p-[24px] relative rounded-[12px]" data-name={`shop-card-${c.cover}`}>
                <div className="bg-[#1e222b] content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[40px]" data-name="card-icon">
                  <p className="[word-break:break-word] font-mono font-extrabold leading-[normal] relative shrink-0 text-[14px] text-white whitespace-nowrap m-0">{serviceTile(c.cover)}</p>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start leading-[normal] relative shrink-0 whitespace-nowrap" data-name="card-meta">
                  <p className="font-serif font-bold not-italic relative shrink-0 text-[18px] text-white m-0">{serviceName(c.cover)}</p>
                  <p className="font-mono font-normal relative shrink-0 text-[#9ca3af] text-[12px] m-0">{c.host}</p>
                </div>
                <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full" data-name="badges-group">
                  <div className="bg-[#201315] border border-[#ff3b30] border-solid content-stretch flex items-start px-[8px] py-[4px] relative rounded-[4px] shrink-0" data-name="badge-1" title="Incidents the provider itself rated major or critical, last 12 months">
                    <p className="[word-break:break-word] font-mono font-normal leading-[normal] relative shrink-0 text-[#ff3b30] text-[11px] whitespace-nowrap m-0">
                      {SERIOUS_OUTAGES_12M[c.cover] ?? "?"} serious / 12mo
                    </p>
                  </div>
                  {cheapest !== undefined && (
                    <div className="bg-accent-deep border border-accent-line border-solid content-stretch flex items-start px-[8px] py-[4px] relative rounded-[4px] shrink-0" data-name="badge-2" title="The shortest outage length this service is sold at">
                      <p className="[word-break:break-word] font-mono font-normal leading-[normal] relative shrink-0 text-accent-text text-[11px] whitespace-nowrap m-0">
                        {hours(cheapest)}+ pays {c.multiples[String(cheapest)]}x
                      </p>
                    </div>
                  )}
                </div>
                <a href={`#/buy?cover=${c.cover}`} className="bg-[#1e222a] hover:bg-[#2a2f39] content-stretch flex items-start justify-center py-[10px] relative rounded-[6px] shrink-0 w-full no-underline" data-name="card-action">
                  <span className="[word-break:break-word] font-mono font-bold leading-[normal] relative shrink-0 text-[12px] text-white whitespace-nowrap">GET COVER</span>
                </a>
              </div>
            );
          })}
        </div>
      </div>

      <div className="content-stretch flex flex-col gap-[20px] items-start pb-[80px] px-[120px] relative shrink-0 w-full" data-name="table-section">
        <p className="[word-break:break-word] font-mono font-normal leading-[normal] relative shrink-0 text-accent-text text-[12px] uppercase whitespace-nowrap m-0">Active Ledger</p>
        <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-col items-start relative rounded-[12px] shrink-0 w-full" data-name="table-box">
          <div className="[word-break:break-word] bg-[#14171f] border border-[#1e222a] border-solid content-stretch flex font-serif font-semibold items-start leading-[normal] not-italic p-[16px] relative shrink-0 text-[#9ca3af] text-[13px] w-full" data-name="table-head">
            <p className="flex-[1_0_0] min-w-px relative m-0">POLICY ID</p>
            <p className="flex-[1_0_0] min-w-px relative m-0">PROVIDER</p>
            <p className="flex-[1_0_0] min-w-px relative m-0">WINDOW (UTC)</p>
            <p className="flex-[1_0_0] min-w-px relative m-0">LIMIT</p>
            <p className="flex-[1_0_0] min-w-px relative m-0">PAYOUT</p>
            <p className="relative shrink-0 w-[100px] m-0">STATUS</p>
          </div>
          {!policies.data && (
            <LedgerNote>{policies.error ? `Could not read the ledger from Studio Next: ${policies.error}` : "Reading the ledger from Studio Next…"}</LedgerNote>
          )}
          {policies.data?.length === 0 && <LedgerNote>No cover has been sold yet.</LedgerNote>}
          {policies.data?.map((p) => {
            const s = policyStatus(p);
            return (
              <a key={p.policy_id} href={`#/policy?id=${encodeURIComponent(p.policy_id)}`} className="border border-[#1e222a] border-solid content-stretch flex items-start p-[16px] relative shrink-0 w-full no-underline hover:bg-[#14171f]" data-name="row">
                <span className="[word-break:break-word] flex-[1_0_0] font-mono font-normal leading-[normal] min-w-px relative text-[13px] text-white">{p.policy_id}</span>
                <span className="[word-break:break-word] flex-[1_0_0] font-serif font-normal leading-[normal] min-w-px not-italic relative text-[13px] text-white">{serviceName(p.cover)}</span>
                <span className="[word-break:break-word] flex-[1_0_0] font-mono font-normal leading-[normal] min-w-px relative text-[#9ca3af] text-[13px]">
                  {day(p.window_start)} - {day(p.window_end)} UTC
                </span>
                <span className="[word-break:break-word] flex-[1_0_0] font-mono font-normal leading-[normal] min-w-px relative text-[#9ca3af] text-[13px]">{p.threshold_minutes} mins</span>
                <span className="[word-break:break-word] flex-[1_0_0] font-mono font-bold leading-[normal] min-w-px relative text-accent-text text-[13px]">{gen(p.payout)} GEN</span>
                <span className="content-stretch flex items-start relative shrink-0 w-[100px]" data-name="td-6">
                  <span className={`${BADGE[s.tone]} border border-solid content-stretch flex items-start px-[8px] py-[2px] relative rounded-[4px] shrink-0`}>
                    <span className="[word-break:break-word] font-mono font-normal leading-[normal] relative shrink-0 text-[11px] whitespace-nowrap">{s.label}</span>
                  </span>
                </span>
              </a>
            );
          })}
        </div>
      </div>

      <div className="[word-break:break-word] content-stretch flex flex-col gap-[20px] items-start pb-[80px] px-[120px] relative shrink-0 w-full" data-name="execution-strip">
        <p className="font-mono font-normal leading-[normal] relative shrink-0 text-accent-text text-[12px] uppercase whitespace-nowrap m-0">Consensus Execution Workflow</p>
        <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full" data-name="strip-blocks">
          <Step n="01" title="Fetch Status Page">
            Anyone makes a claim with an incident id. Every validator fetches that incident from the provider itself.
          </Step>
          <Step n="02" title={`Read Rating & Times`}>
            Validators read when the incident started and ended, and the severity the provider gave it.
          </Step>
          <Step n="03" title="Calculate Duration">
            The duration is plain subtraction, compared with the threshold you bought. No model decides it.
          </Step>
          <Step n="04" title="Disburse Payout">
            A qualifying claim is marked paid within minutes; the GEN reaches your wallet when the transaction finalises, after Studio Next's 30 second finality window.
          </Step>
        </div>
      </div>

      <Footer />
    </div>
  );
}
