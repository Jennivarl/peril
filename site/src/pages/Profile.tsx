import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useRef, useState } from "react";
import { Footer, Header } from "../components/Chrome";
import { addressUrl, gen, readBalance, short, txUrl } from "../lib/chain";
import { useAccount, usePolled } from "../lib/hooks";
import { currentChainId } from "../lib/wallet";
import { privyEnabled, topUp } from "../lib/privy";
import { addressMark, clearProfile, readProfile, toAvatar, writeProfile } from "../lib/profile";

/**
 * The signed-in account: what it holds, what it is called, and how to leave.
 *
 * The balance, the address and the linked email are real. The name and picture
 * are stored in this browser only, because there is no backend and the
 * contract has no profile fields; the page says so rather than pretending
 * otherwise.
 */

function Mark({ address, size }: { address: string; size: number }) {
  const { cells, hue } = addressMark(address);
  const unit = size / 5;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <rect width={size} height={size} rx={size / 8} fill={`hsl(${hue} 70% 94%)`} />
      {cells.map((on, i) =>
        on ? (
          <rect
            key={i}
            x={(i % 5) * unit}
            y={Math.floor(i / 5) * unit}
            width={unit}
            height={unit}
            fill={`hsl(${hue} 62% 46%)`}
          />
        ) : null,
      )}
    </svg>
  );
}

function ProfileBody() {
  const { user, logout } = usePrivy();
  const { account } = useAccount();
  const balance = usePolled(() => (account ? readBalance(account) : Promise.resolve(null)), 30000, [account]);
  const chain = usePolled(() => (account ? currentChainId() : Promise.resolve(null)), 30000, [account]);

  const [profile, setProfile] = useState(readProfile);
  const [draft, setDraft] = useState(profile.name);
  const [note, setNote] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const file = useRef<HTMLInputElement>(null);

  useEffect(() => setDraft(profile.name), [profile.name]);

  const email = user?.email?.address ?? null;

  const saveName = () => {
    const next = { ...profile, name: draft.trim().slice(0, 40) };
    writeProfile(next);
    setProfile(next);
    setNote("Name saved in this browser.");
  };

  const pickAvatar = async (chosen: File | undefined) => {
    if (!chosen) return;
    try {
      const avatar = await toAvatar(chosen);
      const next = { ...profile, avatar };
      writeProfile(next);
      setProfile(next);
      setNote("Picture saved in this browser.");
    } catch (e) {
      setNote(e instanceof Error ? e.message : "That image could not be read.");
    }
  };

  const addFunds = async () => {
    if (!account) return;
    setBusy(true);
    setNote(null);
    const tx = await topUp(account);
    setBusy(false);
    setNote(tx ? "5 GEN sent from the devnet faucet." : "The faucet did not answer. Try again in a moment.");
  };

  if (!account) {
    return (
      <div className="content-stretch flex flex-col gap-[12px] items-start px-[20px] lg:px-[120px] py-[64px] relative shrink-0 w-full">
        <h1 className="font-serif font-extrabold not-italic relative shrink-0 text-[34px] text-[#16141b] m-0">Your account</h1>
        <p className="font-serif not-italic relative shrink-0 text-[#67626f] text-[16px] m-0">
          Create an account from the button in the header, and this page will show what it holds.
        </p>
      </div>
    );
  }

  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start px-[20px] lg:px-[120px] py-[56px] relative shrink-0 w-full" data-name="profile">
      <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0">
        <p className="peril-card-title relative shrink-0 text-[12px] text-[#16141b] m-0">Signed in</p>
        <h1 className="font-serif font-extrabold not-italic relative shrink-0 text-[30px] lg:text-[40px] text-[#16141b] m-0">
          {profile.name || "Your account"}
        </h1>
      </div>

      <div className="content-stretch flex flex-wrap gap-[20px] items-stretch relative shrink-0 w-full">
        {/* who */}
        <div className="peril-glass border border-solid content-stretch flex flex-col gap-[18px] items-start p-[28px] relative rounded-[14px] shrink-0 w-full lg:w-[420px]">
          <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
            <span className="overflow-hidden relative rounded-[12px] shrink-0 size-[72px]">
              {profile.avatar ? (
                <img src={profile.avatar} alt="" className="block h-full object-cover w-full" />
              ) : (
                <Mark address={account} size={72} />
              )}
            </span>
            <div className="content-stretch flex flex-col gap-[6px] items-start min-w-px relative">
              <button
                type="button"
                onClick={() => file.current?.click()}
                className="bg-transparent border border-[#e3ddf0] border-solid cursor-pointer font-mono px-[12px] py-[6px] relative rounded-[100px] shrink-0 text-[#16141b] text-[11px] hover:border-[#6d28d9]"
              >
                {profile.avatar ? "CHANGE PICTURE" : "ADD A PICTURE"}
              </button>
              {profile.avatar && (
                <button
                  type="button"
                  onClick={() => {
                    const next = { ...profile, avatar: "" };
                    writeProfile(next);
                    setProfile(next);
                  }}
                  className="bg-transparent border-0 cursor-pointer font-mono p-0 relative shrink-0 text-[#787384] text-[11px] hover:text-[#16141b]"
                >
                  REMOVE
                </button>
              )}
              <input
                ref={file}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => pickAvatar(e.target.files?.[0])}
              />
            </div>
          </div>

          <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full">
            <label className="font-mono relative shrink-0 text-[#67626f] text-[11px]" htmlFor="display-name">DISPLAY NAME</label>
            <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
              <input
                id="display-name"
                value={draft}
                maxLength={40}
                placeholder="Nobody else will see this"
                onChange={(e) => setDraft(e.target.value)}
                className="bg-[#ffffff] border border-[#e3ddf0] border-solid flex-[1_0_0] font-serif min-w-px px-[12px] py-[9px] relative rounded-[8px] text-[14px] text-[#16141b] outline-none focus:border-[#6d28d9]"
              />
              <button
                type="button"
                onClick={saveName}
                disabled={draft.trim() === profile.name}
                className="peril-cta border-0 content-stretch flex items-center px-[16px] py-[9px] relative rounded-[100px] shrink-0 text-[11px] disabled:opacity-45"
              >
                SAVE
              </button>
            </div>
          </div>

          <p className="font-serif italic leading-[18px] not-italic relative shrink-0 text-[#787384] text-[12px] m-0">
            The name and picture are kept in this browser only. They do not travel with the account and nobody else can see them.
          </p>
        </div>

        {/* what it holds */}
        <div className="peril-glass border border-solid content-stretch flex flex-[1_0_0] flex-col gap-[18px] items-start min-w-0 lg:min-w-[380px] p-[28px] relative rounded-[14px]">
          <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0">
            <p className="font-mono relative shrink-0 text-[#67626f] text-[11px] m-0">BALANCE</p>
            <p className="font-mono font-bold relative shrink-0 text-[34px] m-0">
              <span className="peril-grad-text">{balance.data ? gen(balance.data, 4) : balance.error ? "unavailable" : "…"}</span>
              <span className="ml-[8px] text-[#67626f] text-[15px]">GEN</span>
            </p>
            <p className="font-serif not-italic relative shrink-0 text-[#787384] text-[12px] m-0">Testnet GEN on Studio Next. It has no real-world value.</p>
          </div>

          <div className="border-[rgba(22,20,27,0.1)] border-t border-solid content-stretch flex flex-col gap-[10px] items-start pt-[16px] relative shrink-0 w-full">
            <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full">
              <p className="font-mono shrink-0 text-[#67626f] text-[11px] w-[72px] m-0">ADDRESS</p>
              <p className="flex-[1_0_0] font-mono min-w-px relative text-[#16141b] text-[12px] m-0">{short(account, 10, 8)}</p>
              <button
                type="button"
                onClick={() => navigator.clipboard?.writeText(account).then(() => setNote("Address copied."), () => setNote("Could not copy."))}
                className="bg-transparent border-0 cursor-pointer font-mono p-0 relative shrink-0 text-[#6d28d9] text-[11px] hover:underline"
              >
                COPY
              </button>
              <a href={addressUrl(account)} target="_blank" rel="noreferrer" className="font-mono relative shrink-0 text-[#6d28d9] text-[11px] no-underline hover:underline">
                EXPLORER ↗
              </a>
            </div>

            <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full">
              <p className="font-mono shrink-0 text-[#67626f] text-[11px] w-[72px] m-0">NETWORK</p>
              <p className={`flex-[1_0_0] font-mono min-w-px relative text-[12px] m-0 ${chain.data === 61997 ? "text-[#16141b]" : "text-[#b91c1c]"}`}>
                {chain.data === null || chain.data === undefined
                  ? "…"
                  : chain.data === 61997
                    ? "GenLayer Studio Next (61997)"
                    : `chain ${chain.data} — wrong network, signing will fail`}
              </p>
            </div>

            {email && (
              <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full">
                <p className="font-mono shrink-0 text-[#67626f] text-[11px] w-[72px] m-0">SIGNED IN</p>
                <p className="flex-[1_0_0] font-serif min-w-px not-italic relative text-[#16141b] text-[13px] m-0">{email}</p>
              </div>
            )}

            <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full">
              <p className="font-mono shrink-0 text-[#67626f] text-[11px] w-[72px] m-0">COVER</p>
              <a href="#/my-cover" className="flex-[1_0_0] font-serif min-w-px not-italic relative text-[#6d28d9] text-[13px] no-underline hover:underline">
                See the policies this account holds
              </a>
            </div>
          </div>

          <div className="content-stretch flex flex-wrap gap-[10px] items-center relative shrink-0">
            <button
              type="button"
              onClick={addFunds}
              disabled={busy}
              className="peril-cta border-0 content-stretch flex items-center px-[18px] py-[10px] relative rounded-[100px] shrink-0 text-[11px] disabled:opacity-45"
            >
              {busy ? "SENDING…" : "TOP UP 5 GEN"}
            </button>
            <button
              type="button"
              onClick={() => {
                clearProfile();
                setProfile({ name: "", avatar: "" });
                logout();
              }}
              className="bg-transparent border border-[#e3ddf0] border-solid cursor-pointer font-mono px-[18px] py-[10px] relative rounded-[100px] shrink-0 text-[#16141b] text-[11px] hover:border-[#6d28d9]"
            >
              SIGN OUT
            </button>
          </div>

          {note && <p className="font-mono relative shrink-0 text-[#5b21b6] text-[11px] m-0">{note}</p>}
        </div>
      </div>

      <p className="font-serif not-italic relative shrink-0 text-[#787384] text-[13px] max-w-[760px] m-0">
        {"The faucet is part of the development network, so topping up costs nothing and proves nothing about real funds. Every transaction this account sends is visible in the "}
        <a href={txUrl("").replace(/\/tx\/$/, "")} target="_blank" rel="noreferrer" className="text-[#16141b] underline underline-offset-2">explorer</a>
        {"."}
      </p>
    </div>
  );
}

export default function Profile() {
  return (
    <div className="bg-[#faf8fd] content-stretch flex flex-col items-start min-h-screen mx-auto max-w-[1440px] relative size-full" data-name="peril-profile">
      <Header active="/profile" />
      {privyEnabled ? (
        <ProfileBody />
      ) : (
        <div className="content-stretch flex flex-col gap-[12px] items-start px-[20px] lg:px-[120px] py-[64px] relative shrink-0 w-full">
          <h1 className="font-serif font-extrabold not-italic relative shrink-0 text-[34px] text-[#16141b] m-0">Your account</h1>
          <p className="font-serif not-italic relative shrink-0 text-[#67626f] text-[16px] max-w-[640px] m-0">
            Accounts are switched off in this build, so there is no profile to show. Connect a wallet instead and your cover will appear under My Cover.
          </p>
        </div>
      )}
      <Footer />
    </div>
  );
}
