import { describe, it, expect } from "vitest";
import {
  generateAtlasGeoJSON,
  generateAcademicCitation,
} from "@/lib/geo/exportUtils";
import {
  initialTerritoryPeriods,
  initialTradeRoutes,
  initialMonuments,
  initialCampaigns,
  initialHistoricalEvents,
  initialPolities,
} from "@/lib/data/historicalSeed";
import { filterActiveTerritories } from "@/lib/geo/territoryUtils";

describe("Cartographic Export & Academic Citation Generator", () => {
  it("generates a valid GeoJSON FeatureCollection for a historical year", () => {
    const year = 750;
    const activeTerritories = filterActiveTerritories(initialTerritoryPeriods, year);
    const activeRoutes = initialTradeRoutes.filter(
      (r) => r.activeFromYear <= year && (r.activeToYear ?? 2000) >= year
    );
    const activeMonuments = initialMonuments.filter((m) => m.foundingYear <= year);
    const activeCampaigns = initialCampaigns.filter(
      (c) => c.startYear <= year && c.endYear >= year
    );
    const activeEvents = initialHistoricalEvents.filter(
      (e) => Math.abs(e.eventYear - year) <= 25
    );

    const geojson = generateAtlasGeoJSON({
      year,
      territories: activeTerritories,
      routes: activeRoutes,
      monuments: activeMonuments,
      campaigns: activeCampaigns,
      events: activeEvents,
      activePolities: initialPolities,
    });

    // Top-level structure
    expect(geojson.type).toBe("FeatureCollection");
    expect(Array.isArray(geojson.features)).toBe(true);
    expect(geojson.features.length).toBeGreaterThan(0);

    // Metadata
    expect(geojson.metadata.year).toBe(750);
    expect(geojson.metadata.formattedYear).toBe("750 CE");
    expect(geojson.metadata.title).toContain("750 CE");
    expect(geojson.metadata.totalFeatures).toBe(geojson.features.length);
    expect(geojson.metadata.attribution).toBeDefined();
    expect(geojson.metadata.license).toBeDefined();
    expect(geojson.metadata.primarySources.length).toBeGreaterThanOrEqual(3);

    // Verify feature layer types
    const layerTypes = new Set(geojson.features.map((f) => f.properties.layerType));
    expect(layerTypes.has("territory")).toBe(true);
    expect(layerTypes.has("trade_route")).toBe(true);
    expect(layerTypes.has("monument")).toBe(true);
    expect(layerTypes.has("event")).toBe(true);

    // Verify feature structure
    geojson.features.forEach((feature) => {
      expect(feature.type).toBe("Feature");
      expect(feature.id).toBeDefined();
      expect(feature.geometry).toBeDefined();
      expect(feature.geometry.type).toBeDefined();
      expect(feature.properties).toBeDefined();
      expect(feature.properties.layerType).toBeDefined();
    });
  });

  it("handles empty feature sets gracefully", () => {
    const geojson = generateAtlasGeoJSON({
      year: 600,
      territories: [],
      routes: [],
      monuments: [],
      campaigns: [],
      events: [],
      activePolities: [],
    });

    expect(geojson.type).toBe("FeatureCollection");
    expect(geojson.features.length).toBe(0);
    expect(geojson.metadata.totalFeatures).toBe(0);
    expect(geojson.metadata.year).toBe(600);
    expect(geojson.metadata.formattedYear).toBe("600 CE");
  });

  it("generates scholarly Chicago and BibTeX citations with appropriate year attribution", () => {
    const citations = generateAcademicCitation({
      year: 750,
      activePolities: ["Abbasid Caliphate", "Emirate of Cordoba"],
    });

    // Chicago citation checks
    expect(citations.chicago).toContain("Islamic History Atlas");
    expect(citations.chicago).toContain("750 CE");
    expect(citations.chicago).toContain("Abbasid Caliphate, Emirate of Cordoba");
    expect(citations.chicago).toContain("https://github.com/Usmankhalid20/islamic-history-atlas");

    // BibTeX citation checks
    expect(citations.bibtex).toContain("@misc{islamic_history_atlas_750,");
    expect(citations.bibtex).toContain("Historical Cartography and Territorial Control, 750 CE");
    expect(citations.bibtex).toContain("author = {{Islamic History Atlas Project}}");
    expect(citations.bibtex).toContain("url = {https://github.com/Usmankhalid20/islamic-history-atlas}");
  });

  it("verifies campaign vectors are included when active in year", () => {
    // Battle of Yarmouk occurred 634-636 CE
    const year = 636;
    const campaignsIn636 = initialCampaigns.filter(
      (c) => c.startYear <= year && c.endYear >= year
    );
    expect(campaignsIn636.length).toBeGreaterThanOrEqual(1);

    const geojson = generateAtlasGeoJSON({
      year,
      campaigns: campaignsIn636,
    });

    const campaignFeatures = geojson.features.filter(
      (f) => f.properties.layerType === "campaign"
    );
    expect(campaignFeatures.length).toBe(campaignsIn636.length);
    expect(campaignFeatures[0].geometry.type).toBe("LineString");
    expect(campaignFeatures[0].properties.commanderName).toBeDefined();
  });
});
