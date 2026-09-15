import { Footer, Header, TxTracker } from "../components/Chrome";
import { RPC, gen, readReserves, txUrl } from "../lib/chain";
import { usePolled } from "../lib/hooks";

/**
 * The Figma limits frame. What PERIL cannot do, stated in its own voice.
 * The design's retry schedule, backup caches and proportional payout scaling
 * do not exist in the contract, so they are replaced with what actually
 * happens, and the timeline is a real claim's recorded timestamps.
 */

/** The claim settled on github-w38 against GitHub incident 0rn90wk115q9. */
const REAL_CLAIM_TX = "0x86cfa95fa66a01ced087634fe78ad3b980fb092e2716053a2ff8119edf15e2fb";

type Stamps = { Created?: number; Proposed?: number; Committed?: number; LeaderRevealed?: number; LastVote?: number };

async function readStamps(): Promise<Stamps> {
  const res = await fetch(RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "gen_getTransactionReceipt", params: [{ txId: REAL_CLAIM_TX }] }),
  });
  const body = await res.json();
  const t = body?.result?.timestamps;
  if (!t) throw new Error("no timestamps returned");
  return t;
}

type Tone = "blue" | "accent" | "red";
const TONE: Record<Tone, string> = {
  blue: "bg-[rgba(138,180,248,0.1)] border-[#8ab4f8] text-[#8ab4f8]",
  accent: "bg-accent-tint border-accent-line text-accent-text",
  red: "bg-[rgba(255,59,48,0.1)] border-[#ff3b30] text-[#ff3b30]",
};

function Boundary({ n, title, badge, tone, happen, responds, assume }: { n: string; title: string; badge: string; tone: Tone; happen: string; responds: string; assume: string }) {
  return (
    <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-col gap-[20px] items-start p-[28px] relative rounded-[12px] shrink-0 w-full" data-name={`boundary-card-${n}`}>
      <div className="content-stretch flex items-center justify-between relative shrink-0 w-full gap-[16px]">
        <div className="content-stretch flex gap-[8px] items-center leading-[normal] relative shrink-0">
          <p className="font-mono font-extrabold relative shrink-0 text-accent-text text-[14px] m-0">[{n}]</p>
          <h2 className="font-serif font-bold not-italic relative shrink-0 text-[20px] text-white m-0">{title}</h2>
        </div>
        <div className={`${TONE[tone]} border border-solid content-stretch flex items-start px-[10px] py-[4px] relative rounded-[4px] shrink-0`}>
          <p className="font-mono font-normal leading-[normal] relative shrink-0 text-[11px] whitespace-nowrap m-0">{badge}</p>
        </div>
      </div>
      <div className="content-stretch flex font-normal gap-[32px] items-start relative shrink-0 w-full">
        {[
          ["WHAT CAN HAPPEN", happen],
          ["HOW PERIL RESPONDS", responds],
          ["WHAT USERS SHOULD ASSUME", assume],
        ].map(([k, v]) => (
          <div key={k} className="content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-start min-w-px relative">
            <p className="font-mono leading-[normal] relative shrink-0 text-[#9ca3af] text-[11px] whitespace-nowrap m-0">{k}</p>
            <p className="font-serif leading-[20px] not-italic relative shrink-0 text-[14px] text-white m-0">{v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px p-[28px] relative rounded-[12px]">
      <p className="font-serif font-extrabold relative shrink-0 text-[16px] text-white m-0">{title}</p>
      <div className="content-stretch flex flex-col font-serif font-normal gap-[12px] items-start relative shrink-0 text-[#9ca3af] text-[13px] w-full leading-[18px]">
        {items.map((i) => (
          <p key={i} className="m-0">• {i}</p>
        ))}
      </div>
    </div>
  );
}

export default function Limits() {
  const reserves = usePolled(readReserves, 30000);
  const stamps = usePolled(readStamps, 0);

  const r = reserves.data;
  const pool = r ? BigInt(r.pool) : 0n;
  const locked = r ? BigInt(r.locked) : 0n;
  const lockedPct = pool > 0n ? Number((locked * 10000n) / pool) / 100 : 0;

  const t = stamps.data;
  const at = (k: keyof Stamps) => (t?.Created && t[k] ? `+${t[k]! - t.Created}s` : "…");
  const timeline: [string, string, string][] = [
    ["CLAIM SENT", "0s", "Anyone submits settle with an incident id."],
    ["PROPOSED", at("Proposed"), "The leader fetched the incident and proposed its reading."],
    ["VOTES COMMITTED", at("Committed"), "Validators fetched it themselves and committed votes."],
    ["LAST VOTE", at("LastVote"), "All votes in. The verdict is stored on acceptance."],
    ["FINALISED", "~30 min", "Only now does any payout reach a wallet on Bradbury."],
  ];

  return (
    <div className="bg-[#090a0c] content-stretch flex flex-col items-start relative size-full" data-name="peril-limits">
      <Header active="/limits" />
      <TxTracker />

      <div className="content-stretch flex flex-col gap-[20px] items-start pb-[40px] pt-[64px] px-[120px] relative shrink-0 w-full" data-name="limits-hero">
        <div className="bg-[rgba(138,180,248,0.1)] border border-[#8ab4f8] border-solid content-stretch flex items-start px-[12px] py-[4px] relative rounded-[100px] shrink-0">
          <p className="font-mono font-bold leading-[normal] relative shrink-0 text-[#8ab4f8] text-[11px] whitespace-nowrap m-0">{`KNOWN LIMITS, STATED RATHER THAN HIDDEN`}</p>
        </div>
        <h1 className="font-serif font-extrabold leading-[normal] not-italic relative shrink-0 text-[42px] text-white m-0">{`Protocol Boundaries & Limits`}</h1>
        <p className="font-serif font-normal leading-[24px] not-italic relative shrink-0 text-[#9ca3af] text-[16px] max-w-[840px] m-0">
          Parametric cover is predictable because it only measures what a provider publishes. That is also exactly where its limits are. Read these before buying cover or funding the pool.
        </p>
      </div>

      <div className="content-stretch flex flex-col gap-[24px] items-start pb-[64px] px-[120px] relative shrink-0 w-full" data-name="boundaries-container">
        <Boundary
          n="01"
          title="The Provider Is the Oracle"
          badge="SOURCE OF TRUTH"
          tone="blue"
          happen="A provider under-reports an outage, posts it late, or rates a real outage minor."
          responds={"PERIL does not second-guess the record. It measures the provider's own published incident: its start, end and severity rating."}
          assume="If the provider never marks an outage major or critical, that cover does not pay. Every parametric product has this limit."
        />
        <Boundary
          n="02"
          title="Unreachable Status Pages"
          badge="CLAIM CAN BE RETRIED"
          tone="accent"
          happen="The status page is down or times out while a claim is being settled."
          responds={"The claim fails with \"that incident could not be read\". Nothing is stored and the policy stays open. Within one claim, the network hands the work to new validators up to 8 times before giving up."}
          assume="Try the claim again later. An outage that began inside your window can still be claimed after the window ends."
        />
        <Boundary
          n="03"
          title={`Outage Clustering & Pool Solvency`}
          badge="RISK FOR FUNDERS"
          tone="red"
          happen="One underlying failure takes several covered services down at once, so many policies pay together."
          responds="Payouts are never scaled down. Every payout is locked in the pool before its policy is sold, so the pool can always pay all open cover in full."
          assume="Holders are protected. Funders carry the risk: prices assume outages are independent, and clustering can cost the pool more than the prices expected."
        />
        <Boundary
          n="04"
          title="Testnet Only"
          badge="NO ECONOMIC VALUE"
          tone="blue"
          happen="Everything here runs on GenLayer Bradbury, a development testnet."
          responds="Pools, premiums and payouts use testnet GEN, which carries no real-world value."
          assume="Do not treat this as insurance for real infrastructure. It is an experimental release."
        />
      </div>

      <div className="content-stretch flex gap-[24px] items-start pb-[64px] px-[120px] relative shrink-0 w-full" data-name="diagrams-container">
        <div className="bg-[#14171f] border border-[#1e222a] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[20px] items-start min-w-px p-[28px] relative rounded-[12px]">
          <p className="font-mono font-normal leading-[normal] relative shrink-0 text-[#9ca3af] text-[11px] whitespace-nowrap m-0">REAL CLAIM TIMELINE (GITHUB-W38, RECORDED BY THE NETWORK)</p>
          <div className="content-stretch flex gap-[8px] items-stretch relative shrink-0 w-full">
            {timeline.map(([k, when, what], i) => (
              <div key={k} className="contents">
                {i > 0 && <div className="bg-[#1e222a] h-px relative shrink-0 w-[8px] self-center" />}
                <div className={`${i === timeline.length - 1 ? "bg-accent-tint border-accent-line" : "bg-[#121418] border-[#1e222a]"} border border-solid content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start leading-[normal] min-w-px p-[12px] relative rounded-[6px]`}>
                  <p className={`font-mono text-[11px] m-0 ${i === timeline.length - 1 ? "text-accent-text" : "text-[#8ab4f8]"}`}>{when}</p>
                  <p className="font-mono text-[#9ca3af] text-[10px] m-0">{k}</p>
                  <p className="font-serif not-italic text-[12px] text-white leading-[16px] m-0">{what}</p>
                </div>
              </div>
            ))}
          </div>
          <a href={txUrl(REAL_CLAIM_TX)} target="_blank" rel="noreferrer" className="font-mono text-[#4b5563] text-[11px] hover:text-[#9ca3af]">
            {stamps.error ? `Could not read the timestamps: ${stamps.error}` : "Timestamps from the claim's receipt on Bradbury. Finality time is the median of 48 Bradbury transactions we measured."}
          </a>
        </div>

        <div className="bg-[#14171f] border border-[#1e222a] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[20px] items-start min-w-px p-[28px] relative rounded-[12px]">
          <p className="font-mono font-normal leading-[normal] relative shrink-0 text-[#9ca3af] text-[11px] whitespace-nowrap m-0">WORST CASE: EVERY OPEN POLICY PAYS AT ONCE</p>
          <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
            {[
              { label: "OWED IF ALL OPEN COVER PAID", value: r ? `${gen(locked)} GEN` : "…", width: lockedPct, bar: "bg-[#ff3b30]" },
              { label: "HELD IN THE POOL", value: r ? `${gen(pool)} GEN` : "…", width: pool > 0n ? 100 : 0, bar: "bg-accent" },
            ].map((b) => (
              <div key={b.label} className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
                <div className="content-stretch flex items-start justify-between leading-[normal] relative shrink-0 text-[12px] w-full whitespace-nowrap">
                  <p className="font-serif not-italic text-[#9ca3af] m-0">{b.label}</p>
                  <p className="font-mono text-white m-0">{b.value}</p>
                </div>
                <div className="bg-[#1c1f26] content-stretch flex h-[10px] items-start overflow-clip relative rounded-[5px] shrink-0 w-full">
                  <div className={`${b.bar} h-full relative shrink-0`} style={{ width: `${b.width}%` }} />
                </div>
              </div>
            ))}
          </div>
          <p className="font-serif text-[#9ca3af] text-[12px] leading-[17px] m-0">
            {r
              ? `Live from the contract: even if every open policy paid today, the pool would pay ${gen(locked)} GEN of the ${gen(pool)} GEN it holds. The contract refuses any sale that would break this.`
              : reserves.error
                ? "Could not read the pool from Bradbury."
                : "Reading the pool from Bradbury…"}
          </p>
        </div>
      </div>

      <div className="content-stretch flex gap-[24px] items-start leading-[normal] not-italic pb-[64px] px-[120px] relative shrink-0 w-full" data-name="checklist-section">
        <List
          title="What PERIL Does NOT Cover"
          items={[
            "Incidents the provider rates minor or none.",
            "Outages the provider never posts on its status page.",
            "DNS, routing or client-side connection problems.",
            "Cloudflare and OpenAI: they publish no history to price from.",
          ]}
        />
        <List
          title="Operational Safeguards"
          items={[
            "Every payout is locked in the pool before the policy is sold.",
            "Anyone can settle a claim; the payout only goes to the holder.",
            "Each validator fetches the incident itself before voting.",
            "Every policy is readable on-chain with get_policy.",
          ]}
        />
        <List
          title="Before You Buy"
          items={[
            "Check the UTC start and end dates: cover starts tomorrow at the earliest.",
            "Look at the provider's outage history on the Evidence page.",
            "Pick an outage length that matches what hurts you.",
            "Remember testnet GEN holds no real-world value.",
          ]}
        />
      </div>

      <div className="content-stretch flex items-start pb-[64px] px-[120px] relative shrink-0 w-full" data-name="disclaimer-alert-section">
        <div className="bg-[rgba(255,59,48,0.12)] border border-[#ff3b30] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px p-[32px] relative rounded-[12px]" role="note">
          <div className="content-stretch flex gap-[8px] items-center leading-[normal] relative shrink-0 text-[#ff3b30] whitespace-nowrap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff3b30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 3 2 21h20L12 3z" />
              <path d="M12 10v5" />
              <path d="M12 18h.01" />
            </svg>
            <p className="font-mono font-extrabold relative shrink-0 text-[14px] m-0">NON-ECONOMIC DEV TESTNET</p>
          </div>
          <p className="font-serif font-normal leading-[22px] not-italic relative shrink-0 text-[14px] text-white m-0">
            You are using GenLayer Bradbury Testnet. All transactions, tokens, cover and payouts are experimental. Do not use PERIL to insure real systems or deposit anything of real value.
          </p>
        </div>
      </div>

      <div className="content-stretch flex gap-[24px] items-start pb-[80px] px-[120px] relative shrink-0 w-full" data-name="cta-row">
        <div className="bg-[#14171f] border border-[#1e222a] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px p-[32px] relative rounded-[12px]">
          <p className="font-serif font-extrabold leading-[normal] not-italic relative shrink-0 text-[20px] text-white m-0">Review Outage Statistics</p>
          <p className="font-serif font-normal leading-[20px] not-italic relative shrink-0 text-[#9ca3af] text-[14px] m-0">
            See each provider&apos;s serious outages and the multiples derived from them before choosing an outage length.
          </p>
          <a href="#/evidence" className="bg-accent content-stretch flex items-start px-[24px] py-[12px] relative rounded-[6px] shrink-0 no-underline">
            <span className="font-mono font-bold leading-[normal] text-[#090a0c] text-[13px] whitespace-nowrap">GO TO PRICING EVIDENCE</span>
          </a>
        </div>
        <div className="bg-[#14171f] border border-[#1e222a] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px p-[32px] relative rounded-[12px]">
          <p className="font-serif font-extrabold leading-[normal] not-italic relative shrink-0 text-[20px] text-white m-0">How Parametric Consensus Works</p>
          <p className="font-serif font-normal leading-[20px] not-italic relative shrink-0 text-[#9ca3af] text-[14px] m-0">
            A real incident record, a real validator round, and the arithmetic that decides a claim.
          </p>
          <a href="#/how" className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex items-start px-[24px] py-[12px] relative rounded-[6px] shrink-0 no-underline">
            <span className="font-mono font-bold leading-[normal] text-[13px] text-white whitespace-nowrap">EXPLORE WORKFLOW</span>
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}
