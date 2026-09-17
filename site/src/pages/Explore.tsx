import { Footer, Header } from "../components/Chrome";
import { ProviderIcon } from "../components/ProviderIcon";
import { gen, hours, readCovered, readProviderStatuses, readReserves, type ProviderStatus } from "../lib/chain";
import { FALLBACK_SERVICES, SERIOUS_OUTAGES_12M, serviceName } from "../lib/evidence";
import { usePolled } from "../lib/hooks";

/**
 * The catalogue: every service on sale and every length it is sold at, priced
 * from the contract itself. Each row links into Buy Cover with that pair
 * already chosen, so picking here means the form opens filled in.
 *
 * Nothing on this page is written by hand: the services, the thresholds and
 * the multiples all come from covered(), and the capacity check compares a
 * row against the pool's free funds as the contract would.
 */

export default function Explore() {
  const covers = usePolled(readCovered, 0);
  const reserves = usePolled(readReserves, 60000);
  // Hosts come from the deployed registry when the chain has not answered, so
  // the providers' own status pages are read either way.
  const hosts = (covers.data ?? FALLBACK_SERVICES).map((c) => c.host);
  const hostKey = hosts.join(",");
  const statuses = usePolled<Record<string, ProviderStatus>>(() => readProviderStatuses(hosts), 300000, [hostKey]);

  const free = reserves.data ? BigInt(reserves.data.free) : null;

  /**
   * The largest premium the pool could back at this multiple, mirroring the
   * contract's own solvency rule: pool + premium - locked >= premium * multiple.
   */
  const ceiling = (multiple: number): bigint | null => (free === null || multiple <= 1 ? null : free / BigInt(multiple - 1));

  return (
    <div className="bg-[#faf8fd] content-stretch flex flex-col items-start min-h-screen mx-auto max-w-[1440px] relative size-full" data-name="peril-explore">
      <Header active="/explore" />

      <div className="content-stretch flex flex-col gap-[16px] items-start px-[120px] pt-[56px] pb-[24px] relative shrink-0 w-full" data-name="explore-hero">
        <h1 className="font-serif font-extrabold leading-[52px] not-italic relative shrink-0 text-[44px] text-[#16141b] max-w-[820px] m-0">
          What you can cover
        </h1>
        <p className="font-serif font-normal leading-[26px] not-italic relative shrink-0 text-[#67626f] text-[17px] max-w-[680px] m-0">
          {"Five services, each sold at the outage lengths its own history can price. Pick a row and the form opens with that service and length already chosen."}
        </p>
        <div className="content-stretch flex gap-[24px] items-center relative shrink-0" data-name="explore-meta">
          <p className="font-mono relative shrink-0 text-[#67626f] text-[12px] m-0">
            POOL CAPACITY NOW: <span className="font-bold text-[#16141b]">{reserves.data ? `${gen(reserves.data.free)} GEN` : reserves.error ? "unavailable" : "…"}</span>
          </p>
          <a href="#/evidence" className="font-mono relative shrink-0 text-[#16141b] text-[12px] underline underline-offset-4 opacity-70 hover:opacity-100">
            HOW THESE PRICES WERE SET
          </a>
        </div>
      </div>

      <div className="content-stretch flex flex-col gap-[20px] items-start pb-[128px] px-[120px] relative shrink-0 w-full" data-name="catalogue">
        {!covers.data && (
          <p className="font-mono text-[#67626f] text-[13px] m-0">
            {covers.error ? `Could not read the price list from Studio Next: ${covers.error}` : "Reading the price list from Studio Next…"}
          </p>
        )}

        {/*
          One card per service rather than one row: a narrow card cannot carry
          the old four column table, so each tier keeps the two figures that
          decide a purchase (how long, what it pays) and the pool's ceiling
          moves to a single line at the foot of the card.
        */}
        <div className="gap-[20px] grid grid-cols-1 items-stretch lg:grid-cols-3 md:grid-cols-2 relative shrink-0 w-full" data-name="catalogue-grid">
          {covers.data?.map((c) => {
            const tiers = Object.keys(c.multiples).map(Number).sort((a, b) => a - b);
            const live = statuses.data?.[c.host];
            const calm = live?.indicator === "none";
            const cheapest = tiers.length ? ceiling(c.multiples[String(tiers[0])]) : null;
            return (
              <div key={c.cover} className="peril-glass border border-solid content-stretch flex flex-col h-full items-start overflow-hidden relative rounded-[14px]" data-name={`service-${c.cover}`}>
                <div className="content-stretch flex flex-col gap-[12px] items-start px-[20px] py-[18px] relative shrink-0 w-full" data-name="service-head">
                  <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full">
                    <div className="bg-[rgba(22,20,27,0.05)] border border-[rgba(22,20,27,0.12)] border-solid content-stretch flex items-center justify-center relative rounded-[10px] shrink-0 size-[40px]">
                      <ProviderIcon cover={c.cover} />
                    </div>
                    <div className="content-stretch flex flex-col gap-[1px] items-start min-w-px relative">
                      <p className="font-serif font-bold not-italic relative shrink-0 text-[18px] text-[#16141b] m-0">{serviceName(c.cover)}</p>
                      <p className="font-mono relative shrink-0 text-[#67626f] text-[11px] m-0 truncate">{c.host}</p>
                    </div>
                  </div>

                  <div className="content-stretch flex flex-wrap gap-[6px] items-center relative shrink-0">
                    {live && (
                      <span
                        className={`${calm ? "border-[rgba(22,20,27,0.22)] text-[#16141b]" : "border-[#6d28d9] text-[#5b21b6]"} border border-solid content-stretch flex gap-[6px] items-center px-[9px] py-[2px] relative rounded-[100px] shrink-0`}
                        title={`${c.host} reports: ${live.description}`}
                      >
                        <span className={calm ? "peril-live-dot" : "bg-[#7c3aed] h-[6px] inline-block rounded-full w-[6px]"} aria-hidden="true" />
                        <span className="font-mono text-[10px] whitespace-nowrap">{live.description.toUpperCase()}</span>
                      </span>
                    )}
                    <span className="border border-[#6d28d9] border-solid font-mono px-[9px] py-[2px] rounded-[100px] text-[#5b21b6] text-[10px] whitespace-nowrap" title="Incidents this provider itself rated major or critical in the last 12 months">
                      {SERIOUS_OUTAGES_12M[c.cover] ?? "?"} SERIOUS / 12 MO
                    </span>
                  </div>
                </div>

                <div className="bg-[rgba(22,20,27,0.03)] border-[rgba(22,20,27,0.1)] border-t border-solid content-stretch flex font-mono items-center px-[20px] py-[8px] relative shrink-0 text-[#67626f] text-[10px] w-full">
                  <p className="flex-[1_0_0] min-w-px m-0">OUTAGE COVERED</p>
                  <p className="shrink-0 w-[56px] m-0">PAYS</p>
                  <p className="shrink-0 w-[104px] m-0" />
                </div>

                <div className="max-h-[192px] overflow-y-auto peril-scroll relative shrink-0 w-full" data-name="tier-scroll">
                  {tiers.map((t) => {
                    const multiple = c.multiples[String(t)];
                    return (
                      <div key={t} className="border-[rgba(22,20,27,0.1)] border-t border-solid content-stretch flex gap-[8px] items-center px-[20px] py-[11px] relative shrink-0 w-full hover:bg-[rgba(22,20,27,0.03)]" data-name={`tier-${t}`}>
                        <p className="flex-[1_0_0] font-serif font-bold min-w-px not-italic relative text-[14px] text-[#16141b] m-0" title={`1 GEN premium returns ${multiple}.00 GEN`}>
                          {hours(t)} or longer
                        </p>
                        <p className="font-mono font-extrabold relative shrink-0 text-[17px] w-[56px] m-0"><span className="peril-grad-text">{multiple}x</span></p>
                        <a
                          href={`#/buy?cover=${c.cover}&tier=${t}`}
                          className="peril-cta content-stretch flex font-mono font-bold items-center justify-center px-[10px] py-[7px] relative rounded-[100px] shrink-0 text-[10px] w-[104px] whitespace-nowrap no-underline"
                        >
                          GET COVER
                        </a>
                      </div>
                    );
                  })}
                </div>

                <p className="border-[rgba(22,20,27,0.1)] border-t border-solid font-mono mt-auto px-[20px] py-[10px] relative shrink-0 text-[#787384] text-[10px] w-full m-0" title="Premium above this could not be paid out in full from free funds">
                  {cheapest === null ? "POOL CEILING: …" : `MOST THE POOL COULD BACK: ${gen(cheapest, 2)} GEN PREMIUM`}
                </p>
              </div>
            );
          })}
        </div>

        {/*
          The three rules that decide whether a policy can pay, given the width
          of the page instead of crammed into two lines under the grid.
        */}
        <div className="border-[rgba(22,20,27,0.12)] border-t border-solid gap-[24px] grid grid-cols-1 md:grid-cols-3 mt-[56px] pt-[36px] relative shrink-0 w-full" data-name="terms">
          {[
            { head: "What counts", body: "Only outages the provider itself rated major or critical." },
            { head: "When it starts", body: "Cover starts the day after you buy it, so an outage already under way cannot be insured." },
            { head: "How long it runs", body: "A window runs at most seven days." },
          ].map((rule) => (
            <div key={rule.head} className="content-stretch flex flex-col gap-[6px] items-center relative shrink-0 text-center">
              <p className="peril-card-title relative shrink-0 text-[11px] text-[#16141b] m-0">{rule.head}</p>
              <p className="font-serif leading-[20px] not-italic relative shrink-0 text-[#67626f] text-[13px] text-center max-w-[300px] m-0">{rule.body}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
