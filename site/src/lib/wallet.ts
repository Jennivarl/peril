import { CHAIN_ID, PERIL, RPC } from "./chain";

/**
 * Signing, from the visitor's own wallet.
 *
 * The site never asks for a key and never holds funds. Writes return as soon
 * as the transaction is submitted: waiting inside the client inherits its
 * patience, which on this network is shorter than the chain's, and reports
 * failures that later turn out to have succeeded. The caller polls instead.
 */

/** genlayer-js defaults to 3. Every timed-out write in this project ran out of rotations. */
export const MAX_ROTATIONS = 8;

const CHAIN_ID_HEX = `0x${CHAIN_ID.toString(16)}`;

type Eip1193 = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
};

declare global {
  interface Window {
    ethereum?: Eip1193;
  }
}

export function walletAvailable(): boolean {
  return typeof window !== "undefined" && Boolean(window.ethereum);
}

function provider(): Eip1193 {
  const p = window.ethereum;
  if (!p) throw new Error("No wallet found in this browser. Install MetaMask or a similar wallet.");
  return p;
}

/** A readable reason, or null when the visitor simply said no (code 4001). */
export function walletError(err: unknown): string | null {
  const code = (err as { code?: number })?.code;
  if (code === 4001) return null;
  const message = err instanceof Error ? err.message : String(err);
  return message.replace(/^Error:\s*/, "");
}

export async function connect(): Promise<string> {
  const accounts = (await provider().request({ method: "eth_requestAccounts" })) as string[];
  if (!accounts?.length) throw new Error("Wallet returned no accounts.");
  return accounts[0];
}

export async function currentAccount(): Promise<string | null> {
  if (!walletAvailable()) return null;
  try {
    const accounts = (await provider().request({ method: "eth_accounts" })) as string[];
    return accounts?.[0] ?? null;
  } catch {
    return null;
  }
}

export function onAccountsChanged(handler: (account: string | null) => void): () => void {
  if (!walletAvailable() || !window.ethereum?.on) return () => {};
  const wrapped = (...args: unknown[]) => {
    const list = args[0] as string[] | undefined;
    handler(list?.[0] ?? null);
  };
  window.ethereum.on("accountsChanged", wrapped);
  return () => window.ethereum?.removeListener?.("accountsChanged", wrapped);
}

/** Move the wallet to Bradbury, adding it the first time (4902 is expected then). */
export async function ensureChain(): Promise<void> {
  const id = (await provider().request({ method: "eth_chainId" })) as string;
  if (parseInt(id, 16) === CHAIN_ID) return;
  try {
    await provider().request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: CHAIN_ID_HEX }],
    });
  } catch (err) {
    if ((err as { code?: number })?.code !== 4902) throw err;
    await provider().request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: CHAIN_ID_HEX,
          chainName: "GenLayer Bradbury Testnet",
          rpcUrls: [RPC],
          nativeCurrency: { name: "GEN Token", symbol: "GEN", decimals: 18 },
          blockExplorerUrls: ["https://explorer-bradbury.genlayer.com"],
        },
      ],
    });
  }
}

async function write(functionName: string, args: unknown[], value = 0n): Promise<string> {
  await ensureChain();
  const account = (await currentAccount()) ?? (await connect());
  const [{ createClient }, { testnetBradbury }] = await Promise.all([
    import("genlayer-js"),
    import("genlayer-js/chains"),
  ]);
  const client = createClient({
    chain: testnetBradbury,
    account: account as `0x${string}`,
    provider: provider() as never,
  });
  const hash = await client.writeContract({
    address: PERIL as `0x${string}`,
    functionName,
    // Every argument here is a string, number or bigint, all of which
    // genlayer-js encodes; its calldata type is not exported by name.
    args: args as never[],
    value,
    consensusMaxRotations: MAX_ROTATIONS,
  });
  return String(hash);
}

export const buyCover = (
  policyId: string,
  cover: string,
  windowStart: string,
  windowEnd: string,
  thresholdMinutes: number,
  premiumWei: bigint,
) => write("buy", [policyId, cover, windowStart, windowEnd, thresholdMinutes], premiumWei);

export const fundPool = (amountWei: bigint) => write("fund", [], amountWei);

export const withdrawShares = (shares: bigint) => write("withdraw", [shares]);

export const settleClaim = (policyId: string, incidentId: string) =>
  write("settle", [policyId, incidentId]);

export const closePolicy = (policyId: string) => write("close", [policyId]);
