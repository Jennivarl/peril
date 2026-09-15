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

export const serviceName = (cover: string) => SERVICE_NAMES[cover] ?? cover;

/** The three-letter tile shown on each service card. */
export const serviceTile = (cover: string) => cover.slice(0, 3).toUpperCase();
