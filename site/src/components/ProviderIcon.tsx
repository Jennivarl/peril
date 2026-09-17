import { siDiscord, siGithub, siNetlify, siNpm, siVercel } from "simple-icons";

/**
 * The providers' own marks, from simple-icons (CC0). Every mark keeps its
 * brand colour: the page is cream, so GitHub's and Vercel's near black read
 * correctly rather than needing to be inverted.
 */
const ICONS: Record<string, typeof siGithub> = {
  github: siGithub,
  discord: siDiscord,
  netlify: siNetlify,
  npm: siNpm,
  vercel: siVercel,
};

export function ProviderIcon({ cover, size = 22 }: { cover: string; size?: number }) {
  const icon = ICONS[cover];
  if (!icon) {
    // A service added to the contract without a mark here still gets a tile.
    return <span className="font-mono font-extrabold text-[13px] text-[#16141b]">{cover.slice(0, 3).toUpperCase()}</span>;
  }
  return (
    <svg role="img" aria-label={icon.title} viewBox="0 0 24 24" width={size} height={size} fill={`#${icon.hex}`}>
      <path d={icon.path} />
    </svg>
  );
}
