import { pgTable, text, integer, jsonb, index } from "drizzle-orm/pg-core";
import { polities } from "./polities";

export const territoryPeriods = pgTable(
  "territory_periods",
  {
    id: text("id").primaryKey(),
    polityId: text("polity_id")
      .notNull()
      .references(() => polities.id, { onDelete: "cascade" }),
    regionName: text("region_name").notNull(),
    validFromYear: integer("valid_from_year").notNull(),
    validToYear: integer("valid_to_year").notNull(),
    controlType: text("control_type").notNull(), // direct, tributary, vassal, claimed, contested, influence
    confidence: text("confidence").default("approximate").notNull(), // well-attested, approximate, disputed, inferred, unknown
    geometryGeojson: jsonb("geometry_geojson").notNull(), // GeoJSON Feature or FeatureCollection
    explanatoryNote: text("explanatory_note"),
    reviewStatus: text("review_status").default("draft").notNull(),
  },
  (table) => ({
    yearRangeIdx: index("territory_periods_year_range_idx").on(
      table.validFromYear,
      table.validToYear
    ),
    polityIdx: index("territory_periods_polity_idx").on(table.polityId),
  })
);

export type TerritoryPeriodRecord = typeof territoryPeriods.$inferSelect;
export type NewTerritoryPeriodRecord = typeof territoryPeriods.$inferInsert;

