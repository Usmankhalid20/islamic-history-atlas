import { pgTable, text, integer, boolean } from "drizzle-orm/pg-core";
import { rulers } from "./rulers";
import { polities } from "./polities";

export const reigns = pgTable("reigns", {
  id: text("id").primaryKey(),
  rulerId: text("ruler_id")
    .notNull()
    .references(() => rulers.id, { onDelete: "cascade" }),
  polityId: text("polity_id")
    .notNull()
    .references(() => polities.id, { onDelete: "cascade" }),
  startYear: integer("start_year").notNull(),
  endYear: integer("end_year"),
  title: text("title"),
  isCoRuler: boolean("is_co_ruler").default(false).notNull(),
  reviewStatus: text("review_status").default("draft").notNull(),
});

export type ReignRecord = typeof reigns.$inferSelect;
export type NewReignRecord = typeof reigns.$inferInsert;

