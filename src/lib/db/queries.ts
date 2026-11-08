import { and, lte, gte, eq } from "drizzle-orm";
import { db } from "./index";
import { territoryPeriods, type TerritoryPeriodRecord } from "./schema/territoryPeriods";
import { polities } from "./schema/polities";

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

/**
 * Executes a PostgreSQL database query for territory periods active in a given year.
 */
export async function queryTerritoriesForYear(year: number) {
  if (!db) {
    throw new Error("Database client is not initialized (DATABASE_URL missing).");
  }

  return await db
    .select({
      territory: territoryPeriods,
      polity: polities,
    })
    .from(territoryPeriods)
    .innerJoin(polities, eq(territoryPeriods.polityId, polities.id))
    .where(
      and(
        lte(territoryPeriods.validFromYear, year),
        gte(territoryPeriods.validToYear, year),
        eq(territoryPeriods.reviewStatus, "published")
      )
    );
}

