import { siDiscord, siGithub, siNetlify, siNpm, siVercel } from "simple-icons";

/**
 * The providers' own marks, from simple-icons (CC0). GitHub's and Vercel's
 * brand colours are near black and would vanish on this page, so those two
 * draw in white; the others keep their brand colour.
 */
const ICONS: Record<string, typeof siGithub> = {
  github: siGithub,
  discord: siDiscord,
  netlify: siNetlify,
  npm: siNpm,
  vercel: siVercel,
};

const ON_DARK = new Set(["github", "vercel"]);

export function ProviderIcon({ cover, size = 22 }: { cover: string; size?: number }) {
  const icon = ICONS[cover];
  if (!icon) {
    // A service added to the contract without a mark here still gets a tile.
    return <span className="font-mono font-extrabold text-[13px] text-white">{cover.slice(0, 3).toUpperCase()}</span>;
  }
  return (
    <svg role="img" aria-label={icon.title} viewBox="0 0 24 24" width={size} height={size} fill={ON_DARK.has(cover) ? "#ffffff" : `#${icon.hex}`}>
      <path d={icon.path} />
    </svg>
  );
}
