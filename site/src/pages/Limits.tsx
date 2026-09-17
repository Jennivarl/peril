import { Footer, Header } from "../components/Chrome";
import { RPC, gen, readReserves, txUrl } from "../lib/chain";
import { usePolled } from "../lib/hooks";

/**
 * The Figma limits frame. What PERIL cannot do, stated in its own voice.
 * The design's retry schedule, backup caches and proportional payout scaling
 * do not exist in the contract, so they are replaced with what actually
 * happens, and the timeline is a real claim's recorded timestamps.
 */

/**
 * The claim that paid: github-w38 settled against GitHub incident
 * nlxnbqnkdzdl on 16 September 2026, which moved 1 GEN out of the pool.
 */
const REAL_CLAIM_TX = "0x0299eae1a6690ea1f513aa712e5f65034bb0279eacd962da0ff52574159fc433";

type Stamps = { created?: number; lastVote?: number };

/**
 * Studio Next has no gen_getTransactionReceipt; the transaction itself
 * carries the timestamps, so they are read from eth_getTransactionByHash.
 */
async function readStamps(): Promise<Stamps> {
  const res = await fetch(RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "eth_getTransactionByHash", params: [REAL_CLAIM_TX] }),
  });
  const body = await res.json();
  const r = body?.result;
  if (!r?.created_timestamp) throw new Error("no timestamps returned");
  return { created: Number(r.created_timestamp), lastVote: r.last_vote_timestamp ? Number(r.last_vote_timestamp) : undefined };
}

type Tone = "info" | "accent" | "red";
/** One badge style for the whole page: the tone names are kept only so the
 *  boundaries below still read as what they are. */
const BADGE = "bg-[rgba(124,58,237,0.12)] border-[#6d28d9] text-[#5b21b6]";
const TONE: Record<Tone, string> = { info: BADGE, accent: BADGE, red: BADGE };

function Boundary({ n, title, badge, tone, happen, responds, assume }: { n: string; title: string; badge: string; tone: Tone; happen: string; responds: string; assume: string }) {
  return (
    <div className="peril-glass border border-solid content-stretch flex flex-col gap-[20px] items-start p-[28px] relative rounded-[12px] shrink-0 w-full" data-name={`boundary-card-${n}`}>
      <div className="content-stretch flex items-center justify-between relative shrink-0 w-full gap-[16px]">
        <div className="content-stretch flex gap-[8px] items-center leading-[normal] relative shrink-0">
          <p className="font-mono font-extrabold peril-grad-text relative shrink-0 text-[20px] m-0">{n}</p>
          <h2 className="font-serif font-bold not-italic relative shrink-0 text-[20px] text-[#16141b] m-0">{title}</h2>
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
            <p className="font-mono leading-[normal] relative shrink-0 text-[#67626f] text-[11px] whitespace-nowrap m-0">{k}</p>
            <p className="font-serif leading-[20px] not-italic relative shrink-0 text-[14px] text-[#16141b] m-0">{v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="peril-glass border border-solid content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px p-[28px] relative rounded-[12px]">
      <p className="font-serif font-extrabold relative shrink-0 text-[16px] text-[#16141b] m-0">{title}</p>
      <div className="content-stretch flex flex-col font-serif font-normal gap-[12px] items-start relative shrink-0 text-[#67626f] text-[13px] w-full leading-[18px]">
        {items.map((i) => (
          <p key={i} className="m-0">• {i}</p>
        ))}
      </div>
    </div>
  );
}

export default function Limits() {
  const reserves = usePolled(readReserves, 60000);
  const stamps = usePolled(readStamps, 0);

  const r = reserves.data;
  const pool = r ? BigInt(r.pool) : 0n;
  const locked = r ? BigInt(r.locked) : 0n;
  const lockedPct = pool > 0n ? Number((locked * 10000n) / pool) / 100 : 0;

  const t = stamps.data;
  const voteAt = t?.created && t?.lastVote ? `+${t.lastVote - t.created}s` : "…";
  const timeline: [string, string, string][] = [
    ["CLAIM SENT", "0s", "Anyone submits settle with an incident id."],
    ["FETCHED", "seconds", "Every validator fetches that incident from the provider itself."],
    ["VOTES IN", voteAt, "Validators agreed on the four fields. The verdict is stored."],
    ["FINALISED", "+30s", "The finality window passes and the payout reaches the holder's wallet."],
  ];

  return (
    <div className="bg-[#faf8fd] content-stretch flex flex-col items-start min-h-screen mx-auto max-w-[1440px] relative size-full" data-name="peril-limits">
      <Header active="/limits" />

      <div className="content-stretch flex flex-col gap-[20px] items-start pb-[40px] pt-[64px] px-[20px] lg:px-[120px] relative shrink-0 w-full" data-name="limits-hero">
        <div className="bg-[rgba(124,58,237,0.12)] border border-[#5b21b6] border-solid content-stretch flex items-start px-[12px] py-[4px] relative rounded-[100px] shrink-0">
          <p className="font-mono font-bold leading-[normal] relative shrink-0 text-[#5b21b6] text-[11px] whitespace-nowrap m-0">{`KNOWN LIMITS, STATED RATHER THAN HIDDEN`}</p>
        </div>
        <h1 className="font-serif font-extrabold leading-[normal] not-italic relative shrink-0 text-[42px] text-[#16141b] m-0">{`Protocol Boundaries & Limits`}</h1>
        <p className="font-serif font-normal leading-[24px] not-italic relative shrink-0 text-[#67626f] text-[16px] max-w-[840px] m-0">
          Parametric cover is predictable because it only measures what a provider publishes. That is also exactly where its limits are. Read these before buying cover or funding the pool.
        </p>
      </div>

      <div className="content-stretch flex flex-col gap-[24px] items-start pb-[64px] px-[20px] lg:px-[120px] relative shrink-0 w-full" data-name="boundaries-container">
        <Boundary
          n="01"
          title="The Provider Is the Oracle"
          badge="SOURCE OF TRUTH"
          tone="info"
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
          tone="info"
          happen="Everything here runs on GenLayer Studio Next, a development network."
          responds="Pools, premiums and payouts use testnet GEN, which carries no real-world value."
          assume="Do not treat this as insurance for real infrastructure. It is an experimental release."
        />
      </div>

      <div className="content-stretch flex gap-[24px] items-start pb-[64px] px-[20px] lg:px-[120px] relative shrink-0 w-full" data-name="diagrams-container">
        <div className="bg-[#f1edfa] border border-[#e3ddf0] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[20px] items-start min-w-px p-[28px] relative rounded-[12px]">
          <p className="font-mono font-normal leading-[normal] relative shrink-0 text-[#67626f] text-[11px] whitespace-nowrap m-0">THE CLAIM THAT PAID (GITHUB-W38, RECORDED BY THE NETWORK)</p>
          <div className="content-stretch flex flex-col gap-[8px] items-stretch relative shrink-0 w-full">
            {timeline.map(([k, when, what], i) => {
              const last = i === timeline.length - 1;
              return (
                <div key={k} className={`${last ? "bg-accent-tint border-accent-line" : "bg-[#ffffff] border-[#e3ddf0]"} border border-solid flex gap-[12px] items-center px-[12px] py-[10px] rounded-[6px]`}>
                  <p className={`font-mono font-bold text-[12px] m-0 w-[64px] shrink-0 ${last ? "text-accent-text" : "text-[#5b21b6]"}`}>{when}</p>
                  <p className="font-mono text-[#67626f] text-[10px] m-0 w-[110px] shrink-0">{k}</p>
                  <p className="font-serif not-italic text-[13px] text-[#16141b] leading-[17px] m-0">{what}</p>
                </div>
              );
            })}
          </div>
          <a href={txUrl(REAL_CLAIM_TX)} target="_blank" rel="noreferrer" className="font-mono text-[#787384] text-[11px] hover:text-[#67626f]">
            {stamps.error ? `Could not read the timestamps: ${stamps.error}` : "Timestamps from the paying claim on Studio Next. The finality window is 30 seconds, reported by the network itself."}
          </a>
        </div>

        <div className="bg-[#f1edfa] border border-[#e3ddf0] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[20px] items-start min-w-px p-[28px] relative rounded-[12px]">
          <p className="font-mono font-normal leading-[normal] relative shrink-0 text-[#67626f] text-[11px] whitespace-nowrap m-0">WORST CASE: EVERY OPEN POLICY PAYS AT ONCE</p>
          <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
            {[
              { label: "OWED IF ALL OPEN COVER PAID", value: r ? `${gen(locked)} GEN` : "…", width: lockedPct, bar: "peril-grad-risk" },
              { label: "HELD IN THE POOL", value: r ? `${gen(pool)} GEN` : "…", width: pool > 0n ? 100 : 0, bar: "peril-grad-good" },
            ].map((b) => (
              <div key={b.label} className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
                <div className="content-stretch flex items-start justify-between leading-[normal] relative shrink-0 text-[12px] w-full whitespace-nowrap">
                  <p className="font-serif not-italic text-[#67626f] m-0">{b.label}</p>
                  <p className="font-mono text-[#16141b] m-0">{b.value}</p>
                </div>
                <div className="bg-[#e9e4f4] content-stretch flex h-[10px] items-start overflow-clip relative rounded-[5px] shrink-0 w-full">
                  <div className={`${b.bar} h-full relative shrink-0`} style={{ width: `${b.width}%` }} />
                </div>
              </div>
            ))}
          </div>
          <p className="font-serif text-[#67626f] text-[12px] leading-[17px] m-0">
            {r
              ? `Live from the contract: even if every open policy paid today, the pool would pay ${gen(locked)} GEN of the ${gen(pool)} GEN it holds. The contract refuses any sale that would break this.`
              : reserves.error
                ? "Could not read the pool from Studio Next."
                : "Reading the pool from Studio Next…"}
          </p>
        </div>
      </div>

      <div className="content-stretch flex gap-[24px] items-start leading-[normal] not-italic pb-[64px] px-[20px] lg:px-[120px] relative shrink-0 w-full" data-name="checklist-section">
        <List
          title="What PERIL Does NOT Cover"
          items={[
            "Incidents the provider rates minor or none.",
            "Outages the provider never posts on its status page.",
            "DNS, routing or client-side connection problems.",
            "Cloudflare and OpenAI: they publish no history to price from.",
            "An outage still running when the window ends: anyone can close the policy from that day, before the outage is resolved and claimed.",
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

      <div className="content-stretch flex items-start pb-[64px] px-[20px] lg:px-[120px] relative shrink-0 w-full" data-name="disclaimer-alert-section">
        <div className="bg-[rgba(220,38,38,0.10)] border border-[#dc2626] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px p-[32px] relative rounded-[12px]" role="note">
          <div className="content-stretch flex gap-[8px] items-center leading-[normal] relative shrink-0 text-[#b91c1c] whitespace-nowrap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 3 2 21h20L12 3z" />
              <path d="M12 10v5" />
              <path d="M12 18h.01" />
            </svg>
            <p className="font-mono font-extrabold relative shrink-0 text-[14px] m-0">NON-ECONOMIC DEV TESTNET</p>
          </div>
          <p className="font-serif font-normal leading-[22px] not-italic relative shrink-0 text-[14px] text-[#16141b] m-0">
            You are using GenLayer Studio Next, a development network. All transactions, tokens, cover and payouts are experimental. Do not use PERIL to insure real systems or deposit anything of real value.
          </p>
        </div>
      </div>

      <div className="content-stretch flex gap-[24px] items-start pb-[80px] px-[20px] lg:px-[120px] relative shrink-0 w-full flex-wrap" data-name="cta-row">
        <div className="bg-[#f1edfa] border border-[#e3ddf0] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px p-[32px] relative rounded-[12px]">
          <p className="font-serif font-extrabold leading-[normal] not-italic relative shrink-0 text-[20px] text-[#16141b] m-0">Review Outage Statistics</p>
          <p className="font-serif font-normal leading-[20px] not-italic relative shrink-0 text-[#67626f] text-[14px] m-0">
            See each provider&apos;s serious outages and the multiples derived from them before choosing an outage length.
          </p>
          <a href="#/evidence" className="peril-cta content-stretch flex items-start px-[24px] py-[12px] relative rounded-[6px] shrink-0 no-underline">
            <span className="font-mono font-bold leading-[normal] text-[#ffffff] text-[13px] whitespace-nowrap">GO TO PRICING EVIDENCE</span>
          </a>
        </div>
        <div className="bg-[#f1edfa] border border-[#e3ddf0] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px p-[32px] relative rounded-[12px]">
          <p className="font-serif font-extrabold leading-[normal] not-italic relative shrink-0 text-[20px] text-[#16141b] m-0">How Parametric Consensus Works</p>
          <p className="font-serif font-normal leading-[20px] not-italic relative shrink-0 text-[#67626f] text-[14px] m-0">
            A real incident record, a real validator round, and the arithmetic that decides a claim.
          </p>
          <a href="#/how" className="peril-glass border border-solid content-stretch flex items-start px-[24px] py-[12px] relative rounded-[6px] shrink-0 no-underline">
            <span className="font-mono font-bold leading-[normal] text-[13px] text-[#16141b] whitespace-nowrap">EXPLORE WORKFLOW</span>
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}
