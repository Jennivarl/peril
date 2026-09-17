import { Footer, Header } from "../components/Chrome";
import { ProviderIcon } from "../components/ProviderIcon";
import { day, gen, hours, readCovered, readPolicies, readProviderStatuses, todayUtc, type Policy, type ProviderStatus } from "../lib/chain";
import { FALLBACK_SERVICES, SEEN, SNAPSHOT, TIERS, serviceName } from "../lib/evidence";
import { usePolled } from "../lib/hooks";

/**
 * The landing page, wired to the live contract. Every figure is read from the
 * chain; the only fixed numbers are in the worked example, which says so, and
 * in the list of transactions this contract has already executed.
 */

const BADGE = {
  accent: "bg-accent-tint border-accent-line text-accent-text",
  info: "bg-[rgba(124,58,237,0.12)] border-[#6d28d9] text-[#5b21b6]",
  grey: "bg-[#e9e4f4] border-[#aca7b8] text-[#67626f]",
};

function policyStatus(p: Policy): { label: string; tone: keyof typeof BADGE } {
  if (p.state === "paid") return { label: "PAID", tone: "accent" };
  if (p.state === "closed") return { label: "CLOSED", tone: "grey" };
  const today = todayUtc();
  if (today < p.window_start) return { label: "PENDING", tone: "info" };
  if (today < p.window_end) return { label: "ACTIVE", tone: "accent" };
  return { label: "ENDED", tone: "grey" };
}

function StepTile({ n, title, children }: { n: string; title: string; children: string }) {
  return (
    <div className="peril-tile content-stretch flex flex-[1_0_0] flex-col gap-[12px] items-start min-w-px p-[28px] relative rounded-[12px]" data-name={`step-${n}`}>
      <p className="font-mono font-bold leading-[normal] peril-tile-num relative shrink-0 text-[11px] tracking-[0.12em] whitespace-nowrap m-0">STEP {n}</p>
      <p className="font-serif font-bold leading-[normal] not-italic relative shrink-0 text-[19px] m-0">{title}</p>
      <p className="font-serif font-normal leading-[22px] not-italic opacity-80 relative shrink-0 text-[14px] m-0">{children}</p>
    </div>
  );
}

function Check({ children }: { children: string }) {
  return (
    <li className="content-stretch flex gap-[10px] items-start relative shrink-0">
      <span className="peril-check mt-[2px]" aria-hidden="true">✓</span>
      <span className="font-serif font-normal leading-[22px] not-italic text-[#16141b] text-[15px]">{children}</span>
    </li>
  );
}

function LedgerNote({ children }: { children: string }) {
  return (
    <div className="border-[rgba(22,20,27,0.1)] border-t border-solid content-stretch flex items-start p-[16px] relative shrink-0 w-full">
      <p className="font-mono font-normal leading-[normal] relative text-[#67626f] text-[13px] m-0">{children}</p>
    </div>
  );
}

/**
 * The three claims the landing page makes. Each carries its own tint, rule and
 * numeral, and links to the page that backs it up, so the row is a set rather
 * than three identical boxes.
 */
const ARGUMENT = [
  {
    n: "01",
    title: "The provider is the source",
    body: "A claim is decided on the provider's own published incident, and every validator fetches that record separately before it counts.",
    link: "How a claim is decided",
    href: "#/how",
    bg: "#f4efff",
    edge: "linear-gradient(90deg, #6d28d9 0%, #a855f7 100%)",
    numeral: "rgba(109, 40, 217, 0.16)",
    ink: "#16141b",
    muted: "#67626f",
    accent: "#6d28d9",
  },
  {
    n: "02",
    title: "No claims process",
    body: "Anyone can file, including a stranger. If the fields clear the threshold you bought, nobody can refuse it or change who is paid.",
    link: "What it cannot do",
    href: "#/limits",
    bg: "#efe9fb",
    edge: "linear-gradient(90deg, #5b21b6 0%, #8b5cf6 100%)",
    numeral: "rgba(91, 33, 182, 0.16)",
    ink: "#16141b",
    muted: "#67626f",
    accent: "#6d28d9",
  },
  {
    n: "03",
    title: "Open capital, published price",
    body: "Anyone can fund the pool and earn premiums, and every price comes from twelve months of that provider's own history.",
    link: "Inside the pool",
    href: "#/pool",
    bg: "#16141b",
    edge: "linear-gradient(90deg, #a855f7 0%, #6d28d9 100%)",
    numeral: "rgba(196, 181, 253, 0.18)",
    ink: "#faf8fd",
    muted: "rgba(247, 243, 232, 0.7)",
    accent: "#c4b5fd",
  },
];

export default function Home() {
  const covers = usePolled(readCovered, 0);
  const policies = usePolled(readPolicies, 60000);
  // The providers' own status pages, read straight from the browser. These are
  // their words, not a claim by PERIL that anything is being monitored.
  // The board draws from the contract when it answers, and from the deployed
  // registry when it does not, so a rate limit never leaves the page blank.
  const board = covers.data ?? FALLBACK_SERVICES.map((f) => ({
    cover: f.cover,
    host: f.host,
    serious: [],
    max_window_days: 7,
    multiples: { [String(f.cheapest)]: f.multiple },
  }));

  // Hosts come from the board, not from the chain read: whether a provider's
  // status page answers has nothing to do with whether Studio Next did.
  const hosts = board.map((c) => c.host);
  const hostKey = hosts.join(",");
  const statuses = usePolled<Record<string, ProviderStatus>>(() => readProviderStatuses(hosts), 300000, [hostKey]);

  // True only when at least one provider actually answered just now.
  // How many of them say nothing is wrong, from their own pages.


  return (
    <div className="bg-[#faf8fd] content-stretch flex flex-col items-start min-h-screen mx-auto max-w-[1440px] relative size-full" data-name="peril-home">
      <Header active="/" />

      <div className="content-stretch flex flex-col gap-[26px] items-center px-[20px] lg:px-[120px] pt-[104px] pb-[56px] relative shrink-0 w-full" data-name="hero">
        <div className="peril-glow left-1/2 top-[0px] -translate-x-1/2 h-[420px] w-[820px]" aria-hidden="true" />
        <h1 className="[word-break:break-word] font-serif font-extrabold leading-[56px] not-italic relative shrink-0 text-[34px] lg:text-[48px] text-center text-[#16141b] max-w-[820px] m-0">
          Downtime cover, settled by pure arithmetic.
        </h1>
        <p className="[word-break:break-word] font-serif font-normal leading-[27px] not-italic relative shrink-0 text-[#67626f] text-[17px] text-center max-w-[620px] m-0">
          {"Cover for the services your work depends on. When one of them publishes an outage long enough to break the threshold you bought, the pool pays you."}
        </p>
        <div className="content-stretch flex gap-[24px] items-center mt-[14px] relative shrink-0 flex-wrap" data-name="hero-ctas">
          <a href="#/explore" className="peril-cta peril-cta-wide peril-cta-lg content-stretch flex items-start relative shrink-0 no-underline" data-name="cta-primary">
            EXPLORE COVERED SERVICES
          </a>
          <a href="#/pool" className="peril-link relative shrink-0 opacity-70 hover:opacity-100" data-name="cta-secondary">
            PROVIDE LIQUIDITY
          </a>
        </div>

      </div>

      <div className="content-stretch flex flex-col gap-[36px] items-center px-[20px] lg:px-[120px] pt-[52px] pb-[104px] relative shrink-0 w-full" data-name="argument">
        <div className="peril-glow left-[-160px] top-[20px] h-[400px] w-[520px]" aria-hidden="true" />
        <div className="content-stretch flex flex-col gap-[10px] items-center relative shrink-0">
          <h2 className="font-serif font-extrabold leading-[44px] not-italic relative shrink-0 text-[28px] lg:text-[37px] text-center text-[#16141b] max-w-[720px] m-0">
            {"What we took out of insurance."}
          </h2>
          <p className="font-serif font-normal leading-[24px] not-italic relative shrink-0 text-[#67626f] text-[15px] text-center max-w-[600px] m-0">
            {"Insurance keeps three things for itself: who takes the measurement, who holds the money, and who is allowed to say no. PERIL keeps none of them."}
          </p>
        </div>

        <div className="content-stretch flex gap-[22px] items-stretch relative shrink-0 w-full">
          {ARGUMENT.map((card) => (
            <div
              key={card.n}
              className="content-stretch flex flex-[1_0_0] flex-col gap-[10px] items-start min-w-px overflow-hidden p-[30px] peril-lift relative rounded-[18px]"
              style={{ background: card.bg }}
            >
              <span className="absolute h-[4px] left-0 top-0 w-full" style={{ background: card.edge }} aria-hidden="true" />
              <span
                className="absolute font-serif font-extrabold leading-none right-[22px] text-[58px] top-[20px]"
                style={{ color: card.numeral }}
                aria-hidden="true"
              >
                {card.n}
              </span>

              <p className="font-serif font-bold min-h-[52px] not-italic relative shrink-0 text-[18px] max-w-[220px] m-0" style={{ color: card.ink }}>
                {card.title}
              </p>
              <p className="flex-[1_0_0] font-serif font-normal leading-[21px] not-italic relative text-[14px] m-0" style={{ color: card.muted }}>
                {card.body}
              </p>
              <a
                href={card.href}
                className="font-mono font-bold relative shrink-0 text-[11px] no-underline whitespace-nowrap"
                style={{ color: card.accent }}
              >
                {`${card.link.toUpperCase()} →`}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/*
        The shape of each provider's own history, which is the whole basis of
        the price: how many incidents it rated major or critical ran past each
        length. Darker means it happened more often, and the rarer a length
        is, the larger the multiple sold on it. Counts are the snapshot in
        evidence.ts; nothing here is estimated.
      */}
      <div className="content-stretch flex flex-col items-center px-[20px] lg:px-[120px] pb-[104px] relative shrink-0 w-full overflow-x-auto" data-name="record-section">
        <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full max-w-[880px] min-w-[680px]" data-name="record">
          <div className="content-stretch flex items-baseline justify-between relative shrink-0 w-full">
            <p className="peril-card-title relative shrink-0 text-[12px] text-[#16141b] m-0">How long their outages actually run</p>
            <p className="font-mono relative shrink-0 text-[#787384] text-[11px] m-0">{SNAPSHOT.window.toUpperCase()}</p>
          </div>

          <div className="content-stretch flex gap-[10px] items-center pl-[186px] relative shrink-0 w-full">
            {TIERS.map((t) => (
              <p key={t} className="flex-[1_0_0] font-mono min-w-px relative text-[#787384] text-[11px] text-center m-0">{hours(t)}</p>
            ))}
            <span className="shrink-0 w-[92px]" />
          </div>

          <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
            {board.map((c) => {
              const seen = SEEN[c.cover] ?? {};
              const worst = Math.max(1, ...Object.values(SEEN).flatMap((r) => Object.values(r)));
              const live = statuses.data?.[c.host];
              const down = live !== undefined && live.indicator !== "none";
              const tiers = Object.keys(c.multiples).map(Number).sort((a, b) => a - b);
              return (
                <a
                  key={c.cover}
                  href="#/explore"
                  className="border-[rgba(22,20,27,0.08)] border-b border-solid content-stretch flex gap-[10px] items-center no-underline py-[9px] relative shrink-0 w-full"
                  title={live ? `${c.host} reports: ${live.description}` : c.host}
                  data-name={`record-${c.cover}`}
                >
                  <span className="content-stretch flex gap-[11px] items-center shrink-0 w-[176px]">
                    <span className="content-stretch flex items-center justify-center shrink-0 size-[24px]">
                      <ProviderIcon cover={c.cover} size={21} />
                    </span>
                    <span className="font-serif font-bold not-italic text-[15px] text-[#16141b]">{serviceName(c.cover)}</span>
                    <span
                      className={`${down ? "bg-[#7c3aed]" : live ? "bg-[rgba(22,20,27,0.28)]" : "bg-[rgba(22,20,27,0.1)]"} h-[6px] rounded-full shrink-0 w-[6px]`}
                      aria-hidden="true"
                    />
                  </span>

                  {TIERS.map((t) => {
                    const count = seen[t] ?? 0;
                    const alpha = count === 0 ? 0 : 0.2 + 0.8 * (count / worst);
                    return (
                      <span
                        key={t}
                        className={`${count === 0 ? "border border-[rgba(22,20,27,0.12)] border-dashed" : ""} flex-[1_0_0] content-stretch flex h-[38px] items-center justify-center min-w-px overflow-hidden relative rounded-[6px]`}
                        title={`${count} ran ${hours(t)} or longer`}
                      >
                        <span className="absolute inset-0 peril-grad-fill" style={{ opacity: alpha }} aria-hidden="true" />
                        <span className={`${count === 0 ? "text-[rgba(22,20,27,0.25)]" : "text-[#16141b]"} font-mono font-bold relative text-[13px]`}>{count}</span>
                      </span>
                    );
                  })}

                  <span className="font-mono shrink-0 text-[#787384] text-[11px] text-right w-[92px] whitespace-nowrap">
                    {tiers.length ? `SOLD FROM ${hours(tiers[0])}` : ""}
                  </span>
                </a>
              );
            })}
          </div>

          <p className="font-serif font-normal not-italic relative shrink-0 text-[#787384] text-[13px] max-w-[720px] m-0">
            {"Each cell is how many incidents the provider itself rated major or critical ran that long or longer. The rarer the length, the larger the multiple sold on it."}{" "}
            <a href="#/evidence" className="text-[#16141b] underline underline-offset-2">where these came from</a>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
