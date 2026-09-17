import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { short } from "../lib/chain";
import { fundOnce } from "../lib/privy";
import { addressMark, onProfile, readProfile } from "../lib/profile";
import { clearExternalSigner, setExternalSigner } from "../lib/wallet";

/**
 * The header control when accounts are created in the browser rather than
 * connected from an extension. Signing in hands the embedded wallet's provider
 * to wallet.ts, then asks the devnet faucet for enough GEN to actually buy
 * something, because an account that cannot transact is worse than none.
 */
/**
 * The same sign-in, for a page that needs it inside its own layout. The label
 * has to match what the click actually does: this opens Privy, never a wallet
 * extension.
 */
export function PrivyLoginButton({ className, label }: { className: string; label: string }) {
  const { ready, login } = usePrivy();
  return (
    <button type="button" onClick={() => login()} disabled={!ready} className={className}>
      <span className="font-mono font-bold text-[#ffffff] text-[13px]">{ready ? label : "LOADING"}</span>
    </button>
  );
}

export function PrivyControls() {
  const { ready, authenticated, login, logout } = usePrivy();
  const { wallets } = useWallets();
  const [address, setAddress] = useState<string | null>(null);
  const [saved, setSaved] = useState(readProfile);

  useEffect(() => onProfile(setSaved), []);

  useEffect(() => {
    const wallet = wallets[0];
    if (!authenticated || !wallet) {
      clearExternalSigner();
      setAddress(null);
      return;
    }
    let alive = true;
    wallet
      .getEthereumProvider()
      .then(async (p) => {
        if (!alive) return;
        setExternalSigner(p as never, wallet.address);
        setAddress(wallet.address);
        await fundOnce(wallet.address);
      })
      .catch(() => {
        if (alive) setAddress(null);
      });
    return () => {
      alive = false;
    };
  }, [authenticated, wallets]);

  if (authenticated && address) {
    return (
      <div className="content-stretch flex gap-[10px] items-center relative shrink-0" data-name="account-group">
        <a
          href="#/profile"
          title="Your account"
          className="peril-cta content-stretch flex gap-[8px] items-center relative shrink-0 no-underline"
        >
          {saved.avatar ? (
            <img src={saved.avatar} alt="" className="block h-[18px] object-cover rounded-full w-[18px]" />
          ) : (
            <span
              className="h-[18px] rounded-full shrink-0 w-[18px]"
              style={{ background: `hsl(${addressMark(address).hue} 62% 62%)` }}
              aria-hidden="true"
            />
          )}
          <span className="[word-break:break-word] leading-[normal] relative shrink-0 whitespace-nowrap">
            {saved.name ? saved.name.slice(0, 18) : short(address, 4, 4)}
          </span>
        </a>
        <button
          type="button"
          onClick={() => logout()}
          className="bg-transparent border-0 cursor-pointer font-mono p-0 relative shrink-0 text-[#787384] text-[11px] hover:text-[#16141b]"
        >
          SIGN OUT
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => login()}
      disabled={!ready}
      title="Create an account with an email, no wallet needed"
      className="peril-cta border-0 content-stretch flex items-start relative shrink-0"
      data-name="create-account-btn"
    >
      <span className="[word-break:break-word] font-mono font-bold leading-[normal] relative shrink-0 whitespace-nowrap">
        {ready ? "CREATE ACCOUNT" : "LOADING"}
      </span>
    </button>
  );
}
