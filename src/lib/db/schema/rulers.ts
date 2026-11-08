import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";

export const rulers = pgTable("rulers", {
  id: text("id").primaryKey(),
  preferredName: text("preferred_name").notNull(),
  birthYear: integer("birth_year"),
  deathYear: integer("death_year"),
  biography: text("biography"),
  reviewStatus: text("review_status").default("draft").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type RulerRecord = typeof rulers.$inferSelect;
export type NewRulerRecord = typeof rulers.$inferInsert;

