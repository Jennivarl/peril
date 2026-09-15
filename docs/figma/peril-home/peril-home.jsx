const imgPulseDot = "https://www.figma.com/api/mcp/asset/dde1c11c-c527-40e8-bd88-54dd1c86c6fc.svg";
const imgStepDot = "https://www.figma.com/api/mcp/asset/55eaa016-55f9-4fa1-946a-e0ba5ff3f630.svg";
const imgStepDot1 = "https://www.figma.com/api/mcp/asset/6c3e9051-0c78-4a02-936b-bdf05ad4cb77.svg";

export default function PerilHome() {
  return (
    <div className="bg-[#090a0c] content-stretch flex flex-col items-start relative size-full" data-node-id="3:7" data-name="peril-home">
      <div className="bg-[#121418] border-[#1e222a] border-b border-solid content-stretch flex h-[72px] items-center justify-between px-[40px] relative shrink-0 w-full" data-node-id="3:8" data-name="shared-header">
        <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-node-id="3:9" data-name="brand-group">
          <p className="[word-break:break-word] font-['JetBrains_Mono:ExtraBold'] font-extrabold leading-[0] relative shrink-0 text-[22px] text-white whitespace-nowrap" data-node-id="3:10">
            <span className="leading-[normal]">PERIL</span>
            <span className="leading-[normal] text-[#00ff9d]">.</span>
          </p>
          <div className="bg-[#1c1f26] border border-[#1e222a] border-solid content-stretch flex gap-[6px] items-center px-[10px] py-[4px] relative rounded-[4px] shrink-0" data-node-id="3:11" data-name="network-tag">
            <div className="relative shrink-0 size-[8px]" data-node-id="3:12" data-name="pulse-dot">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgPulseDot} />
            </div>
            <p className="[word-break:break-word] font-['JetBrains_Mono:Regular'] font-normal leading-[normal] relative shrink-0 text-[#00ff9d] text-[11px] whitespace-nowrap" data-node-id="3:13">
              Chain ID: 4221 | GenLayer Bradbury
            </p>
          </div>
        </div>
        <div className="bg-[#090a0c] border border-[#1e222a] border-solid content-stretch flex gap-[4px] items-start p-[4px] relative rounded-[8px] shrink-0" data-node-id="3:14" data-name="nav-tabs">
          <div className="bg-[#121418] content-stretch flex items-start px-[16px] py-[8px] relative rounded-[6px] shrink-0" data-node-id="3:15" data-name="tab-home">
            <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#00ff9d] text-[13px] whitespace-nowrap" data-node-id="3:16">
              Home
            </p>
          </div>
          <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-start px-[16px] py-[8px] relative rounded-[6px] shrink-0" data-node-id="3:17" data-name="tab-buy">
            <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#9ca3af] text-[13px] whitespace-nowrap" data-node-id="3:18">
              Buy Cover
            </p>
          </div>
          <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-start px-[16px] py-[8px] relative rounded-[6px] shrink-0" data-node-id="3:19" data-name="tab-my">
            <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#9ca3af] text-[13px] whitespace-nowrap" data-node-id="3:20">
              My Cover
            </p>
          </div>
          <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-start px-[16px] py-[8px] relative rounded-[6px] shrink-0" data-node-id="3:21" data-name="tab-detail">
            <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#9ca3af] text-[13px] whitespace-nowrap" data-node-id="3:22">
              The Pool
            </p>
          </div>
          <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-start px-[16px] py-[8px] relative rounded-[6px] shrink-0" data-node-id="3:23" data-name="tab-how">
            <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#9ca3af] text-[13px] whitespace-nowrap" data-node-id="3:24">
              How It Works
            </p>
          </div>
          <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-start px-[16px] py-[8px] relative rounded-[6px] shrink-0" data-node-id="3:25" data-name="tab-evidence">
            <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#9ca3af] text-[13px] whitespace-nowrap" data-node-id="3:26">
              Evidence
            </p>
          </div>
          <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-start px-[16px] py-[8px] relative rounded-[6px] shrink-0" data-node-id="3:27" data-name="tab-limits">
            <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#9ca3af] text-[13px] whitespace-nowrap" data-node-id="3:28">
              Limits
            </p>
          </div>
        </div>
        <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-node-id="3:29" data-name="wallet-group">
          <div className="bg-[#161b22] border border-[#1e222a] border-solid content-stretch flex items-start px-[12px] py-[6px] relative rounded-[6px] shrink-0" data-node-id="3:30" data-name="balance-chip">
            <p className="[word-break:break-word] font-['JetBrains_Mono:Bold'] font-bold leading-[normal] relative shrink-0 text-[13px] text-white whitespace-nowrap" data-node-id="3:31">
              Free: 2.15 GEN
            </p>
          </div>
          <div className="bg-[#00ff9d] content-stretch flex items-start px-[16px] py-[8px] relative rounded-[6px] shrink-0" data-node-id="3:32" data-name="connect-btn">
            <p className="[word-break:break-word] font-['JetBrains_Mono:Bold'] font-bold leading-[normal] relative shrink-0 text-[#090a0c] text-[13px] whitespace-nowrap" data-node-id="3:33">
              0x7b...9E3c
            </p>
          </div>
        </div>
      </div>
      <div className="bg-[#090a0c] border-[#1e222a] border-b border-solid content-stretch flex items-center justify-between px-[40px] py-[10px] relative shrink-0 w-full" data-node-id="3:34" data-name="tx-tracker">
        <div className="[word-break:break-word] content-stretch flex font-['JetBrains_Mono:Regular'] font-normal gap-[8px] items-center leading-[normal] relative shrink-0 text-[11px] whitespace-nowrap" data-node-id="3:35" data-name="tracker-left">
          <p className="relative shrink-0 text-[#9ca3af] uppercase" data-node-id="3:36">
            CONSENSUS LIFECYCLE:
          </p>
          <p className="relative shrink-0 text-[#00ff9d]" data-node-id="3:37">
            0xef56...3a9c
          </p>
        </div>
        <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-node-id="3:38" data-name="tracker-steps">
          <div className="content-stretch flex items-center relative shrink-0" data-node-id="3:39" data-name="step-0">
            <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-node-id="3:40" data-name="step-dot-wrap">
              <div className="relative shrink-0 size-[6px]" data-node-id="3:41" data-name="step-dot">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgStepDot} />
              </div>
              <p className="[word-break:break-word] font-['JetBrains_Mono:Regular'] font-normal leading-[normal] relative shrink-0 text-[#9ca3af] text-[11px] whitespace-nowrap" data-node-id="3:42">
                Pending
              </p>
            </div>
          </div>
          <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-node-id="3:43" data-name="step-1">
            <div className="bg-[#00ff9d] h-px relative shrink-0 w-[16px]" data-node-id="3:44" data-name="step-connector" />
            <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-node-id="3:45" data-name="step-dot-wrap">
              <div className="relative shrink-0 size-[6px]" data-node-id="3:46" data-name="step-dot">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgStepDot} />
              </div>
              <p className="[word-break:break-word] font-['JetBrains_Mono:Regular'] font-normal leading-[normal] relative shrink-0 text-[#9ca3af] text-[11px] whitespace-nowrap" data-node-id="3:47">
                Proposing
              </p>
            </div>
          </div>
          <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-node-id="3:48" data-name="step-2">
            <div className="bg-[#1e222a] h-px relative shrink-0 w-[16px]" data-node-id="3:49" data-name="step-connector" />
            <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-node-id="3:50" data-name="step-dot-wrap">
              <div className="relative shrink-0 size-[6px]" data-node-id="3:51" data-name="step-dot">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgStepDot} />
              </div>
              <p className="[word-break:break-word] font-['JetBrains_Mono:Regular'] font-normal leading-[normal] relative shrink-0 text-[#00ff9d] text-[11px] whitespace-nowrap" data-node-id="3:52">
                Committing
              </p>
            </div>
          </div>
          <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-node-id="3:53" data-name="step-3">
            <div className="bg-[#15171e] h-px relative shrink-0 w-[16px]" data-node-id="3:54" data-name="step-connector" />
            <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-node-id="3:55" data-name="step-dot-wrap">
              <div className="relative shrink-0 size-[6px]" data-node-id="3:56" data-name="step-dot">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgStepDot1} />
              </div>
              <p className="[word-break:break-word] font-['JetBrains_Mono:Regular'] font-normal leading-[normal] relative shrink-0 text-[#4b5563] text-[11px] whitespace-nowrap" data-node-id="3:57">
                Revealing
              </p>
            </div>
          </div>
          <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-node-id="3:58" data-name="step-4">
            <div className="bg-[#15171e] h-px relative shrink-0 w-[16px]" data-node-id="3:59" data-name="step-connector" />
            <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-node-id="3:60" data-name="step-dot-wrap">
              <div className="relative shrink-0 size-[6px]" data-node-id="3:61" data-name="step-dot">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgStepDot1} />
              </div>
              <p className="[word-break:break-word] font-['JetBrains_Mono:Regular'] font-normal leading-[normal] relative shrink-0 text-[#4b5563] text-[11px] whitespace-nowrap" data-node-id="3:62">
                LeaderReveal
              </p>
            </div>
          </div>
          <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-node-id="3:63" data-name="step-5">
            <div className="bg-[#15171e] h-px relative shrink-0 w-[16px]" data-node-id="3:64" data-name="step-connector" />
            <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-node-id="3:65" data-name="step-dot-wrap">
              <div className="relative shrink-0 size-[6px]" data-node-id="3:66" data-name="step-dot">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgStepDot1} />
              </div>
              <p className="[word-break:break-word] font-['JetBrains_Mono:Regular'] font-normal leading-[normal] relative shrink-0 text-[#4b5563] text-[11px] whitespace-nowrap" data-node-id="3:67">
                Accepted
              </p>
            </div>
          </div>
          <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-node-id="3:68" data-name="step-6">
            <div className="bg-[#15171e] h-px relative shrink-0 w-[16px]" data-node-id="3:69" data-name="step-connector" />
            <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-node-id="3:70" data-name="step-dot-wrap">
              <div className="relative shrink-0 size-[6px]" data-node-id="3:71" data-name="step-dot">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgStepDot1} />
              </div>
              <p className="[word-break:break-word] font-['JetBrains_Mono:Regular'] font-normal leading-[normal] relative shrink-0 text-[#4b5563] text-[11px] whitespace-nowrap" data-node-id="3:72">
                Finalize
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="content-stretch flex flex-col gap-[24px] items-center pb-[64px] pt-[80px] px-[120px] relative shrink-0 w-full" data-node-id="3:73" data-name="hero-section">
        <div className="bg-[rgba(0,255,157,0.1)] border border-[#00ff9d] border-solid content-stretch flex items-start px-[12px] py-[4px] relative rounded-[100px] shrink-0" data-node-id="3:74" data-name="pill-tag">
          <p className="[word-break:break-word] font-['JetBrains_Mono:Bold'] font-bold leading-[normal] relative shrink-0 text-[#00ff9d] text-[12px] whitespace-nowrap" data-node-id="3:75">
            BLOCKCHAIN-NATIVE ORACLE SERVICE LEVEL AGREEMENTS
          </p>
        </div>
        <p className="[word-break:break-word] font-['Inter:Extra_Bold'] font-extrabold leading-[60px] not-italic relative shrink-0 text-[52px] text-center text-white w-[880px]" data-node-id="3:76">
          No claim forms. No assessors. Automated service downtime cover.
        </p>
        <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[28px] not-italic relative shrink-0 text-[#9ca3af] text-[18px] text-center w-[700px]" data-node-id="3:77">{`Secured by GenLayer's deterministic intelligent consensus. Smart contracts monitor public status APIs and execute sub-minute payouts directly to your wallet when threshold SLAs are breached.`}</p>
      </div>
      <div className="[word-break:break-word] content-stretch flex gap-[24px] items-start pb-[80px] px-[120px] relative shrink-0 w-full" data-node-id="3:78" data-name="principles-container">
        <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px p-[28px] relative rounded-[12px]" data-node-id="3:79" data-name="principle-01">
          <p className="font-['JetBrains_Mono:ExtraBold'] font-extrabold leading-[normal] relative shrink-0 text-[#00ff9d] text-[14px] whitespace-nowrap" data-node-id="3:80">
            [01]
          </p>
          <p className="font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[20px] text-white whitespace-nowrap" data-node-id="3:81">
            Parametric Triggers
          </p>
          <p className="font-['Inter:Regular'] font-normal leading-[22px] min-w-full not-italic relative shrink-0 text-[#9ca3af] text-[14px] w-[min-content]" data-node-id="3:82">
            Claims bypass human adjusters. Your policy is pre-coded to trigger immediately when public status page metrics show outage periods exceeding your selected limits.
          </p>
        </div>
        <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px p-[28px] relative rounded-[12px]" data-node-id="3:83" data-name="principle-02">
          <p className="font-['JetBrains_Mono:ExtraBold'] font-extrabold leading-[normal] relative shrink-0 text-[#00ff9d] text-[14px] whitespace-nowrap" data-node-id="3:84">
            [02]
          </p>
          <p className="font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[20px] text-white whitespace-nowrap" data-node-id="3:85">
            Deterministic Consensus
          </p>
          <p className="font-['Inter:Regular'] font-normal leading-[22px] min-w-full not-italic relative shrink-0 text-[#9ca3af] text-[14px] w-[min-content]" data-node-id="3:86">
            GenLayer Bradbury validators fetch, parse, and verify status page endpoints, forming absolute agreements over durations, impacts, and severity levels.
          </p>
        </div>
        <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px p-[28px] relative rounded-[12px]" data-node-id="3:87" data-name="principle-03">
          <p className="font-['JetBrains_Mono:ExtraBold'] font-extrabold leading-[normal] relative shrink-0 text-[#00ff9d] text-[14px] whitespace-nowrap" data-node-id="3:88">
            [03]
          </p>
          <p className="font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[20px] text-white whitespace-nowrap" data-node-id="3:89">
            Automatic Settlement
          </p>
          <p className="font-['Inter:Regular'] font-normal leading-[22px] min-w-full not-italic relative shrink-0 text-[#9ca3af] text-[14px] w-[min-content]" data-node-id="3:90">
            Once consensus is reached, funds are disbursed in GEN directly from our locked capital pools. Absolute predictability for DevOps risk management.
          </p>
        </div>
      </div>
      <div className="[word-break:break-word] bg-[#0d1117] border-[#1e222a] border-b border-solid border-t content-stretch flex items-start justify-between leading-[normal] px-[120px] py-[24px] relative shrink-0 w-full whitespace-nowrap" data-node-id="3:91" data-name="reserves-ribbon">
        <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0" data-node-id="3:92" data-name="stat-0">
          <p className="font-['JetBrains_Mono:Regular'] font-normal relative shrink-0 text-[#9ca3af] text-[11px]" data-node-id="3:93">
            TOTAL POOL SIZE
          </p>
          <p className="font-['JetBrains_Mono:ExtraBold'] font-extrabold relative shrink-0 text-[#00ff9d] text-[24px]" data-node-id="3:94">
            4,500,000 GEN
          </p>
          <p className="font-['Inter:Regular'] font-normal not-italic relative shrink-0 text-[#4b5563] text-[12px]" data-node-id="3:95">
            $967,500 USD equivalent
          </p>
        </div>
        <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0" data-node-id="3:96" data-name="stat-1">
          <p className="font-['JetBrains_Mono:Regular'] font-normal relative shrink-0 text-[#9ca3af] text-[11px]" data-node-id="3:97">
            ACTIVE COVERAGE
          </p>
          <p className="font-['JetBrains_Mono:ExtraBold'] font-extrabold relative shrink-0 text-[#00ff9d] text-[24px]" data-node-id="3:98">
            1,120,000 GEN
          </p>
          <p className="font-['Inter:Regular'] font-normal not-italic relative shrink-0 text-[#4b5563] text-[12px]" data-node-id="3:99">
            238 policy contracts live
          </p>
        </div>
        <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0" data-node-id="3:100" data-name="stat-2">
          <p className="font-['JetBrains_Mono:Regular'] font-normal relative shrink-0 text-[#9ca3af] text-[11px]" data-node-id="3:101">
            AVAILABLE CAPACITY
          </p>
          <p className="font-['JetBrains_Mono:ExtraBold'] font-extrabold relative shrink-0 text-[#00ff9d] text-[24px]" data-node-id="3:102">
            3,380,000 GEN
          </p>
          <p className="font-['Inter:Regular'] font-normal not-italic relative shrink-0 text-[#4b5563] text-[12px]" data-node-id="3:103">
            92.4% pool capacity free
          </p>
        </div>
      </div>
      <div className="content-stretch flex flex-col gap-[24px] items-start pb-[40px] pt-[80px] px-[120px] relative shrink-0 w-full" data-node-id="3:104" data-name="matrix-section">
        <div className="[word-break:break-word] content-stretch flex items-center justify-between leading-[normal] relative shrink-0 w-full whitespace-nowrap" data-node-id="3:105" data-name="Frame">
          <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0" data-node-id="3:106" data-name="Frame">
            <p className="font-['JetBrains_Mono:Regular'] font-normal relative shrink-0 text-[#00ff9d] text-[12px]" data-node-id="3:107">
              AVAILABLE COVERAGE TARGETS
            </p>
            <p className="font-['Inter:Extra_Bold'] font-extrabold not-italic relative shrink-0 text-[28px] text-white" data-node-id="3:108">{`Supported Providers & Live Rates`}</p>
          </div>
          <p className="font-['Inter:Regular'] font-normal not-italic relative shrink-0 text-[#9ca3af] text-[14px]" data-node-id="3:109">
            Click provider to customize parameters
          </p>
        </div>
        <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full" data-node-id="3:110" data-name="shop-grid">
          <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px p-[24px] relative rounded-[12px]" data-node-id="3:111" data-name="shop-card-GitHub API">
            <div className="bg-[#1e222b] content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[40px]" data-node-id="3:112" data-name="card-icon">
              <p className="[word-break:break-word] font-['JetBrains_Mono:ExtraBold'] font-extrabold leading-[normal] relative shrink-0 text-[14px] text-white whitespace-nowrap" data-node-id="3:113">
                GIT
              </p>
            </div>
            <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start leading-[normal] relative shrink-0 whitespace-nowrap" data-node-id="3:114" data-name="card-meta">
              <p className="font-['Inter:Bold'] font-bold not-italic relative shrink-0 text-[18px] text-white" data-node-id="3:115">
                GitHub API
              </p>
              <p className="font-['JetBrains_Mono:Regular'] font-normal relative shrink-0 text-[#9ca3af] text-[12px]" data-node-id="3:116">
                githubstatus.com
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full" data-node-id="3:117" data-name="badges-group">
              <div className="bg-[#201315] border border-[#ff3b30] border-solid content-stretch flex items-start px-[8px] py-[4px] relative rounded-[4px] shrink-0" data-node-id="3:118" data-name="badge-1">
                <p className="[word-break:break-word] font-['JetBrains_Mono:Regular'] font-normal leading-[normal] relative shrink-0 text-[#ff3b30] text-[11px] whitespace-nowrap" data-node-id="3:119">
                  77 outages / 12m
                </p>
              </div>
              <div className="bg-[#10261d] border border-[#00ff9d] border-solid content-stretch flex items-start px-[8px] py-[4px] relative rounded-[4px] shrink-0" data-node-id="3:120" data-name="badge-2">
                <p className="[word-break:break-word] font-['JetBrains_Mono:Regular'] font-normal leading-[normal] relative shrink-0 text-[#00ff9d] text-[11px] whitespace-nowrap" data-node-id="3:121">
                  4h+ pays 2x
                </p>
              </div>
            </div>
            <div className="bg-[#1e222a] content-stretch flex items-start justify-center py-[10px] relative rounded-[6px] shrink-0 w-full" data-node-id="3:122" data-name="card-action">
              <p className="[word-break:break-word] font-['JetBrains_Mono:Bold'] font-bold leading-[normal] relative shrink-0 text-[12px] text-white whitespace-nowrap" data-node-id="3:123">
                GET COVER
              </p>
            </div>
          </div>
          <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px p-[24px] relative rounded-[12px]" data-node-id="3:124" data-name="shop-card-Discord">
            <div className="bg-[#1e222b] content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[40px]" data-node-id="3:125" data-name="card-icon">
              <p className="[word-break:break-word] font-['JetBrains_Mono:ExtraBold'] font-extrabold leading-[normal] relative shrink-0 text-[14px] text-white whitespace-nowrap" data-node-id="3:126">
                DIS
              </p>
            </div>
            <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start leading-[normal] relative shrink-0 whitespace-nowrap" data-node-id="3:127" data-name="card-meta">
              <p className="font-['Inter:Bold'] font-bold not-italic relative shrink-0 text-[18px] text-white" data-node-id="3:128">
                Discord
              </p>
              <p className="font-['JetBrains_Mono:Regular'] font-normal relative shrink-0 text-[#9ca3af] text-[12px]" data-node-id="3:129">
                discordstatus.com
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full" data-node-id="3:130" data-name="badges-group">
              <div className="bg-[#201315] border border-[#ff3b30] border-solid content-stretch flex items-start px-[8px] py-[4px] relative rounded-[4px] shrink-0" data-node-id="3:131" data-name="badge-1">
                <p className="[word-break:break-word] font-['JetBrains_Mono:Regular'] font-normal leading-[normal] relative shrink-0 text-[#ff3b30] text-[11px] whitespace-nowrap" data-node-id="3:132">
                  142 outages / 31m
                </p>
              </div>
              <div className="bg-[#10261d] border border-[#00ff9d] border-solid content-stretch flex items-start px-[8px] py-[4px] relative rounded-[4px] shrink-0" data-node-id="3:133" data-name="badge-2">
                <p className="[word-break:break-word] font-['JetBrains_Mono:Regular'] font-normal leading-[normal] relative shrink-0 text-[#00ff9d] text-[11px] whitespace-nowrap" data-node-id="3:134">
                  2h+ pays 3x
                </p>
              </div>
            </div>
            <div className="bg-[#1e222a] content-stretch flex items-start justify-center py-[10px] relative rounded-[6px] shrink-0 w-full" data-node-id="3:135" data-name="card-action">
              <p className="[word-break:break-word] font-['JetBrains_Mono:Bold'] font-bold leading-[normal] relative shrink-0 text-[12px] text-white whitespace-nowrap" data-node-id="3:136">
                GET COVER
              </p>
            </div>
          </div>
          <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px p-[24px] relative rounded-[12px]" data-node-id="3:137" data-name="shop-card-Vercel Platform">
            <div className="bg-[#1e222b] content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[40px]" data-node-id="3:138" data-name="card-icon">
              <p className="[word-break:break-word] font-['JetBrains_Mono:ExtraBold'] font-extrabold leading-[normal] relative shrink-0 text-[14px] text-white whitespace-nowrap" data-node-id="3:139">
                VER
              </p>
            </div>
            <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start leading-[normal] relative shrink-0 whitespace-nowrap" data-node-id="3:140" data-name="card-meta">
              <p className="font-['Inter:Bold'] font-bold not-italic relative shrink-0 text-[18px] text-white" data-node-id="3:141">
                Vercel Platform
              </p>
              <p className="font-['JetBrains_Mono:Regular'] font-normal relative shrink-0 text-[#9ca3af] text-[12px]" data-node-id="3:142">
                vercel-status.com
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full" data-node-id="3:143" data-name="badges-group">
              <div className="bg-[#201315] border border-[#ff3b30] border-solid content-stretch flex items-start px-[8px] py-[4px] relative rounded-[4px] shrink-0" data-node-id="3:144" data-name="badge-1">
                <p className="[word-break:break-word] font-['JetBrains_Mono:Regular'] font-normal leading-[normal] relative shrink-0 text-[#ff3b30] text-[11px] whitespace-nowrap" data-node-id="3:145">
                  41 outages / 8m
                </p>
              </div>
              <div className="bg-[#10261d] border border-[#00ff9d] border-solid content-stretch flex items-start px-[8px] py-[4px] relative rounded-[4px] shrink-0" data-node-id="3:146" data-name="badge-2">
                <p className="[word-break:break-word] font-['JetBrains_Mono:Regular'] font-normal leading-[normal] relative shrink-0 text-[#00ff9d] text-[11px] whitespace-nowrap" data-node-id="3:147">
                  1h+ pays 1.8x
                </p>
              </div>
            </div>
            <div className="bg-[#1e222a] content-stretch flex items-start justify-center py-[10px] relative rounded-[6px] shrink-0 w-full" data-node-id="3:148" data-name="card-action">
              <p className="[word-break:break-word] font-['JetBrains_Mono:Bold'] font-bold leading-[normal] relative shrink-0 text-[12px] text-white whitespace-nowrap" data-node-id="3:149">
                GET COVER
              </p>
            </div>
          </div>
          <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px p-[24px] relative rounded-[12px]" data-node-id="3:150" data-name="shop-card-Netlify Services">
            <div className="bg-[#1e222b] content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[40px]" data-node-id="3:151" data-name="card-icon">
              <p className="[word-break:break-word] font-['JetBrains_Mono:ExtraBold'] font-extrabold leading-[normal] relative shrink-0 text-[14px] text-white whitespace-nowrap" data-node-id="3:152">
                NET
              </p>
            </div>
            <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start leading-[normal] relative shrink-0 whitespace-nowrap" data-node-id="3:153" data-name="card-meta">
              <p className="font-['Inter:Bold'] font-bold not-italic relative shrink-0 text-[18px] text-white" data-node-id="3:154">
                Netlify Services
              </p>
              <p className="font-['JetBrains_Mono:Regular'] font-normal relative shrink-0 text-[#9ca3af] text-[12px]" data-node-id="3:155">
                netlify-status.com
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full" data-node-id="3:156" data-name="badges-group">
              <div className="bg-[#201315] border border-[#ff3b30] border-solid content-stretch flex items-start px-[8px] py-[4px] relative rounded-[4px] shrink-0" data-node-id="3:157" data-name="badge-1">
                <p className="[word-break:break-word] font-['JetBrains_Mono:Regular'] font-normal leading-[normal] relative shrink-0 text-[#ff3b30] text-[11px] whitespace-nowrap" data-node-id="3:158">
                  59 outages / 18m
                </p>
              </div>
              <div className="bg-[#10261d] border border-[#00ff9d] border-solid content-stretch flex items-start px-[8px] py-[4px] relative rounded-[4px] shrink-0" data-node-id="3:159" data-name="badge-2">
                <p className="[word-break:break-word] font-['JetBrains_Mono:Regular'] font-normal leading-[normal] relative shrink-0 text-[#00ff9d] text-[11px] whitespace-nowrap" data-node-id="3:160">
                  4h+ pays 2.5x
                </p>
              </div>
            </div>
            <div className="bg-[#1e222a] content-stretch flex items-start justify-center py-[10px] relative rounded-[6px] shrink-0 w-full" data-node-id="3:161" data-name="card-action">
              <p className="[word-break:break-word] font-['JetBrains_Mono:Bold'] font-bold leading-[normal] relative shrink-0 text-[12px] text-white whitespace-nowrap" data-node-id="3:162">
                GET COVER
              </p>
            </div>
          </div>
          <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px p-[24px] relative rounded-[12px]" data-node-id="3:163" data-name="shop-card-npm registry">
            <div className="bg-[#1e222b] content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[40px]" data-node-id="3:164" data-name="card-icon">
              <p className="[word-break:break-word] font-['JetBrains_Mono:ExtraBold'] font-extrabold leading-[normal] relative shrink-0 text-[14px] text-white whitespace-nowrap" data-node-id="3:165">
                NPM
              </p>
            </div>
            <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start leading-[normal] relative shrink-0 whitespace-nowrap" data-node-id="3:166" data-name="card-meta">
              <p className="font-['Inter:Bold'] font-bold not-italic relative shrink-0 text-[18px] text-white" data-node-id="3:167">
                npm registry
              </p>
              <p className="font-['JetBrains_Mono:Regular'] font-normal relative shrink-0 text-[#9ca3af] text-[12px]" data-node-id="3:168">
                status.npmjs.org
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full" data-node-id="3:169" data-name="badges-group">
              <div className="bg-[#201315] border border-[#ff3b30] border-solid content-stretch flex items-start px-[8px] py-[4px] relative rounded-[4px] shrink-0" data-node-id="3:170" data-name="badge-1">
                <p className="[word-break:break-word] font-['JetBrains_Mono:Regular'] font-normal leading-[normal] relative shrink-0 text-[#ff3b30] text-[11px] whitespace-nowrap" data-node-id="3:171">
                  89 outages / 22m
                </p>
              </div>
              <div className="bg-[#10261d] border border-[#00ff9d] border-solid content-stretch flex items-start px-[8px] py-[4px] relative rounded-[4px] shrink-0" data-node-id="3:172" data-name="badge-2">
                <p className="[word-break:break-word] font-['JetBrains_Mono:Regular'] font-normal leading-[normal] relative shrink-0 text-[#00ff9d] text-[11px] whitespace-nowrap" data-node-id="3:173">
                  2h+ pays 4x
                </p>
              </div>
            </div>
            <div className="bg-[#1e222a] content-stretch flex items-start justify-center py-[10px] relative rounded-[6px] shrink-0 w-full" data-node-id="3:174" data-name="card-action">
              <p className="[word-break:break-word] font-['JetBrains_Mono:Bold'] font-bold leading-[normal] relative shrink-0 text-[12px] text-white whitespace-nowrap" data-node-id="3:175">
                GET COVER
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="content-stretch flex flex-col gap-[20px] items-start pb-[80px] px-[120px] relative shrink-0 w-full" data-node-id="3:176" data-name="table-section">
        <p className="[word-break:break-word] font-['JetBrains_Mono:Regular'] font-normal leading-[normal] relative shrink-0 text-[#00ff9d] text-[12px] uppercase whitespace-nowrap" data-node-id="3:177">
          Active Ledger
        </p>
        <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-col items-start relative rounded-[12px] shrink-0 w-full" data-node-id="3:178" data-name="table-box">
          <div className="[word-break:break-word] bg-[#14171f] border border-[#1e222a] border-solid content-stretch flex font-['Inter:Semi_Bold'] font-semibold items-start leading-[normal] not-italic p-[16px] relative shrink-0 text-[#9ca3af] text-[13px] w-full" data-node-id="3:179" data-name="table-head">
            <p className="flex-[1_0_0] min-w-px relative" data-node-id="3:180">
              POLICY ID
            </p>
            <p className="flex-[1_0_0] min-w-px relative" data-node-id="3:181">
              PROVIDER
            </p>
            <p className="flex-[1_0_0] min-w-px relative" data-node-id="3:182">
              WINDOW (UTC)
            </p>
            <p className="flex-[1_0_0] min-w-px relative" data-node-id="3:183">
              LIMIT
            </p>
            <p className="flex-[1_0_0] min-w-px relative" data-node-id="3:184">
              PAYOUT
            </p>
            <p className="relative shrink-0 w-[100px]" data-node-id="3:185">
              STATUS
            </p>
          </div>
          <div className="border border-[#1e222a] border-solid content-stretch flex items-start p-[16px] relative shrink-0 w-full" data-node-id="3:186" data-name="row-0">
            <p className="[word-break:break-word] flex-[1_0_0] font-['JetBrains_Mono:Regular'] font-normal leading-[normal] min-w-px relative text-[13px] text-white" data-node-id="3:187">
              github-w38
            </p>
            <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular'] font-normal leading-[normal] min-w-px not-italic relative text-[13px] text-white" data-node-id="3:188">
              GitHub Status API
            </p>
            <p className="[word-break:break-word] flex-[1_0_0] font-['JetBrains_Mono:Regular'] font-normal leading-[normal] min-w-px relative text-[#9ca3af] text-[13px]" data-node-id="3:189">
              Sep 15 - Sep 22 UTC
            </p>
            <p className="[word-break:break-word] flex-[1_0_0] font-['JetBrains_Mono:Regular'] font-normal leading-[normal] min-w-px relative text-[#9ca3af] text-[13px]" data-node-id="3:190">
              240 mins
            </p>
            <p className="[word-break:break-word] flex-[1_0_0] font-['JetBrains_Mono:Bold'] font-bold leading-[normal] min-w-px relative text-[#00ff9d] text-[13px]" data-node-id="3:191">
              5,000 GEN
            </p>
            <div className="content-stretch flex items-start relative shrink-0 w-[100px]" data-node-id="3:192" data-name="td-6">
              <div className="bg-[rgba(0,255,157,0.1)] border border-[#00ff9d] border-solid content-stretch flex items-start px-[8px] py-[2px] relative rounded-[4px] shrink-0" data-node-id="3:193" data-name="Frame">
                <p className="[word-break:break-word] font-['JetBrains_Mono:Regular'] font-normal leading-[normal] relative shrink-0 text-[#00ff9d] text-[11px] whitespace-nowrap" data-node-id="3:194">
                  ACTIVE
                </p>
              </div>
            </div>
          </div>
          <div className="border border-[#1e222a] border-solid content-stretch flex items-start p-[16px] relative shrink-0 w-full" data-node-id="3:195" data-name="row-1">
            <p className="[word-break:break-word] flex-[1_0_0] font-['JetBrains_Mono:Regular'] font-normal leading-[normal] min-w-px relative text-[13px] text-white" data-node-id="3:196">
              discord-w38
            </p>
            <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular'] font-normal leading-[normal] min-w-px not-italic relative text-[13px] text-white" data-node-id="3:197">
              Discord Service
            </p>
            <p className="[word-break:break-word] flex-[1_0_0] font-['JetBrains_Mono:Regular'] font-normal leading-[normal] min-w-px relative text-[#9ca3af] text-[13px]" data-node-id="3:198">
              Sep 15 - Sep 22 UTC
            </p>
            <p className="[word-break:break-word] flex-[1_0_0] font-['JetBrains_Mono:Regular'] font-normal leading-[normal] min-w-px relative text-[#9ca3af] text-[13px]" data-node-id="3:199">
              120 mins
            </p>
            <p className="[word-break:break-word] flex-[1_0_0] font-['JetBrains_Mono:Bold'] font-bold leading-[normal] min-w-px relative text-[#00ff9d] text-[13px]" data-node-id="3:200">
              3,200 GEN
            </p>
            <div className="content-stretch flex items-start relative shrink-0 w-[100px]" data-node-id="3:201" data-name="td-6">
              <div className="bg-[rgba(0,255,157,0.1)] border border-[#00ff9d] border-solid content-stretch flex items-start px-[8px] py-[2px] relative rounded-[4px] shrink-0" data-node-id="3:202" data-name="Frame">
                <p className="[word-break:break-word] font-['JetBrains_Mono:Regular'] font-normal leading-[normal] relative shrink-0 text-[#00ff9d] text-[11px] whitespace-nowrap" data-node-id="3:203">
                  ACTIVE
                </p>
              </div>
            </div>
          </div>
          <div className="border border-[#1e222a] border-solid content-stretch flex items-start p-[16px] relative shrink-0 w-full" data-node-id="3:204" data-name="row-2">
            <p className="[word-break:break-word] flex-[1_0_0] font-['JetBrains_Mono:Regular'] font-normal leading-[normal] min-w-px relative text-[13px] text-white" data-node-id="3:205">
              vercel-w38
            </p>
            <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular'] font-normal leading-[normal] min-w-px not-italic relative text-[13px] text-white" data-node-id="3:206">
              Vercel Edge Platform
            </p>
            <p className="[word-break:break-word] flex-[1_0_0] font-['JetBrains_Mono:Regular'] font-normal leading-[normal] min-w-px relative text-[#9ca3af] text-[13px]" data-node-id="3:207">
              Sep 18 - Sep 25 UTC
            </p>
            <p className="[word-break:break-word] flex-[1_0_0] font-['JetBrains_Mono:Regular'] font-normal leading-[normal] min-w-px relative text-[#9ca3af] text-[13px]" data-node-id="3:208">
              60 mins
            </p>
            <p className="[word-break:break-word] flex-[1_0_0] font-['JetBrains_Mono:Bold'] font-bold leading-[normal] min-w-px relative text-[#00ff9d] text-[13px]" data-node-id="3:209">
              1,500 GEN
            </p>
            <div className="content-stretch flex items-start relative shrink-0 w-[100px]" data-node-id="3:210" data-name="td-6">
              <div className="bg-[rgba(255,184,0,0.1)] border border-[#ffb800] border-solid content-stretch flex items-start px-[8px] py-[2px] relative rounded-[4px] shrink-0" data-node-id="3:211" data-name="Frame">
                <p className="[word-break:break-word] font-['JetBrains_Mono:Regular'] font-normal leading-[normal] relative shrink-0 text-[#ffb800] text-[11px] whitespace-nowrap" data-node-id="3:212">
                  PENDING
                </p>
              </div>
            </div>
          </div>
          <div className="border border-[#1e222a] border-solid content-stretch flex items-start p-[16px] relative shrink-0 w-full" data-node-id="3:213" data-name="row-3">
            <p className="[word-break:break-word] flex-[1_0_0] font-['JetBrains_Mono:Regular'] font-normal leading-[normal] min-w-px relative text-[13px] text-white" data-node-id="3:214">
              netlify-w38
            </p>
            <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular'] font-normal leading-[normal] min-w-px not-italic relative text-[13px] text-white" data-node-id="3:215">
              Netlify Deployer
            </p>
            <p className="[word-break:break-word] flex-[1_0_0] font-['JetBrains_Mono:Regular'] font-normal leading-[normal] min-w-px relative text-[#9ca3af] text-[13px]" data-node-id="3:216">
              Sep 19 - Sep 26 UTC
            </p>
            <p className="[word-break:break-word] flex-[1_0_0] font-['JetBrains_Mono:Regular'] font-normal leading-[normal] min-w-px relative text-[#9ca3af] text-[13px]" data-node-id="3:217">
              240 mins
            </p>
            <p className="[word-break:break-word] flex-[1_0_0] font-['JetBrains_Mono:Bold'] font-bold leading-[normal] min-w-px relative text-[#00ff9d] text-[13px]" data-node-id="3:218">
              8,000 GEN
            </p>
            <div className="content-stretch flex items-start relative shrink-0 w-[100px]" data-node-id="3:219" data-name="td-6">
              <div className="bg-[rgba(0,255,157,0.1)] border border-[#00ff9d] border-solid content-stretch flex items-start px-[8px] py-[2px] relative rounded-[4px] shrink-0" data-node-id="3:220" data-name="Frame">
                <p className="[word-break:break-word] font-['JetBrains_Mono:Regular'] font-normal leading-[normal] relative shrink-0 text-[#00ff9d] text-[11px] whitespace-nowrap" data-node-id="3:221">
                  ACTIVE
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="[word-break:break-word] content-stretch flex flex-col gap-[20px] items-start pb-[80px] px-[120px] relative shrink-0 w-full" data-node-id="3:222" data-name="execution-strip">
        <p className="font-['JetBrains_Mono:Regular'] font-normal leading-[normal] relative shrink-0 text-[#00ff9d] text-[12px] uppercase whitespace-nowrap" data-node-id="3:223">
          Consensus Execution Workflow
        </p>
        <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full" data-node-id="3:224" data-name="strip-blocks">
          <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[12px] items-start min-w-px p-[20px] relative rounded-[8px]" data-node-id="3:225" data-name="step-card-01">
            <div className="content-stretch flex items-center justify-between leading-[normal] relative shrink-0 w-full whitespace-nowrap" data-node-id="3:226" data-name="Frame">
              <p className="font-['Inter:Extra_Bold'] font-extrabold not-italic relative shrink-0 text-[14px] text-white" data-node-id="3:227">
                Fetch Status Page
              </p>
              <p className="font-['JetBrains_Mono:Regular'] font-normal relative shrink-0 text-[#00ff9d] text-[12px]" data-node-id="3:228">
                [01]
              </p>
            </div>
            <p className="font-['Inter:Regular'] font-normal leading-[18px] not-italic relative shrink-0 text-[#9ca3af] text-[13px] w-full" data-node-id="3:229">
              GenLayer smart oracle triggers scheduled requests targeting endpoints.
            </p>
          </div>
          <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[12px] items-start min-w-px p-[20px] relative rounded-[8px]" data-node-id="3:230" data-name="step-card-02">
            <div className="content-stretch flex items-center justify-between leading-[normal] relative shrink-0 w-full whitespace-nowrap" data-node-id="3:231" data-name="Frame">
              <p className="font-['Inter:Extra_Bold'] font-extrabold not-italic relative shrink-0 text-[14px] text-white" data-node-id="3:232">{`Read Rating & Times`}</p>
              <p className="font-['JetBrains_Mono:Regular'] font-normal relative shrink-0 text-[#00ff9d] text-[12px]" data-node-id="3:233">
                [02]
              </p>
            </div>
            <p className="font-['Inter:Regular'] font-normal leading-[18px] not-italic relative shrink-0 text-[#9ca3af] text-[13px] w-full" data-node-id="3:234">
              Validators parse incident timestamps and verify impact severity levels.
            </p>
          </div>
          <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[12px] items-start min-w-px p-[20px] relative rounded-[8px]" data-node-id="3:235" data-name="step-card-03">
            <div className="content-stretch flex items-center justify-between leading-[normal] relative shrink-0 w-full whitespace-nowrap" data-node-id="3:236" data-name="Frame">
              <p className="font-['Inter:Extra_Bold'] font-extrabold not-italic relative shrink-0 text-[14px] text-white" data-node-id="3:237">
                Calculate Duration
              </p>
              <p className="font-['JetBrains_Mono:Regular'] font-normal relative shrink-0 text-[#00ff9d] text-[12px]" data-node-id="3:238">
                [03]
              </p>
            </div>
            <p className="font-['Inter:Regular'] font-normal leading-[18px] not-italic relative shrink-0 text-[#9ca3af] text-[13px] w-full" data-node-id="3:239">
              Incident durations are mathematically evaluated in deterministic consensus.
            </p>
          </div>
          <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[12px] items-start min-w-px p-[20px] relative rounded-[8px]" data-node-id="3:240" data-name="step-card-04">
            <div className="content-stretch flex items-center justify-between leading-[normal] relative shrink-0 w-full whitespace-nowrap" data-node-id="3:241" data-name="Frame">
              <p className="font-['Inter:Extra_Bold'] font-extrabold not-italic relative shrink-0 text-[14px] text-white" data-node-id="3:242">
                Disburse Payout
              </p>
              <p className="font-['JetBrains_Mono:Regular'] font-normal relative shrink-0 text-[#00ff9d] text-[12px]" data-node-id="3:243">
                [04]
              </p>
            </div>
            <p className="font-['Inter:Regular'] font-normal leading-[18px] not-italic relative shrink-0 text-[#9ca3af] text-[13px] w-full" data-node-id="3:244">
              GEN is disbursed immediately from pool lockboxes to target wallet.
            </p>
          </div>
        </div>
      </div>
      <div className="[word-break:break-word] bg-[#121418] border-[#1e222a] border-solid border-t content-stretch flex font-['JetBrains_Mono:Regular'] font-normal items-center justify-between leading-[normal] px-[40px] py-[32px] relative shrink-0 text-[12px] w-full whitespace-nowrap" data-node-id="3:245" data-name="footer">
        <p className="relative shrink-0 text-[#9ca3af]" data-node-id="3:246">
          PERIL Parametric Downtime Protection © 2026. GenLayer Bradbury Testnet Deployment.
        </p>
        <p className="relative shrink-0 text-[#4b5563]" data-node-id="3:247">
          Contract Address: 0x6284f...a81e
        </p>
      </div>
    </div>
  );
}
