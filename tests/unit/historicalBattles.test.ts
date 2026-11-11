import { describe, it, expect } from "vitest";
import {
  HISTORICAL_BATTLES,
  getBattleById,
  convertBattleToEventRecord,
  filterBattlesByYear,
  getBattlesForCampaign,
} from "@/lib/data/historicalBattlesSeed";
import { initialCampaigns } from "@/lib/data/historicalSeed";

describe("Phase 6: Battles & Military Campaigns Verification", () => {
  describe("Historical Battles Dataset Integrity", () => {
    it("contains over 30 curated major historical battles spanning 624 to 1750+ CE", () => {
      expect(HISTORICAL_BATTLES.length).toBeGreaterThanOrEqual(30);

      HISTORICAL_BATTLES.forEach((battle) => {
        expect(battle.id).toBeDefined();
        expect(battle.id.startsWith("bat_")).toBe(true);
        expect(battle.name.length).toBeGreaterThan(5);
        expect(battle.year).toBeGreaterThanOrEqual(620);
        expect(battle.year).toBeLessThanOrEqual(1800);
        expect(battle.outcome.length).toBeGreaterThan(5);
        expect(["belligerentA", "belligerentB", "stalemate", "inconclusive"]).toContain(
          battle.victor
        );
        expect(battle.historicalSignificance.length).toBeGreaterThan(20);
        expect(battle.tacticalSummary.length).toBeGreaterThan(20);
        expect(battle.sourceCitation.length).toBeGreaterThan(10);
      });
    });

    it("verifies combatants and commanders structure for all battles", () => {
      HISTORICAL_BATTLES.forEach((battle) => {
        // Belligerent A
        expect(battle.belligerentA).toBeDefined();
        expect(battle.belligerentA.name.length).toBeGreaterThan(2);
        expect(Array.isArray(battle.belligerentA.commanders)).toBe(true);
        expect(battle.belligerentA.commanders.length).toBeGreaterThanOrEqual(1);
        expect(["attacker", "defender", "coalition"]).toContain(battle.belligerentA.role);

        // Belligerent B
        expect(battle.belligerentB).toBeDefined();
        expect(battle.belligerentB.name.length).toBeGreaterThan(2);
        expect(Array.isArray(battle.belligerentB.commanders)).toBe(true);
        expect(battle.belligerentB.commanders.length).toBeGreaterThanOrEqual(1);
        expect(["attacker", "defender", "coalition"]).toContain(battle.belligerentB.role);
      });
    });

    it("validates geographic coordinates within the Islamic historical sphere", () => {
      HISTORICAL_BATTLES.forEach((battle) => {
        expect(Array.isArray(battle.coordinates)).toBe(true);
        expect(battle.coordinates.length).toBe(2);

        const [lng, lat] = battle.coordinates;
        expect(typeof lng).toBe("number");
        expect(typeof lat).toBe("number");

        // Latitude bounds: 15°N to 52°N (Arabia to Central Europe)
        expect(lat).toBeGreaterThanOrEqual(15);
        expect(lat).toBeLessThanOrEqual(52);

        // Longitude bounds: -15°W to 80°E (Iberia / Morocco to India)
        expect(lng).toBeGreaterThanOrEqual(-15);
        expect(lng).toBeLessThanOrEqual(80);
      });
    });
  });

  describe("Battle Query & Conversion Utilities", () => {
    it("resolves battles by ID or title correctly", () => {
      const yarmouk = getBattleById("bat_yarmouk_636");
      expect(yarmouk).toBeDefined();
      expect(yarmouk?.name).toBe("Battle of Yarmouk");
      expect(yarmouk?.year).toBe(636);

      const manzikert = getBattleById("Battle of Manzikert");
      expect(manzikert).toBeDefined();
      expect(manzikert?.id).toBe("bat_manzikert_1071");

      const ainJalut = getBattleById("bat_ain_jalut_1260");
      expect(ainJalut).toBeDefined();
      expect(ainJalut?.victor).toBe("belligerentA");
      expect(ainJalut?.belligerentA.name).toContain("Mamluk");

      const unknown = getBattleById("non_existent_battle");
      expect(unknown).toBeUndefined();
    });

    it("converts HistoricalBattle into an RFC 7946 compliant HistoricalEventRecord", () => {
      const constantinople = getBattleById("bat_constantinople_1453")!;
      const eventRecord = convertBattleToEventRecord(constantinople);

      expect(eventRecord.id).toBe("bat_constantinople_1453");
      expect(eventRecord.title).toBe("Siege & Fall of Constantinople");
      expect(eventRecord.eventYear).toBe(1453);
      expect(eventRecord.eventType).toBe("battle");
      expect(eventRecord.locationGeojson.type).toBe("Point");
      expect(eventRecord.locationGeojson.coordinates).toEqual([28.97, 41.01]);
      expect(eventRecord.summary.length).toBeGreaterThan(20);
    });

    it("filters battles by historical year window dynamically", () => {
      // Benchmark 1: Year 636 (Yarmouk & al-Qadisiyyah)
      const battles636 = filterBattlesByYear(636, 1);
      const names636 = battles636.map((b) => b.name);
      expect(names636).toContain("Battle of Yarmouk");
      expect(names636).toContain("Battle of al-Qadisiyyah");

      // Benchmark 2: Year 1071 (Manzikert)
      const battles1071 = filterBattlesByYear(1071, 5);
      expect(battles1071.some((b) => b.id === "bat_manzikert_1071")).toBe(true);

      // Benchmark 3: Year 1187 (Hattin)
      const battles1187 = filterBattlesByYear(1187, 0);
      expect(battles1187.some((b) => b.id === "bat_hattin_1187")).toBe(true);

      // Benchmark 4: Year 1260 (Ain Jalut)
      const battles1260 = filterBattlesByYear(1260, 0);
      expect(battles1260.some((b) => b.id === "bat_ain_jalut_1260")).toBe(true);

      // Benchmark 5: Year 1453 (Constantinople)
      const battles1453 = filterBattlesByYear(1453, 0);
      expect(battles1453.some((b) => b.id === "bat_constantinople_1453")).toBe(true);

      // Benchmark 6: Year 1526 (Panipat 1 & Mohács)
      const battles1526 = filterBattlesByYear(1526, 0);
      const names1526 = battles1526.map((b) => b.name);
      expect(names1526).toContain("First Battle of Panipat");
      expect(names1526).toContain("Battle of Mohács");

      // Benchmark 7: Year 1683 (Siege of Vienna)
      const battles1683 = filterBattlesByYear(1683, 0);
      expect(battles1683.some((b) => b.id === "bat_vienna_1683")).toBe(true);
    });
  });

  describe("Military Campaigns & Cross-Entity Linkages", () => {
    it("links battles to corresponding campaigns accurately", () => {
      const yarmoukCampaignBattles = getBattlesForCampaign("camp_yarmouk_634_636");
      expect(yarmoukCampaignBattles.length).toBeGreaterThanOrEqual(1);
      expect(yarmoukCampaignBattles[0].id).toBe("bat_yarmouk_636");

      const qadisiyyahCampaignBattles = getBattlesForCampaign("camp_qadisiyyah_636");
      expect(qadisiyyahCampaignBattles.length).toBeGreaterThanOrEqual(1);
      expect(qadisiyyahCampaignBattles[0].id).toBe("bat_qadisiyyah_636");

      const andalusCampaignBattles = getBattlesForCampaign("camp_conquest_andalus_711_714");
      expect(andalusCampaignBattles.some((b) => b.id === "bat_guadalete_711")).toBe(true);

      const toursCampaignBattles = getBattlesForCampaign("camp_tours_poitiers_732");
      expect(toursCampaignBattles.some((b) => b.id === "bat_tours_732")).toBe(true);
    });

    it("verifies all 13 military campaigns have valid LineString geometries and routes", () => {
      expect(initialCampaigns.length).toBe(13);

      initialCampaigns.forEach((camp) => {
        expect(camp.id).toBeDefined();
        expect(camp.startYear).toBeGreaterThanOrEqual(632);
        expect(camp.endYear).toBeGreaterThanOrEqual(camp.startYear);
        expect(camp.commanderName.length).toBeGreaterThan(5);
        expect(camp.keyLocations.length).toBeGreaterThan(10);
        expect(camp.strategicOutcome.length).toBeGreaterThan(15);

        const geo = camp.routeGeojson as { type: string; coordinates: [number, number][] };
        expect(geo.type).toBe("LineString");
        expect(Array.isArray(geo.coordinates)).toBe(true);
        expect(geo.coordinates.length).toBeGreaterThanOrEqual(5);

        geo.coordinates.forEach(([lng, lat]) => {
          expect(typeof lng).toBe("number");
          expect(typeof lat).toBe("number");
          expect(lat).toBeGreaterThan(15);
          expect(lat).toBeLessThan(50);
          expect(lng).toBeGreaterThan(-15);
          expect(lng).toBeLessThan(75);
        });
      });
    });
  });
});

