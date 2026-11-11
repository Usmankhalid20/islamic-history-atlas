import type { TerritoryPeriodRecord } from "@/lib/db/schema/territoryPeriods";
export * from "./validateGeometry";

/**
 * Pure predicate function checking if a territory period was active in a given year.
 * Rule: validFromYear <= year AND validToYear >= year.
 */
export function isTerritoryActiveInYear(
  period: { validFromYear: number; validToYear: number },
  year: number
): boolean {
  return period.validFromYear <= year && period.validToYear >= year;
}

/**
 * Filters an in-memory list of territory records for a selected historical year.
 */
export function filterActiveTerritories<T extends { validFromYear: number; validToYear: number }>(
  periods: T[],
  year: number
): T[] {
  return periods.filter((period) => isTerritoryActiveInYear(period, year));
}

/**
 * Formats territory periods into a standard GeoJSON FeatureCollection for map rendering.
 */
export function formatTerritoriesToGeoJson(periods: TerritoryPeriodRecord[]) {
  return {
    type: "FeatureCollection" as const,
    features: periods.map((period) => ({
      type: "Feature" as const,
      id: period.id,
      properties: {
        id: period.id,
        polityId: period.polityId,
        regionName: period.regionName,
        validFromYear: period.validFromYear,
        validToYear: period.validToYear,
        controlType: period.controlType,
        confidence: period.confidence,
        explanatoryNote: period.explanatoryNote,
      },
      geometry: period.geometryGeojson as GeoJSON.Geometry,
    })),
  };
}

