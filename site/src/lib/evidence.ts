/**
 * What the site says about each covered service that the contract does not
 * store: a display name and how often it had a serious outage.
 *
 * The counts are incidents each provider itself rated major or critical over
 * twelve months, from deploy/price_table.py (run 2026-09-11; the raw incidents
 * are in deploy/price_table.json). They are the evidence the prices were
 * derived from. The prices themselves are always read live from covered().
 */

export const SERVICE_NAMES: Record<string, string> = {
  github: "GitHub",
  discord: "Discord",
  vercel: "Vercel",
  netlify: "Netlify",
  npm: "npm",
};

export const SERIOUS_OUTAGES_12M: Record<string, number> = {
  github: 77,
  discord: 34,
  vercel: 30,
  netlify: 23,
  npm: 4,
};

/**
 * From deploy/price_table.json (sha256 1f7f96d2...d415c64, commit 246e6d1,
 * 2026-09-11): per outage length in minutes, how many serious incidents lasted
 * at least that long, and the multiple the pricing rule gave it. The site
 * compares these multiples with the live contract.
 */
export const SNAPSHOT = {
  file: "deploy/price_table.json",
  sha256: "1f7f96d2711931d25360e502b9f82b0a1631d9c1a25e4296504e363d3d415c64",
  commit: "246e6d1",
  generated: "2026-09-11",
  window: "October 2025 to September 2026",
  months: 12,
  weeks: (12 * 30.44) / 7,
  pad: 3,
  lossRatio: 0.5,
  maxMultiple: 20,
};

export const TIERS = [60, 120, 240, 480, 720, 1440];

export const SEEN: Record<string, Record<number, number>> = {
  github: { 60: 56, 120: 27, 240: 12, 480: 5, 720: 1, 1440: 0 },
  discord: { 60: 16, 120: 9, 240: 2, 480: 0, 720: 0, 1440: 0 },
  vercel: { 60: 13, 120: 10, 240: 5, 480: 2, 720: 2, 1440: 1 },
  netlify: { 60: 11, 120: 9, 240: 3, 480: 3, 720: 3, 1440: 1 },
  npm: { 60: 1, 120: 0, 240: 0, 480: 0, 720: 0, 1440: 0 },
};

/** The multiples the snapshot offered (tiers below 2x are not sold). */
export const OFFERED: Record<string, Record<number, number>> = {
  github: { 240: 2, 480: 3, 720: 6, 1440: 8 },
  discord: { 120: 2, 240: 5, 480: 8, 720: 8, 1440: 8 },
  vercel: { 120: 2, 240: 3, 480: 5, 720: 5, 1440: 6 },
  netlify: { 60: 2, 120: 2, 240: 4, 480: 4, 720: 4, 1440: 6 },
  npm: { 60: 6, 120: 8, 240: 8, 480: 8, 720: 8, 1440: 8 },
};

/** The pricing rule, as in deploy/price_table.py. */
export function priceTier(seen: number) {
  const perWeek = (seen + SNAPSHOT.pad) / SNAPSHOT.weeks;
  const pWeek = 1 - Math.exp(-perWeek);
  const multiple = Math.min(SNAPSHOT.maxMultiple, Math.floor(SNAPSHOT.lossRatio / pWeek));
  return { perWeek, pWeek, multiple };
}

export const serviceName = (cover: string) => SERVICE_NAMES[cover] ?? cover;

