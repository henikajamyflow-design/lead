import { CollectionFilters } from "@/lib/types";

const ALLOWED = [
  "allemagne",
  "france",
  "espagne",
  "italie",
  "pays-bas",
  "belgique",
  "suede",
  "suède",
  "danemark",
  "finlande",
  "irlande",
  "portugal",
  "autriche",
  "suisse",
  "europe",
  "union europeenne",
  "union européenne",
  "etats-unis",
  "états-unis",
  "united states",
  "usa",
  "us",
];

export function parseCollectionPrompt(prompt: string): CollectionFilters {
  const cleaned = prompt.trim();
  const lower = cleaned.toLowerCase();

  const targetMatch =
    lower.match(/cible\s*(\d+)/i) ||
    lower.match(/(\d+)\s*(dirigeants|ceos|founders|leads|executives)/i);

  const sectorMatch =
    lower.match(/secteur\s*[:\-]?\s*([^,]+)/i) ||
    lower.match(/(?:france|allemagne|espagne|italie|europe|usa|us)\s+([a-z0-9+\-\s]+)/i);

  const regionMatch =
    lower.match(/collecte\s+pour\s*:\s*([^,]+)/i) ||
    lower.match(/pour\s*:\s*([^,]+)/i) ||
    ALLOWED.map((country) => ({ country, present: lower.includes(country) }))
      .find((entry) => entry.present)?.country;

  const rawRegion = typeof regionMatch === "string" ? regionMatch : regionMatch?.[1] ?? "France";
  const rawSector = sectorMatch?.[1]?.replace(/cible.+$/i, "").trim() ?? "SaaS B2B";
  const targetCount = Math.min(Math.max(Number(targetMatch?.[1] ?? 25), 5), 100);

  return {
    prompt: cleaned,
    region: normalizeRegion(rawRegion),
    sector: normalizeSector(rawSector),
    targetCount,
  };
}

function normalizeRegion(input: string) {
  const value = input.trim();
  if (/usa|us|united states|états-unis|etats-unis/i.test(value)) return "États-Unis";
  if (/union européenne|union europeenne|europe/i.test(value)) return "Europe";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function normalizeSector(input: string) {
  return input
    .replace(/^(de|du|des)\s+/i, "")
    .replace(/\bceos?\b/gi, "")
    .trim()
    .replace(/^./, (char) => char.toUpperCase()) || "SaaS B2B";
}
