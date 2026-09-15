import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

import "@fontsource/ibm-plex-serif/400.css";
import "@fontsource/ibm-plex-serif/600.css";
import "@fontsource/ibm-plex-serif/700.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/700.css";
import "./index.css";

import Home from "./pages/Home";
import BuyCover from "./pages/BuyCover.figma";
import MyCover from "./pages/MyCover.figma";
import PolicyDetail from "./pages/PolicyDetail.figma";
import Pool from "./pages/Pool.figma";
import HowItWorks from "./pages/HowItWorks.figma";
import Evidence from "./pages/Evidence.figma";
import Limits from "./pages/Limits.figma";

/**
 * Hash routes, because GitHub Pages cannot rewrite unknown paths back to
 * index.html. First checkpoint: the Figma pages exactly as exported, before
 * any live data is wired in, so the layout can be compared with the design.
 */
const ROUTES: Record<string, () => React.JSX.Element> = {
  "/": Home,
  "/buy": BuyCover,
  "/my-cover": MyCover,
  "/policy": PolicyDetail,
  "/pool": Pool,
  "/how": HowItWorks,
  "/evidence": Evidence,
  "/limits": Limits,
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

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
