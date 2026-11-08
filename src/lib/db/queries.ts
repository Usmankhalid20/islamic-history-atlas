import { and, lte, gte, eq } from "drizzle-orm";
import { db } from "./index";
import { territoryPeriods } from "./schema/territoryPeriods";
import { polities } from "./schema/polities";
import { historicalEvents } from "./schema/historicalEvents";
import { rulers } from "./schema/rulers";
import { reigns } from "./schema/reigns";
import { tradeRoutes } from "./schema/tradeRoutes";
import { monuments } from "./schema/monuments";
import { scholars } from "./schema/scholars";
import { campaigns } from "./schema/campaigns";
import { sources } from "./schema/sources";

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

/**
 * Queries all historical events with optional year and eventType filters.
 */
export async function queryEvents(filters: { year?: number; eventType?: string } = {}) {
  if (!db) throw new Error("Database client is not initialized.");

  let rows = await db.select().from(historicalEvents);
  if (filters.year !== undefined) {
    rows = rows.filter((e) => e.eventYear === filters.year);
  }
  if (filters.eventType) {
    rows = rows.filter((e) => e.eventType === filters.eventType);
  }
  return rows;
}

/**
 * Queries single event by ID.
 */
export async function queryEventById(id: string) {
  if (!db) throw new Error("Database client is not initialized.");
  const rows = await db.select().from(historicalEvents).where(eq(historicalEvents.id, id));
  return rows[0] || null;
}

/**
 * Queries historical polities.
 */
export async function queryPolities(filters: { activeYear?: number; entityType?: string } = {}) {
  if (!db) throw new Error("Database client is not initialized.");
  let rows = await db.select().from(polities);
  if (filters.activeYear !== undefined) {
    rows = rows.filter(
      (p) =>
        p.startYear <= filters.activeYear! &&
        (p.endYear === null || p.endYear === undefined || p.endYear >= filters.activeYear!)
    );
  }
  if (filters.entityType) {
    rows = rows.filter((p) => p.entityType === filters.entityType);
  }
  return rows;
}

/**
 * Queries single polity by ID.
 */
export async function queryPolityById(id: string) {
  if (!db) throw new Error("Database client is not initialized.");
  const rows = await db.select().from(polities).where(eq(polities.id, id));
  return rows[0] || null;
}

/**
 * Queries rulers with reigns.
 */
export async function queryRulers(filters: { polityId?: string; reignYear?: number; name?: string } = {}) {
  if (!db) throw new Error("Database client is not initialized.");
  const rulerRows = await db.select().from(rulers);
  const reignRows = await db.select().from(reigns);
  const polityRows = await db.select().from(polities);

  let combined = rulerRows.map((ruler) => {
    const rulerReigns = reignRows.filter((r) => r.rulerId === ruler.id);
    const primaryReign = rulerReigns[0];
    const polity = primaryReign
      ? polityRows.find((p) => p.id === primaryReign.polityId)
      : undefined;

    return {
      ...ruler,
      reign: primaryReign,
      polity: polity
        ? {
            id: polity.id,
            canonicalName: polity.canonicalName,
          }
        : undefined,
    };
  });

  if (filters.polityId) {
    combined = combined.filter((r) => r.reign?.polityId === filters.polityId);
  }

  if (filters.reignYear !== undefined) {
    combined = combined.filter((r) => {
      if (!r.reign) return false;
      const end = r.reign.endYear ?? r.reign.startYear;
      return r.reign.startYear <= filters.reignYear! && end >= filters.reignYear!;
    });
  }

  if (filters.name) {
    const lower = filters.name.toLowerCase();
    combined = combined.filter((r) => r.preferredName.toLowerCase().includes(lower));
  }

  return combined;
}

/**
 * Queries historical sources register.
 */
export async function querySources() {
  if (!db) throw new Error("Database client is not initialized.");
  return await db.select().from(sources);
}
