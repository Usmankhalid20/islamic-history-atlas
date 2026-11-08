import { describe, it, expect } from "vitest";
import {
  isTerritoryActiveInYear,
  filterActiveTerritories,
  formatTerritoriesToGeoJson,
} from "@/lib/db/queries";
import { initialTerritoryPeriods } from "@/lib/data/historicalSeed";
import type { TerritoryPeriodRecord } from "@/lib/db/schema/territoryPeriods";

describe("Historical Temporal Predicate and Filtering Logic", () => {
  const samplePeriod = {
    validFromYear: 661,
    validToYear: 750,
  };

  it("identifies active years correctly within the inclusive range", () => {
    // Exact start boundary
    expect(isTerritoryActiveInYear(samplePeriod, 661)).toBe(true);
    // Mid-range
    expect(isTerritoryActiveInYear(samplePeriod, 700)).toBe(true);
    // Exact end boundary
    expect(isTerritoryActiveInYear(samplePeriod, 750)).toBe(true);
  });

  it("identifies inactive years outside the range", () => {
    // One year before start
    expect(isTerritoryActiveInYear(samplePeriod, 660)).toBe(false);
    // Well before start
    expect(isTerritoryActiveInYear(samplePeriod, 500)).toBe(false);
    // One year after end
    expect(isTerritoryActiveInYear(samplePeriod, 751)).toBe(false);
    // Well after end
    expect(isTerritoryActiveInYear(samplePeriod, 900)).toBe(false);
  });

  it("correctly identifies multiple concurrent territories in year 800 CE", () => {
    // In 800 CE: Abbasid in Iraq (750-945) and Cordoba in Iberia (756-929) are both active
    const active800 = filterActiveTerritories(initialTerritoryPeriods, 800);
    const regionNames = active800.map((p) => p.regionName);

    expect(active800.length).toBe(2);
    expect(regionNames).toContain("Al-Andalus (Iberian Peninsula)");
    expect(regionNames).toContain("Iraq & Mesopotamia (Sawad)");
    expect(regionNames).not.toContain("Syria & Levant (Bilad al-Sham)"); // ended 750
    expect(regionNames).not.toContain("Ifriqiya (Tunisia & Eastern Algeria)"); // starts 909
  });

  it("correctly identifies three concurrent polities in year 920 CE", () => {
    // In 920 CE: Abbasid (750-945), Cordoba (756-929), and Fatimid (909-969) are all active
    const active920 = filterActiveTerritories(initialTerritoryPeriods, 920);
    expect(active920.length).toBe(3);

    const polityIds = active920.map((p) => p.polityId);
    expect(polityIds).toContain("pol_abbasid_early");
    expect(polityIds).toContain("pol_cordoba_emirate");
    expect(polityIds).toContain("pol_fatimid");
  });

  it("transforms territory records into valid GeoJSON FeatureCollection", () => {
    const active800 = filterActiveTerritories(
      initialTerritoryPeriods,
      800
    ) as TerritoryPeriodRecord[];
    const featureCollection = formatTerritoriesToGeoJson(active800);

    expect(featureCollection.type).toBe("FeatureCollection");
    expect(featureCollection.features.length).toBe(2);

    const firstFeature = featureCollection.features[0];
    expect(firstFeature.type).toBe("Feature");
    expect(firstFeature.properties).toHaveProperty("regionName");
    expect(firstFeature.properties).toHaveProperty("controlType");
    expect(firstFeature.properties).toHaveProperty("confidence");
    expect(firstFeature.geometry.type).toBe("Polygon");
  });
});

