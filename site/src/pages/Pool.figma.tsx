
export default function PerilPool() {
  return (
    <div className="bg-[#090a0c] content-stretch flex flex-col items-start relative size-full" data-name="peril-pool">
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
          <div className="bg-[#121418] content-stretch flex items-start px-[16px] py-[8px] relative rounded-[6px] shrink-0" data-name="tab-the-pool">
            <p className="[word-break:break-word] font-serif font-semibold leading-[normal] not-italic relative shrink-0 text-accent-text text-[13px] whitespace-nowrap">
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
                Proposing
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
                Committing
              </p>
            </div>
          </div>
          <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="step-2">
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
          <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="step-3">
            <div className="bg-accent h-px relative shrink-0 w-[16px]" data-name="step-connector" />
            <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="step-dot-wrap">
              <div className="relative shrink-0 size-[6px]" data-name="step-dot">
                <span className="absolute block inset-0 max-w-none size-full rounded-full bg-accent-line" />
              </div>
              <p className="[word-break:break-word] font-mono font-normal leading-[normal] relative shrink-0 text-accent-text text-[11px] whitespace-nowrap">
                Finalizing
              </p>
            </div>
          </div>
          <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="step-4">
            <div className="bg-accent h-px relative shrink-0 w-[16px]" data-name="step-connector" />
            <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="step-dot-wrap">
              <div className="relative shrink-0 size-[6px]" data-name="step-dot">
                <span className="absolute block inset-0 max-w-none size-full rounded-full bg-accent-line" />
              </div>
              <p className="[word-break:break-word] font-mono font-normal leading-[normal] relative shrink-0 text-[#9ca3af] text-[11px] whitespace-nowrap">
                Finalized
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="content-stretch flex flex-col gap-[12px] items-start pb-[24px] pt-[48px] px-[120px] relative shrink-0 w-full" data-name="pool-hero">
        <div className="bg-accent-tint border border-accent-line border-solid content-stretch flex items-start px-[12px] py-[4px] relative rounded-[100px] shrink-0" data-name="pill-tag">
          <p className="[word-break:break-word] font-mono font-bold leading-[normal] relative shrink-0 text-accent-text text-[11px] whitespace-nowrap">
            LIQUIDITY ASSURANCE LOCKBOXES
          </p>
        </div>
        <p className="[word-break:break-word] font-serif font-extrabold leading-[normal] min-w-full not-italic relative shrink-0 text-[36px] text-white w-[min-content]">
          The Capital Pool
        </p>
        <p className="[word-break:break-word] font-serif font-normal leading-[22px] not-italic relative shrink-0 text-[#9ca3af] text-[15px] w-[800px]">
          Parametric coverage requires fully collateralized reserves. LPs supply GEN to underwrite downtime agreements and earn premiums proportional to target risk profiles.
        </p>
      </div>
      <div className="content-stretch flex flex-col gap-[20px] items-start pb-[40px] px-[120px] relative shrink-0 w-full" data-name="reserves-ribbon">
        <div className="[word-break:break-word] content-stretch flex gap-[16px] items-start leading-[normal] relative shrink-0 w-full" data-name="stats-row">
          <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-w-px p-[20px] relative rounded-[8px]" data-name="stat-box">
            <p className="font-mono font-normal relative shrink-0 text-[#9ca3af] text-[11px] w-full">
              TOTAL POOL LIQUIDITY
            </p>
            <p className="font-mono font-extrabold relative shrink-0 text-[24px] text-white w-full">
              4,500,000 GEN
            </p>
            <p className="font-serif font-normal not-italic relative shrink-0 text-[#4b5563] text-[12px] w-full">
              $967,500 USD equivalent
            </p>
          </div>
          <div className="bg-[#121418] border border-accent-line border-solid content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-w-px p-[20px] relative rounded-[8px]" data-name="stat-box">
            <p className="font-mono font-normal relative shrink-0 text-[#9ca3af] text-[11px] w-full">
              LOCKED COVER COLLATERAL
            </p>
            <p className="font-mono font-extrabold relative shrink-0 text-accent-text text-[24px] w-full">
              1,120,000 GEN
            </p>
            <p className="font-serif font-normal not-italic relative shrink-0 text-[#4b5563] text-[12px] w-full">
              Backing 238 policy agreements
            </p>
          </div>
          <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-w-px p-[20px] relative rounded-[8px]" data-name="stat-box">
            <p className="font-mono font-normal relative shrink-0 text-[#9ca3af] text-[11px] w-full">
              FREE LIQUIDITY CAPACITY
            </p>
            <p className="font-mono font-extrabold relative shrink-0 text-[24px] text-white w-full">
              3,380,000 GEN
            </p>
            <p className="font-serif font-normal not-italic relative shrink-0 text-[#4b5563] text-[12px] w-full">
              92.4% pool capacity free
            </p>
          </div>
          <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-w-px p-[20px] relative rounded-[8px]" data-name="stat-box">
            <p className="font-mono font-normal relative shrink-0 text-[#9ca3af] text-[11px] w-full">
              UTILIZATION RATE
            </p>
            <p className="font-mono font-extrabold relative shrink-0 text-[24px] text-white w-full">
              24.88%
            </p>
            <p className="font-serif font-normal not-italic relative shrink-0 text-[#4b5563] text-[12px] w-full">
              Optimal risk-adjusted yield
            </p>
          </div>
        </div>
        <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-col gap-[12px] items-start p-[20px] relative rounded-[12px] shrink-0 w-full" data-name="gauge-box">
          <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="gauge-labels">
            <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Frame">
              <div className="relative shrink-0 size-[8px]" data-name="Ellipse">
                <span className="absolute block inset-0 max-w-none size-full rounded-full bg-accent-line peril-pulse" />
              </div>
              <p className="[word-break:break-word] font-mono font-normal leading-[normal] relative shrink-0 text-[12px] text-white whitespace-nowrap">
                Free Liquidity: 3,380,000 GEN (75.12%)
              </p>
            </div>
            <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Frame">
              <div className="relative shrink-0 size-[8px]" data-name="Ellipse">
                <span className="absolute block inset-0 max-w-none size-full rounded-full bg-[#8ab4f8]" />
              </div>
              <p className="[word-break:break-word] font-mono font-normal leading-[normal] relative shrink-0 text-[#8ab4f8] text-[12px] whitespace-nowrap">
                Locked Collateral: 1,120,000 GEN (24.88%)
              </p>
            </div>
          </div>
          <div className="bg-[#1c1f26] content-stretch flex h-[24px] items-start overflow-clip relative rounded-[6px] shrink-0 w-full" data-name="gauge-track">
            <div className="bg-accent h-full relative shrink-0 w-[870px]" data-name="free-fill" />
            <div className="bg-[#8ab4f8] h-full relative shrink-0 w-[290px]" data-name="locked-fill" />
          </div>
          <p className="[word-break:break-word] font-serif font-normal leading-[normal] not-italic relative shrink-0 text-[#4b5563] text-[11px] w-full">
            * Locked reserves are mathematically constrained by active GenLayer policies. LPs cannot withdraw capital currently backing live coverage.
          </p>
        </div>
      </div>
      <div className="content-stretch flex gap-[24px] items-start pb-[48px] px-[120px] relative shrink-0 w-full" data-name="pool-interactive">
        <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px relative" data-name="forms-col">
          <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full" data-name="forms-grid">
            <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px p-[24px] relative rounded-[12px]" data-name="fund-card">
              <p className="[word-break:break-word] font-mono font-extrabold leading-[normal] relative shrink-0 text-accent-text text-[16px] w-full">
                [+] Deposit Capital
              </p>
              <p className="[word-break:break-word] font-serif font-normal leading-[normal] not-italic relative shrink-0 text-[#9ca3af] text-[13px] w-full">
                Fund the coverage pool to issue new policies and accumulate a pro-rata share of all underwriting premiums.
              </p>
              <div className="[word-break:break-word] content-stretch flex flex-col gap-[6px] items-start leading-[normal] relative shrink-0 w-full" data-name="Frame">
                <div className="content-stretch flex font-mono font-normal items-start justify-between relative shrink-0 text-[11px] w-full whitespace-nowrap" data-name="Frame">
                  <p className="relative shrink-0 text-[#9ca3af]">
                    GEN Amount
                  </p>
                  <p className="relative shrink-0 text-[#4b5563]">
                    Wallet: 2.15 GEN
                  </p>
                </div>
                <div className="bg-[#090a0c] border border-[#1e222a] border-solid content-stretch flex gap-[8px] items-center p-[12px] relative rounded-[6px] shrink-0 w-full" data-name="Frame">
                  <p className="flex-[1_0_0] font-mono font-bold min-w-px relative text-[14px] text-white">
                    2.15
                  </p>
                  <p className="font-mono font-normal relative shrink-0 text-[#9ca3af] text-[13px] whitespace-nowrap">
                    GEN
                  </p>
                </div>
              </div>
              <div className="[word-break:break-word] content-stretch flex font-normal items-start justify-between leading-[normal] relative shrink-0 text-[12px] w-full whitespace-nowrap" data-name="Frame">
                <p className="font-serif not-italic relative shrink-0 text-[#9ca3af]">
                  Projected Shares
                </p>
                <p className="font-mono relative shrink-0 text-accent-text">
                  210.78 pSHARES
                </p>
              </div>
              <div className="bg-accent content-stretch flex items-start justify-center p-[12px] relative rounded-[6px] shrink-0 w-full" data-name="deposit-cta">
                <p className="[word-break:break-word] font-mono font-extrabold leading-[normal] relative shrink-0 text-[#090a0c] text-[13px] whitespace-nowrap">
                  DEPOSIT GEN TO POOL
                </p>
              </div>
              <p className="[word-break:break-word] font-serif font-normal leading-[16px] not-italic relative shrink-0 text-[#4b5563] text-[11px] w-full">
                Deposited capital is immediately minted into pool shares at the current exchange rate of 1.02 GEN/pSHARE. Subject to 0.1% deposit fee.
              </p>
            </div>
            <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px p-[24px] relative rounded-[12px]" data-name="withdraw-card">
              <p className="[word-break:break-word] font-mono font-extrabold leading-[normal] relative shrink-0 text-[#ff3b30] text-[16px] w-full">
                [-] Withdraw Capital
              </p>
              <p className="[word-break:break-word] font-serif font-normal leading-[normal] not-italic relative shrink-0 text-[#9ca3af] text-[13px] w-full">
                Redeem your pool shares back into raw GEN token. Only capital not currently locked in active cover can be withdrawn.
              </p>
              <div className="[word-break:break-word] content-stretch flex flex-col gap-[6px] items-start leading-[normal] relative shrink-0 w-full" data-name="Frame">
                <div className="content-stretch flex font-mono font-normal items-start justify-between relative shrink-0 text-[11px] w-full whitespace-nowrap" data-name="Frame">
                  <p className="relative shrink-0 text-[#9ca3af]">
                    Shares to Burn
                  </p>
                  <p className="relative shrink-0 text-[#4b5563]">
                    Max Redeemable: 0.00 pSHARE
                  </p>
                </div>
                <div className="bg-[#090a0c] border border-[#1e222a] border-solid content-stretch flex gap-[8px] items-center p-[12px] relative rounded-[6px] shrink-0 text-[#4b5563] w-full" data-name="Frame">
                  <p className="flex-[1_0_0] font-mono font-bold min-w-px relative text-[14px]">
                    0.00
                  </p>
                  <p className="font-mono font-normal relative shrink-0 text-[13px] whitespace-nowrap">
                    pSHARES
                  </p>
                </div>
              </div>
              <div className="[word-break:break-word] content-stretch flex font-normal items-start justify-between leading-[normal] relative shrink-0 text-[#9ca3af] text-[12px] w-full whitespace-nowrap" data-name="Frame">
                <p className="font-serif not-italic relative shrink-0">
                  Est. GEN Payout
                </p>
                <p className="font-mono relative shrink-0">
                  0.00 GEN
                </p>
              </div>
              <div className="bg-[#14171f] border border-[#1e222a] border-solid content-stretch flex items-start justify-center p-[12px] relative rounded-[6px] shrink-0 w-full" data-name="withdraw-cta">
                <p className="[word-break:break-word] font-mono font-extrabold leading-[normal] relative shrink-0 text-[#4b5563] text-[13px] whitespace-nowrap">
                  WITHDRAW CAPITAL
                </p>
              </div>
              <div className="bg-[rgba(255,59,48,0.12)] border border-[#ff3b30] border-solid content-stretch flex items-start p-[10px] relative rounded-[6px] shrink-0 w-full" data-name="withdraw-warning">
                <p className="[word-break:break-word] flex-[1_0_0] font-serif font-normal leading-[14px] min-w-px not-italic relative text-[#ff3b30] text-[11px]">
                  ⚠️ Your funder balance is currently 100% locked because your shares are backing live policies. Withdrawals will unlock sequentially as coverage windows expire.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-col gap-[20px] items-start p-[32px] relative rounded-[12px] shrink-0 w-[440px]" data-name="position-sidebar">
          <p className="[word-break:break-word] font-serif font-bold leading-[normal] not-italic relative shrink-0 text-[20px] text-white w-full">
            Your Funder Position
          </p>
          <div className="bg-[#14171f] border border-[#1e222a] border-solid content-stretch flex items-start p-[12px] relative rounded-[6px] shrink-0 w-full" data-name="funder-address">
            <p className="[word-break:break-word] flex-[1_0_0] font-mono font-normal leading-[normal] min-w-px relative text-accent-text text-[13px]">
              shares_of(0x7b58797f1...9E3c)
            </p>
          </div>
          <div className="[word-break:break-word] content-stretch flex flex-col gap-[12px] items-start leading-[normal] relative shrink-0 text-[13px] w-full whitespace-nowrap" data-name="position-metrics">
            <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Frame">
              <p className="font-serif font-normal not-italic relative shrink-0 text-[#9ca3af]">
                Total Share Balance
              </p>
              <p className="font-mono font-bold relative shrink-0 text-white">
                250,000 pSHARES
              </p>
            </div>
            <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Frame">
              <p className="font-serif font-normal not-italic relative shrink-0 text-[#9ca3af]">
                Redeemable Value Now
              </p>
              <p className="font-mono font-bold relative shrink-0 text-accent-text">
                255,000 GEN
              </p>
            </div>
            <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Frame">
              <p className="font-serif font-normal not-italic relative shrink-0 text-[#9ca3af]">
                Pool Ownership
              </p>
              <p className="font-mono font-bold relative shrink-0 text-white">
                5.55%
              </p>
            </div>
            <div className="content-stretch flex items-start justify-between relative shrink-0 text-[#9ca3af] w-full" data-name="Frame">
              <p className="font-serif font-normal not-italic relative shrink-0">
                Avg Cost Basis
              </p>
              <p className="font-mono font-bold relative shrink-0">
                1.00 GEN / pSHARE
              </p>
            </div>
            <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Frame">
              <p className="font-serif font-normal not-italic relative shrink-0 text-[#9ca3af]">
                Net ROI
              </p>
              <p className="font-mono font-bold relative shrink-0 text-accent-text">
                +2.00%
              </p>
            </div>
          </div>
          <div className="bg-[#1e222a] h-px relative shrink-0 w-full" data-name="Rectangle" />
          <div className="[word-break:break-word] content-stretch flex flex-col font-normal gap-[6px] items-start relative shrink-0 text-[#9ca3af] w-full" data-name="share-dynamics">
            <p className="font-mono leading-[normal] relative shrink-0 text-[11px] uppercase whitespace-nowrap">
              SHARE MECHANICS
            </p>
            <p className="font-serif leading-[18px] min-w-full not-italic relative shrink-0 text-[12px] w-[min-content]">
              Pool shares fluctuate dynamically based on compiled premium distributions vs payout executions. Consensus settlements auto-deduct capital, while expired policies permanently auto-compound premiums into share value.
            </p>
          </div>
        </div>
      </div>
      <div className="content-stretch flex flex-col gap-[20px] items-start pb-[80px] px-[120px] relative shrink-0 w-full" data-name="exposure-section">
        <p className="[word-break:break-word] font-mono font-normal leading-[normal] relative shrink-0 text-accent-text text-[12px] uppercase whitespace-nowrap">{`Active Pool Risk & Exposure Breakdown`}</p>
        <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-col items-start relative rounded-[12px] shrink-0 w-full" data-name="table-box">
          <div className="[word-break:break-word] bg-[#14171f] border border-[#1e222a] border-solid content-stretch flex font-serif font-semibold items-start leading-[normal] not-italic p-[16px] relative shrink-0 text-[#9ca3af] text-[13px] w-full" data-name="table-head">
            <p className="flex-[1_0_0] min-w-px relative">
              POLICY ID
            </p>
            <p className="flex-[1_0_0] min-w-px relative">
              SERVICE
            </p>
            <p className="flex-[1_0_0] min-w-px relative">
              UTC WINDOW
            </p>
            <p className="flex-[1_0_0] min-w-px relative">
              LOCKED RESERVES
            </p>
            <p className="flex-[1_0_0] min-w-px relative">
              THRESHOLD
            </p>
            <p className="relative shrink-0 w-[120px]">
              EXPOSURE STATUS
            </p>
          </div>
          <div className="border border-[#1e222a] border-solid content-stretch flex items-center p-[16px] relative shrink-0 w-full" data-name="row-0">
            <p className="[word-break:break-word] flex-[1_0_0] font-mono font-normal leading-[normal] min-w-px relative text-[13px] text-white">
              github-w38
            </p>
            <p className="[word-break:break-word] flex-[1_0_0] font-serif font-normal leading-[normal] min-w-px not-italic relative text-[13px] text-white">
              GitHub Status API
            </p>
            <p className="[word-break:break-word] flex-[1_0_0] font-mono font-normal leading-[normal] min-w-px relative text-[#9ca3af] text-[13px]">
              Sep 15 - Sep 22
            </p>
            <p className="[word-break:break-word] flex-[1_0_0] font-mono font-bold leading-[normal] min-w-px relative text-accent-text text-[13px]">
              5,000 GEN
            </p>
            <p className="[word-break:break-word] flex-[1_0_0] font-mono font-normal leading-[normal] min-w-px relative text-[#9ca3af] text-[13px]">
              240 mins
            </p>
            <div className="content-stretch flex items-start relative shrink-0 w-[120px]" data-name="Frame">
              <div className="bg-[rgba(255,59,48,0.12)] border border-[#ff3b30] border-solid content-stretch flex items-start px-[8px] py-[2px] relative rounded-[4px] shrink-0" data-name="Frame">
                <p className="[word-break:break-word] font-mono font-normal leading-[normal] relative shrink-0 text-[#ff3b30] text-[11px] whitespace-nowrap">
                  BREACH RISK
                </p>
              </div>
            </div>
          </div>
          <div className="border border-[#1e222a] border-solid content-stretch flex items-center p-[16px] relative shrink-0 w-full" data-name="row-1">
            <p className="[word-break:break-word] flex-[1_0_0] font-mono font-normal leading-[normal] min-w-px relative text-[13px] text-white">
              discord-w38
            </p>
            <p className="[word-break:break-word] flex-[1_0_0] font-serif font-normal leading-[normal] min-w-px not-italic relative text-[13px] text-white">
              Discord Service
            </p>
            <p className="[word-break:break-word] flex-[1_0_0] font-mono font-normal leading-[normal] min-w-px relative text-[#9ca3af] text-[13px]">
              Sep 15 - Sep 22
            </p>
            <p className="[word-break:break-word] flex-[1_0_0] font-mono font-bold leading-[normal] min-w-px relative text-accent-text text-[13px]">
              3,200 GEN
            </p>
            <p className="[word-break:break-word] flex-[1_0_0] font-mono font-normal leading-[normal] min-w-px relative text-[#9ca3af] text-[13px]">
              120 mins
            </p>
            <div className="content-stretch flex items-start relative shrink-0 w-[120px]" data-name="Frame">
              <div className="bg-accent-tint border border-accent-line border-solid content-stretch flex items-start px-[8px] py-[2px] relative rounded-[4px] shrink-0" data-name="Frame">
                <p className="[word-break:break-word] font-mono font-normal leading-[normal] relative shrink-0 text-accent-text text-[11px] whitespace-nowrap">
                  SECURE
                </p>
              </div>
            </div>
          </div>
          <div className="border border-[#1e222a] border-solid content-stretch flex items-center p-[16px] relative shrink-0 w-full" data-name="row-2">
            <p className="[word-break:break-word] flex-[1_0_0] font-mono font-normal leading-[normal] min-w-px relative text-[13px] text-white">
              vercel-w38
            </p>
            <p className="[word-break:break-word] flex-[1_0_0] font-serif font-normal leading-[normal] min-w-px not-italic relative text-[13px] text-white">
              Vercel Edge Platform
            </p>
            <p className="[word-break:break-word] flex-[1_0_0] font-mono font-normal leading-[normal] min-w-px relative text-[#9ca3af] text-[13px]">
              Sep 18 - Sep 25
            </p>
            <p className="[word-break:break-word] flex-[1_0_0] font-mono font-bold leading-[normal] min-w-px relative text-accent-text text-[13px]">
              1,500 GEN
            </p>
            <p className="[word-break:break-word] flex-[1_0_0] font-mono font-normal leading-[normal] min-w-px relative text-[#9ca3af] text-[13px]">
              60 mins
            </p>
            <div className="content-stretch flex items-start relative shrink-0 w-[120px]" data-name="Frame">
              <div className="bg-[rgba(138,180,248,0.1)] border border-[#8ab4f8] border-solid content-stretch flex items-start px-[8px] py-[2px] relative rounded-[4px] shrink-0" data-name="Frame">
                <p className="[word-break:break-word] font-mono font-normal leading-[normal] relative shrink-0 text-[#8ab4f8] text-[11px] whitespace-nowrap">
                  PENDING
                </p>
              </div>
            </div>
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
