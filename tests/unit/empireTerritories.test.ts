import { describe, it, expect } from "vitest";
import {
  initialPolities,
  initialTerritoryPeriods,
} from "@/lib/data/historicalSeed";
import { POLITY_COLORS } from "@/components/map/HistoricalMap";
import {
  filterActiveTerritories,
  formatTerritoriesToGeoJson,
  isTerritoryActiveInYear,
  validateGeoJsonGeometry,
} from "@/lib/geo/territoryUtils";

describe("Phase 2 & 4: Empire Territories & Dynastic Boundaries Architecture", () => {
  it("defines comprehensive historical polities with valid metadata and capitals", () => {
    expect(initialPolities.length).toBeGreaterThanOrEqual(20);

    const requiredDynasties = [
      "pol_rashidun",
      "pol_umayyad",
      "pol_abbasid_early",
      "pol_cordoba_emirate",
      "pol_cordoba_caliphate",
      "pol_fatimid",
      "pol_samanid",
      "pol_buyid",
      "pol_ghaznavid",
      "pol_seljuk",
      "pol_almoravid",
      "pol_almohad",
      "pol_zengid",
      "pol_ayyubid",
      "pol_mamluk",
      "pol_mongol",
      "pol_delhi_sultanate",
      "pol_timurid",
      "pol_ottoman",
      "pol_safavid",
      "pol_mughal",
    ];

    const definedIds = new Set(initialPolities.map((p) => p.id));
    for (const dynastyId of requiredDynasties) {
      expect(definedIds.has(dynastyId), `Missing polity: ${dynastyId}`).toBe(true);
    }

    initialPolities.forEach((polity) => {
      expect(polity.canonicalName.length).toBeGreaterThan(0);
      expect(polity.startYear).toBeGreaterThanOrEqual(500);
      if (polity.endYear) {
        expect(polity.endYear).toBeGreaterThanOrEqual(polity.startYear);
      }
      expect(polity.capitalCity).toBeDefined();
    });
  });

  it("provides consistent, accessible dynastic colors matching suggested palette", () => {
    initialPolities.forEach((polity) => {
      const colors = POLITY_COLORS[polity.id];
      expect(colors, `Missing color scheme for polity: ${polity.id}`).toBeDefined();
      expect(colors.fill).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(colors.stroke).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });

    // Check specific user requested scholarly archival palette
    expect(POLITY_COLORS["pol_rashidun"].fill).toBe("#16A34A"); // Green
    expect(POLITY_COLORS["pol_umayyad"].fill).toBe("#299B9B"); // Umayyad Teal (#299B9B)
    expect(POLITY_COLORS["pol_abbasid_early"].fill).toBe("#D6A642"); // Abbasid Gold (#D6A642)
    expect(POLITY_COLORS["pol_fatimid"].fill).toBe("#9333EA"); // Purple
    expect(POLITY_COLORS["pol_seljuk"].fill).toBe("#3978C5"); // Seljuk Azure (#3978C5)
    expect(POLITY_COLORS["pol_ghaznavid"].fill).toBe("#94633E"); // Ghaznavid Earth Brown (#94633E)
    expect(POLITY_COLORS["pol_ayyubid"].fill).toBe("#39966A"); // Ayyubid Emerald (#39966A)
    expect(POLITY_COLORS["pol_zengid"].fill).toBe("#8656B9"); // Zengid Violet (#8656B9)
    expect(POLITY_COLORS["pol_mamluk"].fill).toBe("#D94B45"); // Mamluk Crimson (#D94B45)
    expect(POLITY_COLORS["pol_mongol"].fill).toBe("#626B76"); // Mongol Steppe Slate (#626B76)
    expect(POLITY_COLORS["pol_ottoman"].fill).toBe("#991B1B"); // Dark red
    expect(POLITY_COLORS["pol_mughal"].fill).toBe("#EA580C"); // Orange
    expect(POLITY_COLORS["pol_safavid"].fill).toBe("#4338CA"); // Indigo
  });

  it("ensures every territory has valid closed GeoJSON polygons/multipolygons and RFC 7946 compliance", () => {
    expect(initialTerritoryPeriods.length).toBeGreaterThanOrEqual(25);

    const polityIds = new Set(initialPolities.map((p) => p.id));

    initialTerritoryPeriods.forEach((ter) => {
      expect(polityIds.has(ter.polityId), `Territory ${ter.id} references unknown polity ${ter.polityId}`).toBe(true);
      expect(ter.validFromYear).toBeLessThanOrEqual(ter.validToYear);
      expect(ter.regionName.length).toBeGreaterThan(0);

      const validation = validateGeoJsonGeometry(ter.geometryGeojson);
      expect(validation.isValid, `Invalid geometry in territory ${ter.id}: ${validation.error}`).toBe(true);

      const geo = ter.geometryGeojson as {
        type: string;
        coordinates: unknown[];
      };
      expect(["Polygon", "MultiPolygon"]).toContain(geo.type);
    });
  });

  it("supports multi-polity co-existence and changing boundaries across all historical testing milestones", () => {
    // 1. Year 756 CE: Early Abbasids and Emirate of Córdoba
    const active756 = filterActiveTerritories(initialTerritoryPeriods, 756);
    const pols756 = new Set(active756.map((t) => t.polityId));
    expect(pols756.has("pol_abbasid_early")).toBe(true);
    expect(pols756.has("pol_cordoba_emirate")).toBe(true);

    // 2. Year 900 CE: Abbasid Caliphate, Emirate of Córdoba, Samanid Dynasty
    const active900 = filterActiveTerritories(initialTerritoryPeriods, 900);
    const pols900 = new Set(active900.map((t) => t.polityId));
    expect(pols900.has("pol_abbasid_early")).toBe(true);
    expect(pols900.has("pol_cordoba_emirate")).toBe(true);
    expect(pols900.has("pol_samanid")).toBe(true);

    // 3. Year 977 CE: Fatimid, Buyid, Samanid, Córdoba Caliphate, Ghaznavid emergence
    const active977 = filterActiveTerritories(initialTerritoryPeriods, 977);
    const pols977 = new Set(active977.map((t) => t.polityId));
    expect(pols977.has("pol_fatimid")).toBe(true);
    expect(pols977.has("pol_buyid")).toBe(true);
    expect(pols977.has("pol_samanid")).toBe(true);
    expect(pols977.has("pol_cordoba_caliphate")).toBe(true);
    expect(pols977.has("pol_ghaznavid")).toBe(true);

    // 4. Year 1030 CE: Ghaznavid imperial zenith (Mahmud of Ghazna), Fatimids, Buyids, Córdoba
    const active1030 = filterActiveTerritories(initialTerritoryPeriods, 1030);
    const pols1030 = new Set(active1030.map((t) => t.polityId));
    expect(pols1030.has("pol_ghaznavid")).toBe(true);
    expect(pols1030.has("pol_fatimid")).toBe(true);
    expect(pols1030.has("pol_buyid")).toBe(true);
    expect(pols1030.has("pol_cordoba_caliphate")).toBe(true);

    // 5. Year 1071 CE: Early Great Seljuks (Manzikert), Fatimids, Almoravids, Ghaznavids (Lahore)
    const active1071 = filterActiveTerritories(initialTerritoryPeriods, 1071);
    const pols1071 = new Set(active1071.map((t) => t.polityId));
    expect(pols1071.has("pol_seljuk")).toBe(true);
    expect(pols1071.has("pol_fatimid")).toBe(true);
    expect(pols1071.has("pol_almoravid")).toBe(true);

    // 6. Year 1092 CE: Great Seljuk Empire zenith under Malik Shah I
    const active1092 = filterActiveTerritories(initialTerritoryPeriods, 1092);
    const pols1092 = new Set(active1092.map((t) => t.polityId));
    expect(pols1092.has("pol_seljuk")).toBe(true);
    const seljuk1092 = active1092.find((t) => t.id === "ter_seljuk_zenith_1072_1092");
    expect(seljuk1092).toBeDefined();

    // 7. Year 1187 CE: Ayyubids (Saladin), Seljuks, and Almohads
    const active1187 = filterActiveTerritories(initialTerritoryPeriods, 1187);
    const pols1187 = new Set(active1187.map((t) => t.polityId));
    expect(pols1187.has("pol_ayyubid")).toBe(true);
    expect(pols1187.has("pol_seljuk")).toBe(true);
    expect(pols1187.has("pol_almohad")).toBe(true);

    // 8. Year 1200 CE: Ayyubids, Almohads, Ghurid / Delhi Sultanate transition
    const active1200 = filterActiveTerritories(initialTerritoryPeriods, 1200);
    const pols1200 = new Set(active1200.map((t) => t.polityId));
    expect(pols1200.has("pol_ayyubid")).toBe(true);
    expect(pols1200.has("pol_almohad")).toBe(true);

    // 9. Year 1258 CE: Mongol sack of Baghdad & Ilkhanate foundation
    const active1258 = filterActiveTerritories(initialTerritoryPeriods, 1258);
    const pols1258 = new Set(active1258.map((t) => t.polityId));
    expect(pols1258.has("pol_mongol")).toBe(true);
    expect(pols1258.has("pol_mamluk")).toBe(true);
    expect(pols1258.has("pol_delhi_sultanate")).toBe(true);

    // 10. Year 1260 CE: Battle of Ain Jalut (Mamluk Sultanate vs Ilkhanate)
    const active1260 = filterActiveTerritories(initialTerritoryPeriods, 1260);
    const pols1260 = new Set(active1260.map((t) => t.polityId));
    expect(pols1260.has("pol_mamluk")).toBe(true);
    expect(pols1260.has("pol_mongol")).toBe(true);
    const ilkhanateVassal = active1260.find((t) => t.id === "ter_ilkhanate_anatolia_vassal_1260_1335");
    expect(ilkhanateVassal).toBeDefined();
    expect(ilkhanateVassal?.controlType).toBe("vassal_state");

    // 11. Year 1453 CE: Fall of Constantinople & Early Ottoman / Timurid co-existence
    const active1453 = filterActiveTerritories(initialTerritoryPeriods, 1453);
    const pols1453 = new Set(active1453.map((t) => t.polityId));
    expect(pols1453.has("pol_ottoman")).toBe(true);
    expect(pols1453.has("pol_mamluk")).toBe(true);
    expect(pols1453.has("pol_timurid")).toBe(true);
    expect(pols1453.has("pol_delhi_sultanate")).toBe(true);

    // 12. Year 1550 CE: The Three Gunpowder Empires (Ottoman, Safavid, Mughal)
    const active1550 = filterActiveTerritories(initialTerritoryPeriods, 1550);
    const pols1550 = new Set(active1550.map((t) => t.polityId));
    expect(pols1550.has("pol_ottoman")).toBe(true);
    expect(pols1550.has("pol_safavid")).toBe(true);
    expect(pols1550.has("pol_mughal")).toBe(true);

    // 13. Year 1683 CE: Second Siege of Vienna & Mughal Zenith
    const active1683 = filterActiveTerritories(initialTerritoryPeriods, 1683);
    const pols1683 = new Set(active1683.map((t) => t.polityId));
    expect(pols1683.has("pol_ottoman")).toBe(true);
    expect(pols1683.has("pol_safavid")).toBe(true);
    expect(pols1683.has("pol_mughal")).toBe(true);

    // 14. Year 1850 CE: Late Ottoman Empire & Later Mughal Realm
    const active1850 = filterActiveTerritories(initialTerritoryPeriods, 1850);
    const pols1850 = new Set(active1850.map((t) => t.polityId));
    expect(pols1850.has("pol_ottoman")).toBe(true);
    expect(pols1850.has("pol_mughal")).toBe(true);
    const lateOttoman = active1850.find((t) => t.id === "ter_ottoman_late_1684_1922");
    expect(lateOttoman).toBeDefined();
    const lateMughal = active1850.find((t) => t.id === "ter_mughal_late_1708_1857");
    expect(lateMughal).toBeDefined();
  });

  it("converts territories to valid GeoJSON FeatureCollection with properties and preserves MultiPolygon geometries", () => {
    // Check MultiPolygon support in year 980 (Caliphate of Córdoba)
    const active980 = filterActiveTerritories(initialTerritoryPeriods, 980);
    const fc980 = formatTerritoriesToGeoJson(active980);
    const cordobaFeature = fc980.features.find((f) => f.properties.polityId === "pol_cordoba_caliphate");
    expect(cordobaFeature).toBeDefined();
    expect(cordobaFeature?.geometry.type).toBe("MultiPolygon");

    // Check year 1550
    const active1550 = filterActiveTerritories(initialTerritoryPeriods, 1550);
    const featureCollection = formatTerritoriesToGeoJson(active1550);

    expect(featureCollection.type).toBe("FeatureCollection");
    expect(featureCollection.features.length).toBe(active1550.length);

    featureCollection.features.forEach((feat) => {
      expect(feat.type).toBe("Feature");
      expect(feat.id).toBeDefined();
      expect(feat.properties.polityId).toBeDefined();
      expect(feat.properties.regionName).toBeDefined();
      expect(["Polygon", "MultiPolygon"]).toContain(feat.geometry.type);
    });
  });
});

