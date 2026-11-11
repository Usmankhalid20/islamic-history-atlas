import { describe, it, expect } from "vitest";
import {
  ADMINISTRATIVE_TYPES,
  computeTerritoryShift,
  getEmpireTerritorialEpochs,
  type AdministrativeControlType,
} from "@/lib/geo/territoryDynamics";
import { initialTerritoryPeriods, initialPolities } from "@/lib/data/historicalSeed";

describe("Phase 7: Territorial Dynamics & Boundary Changes", () => {
  describe("Administrative Sovereignty Classifications", () => {
    it("defines scholarly administrative models for all five control types", () => {
      const expectedTypes: AdministrativeControlType[] = [
        "direct",
        "vassal_state",
        "tributary",
        "disputed",
        "temporary_occupation",
      ];

      expectedTypes.forEach((type) => {
        const meta = ADMINISTRATIVE_TYPES[type];
        expect(meta).toBeDefined();
        expect(meta.type).toBe(type);
        expect(meta.label.length).toBeGreaterThan(5);
        expect(meta.description.length).toBeGreaterThan(25);
        expect(meta.cartographicStyle).toBeDefined();
        expect(meta.cartographicStyle.weightMultiplier).toBeGreaterThan(0);
        expect(meta.cartographicStyle.opacityMultiplier).toBeGreaterThan(0);
        expect(meta.cartographicStyle.badgeBg).toBeDefined();
        expect(meta.cartographicStyle.badgeText).toBeDefined();
      });
    });

    it("assigns distinct perimeter stroke styles for non-direct sovereignty", () => {
      expect(ADMINISTRATIVE_TYPES.direct.cartographicStyle.strokeDash).toBeUndefined();
      expect(ADMINISTRATIVE_TYPES.vassal_state.cartographicStyle.strokeDash).toBe("2, 4");
      expect(ADMINISTRATIVE_TYPES.tributary.cartographicStyle.strokeDash).toBe("2, 4");
      expect(ADMINISTRATIVE_TYPES.disputed.cartographicStyle.strokeDash).toBe("5, 5");
      expect(ADMINISTRATIVE_TYPES.temporary_occupation.cartographicStyle.strokeDash).toBe(
        "6, 3, 2, 3"
      );
    });

    it("verifies that initial territorial periods utilize diverse governance models", () => {
      const typesInSeed = new Set(initialTerritoryPeriods.map((t) => t.controlType));
      expect(typesInSeed.has("direct")).toBe(true);
      expect(typesInSeed.has("vassal_state") || typesInSeed.has("tributary")).toBe(true);
      expect(Object.keys(ADMINISTRATIVE_TYPES).length).toBe(5);
    });
  });

  describe("Analytical Boundary Shift Calculation (computeTerritoryShift)", () => {
    it("identifies rapid caliphal expansion from Medinan core to Umayyad imperial boundaries (632 vs 661 CE)", () => {
      const shift = computeTerritoryShift(632, 661);

      expect(shift.fromYear).toBe(632);
      expect(shift.toYear).toBe(661);
      expect(shift.elapsedYears).toBe(29);

      // Expansion into Syria, Iraq, Egypt, Persia
      expect(shift.gainedTerritories.length).toBeGreaterThanOrEqual(1);
      const gainedNames = shift.gainedTerritories.map((t) => t.regionName);
      expect(
        gainedNames.some(
          (name) =>
            name.includes("Syria") ||
            name.includes("Levant") ||
            name.includes("Egypt") ||
            name.includes("Iraq")
        )
      ).toBe(true);

      // Umayyad or emerging polities have positive delta
      expect(shift.polityDeltas.length).toBeGreaterThan(0);
    });

    it("captures territorial shift during the Abbasid revolution (749 vs 756 CE)", () => {
      const shift = computeTerritoryShift(749, 756);

      expect(shift.elapsedYears).toBe(7);
      expect(shift.polityDeltas.some((p) => p.polityId === "pol_abbasid_early")).toBe(true);
      expect(shift.polityDeltas.some((p) => p.polityId === "pol_cordoba_emirate")).toBe(true);

      // Early Abbasids gained imperial core provinces
      const abbasidDelta = shift.polityDeltas.find((p) => p.polityId === "pol_abbasid_early");
      expect(abbasidDelta).toBeDefined();
      expect(abbasidDelta?.gainedCount).toBeGreaterThan(0);
    });

    it("evaluates Seljuk territorial expansion between Dandanaqan and Post-Manzikert Zenith (1040 vs 1075 CE)", () => {
      const shift = computeTerritoryShift(1040, 1075);

      expect(shift.elapsedYears).toBe(35);
      // Great Seljuks expanded across Iran, Iraq, and Eastern Anatolia
      const seljukDelta = shift.polityDeltas.find((p) => p.polityId === "pol_seljuk");
      expect(seljukDelta).toBeDefined();
      expect(seljukDelta?.gainedCount).toBeGreaterThan(0);
    });

    it("tracks Mongol destruction of Abbasid Baghdad and Mamluk defense (1258 vs 1260 CE)", () => {
      const shift = computeTerritoryShift(1258, 1260);

      expect(shift.elapsedYears).toBe(2);
      expect(shift.gainedTerritories).toBeDefined();
      expect(shift.lostTerritories).toBeDefined();
      expect(typeof shift.netProvinceDelta).toBe("number");
    });

    it("handles zero delta for identical years symmetrically", () => {
      const shift = computeTerritoryShift(750, 750);

      expect(shift.elapsedYears).toBe(0);
      expect(shift.gainedTerritories.length).toBe(0);
      expect(shift.lostTerritories.length).toBe(0);
      expect(shift.netProvinceDelta).toBe(0);
      expect(shift.polityDeltas.length).toBe(0);
    });

    it("handles reverse chronological calculation cleanly (later to earlier year)", () => {
      const forwardShift = computeTerritoryShift(632, 661);
      const reverseShift = computeTerritoryShift(661, 632);

      expect(reverseShift.elapsedYears).toBe(forwardShift.elapsedYears);
      // Territories gained going forward should be territories lost going backward
      expect(reverseShift.lostTerritories.length).toBe(forwardShift.gainedTerritories.length);
      expect(reverseShift.gainedTerritories.length).toBe(forwardShift.lostTerritories.length);
    });
  });

  describe("Empire Territorial Epochs Analyzer (getEmpireTerritorialEpochs)", () => {
    it("returns chronological epochs for pol_umayyad", () => {
      const epochs = getEmpireTerritorialEpochs("pol_umayyad");

      expect(epochs.length).toBeGreaterThan(0);
      for (let i = 0; i < epochs.length - 1; i++) {
        expect(epochs[i].startYear).toBeLessThanOrEqual(epochs[i + 1].startYear);
      }
    });

    it("returns chronological epochs for pol_seljuk", () => {
      const epochs = getEmpireTerritorialEpochs("pol_seljuk");

      expect(epochs.length).toBeGreaterThan(0);
      epochs.forEach((epoch) => {
        expect(epoch.polityId).toBe("pol_seljuk");
        expect(epoch.endYear).toBeGreaterThanOrEqual(epoch.startYear);
      });
    });

    it("returns empty array for non-existent polity ID without throwing", () => {
      const epochs = getEmpireTerritorialEpochs("non_existent_polity_id");
      expect(epochs).toEqual([]);
    });
  });
});
