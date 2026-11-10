import { describe, it, expect } from "vitest";
import {
  HISTORICAL_MILESTONES,
  HISTORICAL_ERAS,
  getHistoricalEra,
} from "@/components/timeline/YearSlider";

describe("Phase 3: Historical Timeline (500 AD – 1980 AD)", () => {
  describe("Temporal Range & Milestones", () => {
    it("has at least 15 curated civilizational milestones between 500 and 1980 CE", () => {
      expect(HISTORICAL_MILESTONES.length).toBeGreaterThanOrEqual(15);
      HISTORICAL_MILESTONES.forEach((milestone) => {
        expect(milestone.year).toBeGreaterThanOrEqual(500);
        expect(milestone.year).toBeLessThanOrEqual(1980);
        expect(milestone.label).toBeTruthy();
        expect(milestone.dynasty).toBeTruthy();
      });
    });

    it("milestones are sorted chronologically", () => {
      for (let i = 0; i < HISTORICAL_MILESTONES.length - 1; i++) {
        expect(HISTORICAL_MILESTONES[i].year).toBeLessThanOrEqual(
          HISTORICAL_MILESTONES[i + 1].year
        );
      }
    });

    it("includes foundational milestone turning points", () => {
      const milestoneYears = HISTORICAL_MILESTONES.map((m) => m.year);
      expect(milestoneYears).toContain(632); // Rashidun
      expect(milestoneYears).toContain(661); // Umayyad Damascus
      expect(milestoneYears).toContain(750); // Abbasid
      expect(milestoneYears).toContain(1071); // Manzikert (Seljuk)
      expect(milestoneYears).toContain(1187); // Hattin (Ayyubid)
      expect(milestoneYears).toContain(1258); // Fall of Baghdad
      expect(milestoneYears).toContain(1453); // Constantinople (Ottoman)
      expect(milestoneYears).toContain(1526); // Panipat (Mughal)
      expect(milestoneYears).toContain(1550); // Gunpowder Zenith
      expect(milestoneYears).toContain(1922); // End of Ottoman Sultanate
    });
  });

  describe("Historical Eras & Epoch Categorization", () => {
    it("defines continuous chronological eras spanning 500 to 1980 CE", () => {
      expect(HISTORICAL_ERAS.length).toBeGreaterThanOrEqual(8);
      expect(HISTORICAL_ERAS[0].fromYear).toBe(500);
      expect(HISTORICAL_ERAS[HISTORICAL_ERAS.length - 1].toYear).toBe(1980);

      // Verify each era is chronologically contiguous
      for (let i = 0; i < HISTORICAL_ERAS.length - 1; i++) {
        const current = HISTORICAL_ERAS[i];
        const next = HISTORICAL_ERAS[i + 1];
        expect(current.fromYear).toBeLessThanOrEqual(current.toYear);
        expect(next.fromYear).toBe(current.toYear + 1);
        expect(current.name).toBeTruthy();
        expect(current.description).toBeTruthy();
      }
    });

    it("resolves the correct historical era for key historical benchmark years", () => {
      expect(getHistoricalEra(550).name).toContain("Late Antiquity");
      expect(getHistoricalEra(632).name).toContain("Rashidun");
      expect(getHistoricalEra(700).name).toContain("Umayyad");
      expect(getHistoricalEra(800).name).toContain("Abbasid");
      expect(getHistoricalEra(1000).name).toContain("Regional Dynasties");
      expect(getHistoricalEra(1187).name).toContain("Seljuks, Crusades & Ayyubids");
      expect(getHistoricalEra(1400).name).toContain("Mamluk");
      expect(getHistoricalEra(1550).name).toContain("Gunpowder Empires");
      expect(getHistoricalEra(1850).name).toContain("Tanzimat");
      expect(getHistoricalEra(1950).name).toContain("20th Century");
    });

    it("provides fallback for out-of-range years", () => {
      const fallback = getHistoricalEra(2100);
      expect(fallback).toBeDefined();
      expect(fallback.name).toBe("Historical Period");
    });
  });

  describe("Granular Stepping and Clamping", () => {
    const minYear = 500;
    const maxYear = 1980;

    const clamp = (val: number) => Math.max(minYear, Math.min(maxYear, val));
    const step = (current: number, delta: number) => clamp(current + delta);

    it("clamps values to [500, 1980]", () => {
      expect(clamp(400)).toBe(500);
      expect(clamp(2050)).toBe(1980);
      expect(clamp(750)).toBe(750);
    });

    it("steps forward and backward by 1, 10, and 50 years", () => {
      const baseline = 1000;
      expect(step(baseline, -50)).toBe(950);
      expect(step(baseline, -10)).toBe(990);
      expect(step(baseline, -1)).toBe(999);
      expect(step(baseline, 1)).toBe(1001);
      expect(step(baseline, 10)).toBe(1010);
      expect(step(baseline, 50)).toBe(1050);
    });

    it("prevents stepping beyond bounds", () => {
      expect(step(520, -50)).toBe(500);
      expect(step(501, -10)).toBe(500);
      expect(step(1975, 10)).toBe(1980);
      expect(step(1950, 50)).toBe(1980);
    });
  });
});
