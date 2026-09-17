import { CHAIN_ID, CHAIN_NAME, EXPLORER, PERIL, RPC, studioNext } from "./chain";

/**
 * Signing, from the visitor's own wallet.
 *
 * The site never asks for a key and never holds funds. Writes return as soon
 * as the transaction is submitted: waiting inside the client inherits its
 * patience, which on this network is shorter than the chain's, and reports
 * failures that later turn out to have succeeded. The caller polls instead.
 */

const CHAIN_ID_HEX = `0x${CHAIN_ID.toString(16)}`;

type Eip1193 = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
};

/**
 * The extension's provider, when the browser has one. Privy's types declare
 * window.ethereum themselves, so it is read through a cast here rather than
 * declared a second time, which the compiler rejects.
 */
const injected = (): Eip1193 | undefined =>
  typeof window === "undefined" ? undefined : (window as unknown as { ethereum?: Eip1193 }).ethereum;

/**
 * An account created in the browser (Privy) supplies the same EIP-1193 shape
 * an extension does, so it is held here and used in its place. The key stays
 * inside that provider; this module only ever calls request().
 */
let external: { provider: Eip1193; address: string } | null = null;
const accountListeners = new Set<(account: string | null) => void>();

export function setExternalSigner(p: Eip1193, address: string) {
  external = { provider: p, address };
  accountListeners.forEach((l) => l(address));
}

export function clearExternalSigner() {
  if (!external) return;
  external = null;
  accountListeners.forEach((l) => l(null));
}

export function walletAvailable(): boolean {
  return Boolean(external) || Boolean(injected());
}

function provider(): Eip1193 {
  if (external) return external.provider;
  const p = injected();
  if (!p) throw new Error("No wallet found in this browser. Install MetaMask or a similar wallet.");
  return p;
}

/**
 * A readable reason, or null when the visitor simply said no (code 4001).
 *
 * viem wraps an RPC refusal in a generic headline and keeps the useful part in
 * shortMessage, details, metaMessages or a nested cause. Showing only the
 * headline tells a user "missing or invalid parameters" and nothing else, so
 * every layer is unwrapped and the first specific line wins.
 */
export function walletError(err: unknown): string | null {
  const code = (err as { code?: number })?.code;
  if (code === 4001) return null;

  const seen = new Set<unknown>();
  const parts: string[] = [];
  let node: unknown = err;
  while (node && !seen.has(node)) {
    seen.add(node);
    const e = node as { shortMessage?: string; details?: string; metaMessages?: string[]; message?: string; cause?: unknown };
    for (const piece of [e.shortMessage, e.details, ...(e.metaMessages ?? [])]) {
      if (typeof piece === "string" && piece.trim() && !parts.includes(piece.trim())) parts.push(piece.trim());
    }
    node = e.cause;
  }
  if (!parts.length) {
    const message = err instanceof Error ? err.message : String(err);
    parts.push(message.replace(/^Error:\s*/, ""));
  }
  return parts.slice(0, 3).join(" — ");
}

/** The chain the signer is actually on, or null if it will not say. */
export async function currentChainId(): Promise<number | null> {
  try {
    const id = (await provider().request({ method: "eth_chainId" })) as string;
    return parseInt(id, 16);
  } catch {
    return null;
  }
}

export async function connect(): Promise<string> {
  if (external) return external.address;
  const accounts = (await provider().request({ method: "eth_requestAccounts" })) as string[];
  if (!accounts?.length) throw new Error("Wallet returned no accounts.");
  return accounts[0];
}

export async function currentAccount(): Promise<string | null> {
  if (external) return external.address;
  if (!walletAvailable()) return null;
  try {
    const accounts = (await provider().request({ method: "eth_accounts" })) as string[];
    return accounts?.[0] ?? null;
  } catch {
    return null;
  }
}

export function onAccountsChanged(handler: (account: string | null) => void): () => void {
  // An in-browser account changes through setExternalSigner, not through the
  // extension's event, so both are watched.
  accountListeners.add(handler);
  const stopExternal = () => accountListeners.delete(handler);
  const eth = injected();
  if (!eth?.on) return stopExternal;
  const wrapped = (...args: unknown[]) => {
    const list = args[0] as string[] | undefined;
    handler(list?.[0] ?? null);
  };
  eth.on("accountsChanged", wrapped);
  return () => {
    stopExternal();
    eth.removeListener?.("accountsChanged", wrapped);
  };
}

/** Move the wallet to Studio Next, adding it the first time (4902 is expected then). */
export async function ensureChain(): Promise<void> {
  const id = (await provider().request({ method: "eth_chainId" })) as string;
  if (parseInt(id, 16) === CHAIN_ID) return;
  // An embedded wallet may not implement the switch call, but it must still
  // end up on Studio Next: signing for another chain is what produces viem's
  // "missing or invalid parameters" further down.
  if (external) {
    try {
      await provider().request({ method: "wallet_switchEthereumChain", params: [{ chainId: CHAIN_ID_HEX }] });
    } catch {
      // Checked below rather than assumed.
    }
    const after = (await provider().request({ method: "eth_chainId" })) as string;
    const on = parseInt(after, 16);
    if (on !== CHAIN_ID) {
      throw new Error(`This account is on chain ${on}, not ${CHAIN_NAME} (${CHAIN_ID}). It cannot sign here.`);
    }
    return;
  }
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
          chainName: CHAIN_NAME,
          rpcUrls: [RPC],
          nativeCurrency: { name: "GEN Token", symbol: "GEN", decimals: 18 },
          blockExplorerUrls: [EXPLORER],
        },
      ],
    });
  }
}

/**
 * Wrap a signer so every call it makes is recorded.
 *
 * A failure anywhere between the fee estimate and the send arrives as one
 * generic viem headline, which names neither the method nor the step. The
 * trace turns that into "eth_sendTransaction failed: ..." so the next fix is
 * aimed rather than guessed.
 */
/**
 * Broadcast a transaction ourselves instead of letting the wallet do it.
 *
 * An in-browser account signs correctly, but it submits through its own
 * infrastructure, which has no route to this development network: the hash it
 * returns never reaches consensus. So the wallet is asked only to sign, and
 * the signed transaction is posted straight to Studio Next.
 *
 * A wallet will not sign a half-filled transaction, so the fields it expects
 * to supply itself are read from the node first.
 */
async function rpc(method: string, params: unknown[]): Promise<string> {
  const res = await fetch(RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: Date.now(), method, params }),
  });
  const body = (await res.json()) as { result?: string; error?: { message?: string } };
  if (body.error) throw new Error(`${method}: ${body.error.message ?? "failed"}`);
  if (typeof body.result !== "string") throw new Error(`${method}: no result`);
  return body.result;
}

async function signAndSend(p: Eip1193, tx: Record<string, unknown>, log: string[]): Promise<string> {
  const from = String(tx.from ?? "");
  const [nonce, gasPrice] = await Promise.all([
    rpc("eth_getTransactionCount", [from, "pending"]),
    rpc("eth_gasPrice", []),
  ]);
  let gas = tx.gas as string | undefined;
  if (!gas || gas === "0x0") {
    try {
      gas = await rpc("eth_estimateGas", [{ from, to: tx.to, value: tx.value ?? "0x0", data: tx.data ?? "0x" }]);
    } catch {
      gas = "0x7a120";
    }
  }
  const filled = {
    from,
    to: tx.to,
    value: tx.value ?? "0x0",
    data: tx.data ?? "0x",
    nonce,
    gas,
    gasPrice: gasPrice === "0x0" ? "0x1" : gasPrice,
    chainId: CHAIN_ID_HEX,
  };
  log.push(`signing locally nonce=${nonce} gas=${gas}`);
  const signed = (await p.request({ method: "eth_signTransaction", params: [filled] })) as string;
  log.push(`signed ${String(signed).slice(0, 14)}…`);
  const hash = await rpc("eth_sendRawTransaction", [signed]);
  log.push(`broadcast ${hash.slice(0, 14)}…`);
  return hash;
}

function traced(p: Eip1193, log: string[]): Eip1193 {
  return {
    request: async (args) => {
      // The wallet signs; we broadcast.
      if (external && args.method === "eth_sendTransaction") {
        const tx = (args.params?.[0] ?? {}) as Record<string, unknown>;
        try {
          return await signAndSend(p, tx, log);
        } catch (e) {
          const why = (e as { shortMessage?: string; message?: string })?.shortMessage ?? (e as Error)?.message ?? String(e);
          log.push(`sign-and-send FAILED: ${String(why).slice(0, 180)}`);
          throw e;
        }
      }
      try {
        const result = await p.request(args);
        // Record what was actually asked for, not just the method name: a
        // transaction that never reaches consensus is usually malformed here.
        if (args.method === "eth_sendTransaction") {
          const tx = (args.params?.[0] ?? {}) as { to?: string; value?: string; data?: string; from?: string };
          log.push(`eth_sendTransaction ok to=${tx.to ?? "?"} value=${tx.value ?? "none"} data=${(tx.data ?? "").slice(0, 18)}…`);
        } else {
          log.push(`${args.method} ok`);
        }
        return result;
      } catch (e) {
        const why = (e as { shortMessage?: string; message?: string })?.shortMessage ?? (e as Error)?.message ?? String(e);
        const extra =
          args.method === "eth_sendTransaction"
            ? ` params=${JSON.stringify(args.params?.[0] ?? {}).slice(0, 220)}`
            : "";
        log.push(`${args.method} FAILED: ${String(why).slice(0, 160)}${extra}`);
        throw e;
      }
    },
    on: p.on ? (event, handler) => p.on?.(event, handler) : undefined,
    removeListener: p.removeListener ? (event, handler) => p.removeListener?.(event, handler) : undefined,
  };
}

async function write(functionName: string, args: unknown[], value = 0n): Promise<string> {
  await ensureChain();
  const account = (await currentAccount()) ?? (await connect());
  const [{ createClient }, chain] = await Promise.all([import("genlayer-js"), studioNext()]);
  const rpcLog: string[] = [];
  // The account MUST stay a plain address string. genlayer-js decides whether
  // to sign through the wallet with `typeof config.account !== "object"`, so an
  // account object routes eth_sendTransaction to the node instead, which holds
  // no keys and answers "method not found".
  const client = createClient({
    chain: chain as never,
    account: account as `0x${string}`,
    provider: traced(provider(), rpcLog) as never,
  });
  const address = PERIL as `0x${string}`;
  // Every argument here is a string, number or bigint, all of which
  // genlayer-js encodes; its calldata type is not exported by name.
  const callArgs = args as never[];
  // Studio Next charges each transaction up front, and a call that pays a
  // wallet must also reserve a fee for that payment or it fails with "fee
  // no_matching_allocation". Simulating the call first returns both.
  // Studio Next's simulator will only run a call that takes no arguments:
  // sim_estimateTransactionFees answers "execution failed" for every other
  // shape, including a method that does not exist. Verified against the live
  // node: fund() estimates, fund("x") does not, and neither does any buy.
  //
  // So the estimate is advice, not a gate. A failed estimate must not stop the
  // transaction: only a call that pays a wallet needs the allocation it
  // returns, and buy pays nobody. When it fails, send without a preset and let
  // the node apply its own.
  let step = "estimating the fee";
  let fees: { distribution: unknown; messageAllocations: unknown; feeValue: unknown } | undefined;
  try {
    const est = await client.estimateTransactionFeesForWrite({ address, functionName, args: callArgs, value });
    fees = { distribution: est.distribution, messageAllocations: est.messageAllocations, feeValue: est.feeValue };
  } catch {
    // The per-call estimate needs the simulator, which refuses anything with
    // arguments. The generic estimate does not simulate, and the consensus
    // contract rejects a zero fee (FeeValueMustBeNonZero), so use it instead.
    // buy pays no wallet, so no message allocation is needed.
    try {
      const base = await client.estimateTransactionFees();
      fees = { distribution: base.distribution, messageAllocations: [], feeValue: base.feeValue };
    } catch {
      fees = undefined;
    }
  }

  try {
    step = fees ? "sending the transaction" : "sending the transaction without a fee estimate";
    const hash = await client.writeContract({
      address,
      functionName,
      args: callArgs,
      value,
      ...(fees ? { fees: fees as never } : {}),
    });
    return String(hash);
  } catch (e) {
    const detail = walletError(e) ?? "cancelled";
    if (detail === "cancelled") throw e;
    // An in-browser account signs, but Privy submits through its own
    // infrastructure, which has no route to this development network: the
    // hash it returns never reaches consensus. Say that plainly instead of
    // showing a raw RPC error nobody can act on.
    const trail = rpcLog.length ? ` [${step}; calls: ${rpcLog.join(" | ")}]` : ` [${step}]`;
    throw new Error(detail + trail);
  }
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
