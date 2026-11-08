import { and, lte, gte, eq } from "drizzle-orm";
import { db } from "./index";
import { territoryPeriods } from "./schema/territoryPeriods";
import { polities } from "./schema/polities";

export {
  isTerritoryActiveInYear,
  filterActiveTerritories,
  formatTerritoriesToGeoJson,
} from "@/lib/geo/territoryUtils";

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
