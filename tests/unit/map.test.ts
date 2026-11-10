import { describe, it, expect } from "vitest";
import {
  initialTerritoryPeriods,
  initialHistoricalEvents,
  initialTradeRoutes,
  initialMonuments,
  initialCampaigns,
} from "@/lib/data/historicalSeed";
import { initialHistoricalDiscrepancies } from "@/lib/data/discrepanciesSeed";
import { filterActiveTerritories } from "@/lib/geo/territoryUtils";
import { GET as getTerritoriesRoute } from "@/app/api/territories/route";
import { NextRequest } from "next/server";

describe("Historical Map Cartographic Integrity & Coordinate Verification", () => {
  it("verifies all territory polygons have valid coordinates and closed rings", () => {
    expect(initialTerritoryPeriods.length).toBeGreaterThanOrEqual(5);

    initialTerritoryPeriods.forEach((t) => {
      expect(t.id).toBeDefined();
      expect(t.regionName).toBeDefined();
      expect(t.validFromYear).toBeLessThanOrEqual(t.validToYear);

      const geo = t.geometryGeojson as GeoJSON.Polygon;
      expect(geo).toBeDefined();
      expect(geo.type).toBe("Polygon");
      expect(Array.isArray(geo.coordinates)).toBe(true);
      expect(geo.coordinates.length).toBeGreaterThanOrEqual(1);

      const exteriorRing = geo.coordinates[0];
      expect(exteriorRing.length).toBeGreaterThanOrEqual(4); // GeoJSON polygon ring minimum 4 points

      // First and last coordinate must be identical (closed ring)
      const first = exteriorRing[0];
      const last = exteriorRing[exteriorRing.length - 1];
      expect(first[0]).toBe(last[0]);
      expect(first[1]).toBe(last[1]);

      // Coordinates order verification: [longitude, latitude]
      exteriorRing.forEach(([lng, lat]) => {
        expect(typeof lng).toBe("number");
        expect(typeof lat).toBe("number");
        // Latitude valid range (-90 to 90), Islamic world: 10°N to 55°N
        expect(lat).toBeGreaterThanOrEqual(10);
        expect(lat).toBeLessThanOrEqual(55);
        // Longitude valid range (-180 to 180), Islamic world: -15°W (Al-Andalus/Morocco) to 95°E (Bengal/Mughal/Delhi)
        expect(lng).toBeGreaterThanOrEqual(-15);
        expect(lng).toBeLessThanOrEqual(95);
      });
    });
  });

  it("verifies historical event markers have valid Point coordinates [lng, lat]", () => {
    initialHistoricalEvents.forEach((evt) => {
      const geo = evt.locationGeojson as GeoJSON.Point;
      expect(geo).toBeDefined();
      expect(geo.type).toBe("Point");
      expect(Array.isArray(geo.coordinates)).toBe(true);
      expect(geo.coordinates.length).toBe(2);

      const [lng, lat] = geo.coordinates;
      expect(lat).toBeGreaterThanOrEqual(15);
      expect(lat).toBeLessThanOrEqual(45);
      expect(lng).toBeGreaterThanOrEqual(-15);
      expect(lng).toBeLessThanOrEqual(65);
    });
  });

  it("verifies trade routes have valid LineString geometries", () => {
    initialTradeRoutes.forEach((route) => {
      const geo = route.pathGeojson as GeoJSON.LineString;
      expect(geo).toBeDefined();
      expect(geo.type).toBe("LineString");
      expect(Array.isArray(geo.coordinates)).toBe(true);
      expect(geo.coordinates.length).toBeGreaterThanOrEqual(3);

      geo.coordinates.forEach(([lng, lat]) => {
        expect(lat).toBeGreaterThanOrEqual(10);
        expect(lat).toBeLessThanOrEqual(50);
        expect(lng).toBeGreaterThanOrEqual(-15);
        expect(lng).toBeLessThanOrEqual(75);
      });
    });
  });

  it("verifies contested discrepancy buffer zones have valid closed geometries", () => {
    initialHistoricalDiscrepancies.forEach((disc) => {
      const geo = disc.geometryGeojson as GeoJSON.Polygon;
      expect(geo).toBeDefined();
      expect(geo.type).toBe("Polygon");
      const ring = geo.coordinates[0];
      expect(ring[0][0]).toBe(ring[ring.length - 1][0]);
      expect(ring[0][1]).toBe(ring[ring.length - 1][1]);
    });
  });
});

describe("Temporal Map Filtering Verification (/?year=632 and other eras)", () => {
  it("correctly identifies active layers for Year 632 CE", () => {
    const year = 632;

    // 1. Territories: Rashidun Caliphate active
    const activeTerritories = filterActiveTerritories(initialTerritoryPeriods, year);
    expect(activeTerritories.length).toBe(1);
    expect(activeTerritories[0].polityId).toBe("pol_rashidun");
    expect(activeTerritories[0].regionName).toContain("Arabian Peninsula");

    // 2. Events: founding event of the Caliphate in Medina
    const events632 = initialHistoricalEvents.filter(
      (e) => Math.abs(e.eventYear - year) <= 25
    );
    const medinaFounding = events632.find((e) => e.id === "evt_accession_abu_bakr_632");
    expect(medinaFounding).toBeDefined();
    expect(medinaFounding?.eventYear).toBe(632);
    expect(medinaFounding?.locationName).toContain("Medina");

    // 3. Campaigns: Ridda consolidation campaign active
    const campaigns632 = initialCampaigns.filter(
      (c) => c.startYear <= year && c.endYear >= year
    );
    expect(campaigns632.length).toBeGreaterThanOrEqual(1);
    const ridda = campaigns632.find((c) => c.id === "camp_ridda_632_633");
    expect(ridda).toBeDefined();
    expect(ridda?.polityId).toBe("pol_rashidun");

    // 4. Routes: Maritime spice route and Khurasan route active
    const routes632 = initialTradeRoutes.filter(
      (r) => r.activeFromYear <= year && (r.activeToYear ?? 2000) >= year
    );
    expect(routes632.length).toBeGreaterThanOrEqual(3);

    // 5. Contested frontiers: Syro-Mesopotamian steppe march active
    const disc632 = initialHistoricalDiscrepancies.filter(
      (d) => d.activeFromYear <= year && d.activeToYear >= year
    );
    expect(disc632.length).toBeGreaterThanOrEqual(1);
    expect(disc632[0].id).toBe("disc_ghassanid_lakhmid_march_632");
  });

  it("correctly identifies active layers for Year 750 CE (Dynastic Transition)", () => {
    const year = 750;

    const activeTerritories = filterActiveTerritories(initialTerritoryPeriods, year);
    const polityIds = activeTerritories.map((t) => t.polityId);
    expect(polityIds).toContain("pol_umayyad");
    expect(polityIds).toContain("pol_abbasid_early");

    const events750 = initialHistoricalEvents.filter(
      (e) => Math.abs(e.eventYear - year) <= 25
    );
    const zabBattle = events750.find((e) => e.id === "evt_battle_of_zab_750");
    expect(zabBattle).toBeDefined();
    expect(zabBattle?.eventYear).toBe(750);
  });

  it("correctly identifies active layers for Year 800 CE (Golden Age & Al-Andalus)", () => {
    const year = 800;

    const activeTerritories = filterActiveTerritories(initialTerritoryPeriods, year);
    const polityIds = activeTerritories.map((t) => t.polityId);
    expect(polityIds).toContain("pol_abbasid_early");
    expect(polityIds).toContain("pol_cordoba_emirate");

    const activeMonuments = initialMonuments.filter((m) => m.foundingYear <= year);
    expect(activeMonuments.length).toBeGreaterThanOrEqual(4);
  });
});

describe("Territories API Integration (GET /api/territories)", () => {
  it("serves valid territory GeoJSON for year 632 via GET /api/territories?year=632", async () => {
    const req = new NextRequest("http://localhost:3000/api/territories?year=632");
    const res = await getTerritoriesRoute(req);

    expect(res.status).toBe(200);
    const data = await res.json();

    expect(data.year).toBe(632);
    expect(data.count).toBeGreaterThanOrEqual(1);
    expect(data.items.length).toBeGreaterThanOrEqual(1);

    const rashidun = data.items.find(
      (item: any) => item.polity.id === "pol_rashidun" || item.id.includes("rashidun")
    );
    expect(rashidun).toBeDefined();
    expect(rashidun.geometry.type).toBe("Polygon");
    expect(rashidun.validFromYear).toBeLessThanOrEqual(632);
    expect(rashidun.validToYear).toBeGreaterThanOrEqual(632);
  });

  it("returns 400 for out-of-range year query", async () => {
    const req = new NextRequest("http://localhost:3000/api/territories?year=300");
    const res = await getTerritoriesRoute(req);

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Invalid query parameters");
  });
});

