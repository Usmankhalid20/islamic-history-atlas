import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";

export const polities = pgTable("polities", {
  id: text("id").primaryKey(),
  canonicalName: text("canonical_name").notNull(),
  entityType: text("entity_type").notNull(), // caliphate, sultanate, emirate, dynasty, kingdom
  startYear: integer("start_year").notNull(),
  endYear: integer("end_year"),
  precision: text("precision").default("approximate").notNull(), // exact, approximate, disputed, inferred, unknown
  overview: text("overview").notNull(),
  capitalCity: text("capital_city"),
  reviewStatus: text("review_status").default("draft").notNull(), // draft, in_review, verified, published
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type PolityRecord = typeof polities.$inferSelect;
export type NewPolityRecord = typeof polities.$inferInsert;

