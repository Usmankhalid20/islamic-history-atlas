import { pgTable, text } from "drizzle-orm/pg-core";
import { polities } from "./polities";

export const nameVariants = pgTable("name_variants", {
  id: text("id").primaryKey(),
  polityId: text("polity_id")
    .notNull()
    .references(() => polities.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  language: text("language").notNull(), // 'ar', 'fa', 'tr', 'en', etc.
  variantType: text("variant_type").default("transliteration").notNull(), // native, transliteration, exonym, historical
});

export type NameVariantRecord = typeof nameVariants.$inferSelect;
export type NewNameVariantRecord = typeof nameVariants.$inferInsert;

