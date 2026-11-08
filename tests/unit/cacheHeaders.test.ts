import { describe, it, expect } from "vitest";
import {
  getCacheControlHeader,
  generateETag,
  isNotModified,
  CACHE_PROFILES,
} from "@/lib/api/cacheHeaders";

describe("HTTP Cache Headers & ETag Utilities", () => {
  describe("getCacheControlHeader", () => {
    it("returns correct headers for staticCatalog profile", () => {
      const header = getCacheControlHeader("staticCatalog");
      expect(header).toBe(CACHE_PROFILES.staticCatalog);
      expect(header).toContain("s-maxage=86400");
      expect(header).toContain("stale-while-revalidate=604800");
    });

    it("returns correct headers for temporalMap profile", () => {
      const header = getCacheControlHeader("temporalMap");
      expect(header).toBe(CACHE_PROFILES.temporalMap);
      expect(header).toContain("max-age=1800");
      expect(header).toContain("s-maxage=3600");
    });

    it("returns no-store for dynamic and health profiles", () => {
      expect(getCacheControlHeader("dynamic")).toContain("no-store");
      expect(getCacheControlHeader("health")).toContain("no-store");
    });
  });

  describe("generateETag", () => {
    it("generates deterministic ETag for identical objects", () => {
      const obj1 = { name: "Abbasid Caliphate", start: 750 };
      const obj2 = { name: "Abbasid Caliphate", start: 750 };
      expect(generateETag(obj1)).toBe(generateETag(obj2));
    });

    it("generates different ETags for distinct content", () => {
      const tag1 = generateETag({ id: "1" });
      const tag2 = generateETag({ id: "2" });
      expect(tag1).not.toBe(tag2);
    });
  });

  describe("isNotModified", () => {
    const etag = 'W/"abcd1234"';

    it("matches identical ETag exactly", () => {
      expect(isNotModified(etag, etag)).toBe(true);
    });

    it("matches wildcard asterisk (*)", () => {
      expect(isNotModified("*", etag)).toBe(true);
    });

    it("matches within comma-separated list of ETags", () => {
      expect(isNotModified('W/"xyz", W/"abcd1234", W/"999"', etag)).toBe(true);
    });

    it("returns false for non-matching ETag", () => {
      expect(isNotModified('W/"different"', etag)).toBe(false);
    });

    it("returns false for null or undefined headers", () => {
      expect(isNotModified(null, etag)).toBe(false);
      expect(isNotModified(undefined, etag)).toBe(false);
    });
  });
});
