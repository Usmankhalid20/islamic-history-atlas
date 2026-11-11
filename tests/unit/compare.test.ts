import { describe, it, expect } from "vitest";
import {
  computeEraDelta,
  COMPARISON_PRESETS,
} from "@/lib/geo/comparisonUtils";

describe("Historiographical Timeline Comparison Mode", () => {
  it("contains curated historical transition presets with primary source citations", () => {
    expect(COMPARISON_PRESETS.length).toBeGreaterThanOrEqual(4);

    COMPARISON_PRESETS.forEach((preset) => {
      expect(preset.id).toBeDefined();
      expect(preset.title.length).toBeGreaterThan(10);
      expect(preset.shortName).toContain("vs.");
      expect(preset.yearA).toBeGreaterThanOrEqual(500);
      expect(preset.yearA).toBeLessThanOrEqual(1980);
      expect(preset.yearB).toBeGreaterThanOrEqual(500);
      expect(preset.yearB).toBeLessThanOrEqual(1980);
      expect(preset.description.length).toBeGreaterThan(20);
      expect(preset.keyHistoricalTakeaway.length).toBeGreaterThan(20);
      expect(preset.primarySources.length).toBeGreaterThanOrEqual(1);
    });
  });

  it("computes accurate dynastic and territorial deltas for Rashidun-to-Umayyad transition (632 vs 661 CE)", () => {
    const delta = computeEraDelta(632, 661);

    expect(delta.yearA).toBe(632);
    expect(delta.yearB).toBe(661);
    expect(delta.elapsedYears).toBe(29);

    // In 632, Rashidun is active
    expect(delta.politiesA.some((p) => p.id === "pol_rashidun")).toBe(true);

    // In 661, Umayyad Caliphate has emerged
    expect(delta.politiesB.some((p) => p.id === "pol_umayyad")).toBe(true);
    expect(delta.emergedPolities.some((p) => p.id === "pol_umayyad")).toBe(true);

    // By 680 CE (Umayyad consolidation), Rashidun has completely dissolved
    const delta680 = computeEraDelta(632, 680);
    expect(delta680.dissolvedPolities.some((p) => p.id === "pol_rashidun")).toBe(true);
    expect(delta680.emergedPolities.some((p) => p.id === "pol_umayyad")).toBe(true);
  });

  it("detects Abbasid emergence and Umayyad displacement during the 749 vs 756 CE revolution", () => {
    const delta = computeEraDelta(749, 756);

    expect(delta.elapsedYears).toBe(7);

    // Abbasid and Córdoba emerged during this critical window
    const emergedIds = delta.emergedPolities.map((p) => p.id);
    expect(emergedIds).toContain("pol_abbasid_early");
    expect(emergedIds).toContain("pol_cordoba_emirate");

    // Syrian Umayyad caliphate dissolved
    expect(delta.dissolvedPolities.some((p) => p.id === "pol_umayyad")).toBe(true);
  });

  it("identifies architectural and intellectual monuments founded between eras (750 vs 969 CE)", () => {
    const delta = computeEraDelta(750, 969);

    expect(delta.elapsedYears).toBe(219);
    expect(delta.newMonumentsBetween.length).toBeGreaterThan(0);

    const monumentNames = delta.newMonumentsBetween.map((m) => m.name);
    // Great Mosque of Córdoba (785 CE) and al-Qarawiyyin (859 CE) were founded in this period
    expect(monumentNames.some((n) => n.includes("Córdoba"))).toBe(true);
    expect(monumentNames.some((n) => n.includes("al-Qarawiyyin"))).toBe(true);

    // All monuments reported must have founding year strictly within (750, 969]
    delta.newMonumentsBetween.forEach((m) => {
      expect(m.foundingYear).toBeGreaterThan(750);
      expect(m.foundingYear).toBeLessThanOrEqual(969);
    });
  });

  it("handles identical years symmetrically with zero delta", () => {
    const delta = computeEraDelta(750, 750);

    expect(delta.elapsedYears).toBe(0);
    expect(delta.emergedPolities.length).toBe(0);
    expect(delta.dissolvedPolities.length).toBe(0);
    expect(delta.persistentPolities.length).toBe(delta.politiesA.length);
    expect(delta.newMonumentsBetween.length).toBe(0);
  });

  it("handles inverted chronologies (later year compared to earlier year) gracefully", () => {
    const delta = computeEraDelta(900, 750);

    expect(delta.elapsedYears).toBe(150);
    expect(delta.newMonumentsBetween.length).toBeGreaterThan(0);
    // Founding years are still within (750, 900]
    delta.newMonumentsBetween.forEach((m) => {
      expect(m.foundingYear).toBeGreaterThan(750);
      expect(m.foundingYear).toBeLessThanOrEqual(900);
    });
  });

  it("calculates territorial shifts, gained territories, and lost territories in era comparisons", () => {
    // 632 (Medinan Core) vs 661 (Umayyad caliphate expansion)
    const delta = computeEraDelta(632, 661);
    expect(delta.territoryShift).toBeDefined();
    expect(delta.territoriesGained.length).toBeGreaterThan(0);
    expect(delta.territoriesLost.length).toBeGreaterThanOrEqual(0);
    expect(typeof delta.netTerritoryDelta).toBe("number");
    expect(delta.territoryShift.polityDeltas.length).toBeGreaterThan(0);
  });
});
