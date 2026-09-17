import { CHAIN_ID, CHAIN_NAME, EXPLORER, RPC } from "./chain";

/**
 * Signing in without a wallet extension.
 *
 * Privy creates an embedded wallet for an email or social login, so a visitor
 * who has never held a key can still buy cover. The site never sees that key:
 * it only receives the wallet's EIP-1193 provider, the same shape an extension
 * gives, so the signing path in wallet.ts is unchanged.
 *
 * The app id is public by design. It identifies the app to Privy and
 * authorises nothing. Without one, privyEnabled is false and the site falls
 * back to the injected wallet exactly as before.
 */

const env = (import.meta as unknown as { env?: Record<string, string | undefined> }).env ?? {};

export const PRIVY_APP_ID = env.VITE_PRIVY_APP_ID ?? "cmu4yr4g600zx0dicchzypk04";
export const privyEnabled = PRIVY_APP_ID.length > 0;

/** Studio Next as a viem chain, for Privy's supportedChains. */
export const perilChain = {
  id: CHAIN_ID,
  name: CHAIN_NAME,
  nativeCurrency: { name: "GEN Token", symbol: "GEN", decimals: 18 },
  rpcUrls: { default: { http: [RPC] } },
  blockExplorers: { default: { name: "Studio Next Explorer", url: EXPLORER } },
  testnet: true,
};

const FUNDED_KEY = "peril:funded";

function alreadyFunded(address: string): boolean {
  try {
    return (localStorage.getItem(FUNDED_KEY) ?? "").split(",").includes(address.toLowerCase());
  } catch {
    return false;
  }
}

function markFunded(address: string) {
  try {
    const seen = (localStorage.getItem(FUNDED_KEY) ?? "").split(",").filter(Boolean);
    seen.push(address.toLowerCase());
    localStorage.setItem(FUNDED_KEY, seen.join(","));
  } catch {
    // Storage can be blocked. The worst case is asking the faucet twice.
  }
}

/**
 * A new account holds no GEN, and cover cannot be bought with nothing. Studio
 * Next is a devnet with a faucet, so first sign-in asks it for enough to buy a
 * policy. Returns the funding transaction, or null if the faucet refused;
 * either way the account still reads everything.
 */
/**
 * Ask the devnet faucet for more GEN, every time it is called. `fundOnce`
 * refuses after the first grant; this is the button on the profile page.
 * Returns the funding transaction, or null if the faucet refused.
 */
export async function topUp(address: string): Promise<string | null> {
  try {
    const res = await fetch(RPC, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "sim_fundAccount",
        params: [address, 5000000000000000000],
      }),
    });
    const body = (await res.json()) as { result?: string };
    return typeof body.result === "string" ? body.result : null;
  } catch {
    return null;
  }
}

export async function fundOnce(address: string): Promise<string | null> {
  if (alreadyFunded(address)) return null;
  try {
    const res = await fetch(RPC, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "sim_fundAccount",
        params: [address, 5000000000000000000],
      }),
    });
    const body = (await res.json()) as { result?: string };
    if (typeof body.result === "string") {
      markFunded(address);
      return body.result;
    }
    return null;
  } catch {
    return null;
  }
}
