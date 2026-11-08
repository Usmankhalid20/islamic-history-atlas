import { pgTable, text, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { polities } from "./polities";

export const monuments = pgTable("monuments", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  monumentType: text("monument_type").notNull(), // "mosque" | "academy_library" | "palace" | "observatory"
  polityId: text("polity_id")
    .notNull()
    .references(() => polities.id, { onDelete: "cascade" }),
  foundingYear: integer("founding_year").notNull(),
  cityName: text("city_name").notNull(),
  locationGeojson: jsonb("location_geojson").notNull(),
  architecturalFeatures: text("architectural_features"),
  description: text("description"),
  reviewStatus: text("review_status").default("draft").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type MonumentRecord = typeof monuments.$inferSelect;
export type NewMonumentRecord = typeof monuments.$inferInsert;
