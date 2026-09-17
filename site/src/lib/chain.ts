/**
 * Everything the site reads from the PERIL contract.
 *
 * Every call here is a free view. Nothing is signed and there is nothing to
 * fund, so a visitor with no wallet sees everything except the buttons that
 * spend money.
 */

export const PERIL = "0xA9df0bc18628Ea161077190515aA039026C5D00A";
export const RPC = "https://studio-next.genlayer.com/api";
export const EXPLORER = "https://explorer-studio-dev.genlayer.com";
export const CHAIN_ID = 61997;
export const CHAIN_NAME = "GenLayer Studio Next";
export const REPO = "https://github.com/Jennivarl/peril";

/**
 * genlayer-js ships Studio's dev network with another RPC and id, so the
 * site takes its contract settings and points them at Studio Next.
 */
export async function studioNext() {
  const { studioDevnet } = await import("genlayer-js/chains");
  return {
    ...studioDevnet,
    id: CHAIN_ID,
    name: CHAIN_NAME,
    rpcUrls: { default: { http: [RPC] } },
    blockExplorers: { default: { name: "Studio Next Explorer", url: EXPLORER } },
  };
}

export const addressUrl = (a: string) => `${EXPLORER}/address/${a}`;
export const txUrl = (tx: string) => `${EXPLORER}/tx/${tx}`;

/**
 * PERIL ran on Bradbury before Studio Next. The only real settled claim so
 * far happened there, so the pages that show it read it from Bradbury.
 */
export const BRADBURY_RPC = "https://rpc-bradbury.genlayer.com";
export const bradburyTxUrl = (tx: string) => `https://explorer-bradbury.genlayer.com/tx/${tx}`;

export type Cover = {
  cover: string;
  host: string;
  serious: string[];
  max_window_days: number;
  /** Threshold minutes, as strings, to payout multiple. */
  multiples: Record<string, number>;
};

export type Reserves = {
  pool: string;
  locked: string;
  free: string;
  total_shares: string;
};

export type Shares = { shares: string; redeemable: string };

export type Outcome =
  | ""
  | "pays"
  | "under_threshold"
  | "not_serious"
  | "outside_window"
  | "unresolved";

export type Policy = {
  policy_id: string;
  cover: string;
  host: string;
  window_start: string;
  window_end: string;
  threshold_minutes: number;
  multiple: number;
  premium: string;
  payout: string;
  holder: string;
  state: "open" | "paid" | "closed";
  incident_id: string;
  impact: string;
  outcome: Outcome;
  minutes: number;
  reason: string;
};

type ReadClient = {
  readContract: (a: {
    address: `0x${string}`;
    functionName: string;
    args: unknown[];
  }) => Promise<unknown>;
};

let readerPromise: Promise<ReadClient> | null = null;

/**
 * genlayer-js is most of the site's weight. Importing it dynamically keeps it
 * out of the entry bundle, so pages paint before the library arrives.
 */
function reader(): Promise<ReadClient> {
  if (!readerPromise) {
    readerPromise = (async () => {
      const [{ createClient, createAccount }, chain] = await Promise.all([
        import("genlayer-js"),
        studioNext(),
      ]);
      // A throwaway account: every call made with it is a view.
      return createClient({
        chain: chain as never,
        account: createAccount(),
      }) as unknown as ReadClient;
    })();
  }
  return readerPromise;
}

/** Calldata comes back as Maps for dicts and BigInt for integers. Flatten both. */
function plain(value: unknown): unknown {
  if (value instanceof Map) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of value.entries()) out[String(k)] = plain(v);
    return out;
  }
  if (Array.isArray(value)) return value.map(plain);
  if (typeof value === "bigint") {
    return value <= BigInt(Number.MAX_SAFE_INTEGER) ? Number(value) : value.toString();
  }
  if (value && typeof value === "object" && !(value instanceof Uint8Array)) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) out[k] = plain(v);
    return out;
  }
  return value;
}

/**
 * Studio Next's RPC allows 30 requests a minute, and answers past that with
 * "Rate limit exceeded". The header and a page often want the same read, and
 * people click between pages, so reads are shared: one request per call in
 * flight, reused for a short while. The price list is fixed at deployment,
 * so it is read once per visit. A failed read is never reused.
 */
const FRESH_MS: Record<string, number> = { covered: Infinity };
const DEFAULT_FRESH_MS = 15000;
const reads = new Map<string, { at: number; value: Promise<unknown> }>();

/**
 * Studio Next caps requests twice: 30 a minute and 500 an hour, and answers
 * past either with "Rate limit exceeded". Reloading a page would otherwise
 * spend the whole budget again, so the last good answer for each call is kept
 * in localStorage and reused on the next load. It is a cache of what the
 * chain said, never a substitute for asking.
 */
const STORE_KEY = "peril:reads";
const STORE_FRESH_MS = 120000;

type Stored = { at: number; value: unknown };

function storedReads(): Record<string, Stored> {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) ?? "{}") as Record<string, Stored>;
  } catch {
    return {};
  }
}

function remember(key: string, value: unknown): void {
  try {
    const all = storedReads();
    all[key] = { at: Date.now(), value };
    localStorage.setItem(STORE_KEY, JSON.stringify(all));
  } catch {
    // Storage can be blocked. The site then simply asks the chain again.
  }
}

function recall<T>(key: string, maxAgeMs: number): T | undefined {
  const hit = storedReads()[key];
  if (hit && Date.now() - hit.at < maxAgeMs) return hit.value as T;
  return undefined;
}

async function view<T>(functionName: string, args: unknown[] = []): Promise<T> {
  const key = `${functionName}:${JSON.stringify(args)}`;
  const hit = reads.get(key);
  if (hit && Date.now() - hit.at < (FRESH_MS[functionName] ?? DEFAULT_FRESH_MS)) {
    return hit.value as Promise<T>;
  }

  // A fresh page load reuses what this tab already read, rather than spending
  // the hourly budget on figures it fetched a moment ago.
  const kept = recall<T>(key, functionName === "covered" ? 3600000 : STORE_FRESH_MS);
  if (kept !== undefined) {
    const ready = Promise.resolve(kept);
    reads.set(key, { at: Date.now(), value: ready });
    return ready;
  }

  const value = (async () => {
    try {
      const c = await reader();
      const raw = await c.readContract({
        address: PERIL as `0x${string}`,
        functionName,
        args,
      });
      const flat = plain(raw) as T;
      remember(key, flat);
      return flat;
    } catch (e) {
      // When the chain refuses (a rate limit, a blip), serve the last good
      // answer rather than blanking the page. Only a call that has never
      // succeeded surfaces the error.
      const stale = recall<T>(key, 86400000);
      if (stale !== undefined) return stale;
      reads.delete(key);
      throw e;
    }
  })();
  reads.set(key, { at: Date.now(), value });
  return value;
}

/** Wei amounts can exceed 2^53, so they must stay strings. */
function asWei(v: unknown): string {
  return typeof v === "string" ? v : String(v ?? "0");
}

export async function readCovered(): Promise<Cover[]> {
  const rows = (await view<Cover[] | null>("covered")) ?? [];
  return rows.map((r) => ({
    ...r,
    multiples: Object.fromEntries(
      Object.entries(r.multiples ?? {}).map(([k, v]) => [String(k), Number(v)]),
    ),
  }));
}

export async function readReserves(): Promise<Reserves> {
  const r = await view<Record<string, unknown>>("reserves");
  return {
    pool: asWei(r.pool),
    locked: asWei(r.locked),
    free: asWei(r.free),
    total_shares: asWei(r.total_shares),
  };
}

export async function readSharesOf(address: string): Promise<Shares> {
  const r = await view<Record<string, unknown>>("shares_of", [address]);
  return { shares: asWei(r.shares), redeemable: asWei(r.redeemable) };
}

export async function readPolicyIds(): Promise<string[]> {
  return (await view<string[] | null>("policy_ids")) ?? [];
}

export async function readPolicy(id: string): Promise<Policy> {
  const p = await view<Record<string, unknown>>("get_policy", [id]);
  return {
    ...(p as unknown as Policy),
    premium: asWei(p.premium),
    payout: asWei(p.payout),
    threshold_minutes: Number(p.threshold_minutes),
    multiple: Number(p.multiple),
    minutes: Number(p.minutes),
  };
}

export async function readPolicies(): Promise<Policy[]> {
  const ids = await readPolicyIds();
  return Promise.all(ids.map(readPolicy));
}

/** A wallet's GEN balance in wei, read straight from the RPC. No wallet needed. */
export async function readBalance(address: string): Promise<string> {
  const res = await fetch(RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "eth_getBalance", params: [address, "latest"] }),
  });
  const body = (await res.json()) as { result?: string };
  if (!body.result) throw new Error("no balance returned");
  return BigInt(body.result).toString();
}

// ------------------------------------------------------------------
// what a provider says about itself
// ------------------------------------------------------------------

export type ProviderStatus = { indicator: string; description: string };

/**
 * The provider's own summary of its service right now, from its status page.
 *
 * This is their report, not PERIL watching anything: the contract reads an
 * incident only when a claim names one. It is shown so a visitor can see the
 * same source the validators would read.
 */
export async function readProviderStatus(host: string): Promise<ProviderStatus> {
  const res = await fetch(`https://${host}/api/v2/status.json`);
  if (!res.ok) throw new Error(`${host} returned ${res.status}`);
  const body = (await res.json()) as { status?: Partial<ProviderStatus> };
  if (!body.status?.indicator) throw new Error(`${host} sent no status`);
  return { indicator: body.status.indicator, description: body.status.description ?? "" };
}

/** Every host at once. A provider that will not answer simply has no badge. */
export async function readProviderStatuses(hosts: string[]): Promise<Record<string, ProviderStatus>> {
  const out: Record<string, ProviderStatus> = {};
  await Promise.all(
    hosts.map(async (host) => {
      try {
        out[host] = await readProviderStatus(host);
      } catch {
        // Left out on purpose: no badge is better than a guessed one.
      }
    }),
  );
  return out;
}

// ------------------------------------------------------------------
// transaction lifecycle
// ------------------------------------------------------------------

/** The states a write passes through, in order, as the header tracker shows them. */
export const LIFECYCLE = [
  "PENDING",
  "PROPOSING",
  "COMMITTING",
  "REVEALING",
  "LEADER_REVEALING",
  "ACCEPTED",
  "FINALIZED",
] as const;

/**
 * Studio Next reports statuses in upper snake case ("FINALIZED"); Bradbury
 * used "Finalized" and "LeaderRevealing". Both come out as the former.
 */
export function normalizeStatus(status: string): string {
  return status.replace(/([a-z])([A-Z])/g, "$1_$2").toUpperCase();
}

export async function txStatus(txId: string): Promise<string> {
  const res = await fetch(RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "gen_getTransactionStatus",
      params: [{ txId }],
    }),
  });
  const body = (await res.json()) as { result?: { status?: string } };
  return body?.result?.status ? normalizeStatus(body.result.status) : "UNKNOWN";
}

/**
 * 1 means the call returned normally, 2 means the contract raised. Studio
 * Next has no gen_getTransactionReceipt; the transaction itself carries it.
 */
export async function txExecution(txId: string): Promise<number | null> {
  const res = await fetch(RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "eth_getTransactionByHash",
      params: [txId],
    }),
  });
  const body = (await res.json()) as { result?: { txExecutionResult?: number } };
  return body?.result?.txExecutionResult ?? null;
}

// ------------------------------------------------------------------
// formatting
// ------------------------------------------------------------------

const WEI = 10n ** 18n;

/** Wei to GEN, truncated, never rounded up. */
export function gen(wei: string | bigint, decimals = 2): string {
  const v = typeof wei === "bigint" ? wei : BigInt(wei || "0");
  const whole = v / WEI;
  const frac = (v % WEI).toString().padStart(18, "0").slice(0, decimals);
  const w = whole.toLocaleString("en-US");
  return decimals > 0 ? `${w}.${frac}` : w;
}

/** GEN typed by a person to wei, with BigInt only. */
export function toWei(text: string): bigint {
  const t = text.trim();
  if (!/^\d*\.?\d*$/.test(t) || t === "" || t === ".") throw new Error("Enter an amount in GEN.");
  const [w, f = ""] = t.split(".");
  if (f.length > 18) throw new Error("GEN has 18 decimals at most.");
  return BigInt(w || "0") * WEI + BigInt((f + "0".repeat(18)).slice(0, 18));
}

export const short = (a: string, head = 6, tail = 4) =>
  a && a.length > head + tail ? `${a.slice(0, head)}…${a.slice(-tail)}` : a;

export function hours(minutes: number): string {
  return minutes % 60 === 0 ? `${minutes / 60}h` : `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

export function duration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h ? `${h}h ` : ""}${m}m (${minutes} minutes)`;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-09-13" to "Sep 13". Windows are UTC dates and are never localised. */
export function day(iso: string): string {
  const [, m, d] = iso.split("-");
  return `${MONTHS[Number(m) - 1]} ${Number(d)}`;
}

/** Today's date in UTC, as the contract sees it. */
export function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

export function addDays(iso: string, n: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export function daysBetween(a: string, b: string): number {
  return Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86400000);
}
