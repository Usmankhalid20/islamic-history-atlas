import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { polities } from "./polities";

export const scholars = pgTable("scholars", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  birthYear: integer("birth_year"),
  deathYear: integer("death_year"),
  fieldsOfStudy: text("fields_of_study").notNull(),
  primaryCity: text("primary_city").notNull(),
  patronizedByPolityId: text("patronized_by_polity_id").references(() => polities.id, {
    onDelete: "set null",
  }),
  majorWorks: text("major_works"),
  biography: text("biography"),
  reviewStatus: text("review_status").default("draft").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type ScholarRecord = typeof scholars.$inferSelect;
export type NewScholarRecord = typeof scholars.$inferInsert;
