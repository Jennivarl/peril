import { Footer, Header, TxTracker } from "../components/Chrome";
import { BRADBURY_RPC, bradburyTxUrl, hours, readCovered, short } from "../lib/chain";
import { usePolled } from "../lib/hooks";

/**
 * The Figma how-it-works frame, built from real records instead of mock-ups:
 * the worked example is a real GitHub incident read live from GitHub's status
 * API, the tiers are GitHub's live price list, and the validator round is the
 * stored round of a real claim on the live contract.
 */

const EXAMPLE = {
  host: "www.githubstatus.com",
  id: "zkxwbgr0cnmx",
  threshold: 240,
  // The same record, saved on 2026-09-11 for the contract's own tests, shown
  // if GitHub cannot be reached from this browser.
  saved: {
    id: "zkxwbgr0cnmx",
    name: "Incident with GitHub.com",
    status: "resolved",
    impact: "critical",
    created_at: "2026-08-17T13:40:03.629Z",
    resolved_at: "2026-08-17T21:15:46.623Z",
  },
};

/** The claim settled on github-w38 against GitHub incident 0rn90wk115q9. */
const REAL_CLAIM_TX = "0x86cfa95fa66a01ced087634fe78ad3b980fb092e2716053a2ff8119edf15e2fb";

// genlayer-js VoteType: 0 NOT_VOTED, 1 AGREE, 2 DISAGREE, 3 TIMEOUT, 4 DETERMINISTIC_VIOLATION.
const VOTE = ["NOT VOTED", "AGREE", "DISAGREE", "TIMEOUT", "VIOLATION"];

type Record5 = typeof EXAMPLE.saved;

async function readExample(): Promise<{ record: Record5; live: boolean }> {
  try {
    const r = await fetch(`https://${EXAMPLE.host}/api/v2/incidents/${EXAMPLE.id}.json`);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const i = (await r.json()).incident;
    return {
      record: { id: i.id, name: i.name, status: i.status, impact: i.impact, created_at: i.created_at, resolved_at: i.resolved_at },
      live: true,
    };
  } catch {
    return { record: EXAMPLE.saved, live: false };
  }
}

type Round = { validators: string[]; votes: number[]; leader: number; seconds: number | null };

async function readRound(): Promise<Round> {
  const res = await fetch(BRADBURY_RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "gen_getTransactionReceipt", params: [{ txId: REAL_CLAIM_TX }] }),
  });
  const body = await res.json();
  const rd = body?.result?.roundData?.[0];
  if (!rd) throw new Error("no round data returned");
  const votes = typeof rd.validatorVotes === "string" ? Array.from(atob(rd.validatorVotes), (c) => c.charCodeAt(0)) : (rd.validatorVotes as number[]);
  const t = body.result.timestamps ?? {};
  return {
    validators: rd.roundValidators ?? [],
    votes,
    leader: Number(rd.leaderIndex),
    seconds: t.Created && t.LastVote ? t.LastVote - t.Created : null,
  };
}

const secs = (iso: string) => Math.floor(Date.parse(iso) / 1000);

function utc(iso: string) {
  const d = new Date(iso);
  return [d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds()].map((n) => String(n).padStart(2, "0")).join(":");
}

function StageCard({ n, title, children }: { n: string; title: string; children: string }) {
  return (
    <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[12px] items-start min-w-px p-[20px] relative rounded-[8px]" data-name={`step-card-${n}`}>
      <div className="content-stretch flex items-center justify-between leading-[normal] relative shrink-0 w-full whitespace-nowrap">
        <p className="font-serif font-extrabold not-italic relative shrink-0 text-[14px] text-white m-0">{title}</p>
        <p className="font-mono font-normal relative shrink-0 text-accent-text text-[12px] m-0">[{n}]</p>
      </div>
      <p className="font-serif font-normal leading-[18px] not-italic relative shrink-0 text-[#9ca3af] text-[13px] w-full m-0">{children}</p>
    </div>
  );
}

export default function HowItWorks() {
  const example = usePolled(readExample, 0);
  const round = usePolled(readRound, 0);
  const covers = usePolled(readCovered, 0);

  const rec = example.data?.record;
  const start = rec ? secs(rec.created_at) : 0;
  const end = rec && rec.resolved_at ? secs(rec.resolved_at) : 0;
  const total = end - start;
  const minutes = Math.floor(total / 60);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const github = covers.data?.find((c) => c.cover === "github");
  const tiers = github ? Object.keys(github.multiples).map(Number).sort((a, b) => a - b) : [];
  const agree = round.data?.votes.filter((v) => v === 1).length ?? 0;

  return (
    <div className="bg-[#090a0c] content-stretch flex flex-col items-start relative size-full" data-name="peril-how-it-works">
      <Header active="/how" />
      <TxTracker />

      <div className="content-stretch flex flex-col gap-[16px] items-center pb-[40px] pt-[48px] px-[120px] relative shrink-0 w-full" data-name="how-hero">
        <div className="bg-accent-tint border border-accent-line border-solid content-stretch flex items-start px-[12px] py-[4px] relative rounded-[100px] shrink-0">
          <p className="font-mono font-bold leading-[normal] relative shrink-0 text-accent-text text-[11px] whitespace-nowrap m-0">DETERMINISTIC CONSENSUS DESIGN</p>
        </div>
        <h1 className="font-serif font-extrabold leading-[normal] not-italic relative shrink-0 text-[36px] text-center text-white w-[800px] m-0">Deterministic Parametric Settlements</h1>
        <p className="font-serif font-normal leading-[22px] not-italic relative shrink-0 text-[#9ca3af] text-[15px] text-center w-[750px] m-0">
          {"Most oracles hand a contract one number and ask it to trust the messenger. On PERIL, every validator reads the provider's own incident record and they agree on four fields; then the contract does subtraction. There is no model in the decision and nobody who can overrule it."}
        </p>
      </div>

      <div className="[word-break:break-word] content-stretch flex flex-col gap-[20px] items-start pb-[64px] px-[120px] relative shrink-0 w-full" data-name="stages-strip">
        <p className="font-mono font-normal leading-[normal] relative shrink-0 text-accent-text text-[12px] uppercase whitespace-nowrap m-0">End-to-End Parametric Lifecycle</p>
        <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full" data-name="stages-grid">
          <StageCard n="01" title="Buy Policy">You pay a premium in GEN and choose a service, an outage length, and a UTC window that starts tomorrow at the earliest.</StageCard>
          <StageCard n="02" title="Incident Query">{"When an outage happens, anyone makes a claim with its incident id. Each validator fetches that one record from the provider's status API."}</StageCard>
          <StageCard n="03" title="Calculate Duration">The contract subtracts start from end in whole minutes, rounded down, and checks the provider rated it major or critical.</StageCard>
          <StageCard n="04" title="Consensus Settlement">{`Validators vote on whether the leader's reading matches their own. On the real claim below, all ${round.data?.votes.length ?? 5} votes were in ${round.data?.seconds ?? 12} seconds after it was sent.`}</StageCard>
          <StageCard n="05" title={`Disburse & Finalize`}>{"A qualifying claim is marked paid when it is accepted. The GEN reaches the holder's wallet when the transaction finalises, after a 30 second finality window on Studio Next."}</StageCard>
        </div>
      </div>

      <div className="content-stretch flex gap-[24px] items-start pb-[64px] px-[120px] relative shrink-0 w-full" data-name="anatomy-consensus">
        <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px p-[32px] relative rounded-[12px]" data-name="json-anatomy">
          <p className="font-serif font-extrabold leading-[normal] not-italic relative shrink-0 text-[18px] text-white w-full m-0">Downtime API Field Anatomy</p>
          <p className="font-serif font-normal leading-[18px] not-italic relative shrink-0 text-[#9ca3af] text-[13px] w-full m-0">
            {example.data?.live
              ? `A real incident, read from ${EXAMPLE.host} by your browser just now:`
              : example.data
                ? "A real incident, from the copy saved for the contract's tests (GitHub could not be reached from this browser):"
                : `Reading a real incident from ${EXAMPLE.host}…`}
          </p>
          <div className="bg-[#14171f] border border-[#1e222a] border-solid content-stretch flex items-start p-[16px] relative rounded-[6px] shrink-0 w-full">
            <pre className="flex-[1_0_0] font-mono font-normal min-w-px relative text-accent-text text-[11px] leading-[16px] whitespace-pre-wrap [overflow-wrap:anywhere] m-0">
              {rec ? JSON.stringify(rec, null, 2) : "{ … }"}
            </pre>
          </div>
          <div className="content-stretch flex flex-col font-serif font-normal gap-[8px] items-start not-italic relative shrink-0 text-[#9ca3af] text-[12px] w-full leading-[17px]">
            <p className="m-0">• <b className="text-white">id</b>: must match the id that was asked for, so a host cannot answer with a different incident.</p>
            <p className="m-0">• <b className="text-white">created_at / resolved_at</b>: subtracted in whole seconds, then rounded down to minutes.</p>
            <p className="m-0">• <b className="text-white">impact</b>: must be major or critical, as rated by the provider itself.</p>
            <p className="m-0">{"Validators compare only these four fields. The name and update log can change without breaking agreement."}</p>
          </div>
        </div>

        <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[20px] items-start min-w-px p-[32px] relative rounded-[12px]" data-name="consensus-visual">
          <p className="font-serif font-extrabold leading-[normal] not-italic relative shrink-0 text-[18px] text-white w-full m-0">Validator Convergence Mechanism</p>
          <p className="font-serif font-normal leading-[18px] not-italic relative shrink-0 text-[#9ca3af] text-[13px] w-full m-0">
            {"A real round, from the claim settled on github-w38 against GitHub incident 0rn90wk115q9. Each validator fetched the incident itself and voted on whether the leader's reading matched."}
          </p>
          <div className="content-stretch flex flex-col gap-[10px] items-start leading-[normal] relative shrink-0 text-[12px] w-full whitespace-nowrap">
            {!round.data && (
              <p className="font-mono text-[#9ca3af] m-0">{round.error ? `Could not read the round from Bradbury: ${round.error}` : "Reading the round from Bradbury…"}</p>
            )}
            {round.data?.validators.map((v, i) => {
              const vote = round.data!.votes[i];
              return (
                <div key={v} className="bg-[#14171f] border border-[#1e222a] border-solid content-stretch flex items-center justify-between p-[12px] relative rounded-[6px] shrink-0 w-full">
                  <p className="font-mono font-normal relative shrink-0 text-white m-0">
                    Validator #{String(i + 1).padStart(2, "0")} ({short(v, 5, 4)})
                    {i === round.data!.leader && <span className="ml-[8px] text-[#8ab4f8]">LEADER</span>}
                  </p>
                  <p className={`font-mono font-bold relative shrink-0 m-0 ${vote === 1 ? "text-accent-text" : "text-[#ff3b30]"}`}>
                    {VOTE[vote] ?? `CODE ${vote}`}
                    {vote === 1 ? " ✓" : ""}
                  </p>
                </div>
              );
            })}
          </div>
          {round.data && (
            <a href={bradburyTxUrl(REAL_CLAIM_TX)} target="_blank" rel="noreferrer" className="bg-accent-tint border border-accent-line border-solid content-stretch flex items-start justify-center p-[12px] relative rounded-[6px] shrink-0 w-full no-underline">
              <span className="font-mono font-extrabold leading-[normal] text-accent-text text-[12px] whitespace-nowrap">
                {agree} OF {round.data.votes.length} AGREE · VERDICT: UNDER THRESHOLD · VIEW TRANSACTION
              </span>
            </a>
          )}
        </div>
      </div>

      <div className="content-stretch flex flex-col gap-[20px] items-start pb-[80px] px-[120px] relative shrink-0 w-full" data-name="case-study-section">
        <p className="font-mono font-normal leading-[normal] relative shrink-0 text-accent-text text-[12px] uppercase whitespace-nowrap m-0">Fully Worked Case Study: Incident {EXAMPLE.id}</p>
        <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-col gap-[24px] items-start p-[32px] relative rounded-[12px] shrink-0 w-full" data-name="case-study-box">
          <div className="content-stretch flex items-center justify-between relative shrink-0 w-full gap-[16px]">
            <div className="content-stretch flex flex-col gap-[4px] items-start leading-[normal] relative shrink-0">
              <p className="font-serif font-extrabold not-italic relative shrink-0 text-[22px] text-white m-0">{rec?.name ?? "…"}</p>
              <p className="font-mono font-normal relative shrink-0 text-[#9ca3af] text-[12px] m-0">
                Target: {EXAMPLE.host} | Rated: {rec?.impact ?? "…"} | Example threshold: {EXAMPLE.threshold} mins ({hours(EXAMPLE.threshold)})
              </p>
            </div>
            {rec && (
              <div className={`${minutes >= EXAMPLE.threshold ? "bg-accent-tint border-accent-line text-accent-text" : "bg-[rgba(138,180,248,0.1)] border-[#8ab4f8] text-[#8ab4f8]"} border border-solid content-stretch flex items-start px-[10px] py-[4px] relative rounded-[4px] shrink-0`}>
                <p className="font-mono font-bold leading-[normal] text-[12px] whitespace-nowrap m-0">{minutes >= EXAMPLE.threshold ? "THRESHOLD MET ✓" : "UNDER THRESHOLD"}</p>
              </div>
            )}
          </div>

          <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full" data-name="math-grid">
            <div className="bg-[#14171f] border border-[#1e222a] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[10px] items-start min-w-px p-[20px] relative rounded-[8px]" data-name="arithmetic-card">
              <p className="font-mono font-normal leading-[normal] relative shrink-0 text-[#9ca3af] text-[11px] whitespace-nowrap m-0">DOWNTIME ARITHMETIC</p>
              <div className="content-stretch flex flex-col font-serif font-normal gap-[4px] items-start not-italic relative shrink-0 text-[14px] text-white w-full">
                <p className="leading-[normal] m-0">• Outage start: {rec ? `${rec.created_at.slice(0, 10)} ${utc(rec.created_at)} UTC` : "…"}</p>
                <p className="leading-[normal] m-0">• Outage end: {rec?.resolved_at ? `${rec.resolved_at.slice(0, 10)} ${utc(rec.resolved_at)} UTC` : "…"}</p>
                <p className="leading-[normal] m-0">• Subtract: <span className="font-mono text-accent-text">{rec ? `${h} h ${m} m ${s} s` : "…"}</span></p>
                <p className="leading-[normal] m-0">• Round down to whole minutes</p>
              </div>
              <div className="bg-[#1e222a] h-px relative shrink-0 w-full" />
              <p className="font-mono font-bold leading-[normal] relative shrink-0 text-accent-text text-[16px] whitespace-nowrap m-0">Total = {rec ? minutes : "…"} Minutes</p>
            </div>

            <div className="bg-[#14171f] border border-[#1e222a] border-solid content-stretch flex flex-[1_0_0] flex-col font-normal gap-[10px] items-start leading-[normal] min-w-px p-[20px] relative rounded-[8px] whitespace-nowrap" data-name="pass-fail-card">
              <p className="font-mono relative shrink-0 text-[#9ca3af] text-[11px] m-0">{"TIER EVALUATION (GITHUB'S LIVE PRICE LIST)"}</p>
              <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 text-[13px] w-full">
                {!github && <p className="font-mono text-[#9ca3af] m-0">{covers.error ? "Could not read the price list." : "Reading the price list…"}</p>}
                {rec &&
                  tiers.map((t) => {
                    const pass = minutes >= t;
                    return (
                      <div key={t} className="content-stretch flex items-start justify-between relative shrink-0 w-full gap-[12px]">
                        <p className={`font-serif not-italic relative shrink-0 m-0 ${pass ? "text-white" : "text-[#4b5563]"}`}>
                          {hours(t)} tier ({github!.multiples[String(t)]}x){t === EXAMPLE.threshold ? " - Example" : ""}
                        </p>
                        <p className={`font-mono relative shrink-0 m-0 ${pass ? "text-accent-text" : "text-[#ff3b30]"}`}>
                          {pass ? `CLEARED (${minutes}m ≥ ${t}m)` : `FAILED (${minutes}m < ${t}m)`}
                        </p>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>

          <div className="bg-[#14171f] border border-[#1e222a] border-solid content-stretch flex items-start p-[20px] relative rounded-[6px] shrink-0 w-full" data-name="payout-reasoning">
            <p className="flex-[1_0_0] font-mono font-normal leading-[20px] min-w-px relative text-[#9ca3af] text-[13px] m-0">
              {rec
                ? `The contract's verdict for a ${EXAMPLE.threshold} minute policy would read: "${minutes} minutes ${minutes >= EXAMPLE.threshold ? "meets" : "is under"} the ${EXAMPLE.threshold} minute threshold". This outage happened on ${rec.created_at.slice(0, 10)}, before the live policies existed, so nothing was paid on it; it is the worked example the contract's own tests use.`
                : "…"}
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
