const imgPulseDot = "https://www.figma.com/api/mcp/asset/b5acab87-8866-4a52-82d2-dbe8b1d1e453.svg";
const imgStepDot = "https://www.figma.com/api/mcp/asset/d8f244ae-9306-4531-b1c0-00eec263e8d7.svg";
const imgEllipse = "https://www.figma.com/api/mcp/asset/b900c5b9-1ce2-47f3-9cfa-f7f829f1551f.svg";

export default function PerilPool() {
  return (
    <div className="bg-[#090a0c] content-stretch flex flex-col items-start relative size-full" data-node-id="9:5" data-name="peril-pool">
      <div className="bg-[#121418] border-[#1e222a] border-b border-solid content-stretch flex h-[72px] items-center justify-between px-[40px] relative shrink-0 w-full" data-node-id="9:6" data-name="shared-header">
        <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-node-id="9:7" data-name="brand-group">
          <p className="[word-break:break-word] font-['JetBrains_Mono:ExtraBold'] font-extrabold leading-[0] relative shrink-0 text-[22px] text-white whitespace-nowrap" data-node-id="9:8">
            <span className="leading-[normal]">PERIL</span>
            <span className="leading-[normal] text-[#00ff9d]">.</span>
          </p>
          <div className="bg-[#1c1f26] border border-[#1e222a] border-solid content-stretch flex gap-[6px] items-center px-[10px] py-[4px] relative rounded-[4px] shrink-0" data-node-id="9:9" data-name="network-tag">
            <div className="relative shrink-0 size-[8px]" data-node-id="9:10" data-name="pulse-dot">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgPulseDot} />
            </div>
            <p className="[word-break:break-word] font-['JetBrains_Mono:Regular'] font-normal leading-[normal] relative shrink-0 text-[#00ff9d] text-[11px] whitespace-nowrap" data-node-id="9:11">
              Chain ID: 4221 | GenLayer Bradbury
            </p>
          </div>
        </div>
        <div className="bg-[#090a0c] border border-[#1e222a] border-solid content-stretch flex gap-[4px] items-start p-[4px] relative rounded-[8px] shrink-0" data-node-id="9:12" data-name="nav-tabs">
          <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-start px-[16px] py-[8px] relative rounded-[6px] shrink-0" data-node-id="9:13" data-name="tab-home">
            <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#9ca3af] text-[13px] whitespace-nowrap" data-node-id="9:14">
              Home
            </p>
          </div>
          <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-start px-[16px] py-[8px] relative rounded-[6px] shrink-0" data-node-id="9:15" data-name="tab-buy-cover">
            <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#9ca3af] text-[13px] whitespace-nowrap" data-node-id="9:16">
              Buy Cover
            </p>
          </div>
          <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-start px-[16px] py-[8px] relative rounded-[6px] shrink-0" data-node-id="9:17" data-name="tab-my-cover">
            <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#9ca3af] text-[13px] whitespace-nowrap" data-node-id="9:18">
              My Cover
            </p>
          </div>
          <div className="bg-[#121418] content-stretch flex items-start px-[16px] py-[8px] relative rounded-[6px] shrink-0" data-node-id="9:19" data-name="tab-the-pool">
            <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#00ff9d] text-[13px] whitespace-nowrap" data-node-id="9:20">
              The Pool
            </p>
          </div>
          <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-start px-[16px] py-[8px] relative rounded-[6px] shrink-0" data-node-id="9:21" data-name="tab-how-it-works">
            <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#9ca3af] text-[13px] whitespace-nowrap" data-node-id="9:22">
              How It Works
            </p>
          </div>
          <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-start px-[16px] py-[8px] relative rounded-[6px] shrink-0" data-node-id="9:23" data-name="tab-evidence">
            <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#9ca3af] text-[13px] whitespace-nowrap" data-node-id="9:24">
              Evidence
            </p>
          </div>
          <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-start px-[16px] py-[8px] relative rounded-[6px] shrink-0" data-node-id="9:25" data-name="tab-limits">
            <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#9ca3af] text-[13px] whitespace-nowrap" data-node-id="9:26">
              Limits
            </p>
          </div>
        </div>
        <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-node-id="9:27" data-name="wallet-group">
          <div className="bg-[#161b22] border border-[#1e222a] border-solid content-stretch flex items-start px-[12px] py-[6px] relative rounded-[6px] shrink-0" data-node-id="9:28" data-name="balance-chip">
            <p className="[word-break:break-word] font-['JetBrains_Mono:Bold'] font-bold leading-[normal] relative shrink-0 text-[13px] text-white whitespace-nowrap" data-node-id="9:29">
              Free: 2.15 GEN
            </p>
          </div>
          <div className="bg-[#00ff9d] content-stretch flex items-start px-[16px] py-[8px] relative rounded-[6px] shrink-0" data-node-id="9:30" data-name="connect-btn">
            <p className="[word-break:break-word] font-['JetBrains_Mono:Bold'] font-bold leading-[normal] relative shrink-0 text-[#090a0c] text-[13px] whitespace-nowrap" data-node-id="9:31">
              0x7b...9E3c
            </p>
          </div>
        </div>
      </div>
      <div className="bg-[#090a0c] border-[#1e222a] border-b border-solid content-stretch flex items-center justify-between px-[40px] py-[10px] relative shrink-0 w-full" data-node-id="9:32" data-name="tx-tracker">
        <div className="[word-break:break-word] content-stretch flex font-['JetBrains_Mono:Regular'] font-normal gap-[8px] items-center leading-[normal] relative shrink-0 text-[11px] whitespace-nowrap" data-node-id="9:33" data-name="tracker-left">
          <p className="relative shrink-0 text-[#9ca3af] uppercase" data-node-id="9:34">
            CONSENSUS LIFECYCLE:
          </p>
          <p className="relative shrink-0 text-[#00ff9d]" data-node-id="9:35">
            0xef56...3a9c
          </p>
        </div>
        <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-node-id="9:36" data-name="tracker-steps">
          <div className="content-stretch flex items-center relative shrink-0" data-node-id="9:37" data-name="step-0">
            <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-node-id="9:38" data-name="step-dot-wrap">
              <div className="relative shrink-0 size-[6px]" data-node-id="9:39" data-name="step-dot">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgStepDot} />
              </div>
              <p className="[word-break:break-word] font-['JetBrains_Mono:Regular'] font-normal leading-[normal] relative shrink-0 text-[#9ca3af] text-[11px] whitespace-nowrap" data-node-id="9:40">
                Proposing
              </p>
            </div>
          </div>
          <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-node-id="9:41" data-name="step-1">
            <div className="bg-[#00ff9d] h-px relative shrink-0 w-[16px]" data-node-id="9:42" data-name="step-connector" />
            <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-node-id="9:43" data-name="step-dot-wrap">
              <div className="relative shrink-0 size-[6px]" data-node-id="9:44" data-name="step-dot">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgStepDot} />
              </div>
              <p className="[word-break:break-word] font-['JetBrains_Mono:Regular'] font-normal leading-[normal] relative shrink-0 text-[#9ca3af] text-[11px] whitespace-nowrap" data-node-id="9:45">
                Committing
              </p>
            </div>
          </div>
          <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-node-id="9:46" data-name="step-2">
            <div className="bg-[#00ff9d] h-px relative shrink-0 w-[16px]" data-node-id="9:47" data-name="step-connector" />
            <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-node-id="9:48" data-name="step-dot-wrap">
              <div className="relative shrink-0 size-[6px]" data-node-id="9:49" data-name="step-dot">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgStepDot} />
              </div>
              <p className="[word-break:break-word] font-['JetBrains_Mono:Regular'] font-normal leading-[normal] relative shrink-0 text-[#00ff9d] text-[11px] whitespace-nowrap" data-node-id="9:50">
                Accepted
              </p>
            </div>
          </div>
          <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-node-id="9:51" data-name="step-3">
            <div className="bg-[#00ff9d] h-px relative shrink-0 w-[16px]" data-node-id="9:52" data-name="step-connector" />
            <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-node-id="9:53" data-name="step-dot-wrap">
              <div className="relative shrink-0 size-[6px]" data-node-id="9:54" data-name="step-dot">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgStepDot} />
              </div>
              <p className="[word-break:break-word] font-['JetBrains_Mono:Regular'] font-normal leading-[normal] relative shrink-0 text-[#00ff9d] text-[11px] whitespace-nowrap" data-node-id="9:55">
                Finalizing
              </p>
            </div>
          </div>
          <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-node-id="9:56" data-name="step-4">
            <div className="bg-[#00ff9d] h-px relative shrink-0 w-[16px]" data-node-id="9:57" data-name="step-connector" />
            <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-node-id="9:58" data-name="step-dot-wrap">
              <div className="relative shrink-0 size-[6px]" data-node-id="9:59" data-name="step-dot">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgStepDot} />
              </div>
              <p className="[word-break:break-word] font-['JetBrains_Mono:Regular'] font-normal leading-[normal] relative shrink-0 text-[#9ca3af] text-[11px] whitespace-nowrap" data-node-id="9:60">
                Finalized
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="content-stretch flex flex-col gap-[12px] items-start pb-[24px] pt-[48px] px-[120px] relative shrink-0 w-full" data-node-id="9:61" data-name="pool-hero">
        <div className="bg-[rgba(0,255,157,0.1)] border border-[#00ff9d] border-solid content-stretch flex items-start px-[12px] py-[4px] relative rounded-[100px] shrink-0" data-node-id="9:62" data-name="pill-tag">
          <p className="[word-break:break-word] font-['JetBrains_Mono:Bold'] font-bold leading-[normal] relative shrink-0 text-[#00ff9d] text-[11px] whitespace-nowrap" data-node-id="9:63">
            LIQUIDITY ASSURANCE LOCKBOXES
          </p>
        </div>
        <p className="[word-break:break-word] font-['Inter:Extra_Bold'] font-extrabold leading-[normal] min-w-full not-italic relative shrink-0 text-[36px] text-white w-[min-content]" data-node-id="9:64">
          The Capital Pool
        </p>
        <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[22px] not-italic relative shrink-0 text-[#9ca3af] text-[15px] w-[800px]" data-node-id="9:65">
          Parametric coverage requires fully collateralized reserves. LPs supply GEN to underwrite downtime agreements and earn premiums proportional to target risk profiles.
        </p>
      </div>
      <div className="content-stretch flex flex-col gap-[20px] items-start pb-[40px] px-[120px] relative shrink-0 w-full" data-node-id="9:66" data-name="reserves-ribbon">
        <div className="[word-break:break-word] content-stretch flex gap-[16px] items-start leading-[normal] relative shrink-0 w-full" data-node-id="9:67" data-name="stats-row">
          <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-w-px p-[20px] relative rounded-[8px]" data-node-id="9:68" data-name="stat-box">
            <p className="font-['JetBrains_Mono:Regular'] font-normal relative shrink-0 text-[#9ca3af] text-[11px] w-full" data-node-id="9:69">
              TOTAL POOL LIQUIDITY
            </p>
            <p className="font-['JetBrains_Mono:ExtraBold'] font-extrabold relative shrink-0 text-[24px] text-white w-full" data-node-id="9:70">
              4,500,000 GEN
            </p>
            <p className="font-['Inter:Regular'] font-normal not-italic relative shrink-0 text-[#4b5563] text-[12px] w-full" data-node-id="9:71">
              $967,500 USD equivalent
            </p>
          </div>
          <div className="bg-[#121418] border border-[#00ff9d] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-w-px p-[20px] relative rounded-[8px]" data-node-id="9:72" data-name="stat-box">
            <p className="font-['JetBrains_Mono:Regular'] font-normal relative shrink-0 text-[#9ca3af] text-[11px] w-full" data-node-id="9:73">
              LOCKED COVER COLLATERAL
            </p>
            <p className="font-['JetBrains_Mono:ExtraBold'] font-extrabold relative shrink-0 text-[#00ff9d] text-[24px] w-full" data-node-id="9:74">
              1,120,000 GEN
            </p>
            <p className="font-['Inter:Regular'] font-normal not-italic relative shrink-0 text-[#4b5563] text-[12px] w-full" data-node-id="9:75">
              Backing 238 policy agreements
            </p>
          </div>
          <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-w-px p-[20px] relative rounded-[8px]" data-node-id="9:76" data-name="stat-box">
            <p className="font-['JetBrains_Mono:Regular'] font-normal relative shrink-0 text-[#9ca3af] text-[11px] w-full" data-node-id="9:77">
              FREE LIQUIDITY CAPACITY
            </p>
            <p className="font-['JetBrains_Mono:ExtraBold'] font-extrabold relative shrink-0 text-[24px] text-white w-full" data-node-id="9:78">
              3,380,000 GEN
            </p>
            <p className="font-['Inter:Regular'] font-normal not-italic relative shrink-0 text-[#4b5563] text-[12px] w-full" data-node-id="9:79">
              92.4% pool capacity free
            </p>
          </div>
          <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-w-px p-[20px] relative rounded-[8px]" data-node-id="9:80" data-name="stat-box">
            <p className="font-['JetBrains_Mono:Regular'] font-normal relative shrink-0 text-[#9ca3af] text-[11px] w-full" data-node-id="9:81">
              UTILIZATION RATE
            </p>
            <p className="font-['JetBrains_Mono:ExtraBold'] font-extrabold relative shrink-0 text-[24px] text-white w-full" data-node-id="9:82">
              24.88%
            </p>
            <p className="font-['Inter:Regular'] font-normal not-italic relative shrink-0 text-[#4b5563] text-[12px] w-full" data-node-id="9:83">
              Optimal risk-adjusted yield
            </p>
          </div>
        </div>
        <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-col gap-[12px] items-start p-[20px] relative rounded-[12px] shrink-0 w-full" data-node-id="9:84" data-name="gauge-box">
          <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-node-id="9:85" data-name="gauge-labels">
            <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-node-id="9:86" data-name="Frame">
              <div className="relative shrink-0 size-[8px]" data-node-id="9:87" data-name="Ellipse">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgPulseDot} />
              </div>
              <p className="[word-break:break-word] font-['JetBrains_Mono:Regular'] font-normal leading-[normal] relative shrink-0 text-[12px] text-white whitespace-nowrap" data-node-id="9:88">
                Free Liquidity: 3,380,000 GEN (75.12%)
              </p>
            </div>
            <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-node-id="9:89" data-name="Frame">
              <div className="relative shrink-0 size-[8px]" data-node-id="9:90" data-name="Ellipse">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse} />
              </div>
              <p className="[word-break:break-word] font-['JetBrains_Mono:Regular'] font-normal leading-[normal] relative shrink-0 text-[#ffb800] text-[12px] whitespace-nowrap" data-node-id="9:91">
                Locked Collateral: 1,120,000 GEN (24.88%)
              </p>
            </div>
          </div>
          <div className="bg-[#1c1f26] content-stretch flex h-[24px] items-start overflow-clip relative rounded-[6px] shrink-0 w-full" data-node-id="9:92" data-name="gauge-track">
            <div className="bg-[#00ff9d] h-full relative shrink-0 w-[870px]" data-node-id="9:93" data-name="free-fill" />
            <div className="bg-[#ffb800] h-full relative shrink-0 w-[290px]" data-node-id="9:94" data-name="locked-fill" />
          </div>
          <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#4b5563] text-[11px] w-full" data-node-id="9:95">
            * Locked reserves are mathematically constrained by active GenLayer policies. LPs cannot withdraw capital currently backing live coverage.
          </p>
        </div>
      </div>
      <div className="content-stretch flex gap-[24px] items-start pb-[48px] px-[120px] relative shrink-0 w-full" data-node-id="9:96" data-name="pool-interactive">
        <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px relative" data-node-id="9:97" data-name="forms-col">
          <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full" data-node-id="9:98" data-name="forms-grid">
            <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px p-[24px] relative rounded-[12px]" data-node-id="9:99" data-name="fund-card">
              <p className="[word-break:break-word] font-['JetBrains_Mono:ExtraBold'] font-extrabold leading-[normal] relative shrink-0 text-[#00ff9d] text-[16px] w-full" data-node-id="9:100">
                [+] Deposit Capital
              </p>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#9ca3af] text-[13px] w-full" data-node-id="9:101">
                Fund the coverage pool to issue new policies and accumulate a pro-rata share of all underwriting premiums.
              </p>
              <div className="[word-break:break-word] content-stretch flex flex-col gap-[6px] items-start leading-[normal] relative shrink-0 w-full" data-node-id="9:102" data-name="Frame">
                <div className="content-stretch flex font-['JetBrains_Mono:Regular'] font-normal items-start justify-between relative shrink-0 text-[11px] w-full whitespace-nowrap" data-node-id="9:103" data-name="Frame">
                  <p className="relative shrink-0 text-[#9ca3af]" data-node-id="9:104">
                    GEN Amount
                  </p>
                  <p className="relative shrink-0 text-[#4b5563]" data-node-id="9:105">
                    Wallet: 2.15 GEN
                  </p>
                </div>
                <div className="bg-[#090a0c] border border-[#1e222a] border-solid content-stretch flex gap-[8px] items-center p-[12px] relative rounded-[6px] shrink-0 w-full" data-node-id="9:106" data-name="Frame">
                  <p className="flex-[1_0_0] font-['JetBrains_Mono:Bold'] font-bold min-w-px relative text-[14px] text-white" data-node-id="9:107">
                    2.15
                  </p>
                  <p className="font-['JetBrains_Mono:Regular'] font-normal relative shrink-0 text-[#9ca3af] text-[13px] whitespace-nowrap" data-node-id="9:108">
                    GEN
                  </p>
                </div>
              </div>
              <div className="[word-break:break-word] content-stretch flex font-normal items-start justify-between leading-[normal] relative shrink-0 text-[12px] w-full whitespace-nowrap" data-node-id="9:109" data-name="Frame">
                <p className="font-['Inter:Regular'] not-italic relative shrink-0 text-[#9ca3af]" data-node-id="9:110">
                  Projected Shares
                </p>
                <p className="font-['JetBrains_Mono:Regular'] relative shrink-0 text-[#00ff9d]" data-node-id="9:111">
                  210.78 pSHARES
                </p>
              </div>
              <div className="bg-[#00ff9d] content-stretch flex items-start justify-center p-[12px] relative rounded-[6px] shrink-0 w-full" data-node-id="9:112" data-name="deposit-cta">
                <p className="[word-break:break-word] font-['JetBrains_Mono:ExtraBold'] font-extrabold leading-[normal] relative shrink-0 text-[#090a0c] text-[13px] whitespace-nowrap" data-node-id="9:113">
                  DEPOSIT GEN TO POOL
                </p>
              </div>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[16px] not-italic relative shrink-0 text-[#4b5563] text-[11px] w-full" data-node-id="9:114">
                Deposited capital is immediately minted into pool shares at the current exchange rate of 1.02 GEN/pSHARE. Subject to 0.1% deposit fee.
              </p>
            </div>
            <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px p-[24px] relative rounded-[12px]" data-node-id="9:115" data-name="withdraw-card">
              <p className="[word-break:break-word] font-['JetBrains_Mono:ExtraBold'] font-extrabold leading-[normal] relative shrink-0 text-[#ff3b30] text-[16px] w-full" data-node-id="9:116">
                [-] Withdraw Capital
              </p>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#9ca3af] text-[13px] w-full" data-node-id="9:117">
                Redeem your pool shares back into raw GEN token. Only capital not currently locked in active cover can be withdrawn.
              </p>
              <div className="[word-break:break-word] content-stretch flex flex-col gap-[6px] items-start leading-[normal] relative shrink-0 w-full" data-node-id="9:118" data-name="Frame">
                <div className="content-stretch flex font-['JetBrains_Mono:Regular'] font-normal items-start justify-between relative shrink-0 text-[11px] w-full whitespace-nowrap" data-node-id="9:119" data-name="Frame">
                  <p className="relative shrink-0 text-[#9ca3af]" data-node-id="9:120">
                    Shares to Burn
                  </p>
                  <p className="relative shrink-0 text-[#4b5563]" data-node-id="9:121">
                    Max Redeemable: 0.00 pSHARE
                  </p>
                </div>
                <div className="bg-[#090a0c] border border-[#1e222a] border-solid content-stretch flex gap-[8px] items-center p-[12px] relative rounded-[6px] shrink-0 text-[#4b5563] w-full" data-node-id="9:122" data-name="Frame">
                  <p className="flex-[1_0_0] font-['JetBrains_Mono:Bold'] font-bold min-w-px relative text-[14px]" data-node-id="9:123">
                    0.00
                  </p>
                  <p className="font-['JetBrains_Mono:Regular'] font-normal relative shrink-0 text-[13px] whitespace-nowrap" data-node-id="9:124">
                    pSHARES
                  </p>
                </div>
              </div>
              <div className="[word-break:break-word] content-stretch flex font-normal items-start justify-between leading-[normal] relative shrink-0 text-[#9ca3af] text-[12px] w-full whitespace-nowrap" data-node-id="9:125" data-name="Frame">
                <p className="font-['Inter:Regular'] not-italic relative shrink-0" data-node-id="9:126">
                  Est. GEN Payout
                </p>
                <p className="font-['JetBrains_Mono:Regular'] relative shrink-0" data-node-id="9:127">
                  0.00 GEN
                </p>
              </div>
              <div className="bg-[#14171f] border border-[#1e222a] border-solid content-stretch flex items-start justify-center p-[12px] relative rounded-[6px] shrink-0 w-full" data-node-id="9:128" data-name="withdraw-cta">
                <p className="[word-break:break-word] font-['JetBrains_Mono:ExtraBold'] font-extrabold leading-[normal] relative shrink-0 text-[#4b5563] text-[13px] whitespace-nowrap" data-node-id="9:129">
                  WITHDRAW CAPITAL
                </p>
              </div>
              <div className="bg-[rgba(255,59,48,0.12)] border border-[#ff3b30] border-solid content-stretch flex items-start p-[10px] relative rounded-[6px] shrink-0 w-full" data-node-id="9:130" data-name="withdraw-warning">
                <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular'] font-normal leading-[14px] min-w-px not-italic relative text-[#ff3b30] text-[11px]" data-node-id="9:131">
                  ⚠️ Your funder balance is currently 100% locked because your shares are backing live policies. Withdrawals will unlock sequentially as coverage windows expire.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-col gap-[20px] items-start p-[32px] relative rounded-[12px] shrink-0 w-[440px]" data-node-id="9:132" data-name="position-sidebar">
          <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[20px] text-white w-full" data-node-id="9:133">
            Your Funder Position
          </p>
          <div className="bg-[#14171f] border border-[#1e222a] border-solid content-stretch flex items-start p-[12px] relative rounded-[6px] shrink-0 w-full" data-node-id="9:134" data-name="funder-address">
            <p className="[word-break:break-word] flex-[1_0_0] font-['JetBrains_Mono:Regular'] font-normal leading-[normal] min-w-px relative text-[#00ff9d] text-[13px]" data-node-id="9:135">
              shares_of(0x7b58797f1...9E3c)
            </p>
          </div>
          <div className="[word-break:break-word] content-stretch flex flex-col gap-[12px] items-start leading-[normal] relative shrink-0 text-[13px] w-full whitespace-nowrap" data-node-id="9:136" data-name="position-metrics">
            <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-node-id="9:137" data-name="Frame">
              <p className="font-['Inter:Regular'] font-normal not-italic relative shrink-0 text-[#9ca3af]" data-node-id="9:138">
                Total Share Balance
              </p>
              <p className="font-['JetBrains_Mono:Bold'] font-bold relative shrink-0 text-white" data-node-id="9:139">
                250,000 pSHARES
              </p>
            </div>
            <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-node-id="9:140" data-name="Frame">
              <p className="font-['Inter:Regular'] font-normal not-italic relative shrink-0 text-[#9ca3af]" data-node-id="9:141">
                Redeemable Value Now
              </p>
              <p className="font-['JetBrains_Mono:Bold'] font-bold relative shrink-0 text-[#00ff9d]" data-node-id="9:142">
                255,000 GEN
              </p>
            </div>
            <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-node-id="9:143" data-name="Frame">
              <p className="font-['Inter:Regular'] font-normal not-italic relative shrink-0 text-[#9ca3af]" data-node-id="9:144">
                Pool Ownership
              </p>
              <p className="font-['JetBrains_Mono:Bold'] font-bold relative shrink-0 text-white" data-node-id="9:145">
                5.55%
              </p>
            </div>
            <div className="content-stretch flex items-start justify-between relative shrink-0 text-[#9ca3af] w-full" data-node-id="9:146" data-name="Frame">
              <p className="font-['Inter:Regular'] font-normal not-italic relative shrink-0" data-node-id="9:147">
                Avg Cost Basis
              </p>
              <p className="font-['JetBrains_Mono:Bold'] font-bold relative shrink-0" data-node-id="9:148">
                1.00 GEN / pSHARE
              </p>
            </div>
            <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-node-id="9:149" data-name="Frame">
              <p className="font-['Inter:Regular'] font-normal not-italic relative shrink-0 text-[#9ca3af]" data-node-id="9:150">
                Net ROI
              </p>
              <p className="font-['JetBrains_Mono:Bold'] font-bold relative shrink-0 text-[#00ff9d]" data-node-id="9:151">
                +2.00%
              </p>
            </div>
          </div>
          <div className="bg-[#1e222a] h-px relative shrink-0 w-full" data-node-id="9:152" data-name="Rectangle" />
          <div className="[word-break:break-word] content-stretch flex flex-col font-normal gap-[6px] items-start relative shrink-0 text-[#9ca3af] w-full" data-node-id="9:153" data-name="share-dynamics">
            <p className="font-['JetBrains_Mono:Regular'] leading-[normal] relative shrink-0 text-[11px] uppercase whitespace-nowrap" data-node-id="9:154">
              SHARE MECHANICS
            </p>
            <p className="font-['Inter:Regular'] leading-[18px] min-w-full not-italic relative shrink-0 text-[12px] w-[min-content]" data-node-id="9:155">
              Pool shares fluctuate dynamically based on compiled premium distributions vs payout executions. Consensus settlements auto-deduct capital, while expired policies permanently auto-compound premiums into share value.
            </p>
          </div>
        </div>
      </div>
      <div className="content-stretch flex flex-col gap-[20px] items-start pb-[80px] px-[120px] relative shrink-0 w-full" data-node-id="9:156" data-name="exposure-section">
        <p className="[word-break:break-word] font-['JetBrains_Mono:Regular'] font-normal leading-[normal] relative shrink-0 text-[#00ff9d] text-[12px] uppercase whitespace-nowrap" data-node-id="9:157">{`Active Pool Risk & Exposure Breakdown`}</p>
        <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-col items-start relative rounded-[12px] shrink-0 w-full" data-node-id="9:158" data-name="table-box">
          <div className="[word-break:break-word] bg-[#14171f] border border-[#1e222a] border-solid content-stretch flex font-['Inter:Semi_Bold'] font-semibold items-start leading-[normal] not-italic p-[16px] relative shrink-0 text-[#9ca3af] text-[13px] w-full" data-node-id="9:159" data-name="table-head">
            <p className="flex-[1_0_0] min-w-px relative" data-node-id="9:160">
              POLICY ID
            </p>
            <p className="flex-[1_0_0] min-w-px relative" data-node-id="9:161">
              SERVICE
            </p>
            <p className="flex-[1_0_0] min-w-px relative" data-node-id="9:162">
              UTC WINDOW
            </p>
            <p className="flex-[1_0_0] min-w-px relative" data-node-id="9:163">
              LOCKED RESERVES
            </p>
            <p className="flex-[1_0_0] min-w-px relative" data-node-id="9:164">
              THRESHOLD
            </p>
            <p className="relative shrink-0 w-[120px]" data-node-id="9:165">
              EXPOSURE STATUS
            </p>
          </div>
          <div className="border border-[#1e222a] border-solid content-stretch flex items-center p-[16px] relative shrink-0 w-full" data-node-id="9:166" data-name="row-0">
            <p className="[word-break:break-word] flex-[1_0_0] font-['JetBrains_Mono:Regular'] font-normal leading-[normal] min-w-px relative text-[13px] text-white" data-node-id="9:167">
              github-w38
            </p>
            <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular'] font-normal leading-[normal] min-w-px not-italic relative text-[13px] text-white" data-node-id="9:168">
              GitHub Status API
            </p>
            <p className="[word-break:break-word] flex-[1_0_0] font-['JetBrains_Mono:Regular'] font-normal leading-[normal] min-w-px relative text-[#9ca3af] text-[13px]" data-node-id="9:169">
              Sep 15 - Sep 22
            </p>
            <p className="[word-break:break-word] flex-[1_0_0] font-['JetBrains_Mono:Bold'] font-bold leading-[normal] min-w-px relative text-[#00ff9d] text-[13px]" data-node-id="9:170">
              5,000 GEN
            </p>
            <p className="[word-break:break-word] flex-[1_0_0] font-['JetBrains_Mono:Regular'] font-normal leading-[normal] min-w-px relative text-[#9ca3af] text-[13px]" data-node-id="9:171">
              240 mins
            </p>
            <div className="content-stretch flex items-start relative shrink-0 w-[120px]" data-node-id="9:172" data-name="Frame">
              <div className="bg-[rgba(255,59,48,0.12)] border border-[#ff3b30] border-solid content-stretch flex items-start px-[8px] py-[2px] relative rounded-[4px] shrink-0" data-node-id="9:173" data-name="Frame">
                <p className="[word-break:break-word] font-['JetBrains_Mono:Regular'] font-normal leading-[normal] relative shrink-0 text-[#ff3b30] text-[11px] whitespace-nowrap" data-node-id="9:174">
                  BREACH RISK
                </p>
              </div>
            </div>
          </div>
          <div className="border border-[#1e222a] border-solid content-stretch flex items-center p-[16px] relative shrink-0 w-full" data-node-id="9:175" data-name="row-1">
            <p className="[word-break:break-word] flex-[1_0_0] font-['JetBrains_Mono:Regular'] font-normal leading-[normal] min-w-px relative text-[13px] text-white" data-node-id="9:176">
              discord-w38
            </p>
            <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular'] font-normal leading-[normal] min-w-px not-italic relative text-[13px] text-white" data-node-id="9:177">
              Discord Service
            </p>
            <p className="[word-break:break-word] flex-[1_0_0] font-['JetBrains_Mono:Regular'] font-normal leading-[normal] min-w-px relative text-[#9ca3af] text-[13px]" data-node-id="9:178">
              Sep 15 - Sep 22
            </p>
            <p className="[word-break:break-word] flex-[1_0_0] font-['JetBrains_Mono:Bold'] font-bold leading-[normal] min-w-px relative text-[#00ff9d] text-[13px]" data-node-id="9:179">
              3,200 GEN
            </p>
            <p className="[word-break:break-word] flex-[1_0_0] font-['JetBrains_Mono:Regular'] font-normal leading-[normal] min-w-px relative text-[#9ca3af] text-[13px]" data-node-id="9:180">
              120 mins
            </p>
            <div className="content-stretch flex items-start relative shrink-0 w-[120px]" data-node-id="9:181" data-name="Frame">
              <div className="bg-[rgba(0,255,157,0.1)] border border-[#00ff9d] border-solid content-stretch flex items-start px-[8px] py-[2px] relative rounded-[4px] shrink-0" data-node-id="9:182" data-name="Frame">
                <p className="[word-break:break-word] font-['JetBrains_Mono:Regular'] font-normal leading-[normal] relative shrink-0 text-[#00ff9d] text-[11px] whitespace-nowrap" data-node-id="9:183">
                  SECURE
                </p>
              </div>
            </div>
          </div>
          <div className="border border-[#1e222a] border-solid content-stretch flex items-center p-[16px] relative shrink-0 w-full" data-node-id="9:184" data-name="row-2">
            <p className="[word-break:break-word] flex-[1_0_0] font-['JetBrains_Mono:Regular'] font-normal leading-[normal] min-w-px relative text-[13px] text-white" data-node-id="9:185">
              vercel-w38
            </p>
            <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular'] font-normal leading-[normal] min-w-px not-italic relative text-[13px] text-white" data-node-id="9:186">
              Vercel Edge Platform
            </p>
            <p className="[word-break:break-word] flex-[1_0_0] font-['JetBrains_Mono:Regular'] font-normal leading-[normal] min-w-px relative text-[#9ca3af] text-[13px]" data-node-id="9:187">
              Sep 18 - Sep 25
            </p>
            <p className="[word-break:break-word] flex-[1_0_0] font-['JetBrains_Mono:Bold'] font-bold leading-[normal] min-w-px relative text-[#00ff9d] text-[13px]" data-node-id="9:188">
              1,500 GEN
            </p>
            <p className="[word-break:break-word] flex-[1_0_0] font-['JetBrains_Mono:Regular'] font-normal leading-[normal] min-w-px relative text-[#9ca3af] text-[13px]" data-node-id="9:189">
              60 mins
            </p>
            <div className="content-stretch flex items-start relative shrink-0 w-[120px]" data-node-id="9:190" data-name="Frame">
              <div className="bg-[rgba(255,184,0,0.1)] border border-[#ffb800] border-solid content-stretch flex items-start px-[8px] py-[2px] relative rounded-[4px] shrink-0" data-node-id="9:191" data-name="Frame">
                <p className="[word-break:break-word] font-['JetBrains_Mono:Regular'] font-normal leading-[normal] relative shrink-0 text-[#ffb800] text-[11px] whitespace-nowrap" data-node-id="9:192">
                  PENDING
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="[word-break:break-word] bg-[#121418] border-[#1e222a] border-solid border-t content-stretch flex font-['JetBrains_Mono:Regular'] font-normal items-center justify-between leading-[normal] px-[40px] py-[32px] relative shrink-0 text-[12px] w-full whitespace-nowrap" data-node-id="9:193" data-name="footer">
        <p className="relative shrink-0 text-[#9ca3af]" data-node-id="9:194">
          PERIL Parametric Downtime Protection © 2026. GenLayer Bradbury Testnet Deployment.
        </p>
        <p className="relative shrink-0 text-[#4b5563]" data-node-id="9:195">
          Contract Address: 0x6284f...a81e
        </p>
      </div>
    </div>
  );
}
