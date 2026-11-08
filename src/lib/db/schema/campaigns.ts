import { pgTable, text, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { polities } from "./polities";
import { rulers } from "./rulers";

export const campaigns = pgTable("campaigns", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  startYear: integer("start_year").notNull(),
  endYear: integer("end_year").notNull(),
  polityId: text("polity_id")
    .notNull()
    .references(() => polities.id, { onDelete: "cascade" }),
  commanderName: text("commander_name").notNull(),
  rulerId: text("ruler_id").references(() => rulers.id, { onDelete: "set null" }),
  routeGeojson: jsonb("route_geojson").notNull(),
  keyLocations: text("key_locations").notNull(),
  strategicOutcome: text("strategic_outcome").notNull(),
  description: text("description"),
  reviewStatus: text("review_status").default("draft").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type CampaignRecord = typeof campaigns.$inferSelect;
export type NewCampaignRecord = typeof campaigns.$inferInsert;
