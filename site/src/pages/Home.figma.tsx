
export default function PerilHome() {
  return (
    <div className="bg-[#090a0c] content-stretch flex flex-col items-start relative size-full" data-name="peril-home">
      <div className="bg-[#121418] border-[#1e222a] border-b border-solid content-stretch flex h-[72px] items-center justify-between px-[40px] relative shrink-0 w-full" data-name="shared-header">
        <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="brand-group">
          <p className="[word-break:break-word] font-mono font-extrabold leading-[0] relative shrink-0 text-[22px] text-white whitespace-nowrap">
            <span className="leading-[normal]">PERIL</span>
            <span className="leading-[normal] text-accent-text">.</span>
          </p>
          <div className="bg-[#1c1f26] border border-[#1e222a] border-solid content-stretch flex gap-[6px] items-center px-[10px] py-[4px] relative rounded-[4px] shrink-0" data-name="network-tag">
            <div className="relative shrink-0 size-[8px]" data-name="pulse-dot">
              <span className="absolute block inset-0 max-w-none size-full rounded-full bg-accent-line peril-pulse" />
            </div>
            <p className="[word-break:break-word] font-mono font-normal leading-[normal] relative shrink-0 text-accent-text text-[11px] whitespace-nowrap">
              Chain ID: 4221 | GenLayer Bradbury
            </p>
          </div>
        </div>
        <div className="bg-[#090a0c] border border-[#1e222a] border-solid content-stretch flex gap-[4px] items-start p-[4px] relative rounded-[8px] shrink-0" data-name="nav-tabs">
          <div className="bg-[#121418] content-stretch flex items-start px-[16px] py-[8px] relative rounded-[6px] shrink-0" data-name="tab-home">
            <p className="[word-break:break-word] font-serif font-semibold leading-[normal] not-italic relative shrink-0 text-accent-text text-[13px] whitespace-nowrap">
              Home
            </p>
          </div>
          <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-start px-[16px] py-[8px] relative rounded-[6px] shrink-0" data-name="tab-buy">
            <p className="[word-break:break-word] font-serif font-normal leading-[normal] not-italic relative shrink-0 text-[#9ca3af] text-[13px] whitespace-nowrap">
              Buy Cover
            </p>
          </div>
          <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-start px-[16px] py-[8px] relative rounded-[6px] shrink-0" data-name="tab-my">
            <p className="[word-break:break-word] font-serif font-normal leading-[normal] not-italic relative shrink-0 text-[#9ca3af] text-[13px] whitespace-nowrap">
              My Cover
            </p>
          </div>
          <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-start px-[16px] py-[8px] relative rounded-[6px] shrink-0" data-name="tab-detail">
            <p className="[word-break:break-word] font-serif font-normal leading-[normal] not-italic relative shrink-0 text-[#9ca3af] text-[13px] whitespace-nowrap">
              The Pool
            </p>
          </div>
          <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-start px-[16px] py-[8px] relative rounded-[6px] shrink-0" data-name="tab-how">
            <p className="[word-break:break-word] font-serif font-normal leading-[normal] not-italic relative shrink-0 text-[#9ca3af] text-[13px] whitespace-nowrap">
              How It Works
            </p>
          </div>
          <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-start px-[16px] py-[8px] relative rounded-[6px] shrink-0" data-name="tab-evidence">
            <p className="[word-break:break-word] font-serif font-normal leading-[normal] not-italic relative shrink-0 text-[#9ca3af] text-[13px] whitespace-nowrap">
              Evidence
            </p>
          </div>
          <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-start px-[16px] py-[8px] relative rounded-[6px] shrink-0" data-name="tab-limits">
            <p className="[word-break:break-word] font-serif font-normal leading-[normal] not-italic relative shrink-0 text-[#9ca3af] text-[13px] whitespace-nowrap">
              Limits
            </p>
          </div>
        </div>
        <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="wallet-group">
          <div className="bg-[#161b22] border border-[#1e222a] border-solid content-stretch flex items-start px-[12px] py-[6px] relative rounded-[6px] shrink-0" data-name="balance-chip">
            <p className="[word-break:break-word] font-mono font-bold leading-[normal] relative shrink-0 text-[13px] text-white whitespace-nowrap">
              Free: 2.15 GEN
            </p>
          </div>
          <div className="bg-accent content-stretch flex items-start px-[16px] py-[8px] relative rounded-[6px] shrink-0" data-name="connect-btn">
            <p className="[word-break:break-word] font-mono font-bold leading-[normal] relative shrink-0 text-[#090a0c] text-[13px] whitespace-nowrap">
              0x7b...9E3c
            </p>
          </div>
        </div>
      </div>
      <div className="bg-[#090a0c] border-[#1e222a] border-b border-solid content-stretch flex items-center justify-between px-[40px] py-[10px] relative shrink-0 w-full" data-name="tx-tracker">
        <div className="[word-break:break-word] content-stretch flex font-mono font-normal gap-[8px] items-center leading-[normal] relative shrink-0 text-[11px] whitespace-nowrap" data-name="tracker-left">
          <p className="relative shrink-0 text-[#9ca3af] uppercase">
            CONSENSUS LIFECYCLE:
          </p>
          <p className="relative shrink-0 text-accent-text">
            0xef56...3a9c
          </p>
        </div>
        <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="tracker-steps">
          <div className="content-stretch flex items-center relative shrink-0" data-name="step-0">
            <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="step-dot-wrap">
              <div className="relative shrink-0 size-[6px]" data-name="step-dot">
                <span className="absolute block inset-0 max-w-none size-full rounded-full bg-accent-line" />
              </div>
              <p className="[word-break:break-word] font-mono font-normal leading-[normal] relative shrink-0 text-[#9ca3af] text-[11px] whitespace-nowrap">
                Pending
              </p>
            </div>
          </div>
          <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="step-1">
            <div className="bg-accent h-px relative shrink-0 w-[16px]" data-name="step-connector" />
            <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="step-dot-wrap">
              <div className="relative shrink-0 size-[6px]" data-name="step-dot">
                <span className="absolute block inset-0 max-w-none size-full rounded-full bg-accent-line" />
              </div>
              <p className="[word-break:break-word] font-mono font-normal leading-[normal] relative shrink-0 text-[#9ca3af] text-[11px] whitespace-nowrap">
                Proposing
              </p>
            </div>
          </div>
          <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="step-2">
            <div className="bg-[#1e222a] h-px relative shrink-0 w-[16px]" data-name="step-connector" />
            <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="step-dot-wrap">
              <div className="relative shrink-0 size-[6px]" data-name="step-dot">
                <span className="absolute block inset-0 max-w-none size-full rounded-full bg-accent-line" />
              </div>
              <p className="[word-break:break-word] font-mono font-normal leading-[normal] relative shrink-0 text-accent-text text-[11px] whitespace-nowrap">
                Committing
              </p>
            </div>
          </div>
          <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="step-3">
            <div className="bg-[#15171e] h-px relative shrink-0 w-[16px]" data-name="step-connector" />
            <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="step-dot-wrap">
              <div className="relative shrink-0 size-[6px]" data-name="step-dot">
                <span className="absolute block inset-0 max-w-none size-full rounded-full bg-[#4b5563]" />
              </div>
              <p className="[word-break:break-word] font-mono font-normal leading-[normal] relative shrink-0 text-[#4b5563] text-[11px] whitespace-nowrap">
                Revealing
              </p>
            </div>
          </div>
          <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="step-4">
            <div className="bg-[#15171e] h-px relative shrink-0 w-[16px]" data-name="step-connector" />
            <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="step-dot-wrap">
              <div className="relative shrink-0 size-[6px]" data-name="step-dot">
                <span className="absolute block inset-0 max-w-none size-full rounded-full bg-[#4b5563]" />
              </div>
              <p className="[word-break:break-word] font-mono font-normal leading-[normal] relative shrink-0 text-[#4b5563] text-[11px] whitespace-nowrap">
                LeaderReveal
              </p>
            </div>
          </div>
          <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="step-5">
            <div className="bg-[#15171e] h-px relative shrink-0 w-[16px]" data-name="step-connector" />
            <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="step-dot-wrap">
              <div className="relative shrink-0 size-[6px]" data-name="step-dot">
                <span className="absolute block inset-0 max-w-none size-full rounded-full bg-[#4b5563]" />
              </div>
              <p className="[word-break:break-word] font-mono font-normal leading-[normal] relative shrink-0 text-[#4b5563] text-[11px] whitespace-nowrap">
                Accepted
              </p>
            </div>
          </div>
          <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="step-6">
            <div className="bg-[#15171e] h-px relative shrink-0 w-[16px]" data-name="step-connector" />
            <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="step-dot-wrap">
              <div className="relative shrink-0 size-[6px]" data-name="step-dot">
                <span className="absolute block inset-0 max-w-none size-full rounded-full bg-[#4b5563]" />
              </div>
              <p className="[word-break:break-word] font-mono font-normal leading-[normal] relative shrink-0 text-[#4b5563] text-[11px] whitespace-nowrap">
                Finalize
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="content-stretch flex flex-col gap-[24px] items-center pb-[64px] pt-[80px] px-[120px] relative shrink-0 w-full" data-name="hero-section">
        <div className="bg-accent-tint border border-accent-line border-solid content-stretch flex items-start px-[12px] py-[4px] relative rounded-[100px] shrink-0" data-name="pill-tag">
          <p className="[word-break:break-word] font-mono font-bold leading-[normal] relative shrink-0 text-accent-text text-[12px] whitespace-nowrap">
            BLOCKCHAIN-NATIVE ORACLE SERVICE LEVEL AGREEMENTS
          </p>
        </div>
        <p className="[word-break:break-word] font-serif font-extrabold leading-[60px] not-italic relative shrink-0 text-[52px] text-center text-white w-[880px]">
          No claim forms. No assessors. Automated service downtime cover.
        </p>
        <p className="[word-break:break-word] font-serif font-normal leading-[28px] not-italic relative shrink-0 text-[#9ca3af] text-[18px] text-center w-[700px]">{`Secured by GenLayer's deterministic intelligent consensus. Smart contracts monitor public status APIs and execute sub-minute payouts directly to your wallet when threshold SLAs are breached.`}</p>
      </div>
      <div className="[word-break:break-word] content-stretch flex gap-[24px] items-start pb-[80px] px-[120px] relative shrink-0 w-full" data-name="principles-container">
        <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px p-[28px] relative rounded-[12px]" data-name="principle-01">
          <p className="font-mono font-extrabold leading-[normal] relative shrink-0 text-accent-text text-[14px] whitespace-nowrap">
            [01]
          </p>
          <p className="font-serif font-bold leading-[normal] not-italic relative shrink-0 text-[20px] text-white whitespace-nowrap">
            Parametric Triggers
          </p>
          <p className="font-serif font-normal leading-[22px] min-w-full not-italic relative shrink-0 text-[#9ca3af] text-[14px] w-[min-content]">
            Claims bypass human adjusters. Your policy is pre-coded to trigger immediately when public status page metrics show outage periods exceeding your selected limits.
          </p>
        </div>
        <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px p-[28px] relative rounded-[12px]" data-name="principle-02">
          <p className="font-mono font-extrabold leading-[normal] relative shrink-0 text-accent-text text-[14px] whitespace-nowrap">
            [02]
          </p>
          <p className="font-serif font-bold leading-[normal] not-italic relative shrink-0 text-[20px] text-white whitespace-nowrap">
            Deterministic Consensus
          </p>
          <p className="font-serif font-normal leading-[22px] min-w-full not-italic relative shrink-0 text-[#9ca3af] text-[14px] w-[min-content]">
            GenLayer Bradbury validators fetch, parse, and verify status page endpoints, forming absolute agreements over durations, impacts, and severity levels.
          </p>
        </div>
        <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px p-[28px] relative rounded-[12px]" data-name="principle-03">
          <p className="font-mono font-extrabold leading-[normal] relative shrink-0 text-accent-text text-[14px] whitespace-nowrap">
            [03]
          </p>
          <p className="font-serif font-bold leading-[normal] not-italic relative shrink-0 text-[20px] text-white whitespace-nowrap">
            Automatic Settlement
          </p>
          <p className="font-serif font-normal leading-[22px] min-w-full not-italic relative shrink-0 text-[#9ca3af] text-[14px] w-[min-content]">
            Once consensus is reached, funds are disbursed in GEN directly from our locked capital pools. Absolute predictability for DevOps risk management.
          </p>
        </div>
      </div>
      <div className="[word-break:break-word] bg-[#0d1117] border-[#1e222a] border-b border-solid border-t content-stretch flex items-start justify-between leading-[normal] px-[120px] py-[24px] relative shrink-0 w-full whitespace-nowrap" data-name="reserves-ribbon">
        <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0" data-name="stat-0">
          <p className="font-mono font-normal relative shrink-0 text-[#9ca3af] text-[11px]">
            TOTAL POOL SIZE
          </p>
          <p className="font-mono font-extrabold relative shrink-0 text-accent-text text-[24px]">
            4,500,000 GEN
          </p>
          <p className="font-serif font-normal not-italic relative shrink-0 text-[#4b5563] text-[12px]">
            $967,500 USD equivalent
          </p>
        </div>
        <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0" data-name="stat-1">
          <p className="font-mono font-normal relative shrink-0 text-[#9ca3af] text-[11px]">
            ACTIVE COVERAGE
          </p>
          <p className="font-mono font-extrabold relative shrink-0 text-accent-text text-[24px]">
            1,120,000 GEN
          </p>
          <p className="font-serif font-normal not-italic relative shrink-0 text-[#4b5563] text-[12px]">
            238 policy contracts live
          </p>
        </div>
        <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0" data-name="stat-2">
          <p className="font-mono font-normal relative shrink-0 text-[#9ca3af] text-[11px]">
            AVAILABLE CAPACITY
          </p>
          <p className="font-mono font-extrabold relative shrink-0 text-accent-text text-[24px]">
            3,380,000 GEN
          </p>
          <p className="font-serif font-normal not-italic relative shrink-0 text-[#4b5563] text-[12px]">
            92.4% pool capacity free
          </p>
        </div>
      </div>
      <div className="content-stretch flex flex-col gap-[24px] items-start pb-[40px] pt-[80px] px-[120px] relative shrink-0 w-full" data-name="matrix-section">
        <div className="[word-break:break-word] content-stretch flex items-center justify-between leading-[normal] relative shrink-0 w-full whitespace-nowrap" data-name="Frame">
          <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0" data-name="Frame">
            <p className="font-mono font-normal relative shrink-0 text-accent-text text-[12px]">
              AVAILABLE COVERAGE TARGETS
            </p>
            <p className="font-serif font-extrabold not-italic relative shrink-0 text-[28px] text-white">{`Supported Providers & Live Rates`}</p>
          </div>
          <p className="font-serif font-normal not-italic relative shrink-0 text-[#9ca3af] text-[14px]">
            Click provider to customize parameters
          </p>
        </div>
        <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full" data-name="shop-grid">
          <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px p-[24px] relative rounded-[12px]" data-name="shop-card-GitHub API">
            <div className="bg-[#1e222b] content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[40px]" data-name="card-icon">
              <p className="[word-break:break-word] font-mono font-extrabold leading-[normal] relative shrink-0 text-[14px] text-white whitespace-nowrap">
                GIT
              </p>
            </div>
            <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start leading-[normal] relative shrink-0 whitespace-nowrap" data-name="card-meta">
              <p className="font-serif font-bold not-italic relative shrink-0 text-[18px] text-white">
                GitHub API
              </p>
              <p className="font-mono font-normal relative shrink-0 text-[#9ca3af] text-[12px]">
                githubstatus.com
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full" data-name="badges-group">
              <div className="bg-[#201315] border border-[#ff3b30] border-solid content-stretch flex items-start px-[8px] py-[4px] relative rounded-[4px] shrink-0" data-name="badge-1">
                <p className="[word-break:break-word] font-mono font-normal leading-[normal] relative shrink-0 text-[#ff3b30] text-[11px] whitespace-nowrap">
                  77 outages / 12m
                </p>
              </div>
              <div className="bg-accent-deep border border-accent-line border-solid content-stretch flex items-start px-[8px] py-[4px] relative rounded-[4px] shrink-0" data-name="badge-2">
                <p className="[word-break:break-word] font-mono font-normal leading-[normal] relative shrink-0 text-accent-text text-[11px] whitespace-nowrap">
                  4h+ pays 2x
                </p>
              </div>
            </div>
            <div className="bg-[#1e222a] content-stretch flex items-start justify-center py-[10px] relative rounded-[6px] shrink-0 w-full" data-name="card-action">
              <p className="[word-break:break-word] font-mono font-bold leading-[normal] relative shrink-0 text-[12px] text-white whitespace-nowrap">
                GET COVER
              </p>
            </div>
          </div>
          <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px p-[24px] relative rounded-[12px]" data-name="shop-card-Discord">
            <div className="bg-[#1e222b] content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[40px]" data-name="card-icon">
              <p className="[word-break:break-word] font-mono font-extrabold leading-[normal] relative shrink-0 text-[14px] text-white whitespace-nowrap">
                DIS
              </p>
            </div>
            <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start leading-[normal] relative shrink-0 whitespace-nowrap" data-name="card-meta">
              <p className="font-serif font-bold not-italic relative shrink-0 text-[18px] text-white">
                Discord
              </p>
              <p className="font-mono font-normal relative shrink-0 text-[#9ca3af] text-[12px]">
                discordstatus.com
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full" data-name="badges-group">
              <div className="bg-[#201315] border border-[#ff3b30] border-solid content-stretch flex items-start px-[8px] py-[4px] relative rounded-[4px] shrink-0" data-name="badge-1">
                <p className="[word-break:break-word] font-mono font-normal leading-[normal] relative shrink-0 text-[#ff3b30] text-[11px] whitespace-nowrap">
                  142 outages / 31m
                </p>
              </div>
              <div className="bg-accent-deep border border-accent-line border-solid content-stretch flex items-start px-[8px] py-[4px] relative rounded-[4px] shrink-0" data-name="badge-2">
                <p className="[word-break:break-word] font-mono font-normal leading-[normal] relative shrink-0 text-accent-text text-[11px] whitespace-nowrap">
                  2h+ pays 3x
                </p>
              </div>
            </div>
            <div className="bg-[#1e222a] content-stretch flex items-start justify-center py-[10px] relative rounded-[6px] shrink-0 w-full" data-name="card-action">
              <p className="[word-break:break-word] font-mono font-bold leading-[normal] relative shrink-0 text-[12px] text-white whitespace-nowrap">
                GET COVER
              </p>
            </div>
          </div>
          <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px p-[24px] relative rounded-[12px]" data-name="shop-card-Vercel Platform">
            <div className="bg-[#1e222b] content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[40px]" data-name="card-icon">
              <p className="[word-break:break-word] font-mono font-extrabold leading-[normal] relative shrink-0 text-[14px] text-white whitespace-nowrap">
                VER
              </p>
            </div>
            <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start leading-[normal] relative shrink-0 whitespace-nowrap" data-name="card-meta">
              <p className="font-serif font-bold not-italic relative shrink-0 text-[18px] text-white">
                Vercel Platform
              </p>
              <p className="font-mono font-normal relative shrink-0 text-[#9ca3af] text-[12px]">
                vercel-status.com
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full" data-name="badges-group">
              <div className="bg-[#201315] border border-[#ff3b30] border-solid content-stretch flex items-start px-[8px] py-[4px] relative rounded-[4px] shrink-0" data-name="badge-1">
                <p className="[word-break:break-word] font-mono font-normal leading-[normal] relative shrink-0 text-[#ff3b30] text-[11px] whitespace-nowrap">
                  41 outages / 8m
                </p>
              </div>
              <div className="bg-accent-deep border border-accent-line border-solid content-stretch flex items-start px-[8px] py-[4px] relative rounded-[4px] shrink-0" data-name="badge-2">
                <p className="[word-break:break-word] font-mono font-normal leading-[normal] relative shrink-0 text-accent-text text-[11px] whitespace-nowrap">
                  1h+ pays 1.8x
                </p>
              </div>
            </div>
            <div className="bg-[#1e222a] content-stretch flex items-start justify-center py-[10px] relative rounded-[6px] shrink-0 w-full" data-name="card-action">
              <p className="[word-break:break-word] font-mono font-bold leading-[normal] relative shrink-0 text-[12px] text-white whitespace-nowrap">
                GET COVER
              </p>
            </div>
          </div>
          <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px p-[24px] relative rounded-[12px]" data-name="shop-card-Netlify Services">
            <div className="bg-[#1e222b] content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[40px]" data-name="card-icon">
              <p className="[word-break:break-word] font-mono font-extrabold leading-[normal] relative shrink-0 text-[14px] text-white whitespace-nowrap">
                NET
              </p>
            </div>
            <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start leading-[normal] relative shrink-0 whitespace-nowrap" data-name="card-meta">
              <p className="font-serif font-bold not-italic relative shrink-0 text-[18px] text-white">
                Netlify Services
              </p>
              <p className="font-mono font-normal relative shrink-0 text-[#9ca3af] text-[12px]">
                netlify-status.com
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full" data-name="badges-group">
              <div className="bg-[#201315] border border-[#ff3b30] border-solid content-stretch flex items-start px-[8px] py-[4px] relative rounded-[4px] shrink-0" data-name="badge-1">
                <p className="[word-break:break-word] font-mono font-normal leading-[normal] relative shrink-0 text-[#ff3b30] text-[11px] whitespace-nowrap">
                  59 outages / 18m
                </p>
              </div>
              <div className="bg-accent-deep border border-accent-line border-solid content-stretch flex items-start px-[8px] py-[4px] relative rounded-[4px] shrink-0" data-name="badge-2">
                <p className="[word-break:break-word] font-mono font-normal leading-[normal] relative shrink-0 text-accent-text text-[11px] whitespace-nowrap">
                  4h+ pays 2.5x
                </p>
              </div>
            </div>
            <div className="bg-[#1e222a] content-stretch flex items-start justify-center py-[10px] relative rounded-[6px] shrink-0 w-full" data-name="card-action">
              <p className="[word-break:break-word] font-mono font-bold leading-[normal] relative shrink-0 text-[12px] text-white whitespace-nowrap">
                GET COVER
              </p>
            </div>
          </div>
          <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px p-[24px] relative rounded-[12px]" data-name="shop-card-npm registry">
            <div className="bg-[#1e222b] content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[40px]" data-name="card-icon">
              <p className="[word-break:break-word] font-mono font-extrabold leading-[normal] relative shrink-0 text-[14px] text-white whitespace-nowrap">
                NPM
              </p>
            </div>
            <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start leading-[normal] relative shrink-0 whitespace-nowrap" data-name="card-meta">
              <p className="font-serif font-bold not-italic relative shrink-0 text-[18px] text-white">
                npm registry
              </p>
              <p className="font-mono font-normal relative shrink-0 text-[#9ca3af] text-[12px]">
                status.npmjs.org
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full" data-name="badges-group">
              <div className="bg-[#201315] border border-[#ff3b30] border-solid content-stretch flex items-start px-[8px] py-[4px] relative rounded-[4px] shrink-0" data-name="badge-1">
                <p className="[word-break:break-word] font-mono font-normal leading-[normal] relative shrink-0 text-[#ff3b30] text-[11px] whitespace-nowrap">
                  89 outages / 22m
                </p>
              </div>
              <div className="bg-accent-deep border border-accent-line border-solid content-stretch flex items-start px-[8px] py-[4px] relative rounded-[4px] shrink-0" data-name="badge-2">
                <p className="[word-break:break-word] font-mono font-normal leading-[normal] relative shrink-0 text-accent-text text-[11px] whitespace-nowrap">
                  2h+ pays 4x
                </p>
              </div>
            </div>
            <div className="bg-[#1e222a] content-stretch flex items-start justify-center py-[10px] relative rounded-[6px] shrink-0 w-full" data-name="card-action">
              <p className="[word-break:break-word] font-mono font-bold leading-[normal] relative shrink-0 text-[12px] text-white whitespace-nowrap">
                GET COVER
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="content-stretch flex flex-col gap-[20px] items-start pb-[80px] px-[120px] relative shrink-0 w-full" data-name="table-section">
        <p className="[word-break:break-word] font-mono font-normal leading-[normal] relative shrink-0 text-accent-text text-[12px] uppercase whitespace-nowrap">
          Active Ledger
        </p>
        <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-col items-start relative rounded-[12px] shrink-0 w-full" data-name="table-box">
          <div className="[word-break:break-word] bg-[#14171f] border border-[#1e222a] border-solid content-stretch flex font-serif font-semibold items-start leading-[normal] not-italic p-[16px] relative shrink-0 text-[#9ca3af] text-[13px] w-full" data-name="table-head">
            <p className="flex-[1_0_0] min-w-px relative">
              POLICY ID
            </p>
            <p className="flex-[1_0_0] min-w-px relative">
              PROVIDER
            </p>
            <p className="flex-[1_0_0] min-w-px relative">
              WINDOW (UTC)
            </p>
            <p className="flex-[1_0_0] min-w-px relative">
              LIMIT
            </p>
            <p className="flex-[1_0_0] min-w-px relative">
              PAYOUT
            </p>
            <p className="relative shrink-0 w-[100px]">
              STATUS
            </p>
          </div>
          <div className="border border-[#1e222a] border-solid content-stretch flex items-start p-[16px] relative shrink-0 w-full" data-name="row-0">
            <p className="[word-break:break-word] flex-[1_0_0] font-mono font-normal leading-[normal] min-w-px relative text-[13px] text-white">
              github-w38
            </p>
            <p className="[word-break:break-word] flex-[1_0_0] font-serif font-normal leading-[normal] min-w-px not-italic relative text-[13px] text-white">
              GitHub Status API
            </p>
            <p className="[word-break:break-word] flex-[1_0_0] font-mono font-normal leading-[normal] min-w-px relative text-[#9ca3af] text-[13px]">
              Sep 15 - Sep 22 UTC
            </p>
            <p className="[word-break:break-word] flex-[1_0_0] font-mono font-normal leading-[normal] min-w-px relative text-[#9ca3af] text-[13px]">
              240 mins
            </p>
            <p className="[word-break:break-word] flex-[1_0_0] font-mono font-bold leading-[normal] min-w-px relative text-accent-text text-[13px]">
              5,000 GEN
            </p>
            <div className="content-stretch flex items-start relative shrink-0 w-[100px]" data-name="td-6">
              <div className="bg-accent-tint border border-accent-line border-solid content-stretch flex items-start px-[8px] py-[2px] relative rounded-[4px] shrink-0" data-name="Frame">
                <p className="[word-break:break-word] font-mono font-normal leading-[normal] relative shrink-0 text-accent-text text-[11px] whitespace-nowrap">
                  ACTIVE
                </p>
              </div>
            </div>
          </div>
          <div className="border border-[#1e222a] border-solid content-stretch flex items-start p-[16px] relative shrink-0 w-full" data-name="row-1">
            <p className="[word-break:break-word] flex-[1_0_0] font-mono font-normal leading-[normal] min-w-px relative text-[13px] text-white">
              discord-w38
            </p>
            <p className="[word-break:break-word] flex-[1_0_0] font-serif font-normal leading-[normal] min-w-px not-italic relative text-[13px] text-white">
              Discord Service
            </p>
            <p className="[word-break:break-word] flex-[1_0_0] font-mono font-normal leading-[normal] min-w-px relative text-[#9ca3af] text-[13px]">
              Sep 15 - Sep 22 UTC
            </p>
            <p className="[word-break:break-word] flex-[1_0_0] font-mono font-normal leading-[normal] min-w-px relative text-[#9ca3af] text-[13px]">
              120 mins
            </p>
            <p className="[word-break:break-word] flex-[1_0_0] font-mono font-bold leading-[normal] min-w-px relative text-accent-text text-[13px]">
              3,200 GEN
            </p>
            <div className="content-stretch flex items-start relative shrink-0 w-[100px]" data-name="td-6">
              <div className="bg-accent-tint border border-accent-line border-solid content-stretch flex items-start px-[8px] py-[2px] relative rounded-[4px] shrink-0" data-name="Frame">
                <p className="[word-break:break-word] font-mono font-normal leading-[normal] relative shrink-0 text-accent-text text-[11px] whitespace-nowrap">
                  ACTIVE
                </p>
              </div>
            </div>
          </div>
          <div className="border border-[#1e222a] border-solid content-stretch flex items-start p-[16px] relative shrink-0 w-full" data-name="row-2">
            <p className="[word-break:break-word] flex-[1_0_0] font-mono font-normal leading-[normal] min-w-px relative text-[13px] text-white">
              vercel-w38
            </p>
            <p className="[word-break:break-word] flex-[1_0_0] font-serif font-normal leading-[normal] min-w-px not-italic relative text-[13px] text-white">
              Vercel Edge Platform
            </p>
            <p className="[word-break:break-word] flex-[1_0_0] font-mono font-normal leading-[normal] min-w-px relative text-[#9ca3af] text-[13px]">
              Sep 18 - Sep 25 UTC
            </p>
            <p className="[word-break:break-word] flex-[1_0_0] font-mono font-normal leading-[normal] min-w-px relative text-[#9ca3af] text-[13px]">
              60 mins
            </p>
            <p className="[word-break:break-word] flex-[1_0_0] font-mono font-bold leading-[normal] min-w-px relative text-accent-text text-[13px]">
              1,500 GEN
            </p>
            <div className="content-stretch flex items-start relative shrink-0 w-[100px]" data-name="td-6">
              <div className="bg-[rgba(138,180,248,0.1)] border border-[#8ab4f8] border-solid content-stretch flex items-start px-[8px] py-[2px] relative rounded-[4px] shrink-0" data-name="Frame">
                <p className="[word-break:break-word] font-mono font-normal leading-[normal] relative shrink-0 text-[#8ab4f8] text-[11px] whitespace-nowrap">
                  PENDING
                </p>
              </div>
            </div>
          </div>
          <div className="border border-[#1e222a] border-solid content-stretch flex items-start p-[16px] relative shrink-0 w-full" data-name="row-3">
            <p className="[word-break:break-word] flex-[1_0_0] font-mono font-normal leading-[normal] min-w-px relative text-[13px] text-white">
              netlify-w38
            </p>
            <p className="[word-break:break-word] flex-[1_0_0] font-serif font-normal leading-[normal] min-w-px not-italic relative text-[13px] text-white">
              Netlify Deployer
            </p>
            <p className="[word-break:break-word] flex-[1_0_0] font-mono font-normal leading-[normal] min-w-px relative text-[#9ca3af] text-[13px]">
              Sep 19 - Sep 26 UTC
            </p>
            <p className="[word-break:break-word] flex-[1_0_0] font-mono font-normal leading-[normal] min-w-px relative text-[#9ca3af] text-[13px]">
              240 mins
            </p>
            <p className="[word-break:break-word] flex-[1_0_0] font-mono font-bold leading-[normal] min-w-px relative text-accent-text text-[13px]">
              8,000 GEN
            </p>
            <div className="content-stretch flex items-start relative shrink-0 w-[100px]" data-name="td-6">
              <div className="bg-accent-tint border border-accent-line border-solid content-stretch flex items-start px-[8px] py-[2px] relative rounded-[4px] shrink-0" data-name="Frame">
                <p className="[word-break:break-word] font-mono font-normal leading-[normal] relative shrink-0 text-accent-text text-[11px] whitespace-nowrap">
                  ACTIVE
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="[word-break:break-word] content-stretch flex flex-col gap-[20px] items-start pb-[80px] px-[120px] relative shrink-0 w-full" data-name="execution-strip">
        <p className="font-mono font-normal leading-[normal] relative shrink-0 text-accent-text text-[12px] uppercase whitespace-nowrap">
          Consensus Execution Workflow
        </p>
        <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full" data-name="strip-blocks">
          <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[12px] items-start min-w-px p-[20px] relative rounded-[8px]" data-name="step-card-01">
            <div className="content-stretch flex items-center justify-between leading-[normal] relative shrink-0 w-full whitespace-nowrap" data-name="Frame">
              <p className="font-serif font-extrabold not-italic relative shrink-0 text-[14px] text-white">
                Fetch Status Page
              </p>
              <p className="font-mono font-normal relative shrink-0 text-accent-text text-[12px]">
                [01]
              </p>
            </div>
            <p className="font-serif font-normal leading-[18px] not-italic relative shrink-0 text-[#9ca3af] text-[13px] w-full">
              GenLayer smart oracle triggers scheduled requests targeting endpoints.
            </p>
          </div>
          <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[12px] items-start min-w-px p-[20px] relative rounded-[8px]" data-name="step-card-02">
            <div className="content-stretch flex items-center justify-between leading-[normal] relative shrink-0 w-full whitespace-nowrap" data-name="Frame">
              <p className="font-serif font-extrabold not-italic relative shrink-0 text-[14px] text-white">{`Read Rating & Times`}</p>
              <p className="font-mono font-normal relative shrink-0 text-accent-text text-[12px]">
                [02]
              </p>
            </div>
            <p className="font-serif font-normal leading-[18px] not-italic relative shrink-0 text-[#9ca3af] text-[13px] w-full">
              Validators parse incident timestamps and verify impact severity levels.
            </p>
          </div>
          <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[12px] items-start min-w-px p-[20px] relative rounded-[8px]" data-name="step-card-03">
            <div className="content-stretch flex items-center justify-between leading-[normal] relative shrink-0 w-full whitespace-nowrap" data-name="Frame">
              <p className="font-serif font-extrabold not-italic relative shrink-0 text-[14px] text-white">
                Calculate Duration
              </p>
              <p className="font-mono font-normal relative shrink-0 text-accent-text text-[12px]">
                [03]
              </p>
            </div>
            <p className="font-serif font-normal leading-[18px] not-italic relative shrink-0 text-[#9ca3af] text-[13px] w-full">
              Incident durations are mathematically evaluated in deterministic consensus.
            </p>
          </div>
          <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[12px] items-start min-w-px p-[20px] relative rounded-[8px]" data-name="step-card-04">
            <div className="content-stretch flex items-center justify-between leading-[normal] relative shrink-0 w-full whitespace-nowrap" data-name="Frame">
              <p className="font-serif font-extrabold not-italic relative shrink-0 text-[14px] text-white">
                Disburse Payout
              </p>
              <p className="font-mono font-normal relative shrink-0 text-accent-text text-[12px]">
                [04]
              </p>
            </div>
            <p className="font-serif font-normal leading-[18px] not-italic relative shrink-0 text-[#9ca3af] text-[13px] w-full">
              GEN is disbursed immediately from pool lockboxes to target wallet.
            </p>
          </div>
        </div>
      </div>
      <div className="[word-break:break-word] bg-[#121418] border-[#1e222a] border-solid border-t content-stretch flex font-mono font-normal items-center justify-between leading-[normal] px-[40px] py-[32px] relative shrink-0 text-[12px] w-full whitespace-nowrap" data-name="footer">
        <p className="relative shrink-0 text-[#9ca3af]">
          PERIL Parametric Downtime Protection © 2026. GenLayer Bradbury Testnet Deployment.
        </p>
        <p className="relative shrink-0 text-[#4b5563]">
          Contract Address: 0x6284f...a81e
        </p>
      </div>
    </div>
  );
}
