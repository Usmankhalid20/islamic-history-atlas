import { describe, it, expect } from "vitest";
import {
  territoriesQuerySchema,
  politiesQuerySchema,
  eventsQuerySchema,
} from "@/lib/api/validators";

describe("API Query Validators", () => {
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
});

