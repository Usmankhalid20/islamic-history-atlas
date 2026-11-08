import { pgTable, text, integer, jsonb, index } from "drizzle-orm/pg-core";

export const historicalEvents = pgTable(
  "historical_events",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    eventYear: integer("event_year").notNull(),
    summary: text("summary").notNull(),
    eventType: text("event_type").notNull(), // battle, treaty, conquest, succession, founding
    locationName: text("location_name"),
    locationGeojson: jsonb("location_geojson"),
    reviewStatus: text("review_status").default("draft").notNull(),
  },
  (table) => ({
    eventYearIdx: index("historical_events_year_idx").on(table.eventYear),
  })
);

export type HistoricalEventRecord = typeof historicalEvents.$inferSelect;
export type NewHistoricalEventRecord = typeof historicalEvents.$inferInsert;

