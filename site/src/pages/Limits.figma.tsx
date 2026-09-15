
export default function PerilLimits() {
  return (
    <div className="bg-[#090a0c] content-stretch flex flex-col items-start relative size-full" data-name="peril-limits">
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
          <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-start px-[16px] py-[8px] relative rounded-[6px] shrink-0" data-name="tab-home">
            <p className="[word-break:break-word] font-serif font-normal leading-[normal] not-italic relative shrink-0 text-[#9ca3af] text-[13px] whitespace-nowrap">
              Home
            </p>
          </div>
          <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-start px-[16px] py-[8px] relative rounded-[6px] shrink-0" data-name="tab-buy-cover">
            <p className="[word-break:break-word] font-serif font-normal leading-[normal] not-italic relative shrink-0 text-[#9ca3af] text-[13px] whitespace-nowrap">
              Buy Cover
            </p>
          </div>
          <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-start px-[16px] py-[8px] relative rounded-[6px] shrink-0" data-name="tab-my-cover">
            <p className="[word-break:break-word] font-serif font-normal leading-[normal] not-italic relative shrink-0 text-[#9ca3af] text-[13px] whitespace-nowrap">
              My Cover
            </p>
          </div>
          <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-start px-[16px] py-[8px] relative rounded-[6px] shrink-0" data-name="tab-the-pool">
            <p className="[word-break:break-word] font-serif font-normal leading-[normal] not-italic relative shrink-0 text-[#9ca3af] text-[13px] whitespace-nowrap">
              The Pool
            </p>
          </div>
          <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-start px-[16px] py-[8px] relative rounded-[6px] shrink-0" data-name="tab-how-it-works">
            <p className="[word-break:break-word] font-serif font-normal leading-[normal] not-italic relative shrink-0 text-[#9ca3af] text-[13px] whitespace-nowrap">
              How It Works
            </p>
          </div>
          <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-start px-[16px] py-[8px] relative rounded-[6px] shrink-0" data-name="tab-evidence">
            <p className="[word-break:break-word] font-serif font-normal leading-[normal] not-italic relative shrink-0 text-[#9ca3af] text-[13px] whitespace-nowrap">
              Evidence
            </p>
          </div>
          <div className="bg-[#121418] content-stretch flex items-start px-[16px] py-[8px] relative rounded-[6px] shrink-0" data-name="tab-limits">
            <p className="[word-break:break-word] font-serif font-semibold leading-[normal] not-italic relative shrink-0 text-accent-text text-[13px] whitespace-nowrap">
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
            <div className="bg-accent h-px relative shrink-0 w-[16px]" data-name="step-connector" />
            <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="step-dot-wrap">
              <div className="relative shrink-0 size-[6px]" data-name="step-dot">
                <span className="absolute block inset-0 max-w-none size-full rounded-full bg-accent-line" />
              </div>
              <p className="[word-break:break-word] font-mono font-normal leading-[normal] relative shrink-0 text-[#9ca3af] text-[11px] whitespace-nowrap">
                Committing
              </p>
            </div>
          </div>
          <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="step-3">
            <div className="bg-accent h-px relative shrink-0 w-[16px]" data-name="step-connector" />
            <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="step-dot-wrap">
              <div className="relative shrink-0 size-[6px]" data-name="step-dot">
                <span className="absolute block inset-0 max-w-none size-full rounded-full bg-accent-line" />
              </div>
              <p className="[word-break:break-word] font-mono font-normal leading-[normal] relative shrink-0 text-accent-text text-[11px] whitespace-nowrap">
                Accepted
              </p>
            </div>
          </div>
          <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="step-4">
            <div className="bg-[#1e222a] h-px relative shrink-0 w-[16px]" data-name="step-connector" />
            <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="step-dot-wrap">
              <div className="relative shrink-0 size-[6px]" data-name="step-dot">
                <span className="absolute block inset-0 max-w-none size-full rounded-full bg-[#4b5563]" />
              </div>
              <p className="[word-break:break-word] font-mono font-normal leading-[normal] relative shrink-0 text-[#4b5563] text-[11px] whitespace-nowrap">
                Finalized
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="content-stretch flex flex-col gap-[20px] items-start pb-[40px] pt-[64px] px-[120px] relative shrink-0 w-full" data-name="limits-hero">
        <div className="bg-[rgba(138,180,248,0.1)] border border-[#8ab4f8] border-solid content-stretch flex items-start px-[12px] py-[4px] relative rounded-[100px] shrink-0" data-name="pill-tag">
          <p className="[word-break:break-word] font-mono font-bold leading-[normal] relative shrink-0 text-[#8ab4f8] text-[11px] whitespace-nowrap">{`STRICT SECURITY BOUNDARIES & TESTNET GUIDELINES`}</p>
        </div>
        <p className="[word-break:break-word] font-serif font-extrabold leading-[normal] min-w-full not-italic relative shrink-0 text-[42px] text-white w-[min-content]">{`Protocol Boundaries & Limits`}</p>
        <p className="[word-break:break-word] font-serif font-normal leading-[24px] not-italic relative shrink-0 text-[#9ca3af] text-[16px] w-[840px]">
          Parametric coverage is fast, deterministic, and highly predictable—but it operates under strict boundary constraints. Review our retry, consensus, and non-economic testnet limitations below before provisioning cover.
        </p>
      </div>
      <div className="content-stretch flex flex-col gap-[24px] items-start pb-[64px] px-[120px] relative shrink-0 w-full" data-name="boundaries-container">
        <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-col gap-[20px] items-start p-[28px] relative rounded-[12px] shrink-0 w-full" data-name="boundary-card-0">
          <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Frame">
            <div className="[word-break:break-word] content-stretch flex gap-[8px] items-center leading-[normal] relative shrink-0 whitespace-nowrap" data-name="Frame">
              <p className="font-mono font-extrabold relative shrink-0 text-accent-text text-[14px]">
                [01]
              </p>
              <p className="font-serif font-bold not-italic relative shrink-0 text-[20px] text-white">
                Oracle Dependence on Status Pages
              </p>
            </div>
            <div className="bg-[rgba(138,180,248,0.1)] border border-[#8ab4f8] border-solid content-stretch flex items-start px-[10px] py-[4px] relative rounded-[4px] shrink-0" data-name="Frame">
              <p className="[word-break:break-word] font-mono font-normal leading-[normal] relative shrink-0 text-[#8ab4f8] text-[11px] whitespace-nowrap">
                MEDIUM SEVERITY RISK
              </p>
            </div>
          </div>
          <div className="[word-break:break-word] content-stretch flex font-normal gap-[32px] items-start relative shrink-0 w-full" data-name="boundary-content">
            <div className="content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-start min-w-px relative" data-name="Frame">
              <p className="font-mono leading-[normal] relative shrink-0 text-[#9ca3af] text-[11px] whitespace-nowrap">
                WHAT CAN HAPPEN
              </p>
              <p className="font-serif leading-[20px] min-w-full not-italic relative shrink-0 text-[14px] text-white w-[min-content]">{`If a provider status page fails to update during an actual incident, the contract won't trigger automatically.`}</p>
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-start min-w-px relative" data-name="Frame">
              <p className="font-mono leading-[normal] relative shrink-0 text-[#9ca3af] text-[11px] whitespace-nowrap">
                HOW PERIL RESPONDS
              </p>
              <p className="font-serif leading-[20px] min-w-full not-italic relative shrink-0 text-[14px] text-white w-[min-content]">
                PERIL utilizes historical backup status caches but requires eventually consistent official public logs for settlement.
              </p>
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-start min-w-px relative" data-name="Frame">
              <p className="font-mono leading-[normal] relative shrink-0 text-[#9ca3af] text-[11px] whitespace-nowrap">
                WHAT USERS SHOULD ASSUME
              </p>
              <p className="font-serif leading-[20px] min-w-full not-italic relative shrink-0 text-[14px] text-white w-[min-content]">
                Users must assume that manual updates on official channels are the absolute truth.
              </p>
            </div>
          </div>
        </div>
        <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-col gap-[20px] items-start p-[28px] relative rounded-[12px] shrink-0 w-full" data-name="boundary-card-1">
          <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Frame">
            <div className="[word-break:break-word] content-stretch flex gap-[8px] items-center leading-[normal] relative shrink-0 whitespace-nowrap" data-name="Frame">
              <p className="font-mono font-extrabold relative shrink-0 text-accent-text text-[14px]">
                [02]
              </p>
              <p className="font-serif font-bold not-italic relative shrink-0 text-[20px] text-white">
                Unreachable Status Page Handling
              </p>
            </div>
            <div className="bg-accent-tint border border-accent-line border-solid content-stretch flex items-start px-[10px] py-[4px] relative rounded-[4px] shrink-0" data-name="Frame">
              <p className="[word-break:break-word] font-mono font-normal leading-[normal] relative shrink-0 text-accent-text text-[11px] whitespace-nowrap">
                HIGH RESILIENCE ACTION
              </p>
            </div>
          </div>
          <div className="[word-break:break-word] content-stretch flex font-normal gap-[32px] items-start relative shrink-0 w-full" data-name="boundary-content">
            <div className="content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-start min-w-px relative" data-name="Frame">
              <p className="font-mono leading-[normal] relative shrink-0 text-[#9ca3af] text-[11px] whitespace-nowrap">
                WHAT CAN HAPPEN
              </p>
              <p className="font-serif leading-[20px] min-w-full not-italic relative shrink-0 text-[14px] text-white w-[min-content]">
                The status page endpoint becomes unreachable or times out during a massive network split.
              </p>
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-start min-w-px relative" data-name="Frame">
              <p className="font-mono leading-[normal] relative shrink-0 text-[#9ca3af] text-[11px] whitespace-nowrap">
                HOW PERIL RESPONDS
              </p>
              <p className="font-serif leading-[20px] min-w-full not-italic relative shrink-0 text-[14px] text-white w-[min-content]">
                GenLayer validators initiate automatic 5-minute retry intervals, cascading backoffs, and fallback checks.
              </p>
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-start min-w-px relative" data-name="Frame">
              <p className="font-mono leading-[normal] relative shrink-0 text-[#9ca3af] text-[11px] whitespace-nowrap">
                WHAT USERS SHOULD ASSUME
              </p>
              <p className="font-serif leading-[20px] min-w-full not-italic relative shrink-0 text-[14px] text-white w-[min-content]">
                Allow up to 30 minutes for consensus resolution during severe global network degradation.
              </p>
            </div>
          </div>
        </div>
        <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-col gap-[20px] items-start p-[28px] relative rounded-[12px] shrink-0 w-full" data-name="boundary-card-2">
          <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Frame">
            <div className="[word-break:break-word] content-stretch flex gap-[8px] items-center leading-[normal] relative shrink-0 whitespace-nowrap" data-name="Frame">
              <p className="font-mono font-extrabold relative shrink-0 text-accent-text text-[14px]">
                [03]
              </p>
              <p className="font-serif font-bold not-italic relative shrink-0 text-[20px] text-white">{`Outage Clustering & Margin Pool Limits`}</p>
            </div>
            <div className="bg-[rgba(255,59,48,0.1)] border border-[#ff3b30] border-solid content-stretch flex items-start px-[10px] py-[4px] relative rounded-[4px] shrink-0" data-name="Frame">
              <p className="[word-break:break-word] font-mono font-normal leading-[normal] relative shrink-0 text-[#ff3b30] text-[11px] whitespace-nowrap">
                CRITICAL BOUNDARY RISK
              </p>
            </div>
          </div>
          <div className="[word-break:break-word] content-stretch flex font-normal gap-[32px] items-start relative shrink-0 w-full" data-name="boundary-content">
            <div className="content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-start min-w-px relative" data-name="Frame">
              <p className="font-mono leading-[normal] relative shrink-0 text-[#9ca3af] text-[11px] whitespace-nowrap">
                WHAT CAN HAPPEN
              </p>
              <p className="font-serif leading-[20px] min-w-full not-italic relative shrink-0 text-[14px] text-white w-[min-content]">
                Highly correlated incidents (e.g. cloud provider failure) trigger multiple simultaneous payouts.
              </p>
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-start min-w-px relative" data-name="Frame">
              <p className="font-mono leading-[normal] relative shrink-0 text-[#9ca3af] text-[11px] whitespace-nowrap">
                HOW PERIL RESPONDS
              </p>
              <p className="font-serif leading-[20px] min-w-full not-italic relative shrink-0 text-[14px] text-white w-[min-content]">
                The pool holds a reserved margin limit. Payouts are queued sequentially under the maximum 50% cap limit.
              </p>
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-start min-w-px relative" data-name="Frame">
              <p className="font-mono leading-[normal] relative shrink-0 text-[#9ca3af] text-[11px] whitespace-nowrap">
                WHAT USERS SHOULD ASSUME
              </p>
              <p className="font-serif leading-[20px] min-w-full not-italic relative shrink-0 text-[14px] text-white w-[min-content]">
                LPs are protected; coverage payouts may scale down proportionally to avoid pool bankruptcy.
              </p>
            </div>
          </div>
        </div>
        <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-col gap-[20px] items-start p-[28px] relative rounded-[12px] shrink-0 w-full" data-name="boundary-card-3">
          <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Frame">
            <div className="[word-break:break-word] content-stretch flex gap-[8px] items-center leading-[normal] relative shrink-0 whitespace-nowrap" data-name="Frame">
              <p className="font-mono font-extrabold relative shrink-0 text-accent-text text-[14px]">
                [04]
              </p>
              <p className="font-serif font-bold not-italic relative shrink-0 text-[20px] text-white">
                Non-Economic Testnet Sandbox Disclaimer
              </p>
            </div>
            <div className="bg-[rgba(138,180,248,0.1)] border border-[#8ab4f8] border-solid content-stretch flex items-start px-[10px] py-[4px] relative rounded-[4px] shrink-0" data-name="Frame">
              <p className="[word-break:break-word] font-mono font-normal leading-[normal] relative shrink-0 text-[#8ab4f8] text-[11px] whitespace-nowrap">
                NON-ECONOMIC ENVIRONMENT
              </p>
            </div>
          </div>
          <div className="[word-break:break-word] content-stretch flex font-normal gap-[32px] items-start relative shrink-0 w-full" data-name="boundary-content">
            <div className="content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-start min-w-px relative" data-name="Frame">
              <p className="font-mono leading-[normal] relative shrink-0 text-[#9ca3af] text-[11px] whitespace-nowrap">
                WHAT CAN HAPPEN
              </p>
              <p className="font-serif leading-[20px] min-w-full not-italic relative shrink-0 text-[14px] text-white w-[min-content]">
                GenLayer Bradbury operates strictly as a development testnet.
              </p>
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-start min-w-px relative" data-name="Frame">
              <p className="font-mono leading-[normal] relative shrink-0 text-[#9ca3af] text-[11px] whitespace-nowrap">
                HOW PERIL RESPONDS
              </p>
              <p className="font-serif leading-[20px] min-w-full not-italic relative shrink-0 text-[14px] text-white w-[min-content]">
                All protection pools utilize play-money GEN. Payouts carry no actual underlying economic value.
              </p>
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-start min-w-px relative" data-name="Frame">
              <p className="font-mono leading-[normal] relative shrink-0 text-[#9ca3af] text-[11px] whitespace-nowrap">
                WHAT USERS SHOULD ASSUME
              </p>
              <p className="font-serif leading-[20px] min-w-full not-italic relative shrink-0 text-[14px] text-white w-[min-content]">
                Do not deploy actual assets to cover physical infrastructure. This is an experimental release.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="content-stretch flex gap-[24px] items-start pb-[64px] px-[120px] relative shrink-0 w-full" data-name="diagrams-container">
        <div className="bg-[#14171f] border border-[#1e222a] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[20px] items-start min-w-px p-[28px] relative rounded-[12px]" data-name="retry-visual-box">
          <p className="[word-break:break-word] font-mono font-normal leading-[normal] relative shrink-0 text-[#9ca3af] text-[11px] whitespace-nowrap">{`ENDPOINT TIMEOUT & RETRY SEQUENCE`}</p>
          <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="timeline">
            <div className="[word-break:break-word] bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-[1_0_0] flex-col font-normal gap-[4px] items-start leading-[normal] min-w-px p-[12px] relative rounded-[6px]" data-name="Frame">
              <p className="font-mono relative shrink-0 text-[#9ca3af] text-[11px] whitespace-nowrap">
                T0: FAILURE
              </p>
              <p className="font-serif min-w-full not-italic relative shrink-0 text-[13px] text-white w-[min-content]">
                First attempt times out.
              </p>
            </div>
            <div className="bg-[#1e222a] h-px relative shrink-0 w-[12px]" data-name="Rectangle" />
            <div className="[word-break:break-word] bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-[1_0_0] flex-col font-normal gap-[4px] items-start leading-[normal] min-w-px p-[12px] relative rounded-[6px]" data-name="Frame">
              <p className="font-mono relative shrink-0 text-[#8ab4f8] text-[11px] whitespace-nowrap">
                T+5M: RETRY 1
              </p>
              <p className="font-serif min-w-full not-italic relative shrink-0 text-[13px] text-white w-[min-content]">
                Backoff queries backup api.
              </p>
            </div>
            <div className="bg-[#1e222a] h-px relative shrink-0 w-[12px]" data-name="Rectangle" />
            <div className="[word-break:break-word] bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-[1_0_0] flex-col font-normal gap-[4px] items-start leading-[normal] min-w-px p-[12px] relative rounded-[6px]" data-name="Frame">
              <p className="font-mono relative shrink-0 text-[#8ab4f8] text-[11px] whitespace-nowrap">
                T+15M: RETRY 2
              </p>
              <p className="font-serif min-w-full not-italic relative shrink-0 text-[13px] text-white w-[min-content]">
                Query secondary status nodes.
              </p>
            </div>
            <div className="bg-[#1e222a] h-px relative shrink-0 w-[12px]" data-name="Rectangle" />
            <div className="[word-break:break-word] bg-accent-tint border border-accent-line border-solid content-stretch flex flex-[1_0_0] flex-col font-normal gap-[4px] items-start leading-[normal] min-w-px p-[12px] relative rounded-[6px]" data-name="Frame">
              <p className="font-mono relative shrink-0 text-accent-text text-[11px] whitespace-nowrap">
                T+30M: DECREE
              </p>
              <p className="font-serif min-w-full not-italic relative shrink-0 text-[13px] text-white w-[min-content]">
                Validator consensus reached.
              </p>
            </div>
          </div>
        </div>
        <div className="bg-[#14171f] border border-[#1e222a] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[20px] items-start min-w-px p-[28px] relative rounded-[12px]" data-name="clustering-visual-box">
          <p className="[word-break:break-word] font-mono font-normal leading-[normal] relative shrink-0 text-[#9ca3af] text-[11px] whitespace-nowrap">
            CORRELATED CLUSTERING EXPOSURE LIMIT
          </p>
          <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="bar-comparison">
            <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="Frame">
              <div className="[word-break:break-word] content-stretch flex font-normal items-start justify-between leading-[normal] relative shrink-0 text-[12px] w-full whitespace-nowrap" data-name="Frame">
                <p className="font-serif not-italic relative shrink-0 text-[#9ca3af]">
                  MAX QUEUED LIQUIDITY
                </p>
                <p className="font-mono relative shrink-0 text-white">
                  2,250,000 GEN
                </p>
              </div>
              <div className="bg-[#1c1f26] content-stretch flex h-[10px] items-start overflow-clip relative rounded-[5px] shrink-0 w-full" data-name="Frame">
                <div className="bg-[#ff3b30] h-full relative shrink-0 w-[200px]" data-name="Rectangle" />
              </div>
            </div>
            <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="Frame">
              <div className="[word-break:break-word] content-stretch flex font-normal items-start justify-between leading-[normal] relative shrink-0 text-[12px] w-full whitespace-nowrap" data-name="Frame">
                <p className="font-serif not-italic relative shrink-0 text-[#9ca3af]">
                  POOL BUFFER ASSURANCE
                </p>
                <p className="font-mono relative shrink-0 text-white">
                  4,500,000 GEN
                </p>
              </div>
              <div className="bg-[#1c1f26] content-stretch flex h-[10px] items-start overflow-clip relative rounded-[5px] shrink-0 w-full" data-name="Frame">
                <div className="bg-accent h-full relative shrink-0 w-[420px]" data-name="Rectangle" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="[word-break:break-word] content-stretch flex gap-[24px] items-start leading-[normal] not-italic pb-[64px] px-[120px] relative shrink-0 w-full" data-name="checklist-section">
        <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px p-[28px] relative rounded-[12px]" data-name="not-covered-box">
          <p className="font-serif font-extrabold relative shrink-0 text-[16px] text-white whitespace-nowrap">
            What PERIL Does NOT Cover
          </p>
          <div className="content-stretch flex flex-col font-serif font-normal gap-[12px] items-start relative shrink-0 text-[#9ca3af] text-[13px] w-full" data-name="Frame">
            <p className="relative shrink-0 whitespace-nowrap">
              • Minor performance delays under official thresholds.
            </p>
            <p className="relative shrink-0 whitespace-nowrap">
              • Partial endpoint failure with operational status intact.
            </p>
            <p className="relative shrink-0 whitespace-nowrap">
              • DNS routing or client-side connection issues.
            </p>
            <p className="min-w-full relative shrink-0 w-[min-content]">
              • Excluded providers lacking public historical databases.
            </p>
          </div>
        </div>
        <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px p-[28px] relative rounded-[12px] whitespace-nowrap" data-name="safeguards-box">
          <p className="font-serif font-extrabold relative shrink-0 text-[16px] text-white">
            Operational Safeguards
          </p>
          <div className="content-stretch flex flex-col font-serif font-normal gap-[12px] items-start relative shrink-0 text-[#9ca3af] text-[13px] w-full" data-name="Frame">
            <p className="relative shrink-0">
              • Absolute collateral lockboxes before policy creation.
            </p>
            <p className="relative shrink-0">
              • Trustless automated payout dispatch via consensus.
            </p>
            <p className="relative shrink-0">
              • Independent validator signatures on every block.
            </p>
            <p className="relative shrink-0">
              • Real-time public audit endpoints available.
            </p>
          </div>
        </div>
        <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px p-[28px] relative rounded-[12px] whitespace-nowrap" data-name="before-buy-box">
          <p className="font-serif font-extrabold relative shrink-0 text-[16px] text-white">
            Before You Buy
          </p>
          <div className="content-stretch flex flex-col font-serif font-normal gap-[12px] items-start relative shrink-0 text-[#9ca3af] text-[13px] w-full" data-name="Frame">
            <p className="relative shrink-0">{`• Verify exact UTC policy start & end dates.`}</p>
            <p className="relative shrink-0">
              • Review provider historical metrics table on-chain.
            </p>
            <p className="relative shrink-0">
              • Confirm threshold limits are suitable for SLA.
            </p>
            <p className="relative shrink-0">
              • Ensure testnet GEN holds no real-world value.
            </p>
          </div>
        </div>
      </div>
      <div className="content-stretch flex items-start pb-[64px] px-[120px] relative shrink-0 w-full" data-name="disclaimer-alert-section">
        <div className="[word-break:break-word] bg-[rgba(255,59,48,0.12)] border border-[#ff3b30] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px p-[32px] relative rounded-[12px]" data-name="disclaimer-alert">
          <div className="content-stretch flex gap-[8px] items-center leading-[normal] relative shrink-0 text-[#ff3b30] whitespace-nowrap" data-name="Frame">
            <p className="font-serif font-normal not-italic relative shrink-0 text-[20px]">
              ⚠️
            </p>
            <p className="font-mono font-extrabold relative shrink-0 text-[14px]">
              NON-ECONOMIC DEV TESTNET sandbox
            </p>
          </div>
          <p className="font-serif font-normal leading-[22px] min-w-full not-italic relative shrink-0 text-[14px] text-white w-[min-content]">
            You are deploying on GenLayer Bradbury Testnet. All transactions, tokens, coverage commitments, and payouts are experimental. Do not attempt to buy real-world security coverage or deposit true value. PERIL is not responsible for physical system damage or real operational losses.
          </p>
        </div>
      </div>
      <div className="content-stretch flex gap-[24px] items-start pb-[80px] px-[120px] relative shrink-0 w-full" data-name="cta-row">
        <div className="bg-[#14171f] border border-[#1e222a] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px p-[32px] relative rounded-[12px]" data-name="cta-evidence">
          <p className="[word-break:break-word] font-serif font-extrabold leading-[normal] not-italic relative shrink-0 text-[20px] text-white whitespace-nowrap">
            Review Outage Statistics
          </p>
          <p className="[word-break:break-word] font-serif font-normal leading-[20px] min-w-full not-italic relative shrink-0 text-[#9ca3af] text-[14px] w-[min-content]">
            See actual past outages and multipliers mapped for all supported targets before setting policy threshold limits.
          </p>
          <div className="bg-accent content-stretch flex items-start px-[24px] py-[12px] relative rounded-[6px] shrink-0" data-name="cta-action">
            <p className="[word-break:break-word] font-mono font-bold leading-[normal] relative shrink-0 text-[#090a0c] text-[13px] whitespace-nowrap">
              GO TO PRICING EVIDENCE
            </p>
          </div>
        </div>
        <div className="bg-[#14171f] border border-[#1e222a] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px p-[32px] relative rounded-[12px]" data-name="cta-how">
          <p className="[word-break:break-word] font-serif font-extrabold leading-[normal] not-italic relative shrink-0 text-[20px] text-white whitespace-nowrap">
            How Parametric Consensus Works
          </p>
          <p className="[word-break:break-word] font-serif font-normal leading-[20px] min-w-full not-italic relative shrink-0 text-[#9ca3af] text-[14px] w-[min-content]">
            Deep dive into GenLayer intelligent consensus, incident JSON structures, and automated validator settlement rules.
          </p>
          <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex items-start px-[24px] py-[12px] relative rounded-[6px] shrink-0" data-name="cta-action">
            <p className="[word-break:break-word] font-mono font-bold leading-[normal] relative shrink-0 text-[13px] text-white whitespace-nowrap">
              EXPLORE WORKFLOW
            </p>
          </div>
        </div>
      </div>
      <div className="[word-break:break-word] bg-[#121418] border-[#1e222a] border-solid border-t content-stretch flex font-mono font-normal items-center justify-between leading-[normal] px-[40px] py-[32px] relative shrink-0 text-[11px] w-full whitespace-nowrap" data-name="footer">
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
