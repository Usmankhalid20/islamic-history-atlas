/**
 * HTTP Cache Headers and Conditional Request Utilities
 * Conforms to ADR-006 and docs/API_DESIGN.md
 */

export type CacheProfile = "staticCatalog" | "temporalMap" | "dynamic" | "health";

export const CACHE_PROFILES: Record<CacheProfile, string> = {
  // Static Reference Catalog (Polities, Routes, Monuments, Scholars, Campaigns)
  staticCatalog: "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",

  // Temporal Map Queries (Territories by year, Events by year)
  temporalMap: "public, max-age=1800, s-maxage=3600, stale-while-revalidate=86400",

  // Dynamic Content (AI Scholar Inquiries)
  dynamic: "no-store, no-cache, must-revalidate",

  // Operational Probes (Health probe)
  health: "no-cache, no-store, must-revalidate",
};

/**
 * Returns standard Cache-Control header string for a given profile
 */
export function getCacheControlHeader(profile: CacheProfile): string {
  return CACHE_PROFILES[profile] || CACHE_PROFILES.dynamic;
}

/**
 * Generates a lightweight, deterministic ETag hash for data
 */
export function generateETag(data: unknown): string {
  const serialized = typeof data === "string" ? data : JSON.stringify(data);
  let hash = 2166136261;
  for (let i = 0; i < serialized.length; i++) {
    hash ^= serialized.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return `W/"${(hash >>> 0).toString(16)}"`;
}

/**
 * Checks whether an incoming If-None-Match header matches the calculated ETag
 */
export function isNotModified(ifNoneMatchHeader: string | null | undefined, currentETag: string): boolean {
  if (!ifNoneMatchHeader) return false;
  const cleanHeader = ifNoneMatchHeader.trim();
  const cleanEtag = currentETag.trim();

  if (cleanHeader === "*") return true;
  if (cleanHeader === cleanEtag) return true;

  // Handle comma-separated list of ETags
  const tags = cleanHeader.split(",").map((t) => t.trim());
  return tags.includes(cleanEtag);
}
