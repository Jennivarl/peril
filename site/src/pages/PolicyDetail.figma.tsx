
export default function PerilPolicyDetail() {
  return (
    <div className="bg-[#090a0c] content-stretch flex flex-col items-start relative size-full" data-name="peril-policy-detail">
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
      <div className="content-stretch flex gap-[32px] items-start p-[40px] relative shrink-0 w-full" data-name="detail-content">
        <div className="content-stretch flex flex-[1_0_0] flex-col gap-[24px] items-start min-w-px relative" data-name="detail-main">
          <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="detail-meta-header">
            <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Frame">
              <p className="[word-break:break-word] font-mono font-normal leading-[normal] relative shrink-0 text-accent-text text-[12px] whitespace-nowrap">
                LEDGER ACTIVE PARAMETERS
              </p>
              <div className="bg-accent-deep border border-accent-line border-solid content-stretch flex items-start px-[8px] py-[2px] relative rounded-[4px] shrink-0" data-name="Frame">
                <p className="[word-break:break-word] font-mono font-normal leading-[normal] relative shrink-0 text-accent-text text-[11px] whitespace-nowrap">
                  ACTIVE
                </p>
              </div>
            </div>
            <p className="[word-break:break-word] font-mono font-extrabold leading-[normal] relative shrink-0 text-[32px] text-white whitespace-nowrap">
              Policy: github-2026-09-15
            </p>
            <p className="[word-break:break-word] font-mono font-normal leading-[normal] relative shrink-0 text-[#9ca3af] text-[13px] whitespace-nowrap">
              Owner: 0x7b58797f1f0a218d6e355c3c0429f6d708e92e10
            </p>
          </div>
          <div className="[word-break:break-word] content-stretch flex gap-[16px] items-start leading-[normal] relative shrink-0 w-full whitespace-nowrap" data-name="params-grid">
            <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-w-px p-[16px] relative rounded-[8px]" data-name="param-0">
              <p className="font-serif font-normal not-italic relative shrink-0 text-[#9ca3af] text-[12px]">
                Premium Committed
              </p>
              <p className="font-mono font-bold relative shrink-0 text-[18px] text-white">
                2,500 GEN
              </p>
            </div>
            <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-w-px p-[16px] relative rounded-[8px]" data-name="param-1">
              <p className="font-serif font-normal not-italic relative shrink-0 text-[#9ca3af] text-[12px]">
                Multiple Ratio
              </p>
              <p className="font-mono font-bold relative shrink-0 text-[18px] text-white">
                2.0x
              </p>
            </div>
            <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-w-px p-[16px] relative rounded-[8px]" data-name="param-2">
              <p className="font-serif font-normal not-italic relative shrink-0 text-[#9ca3af] text-[12px]">
                Max Potential Payout
              </p>
              <p className="font-mono font-bold relative shrink-0 text-[18px] text-white">
                5,000 GEN
              </p>
            </div>
            <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-w-px p-[16px] relative rounded-[8px]" data-name="param-3">
              <p className="font-serif font-normal not-italic relative shrink-0 text-[#9ca3af] text-[12px]">
                SLA Threshold
              </p>
              <p className="font-mono font-bold relative shrink-0 text-[18px] text-white">
                240 minutes
              </p>
            </div>
          </div>
          <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-col gap-[20px] items-start p-[24px] relative rounded-[12px] shrink-0 w-full" data-name="evidence-panel">
            <p className="[word-break:break-word] font-serif font-bold leading-[normal] not-italic relative shrink-0 text-[16px] text-white whitespace-nowrap">{`Evidence & Measurement Visualization`}</p>
            <div className="[word-break:break-word] content-stretch flex font-normal items-center justify-between leading-[normal] relative shrink-0 text-[14px] w-full whitespace-nowrap" data-name="Frame">
              <p className="font-serif not-italic relative shrink-0 text-[#9ca3af]">
                Measured outage vs policy threshold:
              </p>
              <p className="font-mono relative shrink-0 text-accent-text">
                455 minutes / 240 minute threshold
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full" data-name="Frame">
              <div className="[word-break:break-word] content-stretch flex font-mono font-normal items-start justify-between leading-[normal] relative shrink-0 text-[11px] w-full whitespace-nowrap" data-name="Frame">
                <p className="relative shrink-0 text-[#9ca3af]">
                  THRESHOLD (240m)
                </p>
                <p className="relative shrink-0 text-accent-text">
                  MEASURED OUTAGE (455m)
                </p>
              </div>
              <div className="bg-[#1c1f26] content-stretch flex h-[24px] items-start overflow-clip relative rounded-[4px] shrink-0 w-full" data-name="Frame">
                <div className="bg-[#8ab4f8] h-full relative shrink-0 w-[360px]" data-name="Rectangle" />
                <div className="bg-accent h-full relative shrink-0 w-[200px]" data-name="Rectangle" />
              </div>
            </div>
            <div className="bg-[#14171f] border border-[#1e222a] border-solid content-stretch flex items-start p-[16px] relative rounded-[6px] shrink-0 w-full" data-name="Frame">
              <p className="[word-break:break-word] font-mono font-normal leading-[normal] relative shrink-0 text-[13px] text-white whitespace-nowrap">
                “455 minutes meets the 240 minute threshold”
              </p>
            </div>
            <div className="[word-break:break-word] content-stretch flex font-normal gap-[16px] items-start leading-[normal] relative shrink-0 w-full whitespace-nowrap" data-name="Frame">
              <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="Frame">
                <p className="font-serif not-italic relative shrink-0 text-[#9ca3af] text-[11px]">
                  SOURCE INCIDENT ID
                </p>
                <p className="font-mono relative shrink-0 text-[13px] text-white">
                  zkxwbgr0cnmx
                </p>
              </div>
              <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="Frame">
                <p className="font-serif not-italic relative shrink-0 text-[#9ca3af] text-[11px]">
                  EXTERNAL STATUS API URL
                </p>
                <p className="font-mono relative shrink-0 text-accent-text text-[13px]">{`https://githubstatus.com/incidents/zkxwbgr0cnmx`}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#121418] border border-[#1e222a] border-solid content-stretch flex flex-col gap-[24px] items-start p-[32px] relative rounded-[12px] shrink-0 w-[440px]" data-name="detail-sidebar">
          <p className="[word-break:break-word] font-serif font-bold leading-[normal] not-italic relative shrink-0 text-[18px] text-white whitespace-nowrap">
            Two-Stage Payout Validation
          </p>
          <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="stage-1">
            <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Frame">
              <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Frame">
                <div className="bg-accent-deep border border-accent-line border-solid content-stretch flex items-center justify-center relative rounded-[12px] shrink-0 size-[24px]" data-name="Frame">
                  <p className="[word-break:break-word] font-mono font-extrabold leading-[normal] relative shrink-0 text-accent-text text-[12px] whitespace-nowrap">
                    ✓
                  </p>
                </div>
                <p className="[word-break:break-word] font-serif font-bold leading-[normal] not-italic relative shrink-0 text-[15px] text-white whitespace-nowrap">
                  Settlement Accepted
                </p>
              </div>
              <div className="bg-accent-deep border border-accent-line border-solid content-stretch flex items-start px-[8px] py-[2px] relative rounded-[4px] shrink-0" data-name="Frame">
                <p className="[word-break:break-word] font-mono font-normal leading-[normal] relative shrink-0 text-accent-text text-[11px] whitespace-nowrap">
                  RESOLVED
                </p>
              </div>
            </div>
            <p className="[word-break:break-word] font-serif font-normal leading-[18px] not-italic relative shrink-0 text-[#9ca3af] text-[13px] w-full">
              Smart contract consensus confirmed SLA threshold breach. Consensus duration took approximately 30 seconds.
            </p>
            <div className="[word-break:break-word] content-stretch flex font-normal items-start justify-between leading-[normal] relative shrink-0 text-[11px] w-full whitespace-nowrap" data-name="meta-row">
              <p className="font-serif not-italic relative shrink-0 text-[#4b5563]">
                Tx Hash:
              </p>
              <p className="font-mono relative shrink-0 text-[#9ca3af]">
                0xef56...3a9c
              </p>
            </div>
          </div>
          <div className="bg-[#1e222a] h-px relative shrink-0 w-full" data-name="connector" />
          <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="stage-2">
            <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Frame">
              <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Frame">
                <div className="bg-[#261e13] border border-[#8ab4f8] border-solid content-stretch flex items-center justify-center relative rounded-[12px] shrink-0 size-[24px]" data-name="Frame">
                  <p className="[word-break:break-word] font-mono font-extrabold leading-[normal] relative shrink-0 text-[#8ab4f8] text-[12px] whitespace-nowrap">
                    ⌛
                  </p>
                </div>
                <p className="[word-break:break-word] font-serif font-bold leading-[normal] not-italic relative shrink-0 text-[15px] text-white whitespace-nowrap">
                  Finalized (GEN in Wallet)
                </p>
              </div>
              <div className="bg-[#261e13] border border-[#8ab4f8] border-solid content-stretch flex items-start px-[8px] py-[2px] relative rounded-[4px] shrink-0" data-name="Frame">
                <p className="[word-break:break-word] font-mono font-normal leading-[normal] relative shrink-0 text-[#8ab4f8] text-[11px] whitespace-nowrap">
                  PENDING
                </p>
              </div>
            </div>
            <p className="[word-break:break-word] font-serif font-normal leading-[18px] not-italic relative shrink-0 text-[#9ca3af] text-[13px] w-full">
              Capital lockbox is disabusing the funds to target wallet. L2 finalization takes ~3 minutes after block commitment.
            </p>
            <div className="bg-[#1c1f26] content-stretch flex h-[6px] items-start overflow-clip relative rounded-[3px] shrink-0 w-full" data-name="progress-bar">
              <div className="bg-[#8ab4f8] h-full relative shrink-0 w-[300px]" data-name="Rectangle" />
            </div>
          </div>
          <div className="bg-[#1e222a] h-px relative shrink-0 w-full" data-name="connector-2" />
          <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="audit-panel">
            <p className="[word-break:break-word] font-mono font-normal leading-[normal] relative shrink-0 text-[#4b5563] text-[11px] uppercase whitespace-nowrap">
              AUDIT-READY CONTRACT DATA
            </p>
            <div className="bg-[#14171f] content-stretch flex items-start p-[12px] relative rounded-[6px] shrink-0 w-full" data-name="Frame">
              <p className="[word-break:break-word] flex-[1_0_0] font-mono font-normal leading-[16px] min-w-px relative text-[#9ca3af] text-[11px]">
                Contract: PerilOracleSLA.gen Method: requestSettle(0x9a7b...) StateRoot: 0x38af9de8c7...8a1c
              </p>
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
