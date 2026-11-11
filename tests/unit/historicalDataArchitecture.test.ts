import { describe, it, expect } from "vitest";
import {
  validateGeoJsonGeometry,
  validatePosition,
  validateLinearRing,
  isClosedLinearRing,
  ensureClosedRing,
} from "@/lib/geo/validateGeometry";
import {
  initialPolities,
  initialTerritoryPeriods,
} from "@/lib/data/historicalSeed";
import {
  filterActiveTerritories,
  formatTerritoriesToGeoJson,
} from "@/lib/geo/territoryUtils";

describe("Phase 4: Historical Data Architecture & Geometry Validation", () => {
  describe("GeoJSON Geometry Validation (RFC 7946)", () => {
    it("validates valid coordinate positions in [lng, lat] order", () => {
      expect(validatePosition([35.21, 31.78]).isValid).toBe(true); // Jerusalem
      expect(validatePosition([-5.6, 36.01]).isValid).toBe(true); // Tarifa
      expect(validatePosition([180, 90]).isValid).toBe(true);
      expect(validatePosition([-180, -90]).isValid).toBe(true);
    });

    it("rejects out-of-bounds or non-numeric positions", () => {
      expect(validatePosition([185, 30]).isValid).toBe(false); // Longitude > 180
      expect(validatePosition([-181, 30]).isValid).toBe(false); // Longitude < -180
      expect(validatePosition([35, 95]).isValid).toBe(false); // Latitude > 90
      expect(validatePosition([35, -95]).isValid).toBe(false); // Latitude < -90
      expect(validatePosition(["35", 31]).isValid).toBe(false); // String
      expect(validatePosition([NaN, 31]).isValid).toBe(false); // NaN
      expect(validatePosition(null).isValid).toBe(false);
      expect(validatePosition([35]).isValid).toBe(false); // Missing lat
    });

    it("validates closed linear rings correctly", () => {
      const closedRing: [number, number][] = [
        [30, 30],
        [35, 30],
        [35, 35],
        [30, 35],
        [30, 30],
      ];
      expect(isClosedLinearRing(closedRing)).toBe(true);
      expect(validateLinearRing(closedRing).isValid).toBe(true);
    });

    it("detects unclosed linear rings and repairs with ensureClosedRing", () => {
      const unclosedRing: [number, number][] = [
        [30, 30],
        [35, 30],
        [35, 35],
        [30, 35],
      ];
      expect(isClosedLinearRing(unclosedRing)).toBe(false);
      expect(validateLinearRing(unclosedRing).isValid).toBe(false);

      const repaired = ensureClosedRing(unclosedRing);
      expect(isClosedLinearRing(repaired)).toBe(true);
      expect(validateLinearRing(repaired).isValid).toBe(true);
    });

    it("validates standard Polygon geometries", () => {
      const polygon = {
        type: "Polygon",
        coordinates: [
          [
            [40, 30],
            [45, 30],
            [45, 35],
            [40, 35],
            [40, 30],
          ],
        ],
      };
      const result = validateGeoJsonGeometry(polygon);
      expect(result.isValid).toBe(true);
    });

    it("validates MultiPolygon geometries with multiple disconnected regions", () => {
      const multiPolygon = {
        type: "MultiPolygon",
        coordinates: [
          [
            [
              [-5, 36],
              [-4, 36],
              [-4, 37],
              [-5, 37],
              [-5, 36],
            ],
          ],
          [
            [
              [-5.3, 35.5],
              [-4.0, 35.2],
              [-4.0, 35.8],
              [-5.3, 35.5],
            ],
          ],
        ],
      };
      const result = validateGeoJsonGeometry(multiPolygon);
      expect(result.isValid).toBe(true);
    });

    it("validates Point and LineString geometries", () => {
      expect(
        validateGeoJsonGeometry({
          type: "Point",
          coordinates: [44.36, 33.31],
        }).isValid
      ).toBe(true);

      expect(
        validateGeoJsonGeometry({
          type: "LineString",
          coordinates: [
            [39.82, 21.42],
            [39.61, 24.47],
            [36.31, 33.51],
          ],
        }).isValid
      ).toBe(true);
    });

    it("rejects invalid or unsupported geometry types", () => {
      expect(validateGeoJsonGeometry(null).isValid).toBe(false);
      expect(validateGeoJsonGeometry({ type: "InvalidType", coordinates: [] }).isValid).toBe(false);
      expect(validateGeoJsonGeometry({ coordinates: [30, 30] }).isValid).toBe(false);
    });
  });

  describe("Temporal Milestone Filtering & Changing Boundaries", () => {
    it("ensures all testing milestone years return non-empty active territories", () => {
      const milestones = [900, 977, 1030, 1071, 1092, 1200, 1258, 1260, 1453, 1550, 1683, 1850];

      for (const year of milestones) {
        const active = filterActiveTerritories(initialTerritoryPeriods, year);
        expect(
          active.length,
          `Expected active territories in testing milestone year ${year}`
        ).toBeGreaterThanOrEqual(1);

        // Every active territory must pass GeoJSON validation
        for (const ter of active) {
          const res = validateGeoJsonGeometry(ter.geometryGeojson);
          expect(res.isValid, `Territory ${ter.id} in year ${year} has invalid geometry`).toBe(true);
        }
      }
    });

    it("verifies changing territorial contours for the Great Seljuk Empire", () => {
      // Early expansion in 1055
      const active1055 = filterActiveTerritories(initialTerritoryPeriods, 1055);
      const earlySeljuk = active1055.find((t) => t.id === "ter_seljuk_early_1037_1071");
      expect(earlySeljuk).toBeDefined();

      // Imperial zenith under Malik Shah in 1085
      const active1085 = filterActiveTerritories(initialTerritoryPeriods, 1085);
      const zenithSeljuk = active1085.find((t) => t.id === "ter_seljuk_zenith_1072_1092");
      expect(zenithSeljuk).toBeDefined();

      // Partitioned later realm in 1150
      const active1150 = filterActiveTerritories(initialTerritoryPeriods, 1150);
      const lateSeljuk = active1150.find((t) => t.id === "ter_seljuk_late_1093_1194");
      expect(lateSeljuk).toBeDefined();
    });

    it("verifies changing territorial contours for the Ottoman Empire", () => {
      // Early Beylik in 1380
      const active1380 = filterActiveTerritories(initialTerritoryPeriods, 1380);
      const earlyOttoman = active1380.find((t) => t.id === "ter_ottoman_early_1299_1453");
      expect(earlyOttoman).toBeDefined();

      // Classical Zenith in 1550
      const active1550 = filterActiveTerritories(initialTerritoryPeriods, 1550);
      const zenithOttoman = active1550.find((t) => t.id === "ter_ottoman_zenith_1453_1683");
      expect(zenithOttoman).toBeDefined();

      // Late Tanzimat in 1850
      const active1850 = filterActiveTerritories(initialTerritoryPeriods, 1850);
      const lateOttoman = active1850.find((t) => t.id === "ter_ottoman_late_1684_1922");
      expect(lateOttoman).toBeDefined();
    });

    it("verifies Ilkhanate presence and vassal protectorate in 1260", () => {
      const active1260 = filterActiveTerritories(initialTerritoryPeriods, 1260);
      const ilkhanateCore = active1260.find((t) => t.id === "ter_ilkhanate_realm_1258_1335");
      const rumVassal = active1260.find((t) => t.id === "ter_ilkhanate_anatolia_vassal_1260_1335");

      expect(ilkhanateCore).toBeDefined();
      expect(ilkhanateCore?.controlType).toBe("direct");

      expect(rumVassal).toBeDefined();
      expect(rumVassal?.controlType).toBe("vassal_state");
    });
  });

  describe("Control Types & Attribute Architecture", () => {
    it("ensures every territory has an attested control classification", () => {
      const validControlTypes = new Set([
        "direct",
        "tributary",
        "vassal_state",
        "claimed",
        "contested",
        "temporary_occupation",
      ]);

      initialTerritoryPeriods.forEach((ter) => {
        expect(
          validControlTypes.has(ter.controlType),
          `Territory ${ter.id} has invalid controlType: ${ter.controlType}`
        ).toBe(true);
      });
    });

    it("formats GeoJSON FeatureCollection preserving properties and geometries", () => {
      const allActive = filterActiveTerritories(initialTerritoryPeriods, 1260);
      const fc = formatTerritoriesToGeoJson(allActive);

      expect(fc.type).toBe("FeatureCollection");
      expect(fc.features.length).toBe(allActive.length);

      fc.features.forEach((feat) => {
        expect(feat.type).toBe("Feature");
        expect(feat.properties.id).toBeDefined();
        expect(feat.properties.polityId).toBeDefined();
        expect(feat.properties.controlType).toBeDefined();
        expect(feat.properties.validFromYear).toBeDefined();
        expect(feat.properties.validToYear).toBeDefined();
        expect(feat.geometry).toBeDefined();
      });
    });
  });
});
