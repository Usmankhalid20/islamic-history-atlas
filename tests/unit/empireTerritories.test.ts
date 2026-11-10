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
} from "@/lib/geo/territoryUtils";

describe("Phase 2: Empire Territories & Dynastic Boundaries", () => {
  it("defines comprehensive historical polities with valid metadata and capitals", () => {
    expect(initialPolities.length).toBeGreaterThanOrEqual(18);

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
      "pol_ayyubid",
      "pol_mamluk",
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

    // Check specific user requested colors
    expect(POLITY_COLORS["pol_rashidun"].fill).toBe("#16A34A"); // Green
    expect(POLITY_COLORS["pol_umayyad"].fill).toBe("#14532D"); // Deep green
    expect(POLITY_COLORS["pol_abbasid_early"].fill).toBe("#D97706"); // Gold
    expect(POLITY_COLORS["pol_fatimid"].fill).toBe("#9333EA"); // Purple
    expect(POLITY_COLORS["pol_seljuk"].fill).toBe("#2563EB"); // Blue
    expect(POLITY_COLORS["pol_ghaznavid"].fill).toBe("#78350F"); // Brown
    expect(POLITY_COLORS["pol_ayyubid"].fill).toBe("#0D9488"); // Teal
    expect(POLITY_COLORS["pol_mamluk"].fill).toBe("#DC2626"); // Red
    expect(POLITY_COLORS["pol_ottoman"].fill).toBe("#991B1B"); // Dark red
    expect(POLITY_COLORS["pol_mughal"].fill).toBe("#EA580C"); // Orange
    expect(POLITY_COLORS["pol_safavid"].fill).toBe("#4338CA"); // Indigo
  });

  it("ensures every territory has valid closed GeoJSON polygons and attested boundaries", () => {
    expect(initialTerritoryPeriods.length).toBeGreaterThanOrEqual(18);

    const polityIds = new Set(initialPolities.map((p) => p.id));

    initialTerritoryPeriods.forEach((ter) => {
      expect(polityIds.has(ter.polityId), `Territory ${ter.id} references unknown polity ${ter.polityId}`).toBe(true);
      expect(ter.validFromYear).toBeLessThanOrEqual(ter.validToYear);
      expect(ter.regionName.length).toBeGreaterThan(0);

      const geo = ter.geometryGeojson as {
        type: string;
        coordinates: [number, number][][];
      };
      expect(geo.type).toBe("Polygon");
      expect(geo.coordinates.length).toBeGreaterThanOrEqual(1);

      const ring = geo.coordinates[0];
      expect(ring.length).toBeGreaterThanOrEqual(4); // Minimum valid polygon (triangle + close)

      // Ring must be closed
      const firstCoord = ring[0];
      const lastCoord = ring[ring.length - 1];
      expect(firstCoord[0]).toBeCloseTo(lastCoord[0], 4);
      expect(firstCoord[1]).toBeCloseTo(lastCoord[1], 4);

      // Coordinates within standard world geographic bounds [lng, lat]
      ring.forEach(([lng, lat]) => {
        expect(lng).toBeGreaterThanOrEqual(-180);
        expect(lng).toBeLessThanOrEqual(180);
        expect(lat).toBeGreaterThanOrEqual(-90);
        expect(lat).toBeLessThanOrEqual(90);
      });
    });
  });

  it("supports multi-polity co-existence across historical benchmark eras", () => {
    // 1. Year 756 CE: Early Abbasids and Emirate of Córdoba
    const active756 = filterActiveTerritories(initialTerritoryPeriods, 756);
    const pols756 = new Set(active756.map((t) => t.polityId));
    expect(pols756.has("pol_abbasid_early")).toBe(true);
    expect(pols756.has("pol_cordoba_emirate")).toBe(true);

    // 2. Year 985 CE: 5 contemporaneous empires (Fatimid, Buyid, Ghaznavid, Samanid, Córdoba Caliphate)
    const active985 = filterActiveTerritories(initialTerritoryPeriods, 985);
    const pols985 = new Set(active985.map((t) => t.polityId));
    expect(pols985.has("pol_fatimid")).toBe(true);
    expect(pols985.has("pol_buyid")).toBe(true);
    expect(pols985.has("pol_ghaznavid")).toBe(true);
    expect(pols985.has("pol_samanid")).toBe(true);
    expect(pols985.has("pol_cordoba_caliphate")).toBe(true);

    // 3. Year 1187 CE: Ayyubids (Saladin), Seljuks, and Almohads
    const active1187 = filterActiveTerritories(initialTerritoryPeriods, 1187);
    const pols1187 = new Set(active1187.map((t) => t.polityId));
    expect(pols1187.has("pol_ayyubid")).toBe(true);
    expect(pols1187.has("pol_seljuk")).toBe(true);
    expect(pols1187.has("pol_almohad")).toBe(true);

    // 4. Year 1300 CE: Mamluk Sultanate, Delhi Sultanate, Ottoman Empire
    const active1300 = filterActiveTerritories(initialTerritoryPeriods, 1300);
    const pols1300 = new Set(active1300.map((t) => t.polityId));
    expect(pols1300.has("pol_mamluk")).toBe(true);
    expect(pols1300.has("pol_delhi_sultanate")).toBe(true);
    expect(pols1300.has("pol_ottoman")).toBe(true);

    // 5. Year 1550 CE: The Three Gunpowder Empires (Ottoman, Safavid, Mughal)
    const active1550 = filterActiveTerritories(initialTerritoryPeriods, 1550);
    const pols1550 = new Set(active1550.map((t) => t.polityId));
    expect(pols1550.has("pol_ottoman")).toBe(true);
    expect(pols1550.has("pol_safavid")).toBe(true);
    expect(pols1550.has("pol_mughal")).toBe(true);
  });

  it("converts territories to valid GeoJSON FeatureCollection with properties", () => {
    const active1550 = filterActiveTerritories(initialTerritoryPeriods, 1550);
    const featureCollection = formatTerritoriesToGeoJson(active1550);

    expect(featureCollection.type).toBe("FeatureCollection");
    expect(featureCollection.features.length).toBe(active1550.length);

    featureCollection.features.forEach((feat) => {
      expect(feat.type).toBe("Feature");
      expect(feat.id).toBeDefined();
      expect(feat.properties.polityId).toBeDefined();
      expect(feat.properties.regionName).toBeDefined();
      expect(feat.geometry.type).toBe("Polygon");
    });
  });
});
