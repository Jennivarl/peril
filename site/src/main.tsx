import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { PrivyProvider } from "@privy-io/react-auth";

import { PRIVY_APP_ID, perilChain, privyEnabled } from "./lib/privy";

import "@fontsource/ibm-plex-serif/400.css";
import "@fontsource/ibm-plex-serif/600.css";
import "@fontsource/ibm-plex-serif/700.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/ibm-plex-sans/700.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/700.css";
import "./index.css";

import Home from "./pages/Home";
import BuyCover from "./pages/BuyCover";
import Explore from "./pages/Explore";
import MyCover from "./pages/MyCover";
import PolicyDetail from "./pages/PolicyDetail";
import Pool from "./pages/Pool";
import HowItWorks from "./pages/HowItWorks";
import Evidence from "./pages/Evidence";
import Limits from "./pages/Limits";
import Profile from "./pages/Profile";

/**
 * Hash routes, because GitHub Pages cannot rewrite unknown paths back to
 * index.html. First checkpoint: the Figma pages exactly as exported, before
 * any live data is wired in, so the layout can be compared with the design.
 */
const ROUTES: Record<string, () => React.JSX.Element> = {
  "/": Home,
  "/explore": Explore,
  "/buy": BuyCover,
  "/my-cover": MyCover,
  "/policy": PolicyDetail,
  "/pool": Pool,
  "/how": HowItWorks,
  "/evidence": Evidence,
  "/limits": Limits,
  "/profile": Profile,
};

function currentPath(): string {
  const hash = window.location.hash.replace(/^#/, "");
  const path = hash.split("?")[0] || "/";
  return path.startsWith("/policy") ? "/policy" : path;
}

function App() {
  const [path, setPath] = useState(currentPath);
  useEffect(() => {
    const onHash = () => {
      setPath(currentPath());
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  const Page = ROUTES[path] ?? Home;
  return <Page />;
}

/**
 * Privy only wraps the app when an app id is configured. Without one its
 * provider throws on mount, and the site must still work as it did.
 */
const tree = privyEnabled ? (
  <PrivyProvider
    appId={PRIVY_APP_ID}
    config={{
      embeddedWallets: { ethereum: { createOnLogin: "users-without-wallets" } },
      defaultChain: perilChain as never,
      supportedChains: [perilChain as never],
      appearance: { theme: "light", accentColor: "#7c3aed" },
    }}
  >
    <App />
  </PrivyProvider>
) : (
  <App />
);

createRoot(document.getElementById("root")!).render(<StrictMode>{tree}</StrictMode>);
