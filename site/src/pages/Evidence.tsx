import { Footer, Header } from "../components/Chrome";
import { ProviderIcon } from "../components/ProviderIcon";
import { PERIL, REPO, addressUrl, hours, readCovered } from "../lib/chain";
import { OFFERED, SEEN, SERIOUS_OUTAGES_12M, SNAPSHOT, TIERS, priceTier, serviceName } from "../lib/evidence";
import { usePolled } from "../lib/hooks";

/**
 * The Figma pricing-evidence frame. Every multiple shown is read live from the
 * contract; the counts behind them come from the published snapshot, and the
 * page checks the two still agree.
 */

const EXAMPLE = { cover: "github", tier: 240 };

export default function Evidence() {
  const covers = usePolled(readCovered, 0);
  const live = covers.data;

  const matches = live
    ? live.every((c) => {
        const snap = OFFERED[c.cover] ?? {};
        const liveKeys = Object.keys(c.multiples).map(Number).sort();
        const snapKeys = Object.keys(snap).map(Number).sort();
        return liveKeys.length === snapKeys.length && liveKeys.every((t, i) => t === snapKeys[i] && c.multiples[String(t)] === snap[t]);
      }) && live.length === Object.keys(OFFERED).length
    : null;

  const ex = priceTier(SEEN[EXAMPLE.cover][EXAMPLE.tier]);

  return (
    <div className="bg-[#faf8fd] content-stretch flex flex-col items-start min-h-screen mx-auto max-w-[1440px] relative size-full" data-name="peril-pricing-evidence">
      <Header active="/evidence" />

      <div className="content-stretch flex flex-col gap-[20px] items-start pb-[40px] pt-[64px] px-[120px] relative shrink-0 w-full" data-name="evidence-hero">
        <div className="bg-accent-tint border border-accent-line border-solid content-stretch flex items-start px-[12px] py-[4px] relative rounded-[100px] shrink-0">
          <p className="font-mono font-bold leading-[normal] relative shrink-0 text-accent-text text-[11px] whitespace-nowrap m-0">PRICES DERIVED FROM PUBLISHED OUTAGE HISTORY</p>
        </div>
        <h1 className="font-serif font-extrabold leading-[normal] not-italic relative shrink-0 text-[42px] text-[#16141b] m-0">Evidence-Driven Parametric Pricing</h1>
        <p className="font-serif font-normal leading-[24px] not-italic relative shrink-0 text-[#67626f] text-[16px] max-w-[840px] m-0">
          {"Nobody sets a price by feel. Each multiple comes from twelve months of the provider's own incident history, run through one published rule. The margin is in the rule, not hidden: the pool aims to keep at least half of every premium."}
        </p>
      </div>

      <div className="content-stretch flex flex-col gap-[24px] items-start pb-[64px] px-[120px] relative shrink-0 w-full" data-name="matrix-container">
        <div className="content-stretch flex items-center justify-between relative shrink-0 w-full gap-[16px]">
          <div className="content-stretch flex flex-col gap-[6px] items-start leading-[normal] relative shrink-0">
            <p className="font-mono font-normal relative shrink-0 text-accent-text text-[12px] m-0">OUTAGE COVERAGE MATRIX</p>
            <p className="font-serif font-extrabold not-italic relative shrink-0 text-[24px] text-[#16141b] m-0">{`Active Rate Table & Multipliers`}</p>
          </div>
          <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
            <div className="content-stretch flex gap-[6px] items-center">
              <div className="bg-[#f1edfa] border border-[#e3ddf0] border-solid rounded-[2px] size-[12px]" />
              <p className="font-serif text-[#67626f] text-[12px] whitespace-nowrap m-0">Sold at this multiple (live)</p>
            </div>
            <div className="content-stretch flex gap-[6px] items-center">
              <div className="bg-[#e9e4f4] border border-[#6d28d9] border-solid rounded-[2px] size-[12px]" />
              <p className="font-serif text-[#67626f] text-[12px] whitespace-nowrap m-0">Not sold: would pay too often</p>
            </div>
          </div>
        </div>

        <div className="peril-glass border border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[12px] shrink-0 w-full" data-name="matrix-table-box">
          <div className="bg-[#f1edfa] border-[#e3ddf0] border-b border-solid content-stretch flex font-mono font-bold items-start leading-[normal] p-[16px] relative shrink-0 text-[#67626f] text-[12px] w-full">
            <p className="relative shrink-0 w-[220px] m-0">PROVIDER / HOST</p>
            <p className="relative shrink-0 text-center w-[120px] m-0">12M SERIOUS</p>
            {TIERS.map((t) => (
              <p key={t} className="flex-[1_0_0] min-w-px relative text-center m-0">{hours(t).toUpperCase()} TIER</p>
            ))}
          </div>
          {!live && (
            <div className="p-[16px] w-full">
              <p className="font-mono text-[#67626f] text-[13px] m-0">{covers.error ? `Could not read the price list from Studio Next: ${covers.error}` : "Reading the price list from Studio Next…"}</p>
            </div>
          )}
          {live?.map((c) => (
            <div key={c.cover} className="border-[#e3ddf0] border-b border-solid content-stretch flex items-center p-[16px] relative shrink-0 w-full">
              <div className="content-stretch flex gap-[10px] items-center leading-[normal] relative shrink-0 w-[220px]">
                <span className="content-stretch flex items-center justify-center shrink-0 size-[22px]">
                  <ProviderIcon cover={c.cover} size={20} />
                </span>
                <div className="content-stretch flex flex-col gap-[4px] items-start min-w-px relative">
                  <p className="font-serif font-bold not-italic text-[14px] text-[#16141b] m-0">{serviceName(c.cover)}</p>
                  <p className="font-mono font-normal text-[#67626f] text-[11px] m-0">{c.host}</p>
                </div>
              </div>
              <p className="font-mono font-normal leading-[normal] relative shrink-0 text-[13px] text-center text-[#16141b] w-[120px] m-0">{SERIOUS_OUTAGES_12M[c.cover] ?? "?"}</p>
              {TIERS.map((t) => {
                const m = c.multiples[String(t)];
                const seen = SEEN[c.cover]?.[t];
                return (
                  <div key={t} className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-center min-w-px relative">
                    {m !== undefined ? (
                      <div className="bg-[#f1edfa] border border-[#e3ddf0] border-solid flex justify-center px-[12px] py-[6px] rounded-[6px] w-[64px]">
                        <p className="font-mono font-bold text-[12px] text-[#16141b] m-0">{m}x</p>
                      </div>
                    ) : (
                      <div className="bg-[rgba(124,58,237,0.12)] border border-[#6d28d9] border-solid flex px-[8px] py-[4px] rounded-[4px]">
                        <p className="font-mono font-normal text-[#5b21b6] text-[10px] m-0">NOT SOLD</p>
                      </div>
                    )}
                    {seen !== undefined && <p className="font-mono text-[#787384] text-[10px] m-0">{seen} ≥{hours(t)}</p>}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <p className="font-serif text-[#787384] text-[12px] m-0">
          {"Under each multiple: how many of the provider's serious outages in the 12 months lasted at least that long."}
        </p>
      </div>

      <div className="content-stretch flex flex-col gap-[32px] items-start pb-[64px] px-[120px] relative shrink-0 w-full" data-name="methodology-container">
        <div className="content-stretch flex flex-col gap-[6px] items-start leading-[normal] relative shrink-0">
          <p className="font-mono font-normal text-accent-text text-[12px] m-0">THE PRICING RULE</p>
          <p className="font-serif font-extrabold not-italic text-[24px] text-[#16141b] m-0">Active Risk Calculation Methodology</p>
        </div>
        <div className="content-stretch flex gap-[20px] items-start relative shrink-0 w-full">
          {[
            ["01", "12-Month Lookback", `A script read each provider's published incident history for ${SNAPSHOT.window} and fetched every incident for its exact start and end. It ran once, on ${SNAPSHOT.generated}.`],
            ["02", "Major/Critical Severity Filter", "Only incidents the provider itself rated major or critical count. Minor slowdowns are excluded, exactly as they are at claim time."],
            ["03", "Three-Phantom-Outage Pad", "Three extra outages are added to every count, so a clean year is never priced as a guarantee. Three is the usual upper bound when none were seen."],
            ["04", "Keep Half, Cap at 20x", "The multiple is the largest whole number that keeps the expected payout under half the premium, never above 20x. Anything under 2x is not sold."],
          ].map(([n, title, body]) => (
            <div key={n} className="peril-glass border border-solid content-stretch flex flex-[1_0_0] flex-col gap-[12px] items-start min-w-px p-[24px] relative rounded-[12px]">
              <p className="font-mono font-bold leading-[normal] text-accent-text text-[13px] m-0">[{n}]</p>
              <p className="font-serif font-bold leading-[normal] not-italic text-[16px] text-[#16141b] m-0">{title}</p>
              <p className="font-serif font-normal leading-[20px] not-italic text-[#67626f] text-[13px] m-0">{body}</p>
            </div>
          ))}
        </div>

        <div className="bg-[#f1edfa] border border-[#e3ddf0] border-solid content-stretch flex gap-[32px] items-center p-[32px] relative rounded-[12px] shrink-0 w-full" data-name="formula-block">
          <div className="content-stretch flex flex-[1_0_0] flex-col gap-[14px] items-start min-w-px relative">
            <p className="font-mono font-normal text-[#67626f] text-[11px] m-0">HOW A MULTIPLE IS SET (THE PREMIUM IS YOURS TO CHOOSE)</p>
            <p className="font-mono text-[#16141b] text-[15px] m-0">
              weekly rate <span className="text-accent-text">L</span> = (outages ≥ T + {SNAPSHOT.pad}) ÷ {SNAPSHOT.weeks.toFixed(2)} weeks
            </p>
            <p className="font-mono text-[#16141b] text-[15px] m-0">
              chance in a week <span className="text-accent-text">P</span> = 1 − e<sup>−L</sup>
            </p>
            <p className="font-mono text-[#16141b] text-[15px] m-0">
              <span className="text-accent-text font-bold">MULTIPLE</span> = floor({SNAPSHOT.lossRatio} ÷ P), at most {SNAPSHOT.maxMultiple}x, sold if ≥ 2x
            </p>
          </div>
          <div className="content-stretch flex flex-col font-normal gap-[8px] items-start relative shrink-0 w-[440px]">
            <p className="font-mono text-[#67626f] text-[11px] m-0">WORKED EXAMPLE (GITHUB 4H)</p>
            <p className="font-serif leading-[18px] not-italic text-[#67626f] text-[13px] m-0">
              GitHub had {SEEN.github[240]} serious outages lasting 4 hours or more:
            </p>
            <p className="font-mono text-accent-text text-[13px] leading-[20px] m-0">
              L = ({SEEN.github[240]} + 3) ÷ {SNAPSHOT.weeks.toFixed(2)} = {ex.perWeek.toFixed(3)} per week
              <br />P = 1 − e<sup>−{ex.perWeek.toFixed(3)}</sup> = {(ex.pWeek * 100).toFixed(1)}%
              <br />floor(0.5 ÷ {ex.pWeek.toFixed(3)}) = {ex.multiple}x
            </p>
            <p className="font-serif leading-[18px] not-italic text-[#67626f] text-[13px] m-0">
              {live
                ? `The live contract sells GitHub 4h at ${live.find((c) => c.cover === "github")?.multiples["240"] ?? "?"}x.`
                : "Checking the live contract…"}
            </p>
          </div>
        </div>
      </div>

      <div className="content-stretch flex flex-col items-start pb-[64px] px-[120px] relative shrink-0 w-full" data-name="omission-callout">
        <div className="bg-[rgba(124,58,237,0.12)] border border-[#6d28d9] border-solid content-stretch flex flex-col gap-[12px] items-start p-[24px] relative rounded-[12px] shrink-0 w-full">
          <div className="content-stretch flex gap-[8px] items-center leading-[normal] text-[#5b21b6] whitespace-nowrap">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 3 2 21h20L12 3z" />
              <path d="M12 10v5" />
              <path d="M12 18h.01" />
            </svg>
            <p className="font-mono font-bold text-[12px] m-0">WHY CLOUDFLARE AND OPENAI ARE NOT OFFERED</p>
          </div>
          <p className="font-serif font-normal leading-[20px] not-italic text-[13px] text-[#16141b] m-0">
            Their status pages publish no incident history to price from: the history file returned 404 when the snapshot ran on {SNAPSHOT.generated}. Guessing a price from a few weeks of data would be pretending to know something, so no cover is sold for them.
          </p>
        </div>
      </div>

      <div className="content-stretch flex flex-col items-start pb-[80px] px-[120px] relative shrink-0 w-full" data-name="provenance-section">
        <div className="peril-glass border border-solid content-stretch flex flex-col gap-[20px] items-start p-[32px] relative rounded-[12px] shrink-0 w-full">
          <div className="content-stretch flex items-center justify-between relative shrink-0 w-full gap-[16px]">
            <p className="font-serif font-extrabold leading-[normal] not-italic text-[18px] text-[#16141b] m-0">Technical Data Provenance</p>
            <div className={`${matches === null ? "bg-[#e9e4f4] border-[#e3ddf0] text-[#67626f]" : matches ? "bg-accent-tint border-accent-line text-accent-text" : "bg-[rgba(124,58,237,0.12)] border-[#6d28d9] text-[#5b21b6]"} border border-solid flex px-[10px] py-[4px] rounded-[4px]`}>
              <p className="font-mono font-normal text-[11px] whitespace-nowrap m-0">
                {matches === null ? (covers.error ? "COULD NOT CHECK CONTRACT" : "CHECKING CONTRACT…") : matches ? "SNAPSHOT MATCHES LIVE CONTRACT ✓" : "LIVE PRICES DIFFER FROM SNAPSHOT"}
              </p>
            </div>
          </div>
          <div className="content-stretch flex gap-[32px] items-start relative shrink-0 w-full">
            <div className="content-stretch flex flex-[1_0_0] flex-col gap-[12px] items-start min-w-px">
              {[
                ["DATA FILE", <a key="f" href={`${REPO}/blob/main/${SNAPSHOT.file}`} target="_blank" rel="noreferrer" className="font-mono text-[#16141b] underline">{SNAPSHOT.file}</a>],
                ["GENERATED", <span key="g" className="font-mono text-[#16141b]">{SNAPSHOT.generated} (commit {SNAPSHOT.commit})</span>],
                ["FILE SHA-256", <span key="h" className="font-mono text-accent-text text-[11px]" title={SNAPSHOT.sha256}>{`${SNAPSHOT.sha256.slice(0, 10)}…${SNAPSHOT.sha256.slice(-8)}`}</span>],
              ].map(([k, v], i) => (
                <div key={i} className="w-full flex flex-col gap-[12px]">
                  {i > 0 && <div className="bg-[#e3ddf0] h-px w-full" />}
                  <div className="flex items-start justify-between text-[12px] w-full gap-[16px]">
                    <p className="font-serif text-[#67626f] m-0">{k}</p>
                    {v}
                  </div>
                </div>
              ))}
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col gap-[12px] items-start min-w-px">
              {[
                ["SCRIPT", <a key="s" href={`${REPO}/blob/main/deploy/price_table.py`} target="_blank" rel="noreferrer" className="font-mono text-[#16141b] underline">deploy/price_table.py</a>],
                ["PRICES ON CHAIN", <a key="c" href={addressUrl(PERIL)} target="_blank" rel="noreferrer" className="font-mono text-[#16141b] underline">covered() on {PERIL.slice(0, 8)}…</a>],
                ["REPRODUCIBILITY", <span key="r" className="font-serif text-[#67626f] text-[11px] text-right max-w-[340px]">Rerun the script to rebuild the table. Incidents after the snapshot can shift the counts.</span>],
              ].map(([k, v], i) => (
                <div key={i} className="w-full flex flex-col gap-[12px]">
                  {i > 0 && <div className="bg-[#e3ddf0] h-px w-full" />}
                  <div className="flex items-start justify-between text-[12px] w-full gap-[16px]">
                    <p className="font-serif text-[#67626f] m-0 whitespace-nowrap">{k}</p>
                    {v}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
