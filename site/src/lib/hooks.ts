import { useEffect, useState } from "react";
import { connect, currentAccount, onAccountsChanged } from "./wallet";

export type Polled<T> = {
  data?: T;
  /** Set when the latest attempt failed. Earlier data is kept, not wiped. */
  error?: string;
  loading: boolean;
};

const message = (e: unknown) => (e instanceof Error ? e.message : String(e));

/**
 * Read something from the chain now, then again every `intervalMs`.
 *
 * A failed read keeps the last good value and records the error, because
 * "unknown right now" and "zero" are different facts and the page must never
 * show one as the other. `intervalMs` of 0 reads once.
 */
export function usePolled<T>(
  fetcher: () => Promise<T>,
  intervalMs = 20000,
  deps: unknown[] = [],
): Polled<T> {
  const [state, setState] = useState<Polled<T>>({ loading: true });
  useEffect(() => {
    let alive = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const run = async () => {
      try {
        const data = await fetcher();
        if (alive) setState({ data, loading: false });
      } catch (e) {
        if (alive) setState((s) => ({ ...s, error: message(e), loading: false }));
      }
      if (alive && intervalMs > 0) timer = setTimeout(run, intervalMs);
    };
    run();
    return () => {
      alive = false;
      if (timer) clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return state;
}

/** The connected wallet account, kept in step with the wallet itself. */
export function useAccount() {
  const [account, setAccount] = useState<string | null>(null);
  useEffect(() => {
    currentAccount().then(setAccount);
    return onAccountsChanged(setAccount);
  }, []);
  const connectWallet = async () => {
    const a = await connect();
    setAccount(a);
    return a;
  };
  return { account, connectWallet };
}

// ------------------------------------------------------------------
// the last transaction this browser submitted, for the lifecycle tracker
// ------------------------------------------------------------------

const TX_KEY = "peril:lastTx";
const txListeners = new Set<(tx: string | null) => void>();

function readTx(): string | null {
  try {
    return localStorage.getItem(TX_KEY);
  } catch {
    return null;
  }
}

export function setLastTx(tx: string) {
  try {
    localStorage.setItem(TX_KEY, tx);
  } catch {
    // Storage can be blocked; the tracker simply stays idle then.
  }
  txListeners.forEach((l) => l(tx));
}

export function useLastTx(): string | null {
  const [tx, setTx] = useState<string | null>(readTx);
  useEffect(() => {
    txListeners.add(setTx);
    return () => {
      txListeners.delete(setTx);
    };
  }, []);
  return tx;
}
