import { describe, it, expect } from "vitest";
import {
  territoriesQuerySchema,
  politiesQuerySchema,
  eventsQuerySchema,
} from "@/lib/api/validators";
import { GET as getSourcesRoute } from "@/app/api/sources/route";
import { NextRequest } from "next/server";
import { initialSources } from "@/lib/data/historicalSeed";

describe("API Query Validators & Bibliography API", () => {
  describe("territoriesQuerySchema", () => {
    it("accepts valid historical years", () => {
      const result = territoriesQuerySchema.safeParse({ year: "750" });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.year).toBe(750);
      }
    });

    it("rejects non-numeric year input", () => {
      const result = territoriesQuerySchema.safeParse({ year: "invalid-year" });
      expect(result.success).toBe(false);
    });

    it("rejects missing year parameter", () => {
      const result = territoriesQuerySchema.safeParse({});
      expect(result.success).toBe(false);
    });

    it("rejects years outside historical bounds (< 500 or > 2000)", () => {
      expect(territoriesQuerySchema.safeParse({ year: "400" }).success).toBe(false);
      expect(territoriesQuerySchema.safeParse({ year: "2500" }).success).toBe(false);
    });
  });

  describe("politiesQuerySchema", () => {
    it("accepts valid activeYear and entityType", () => {
      const result = politiesQuerySchema.safeParse({
        activeYear: "800",
        entityType: "caliphate",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.activeYear).toBe(800);
        expect(result.data.entityType).toBe("caliphate");
      }
    });

    it("allows omitting activeYear", () => {
      const result = politiesQuerySchema.safeParse({});
      expect(result.success).toBe(true);
    });
  });

  describe("eventsQuerySchema", () => {
    it("validates event query parameters", () => {
      const result = eventsQuerySchema.safeParse({
        year: "750",
        eventType: "battle",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.year).toBe(750);
        expect(result.data.eventType).toBe("battle");
      }
    });
  });

  describe("GET /api/sources", () => {
    it("serves academic bibliography register with pagination and cache headers", async () => {
      const req = new NextRequest("http://localhost:3000/api/sources");
      const res = await getSourcesRoute(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.count).toBe(initialSources.length);
      expect(data.items.length).toBe(initialSources.length);
      expect(data.pagination).toBeDefined();
      expect(data.pagination.page).toBe(1);
      expect(res.headers.get("Cache-Control")).toContain("max-age=3600");
    });
  });
});
