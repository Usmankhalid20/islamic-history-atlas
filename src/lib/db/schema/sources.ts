import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const sources = pgTable("sources", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  authorOrOrganization: text("author_or_organization").notNull(),
  publication: text("publication"),
  publicationDate: text("publication_date"),
  url: text("url"),
  accessedAt: timestamp("accessed_at", { withTimezone: true }),
  citationText: text("citation_text").notNull(),
  licenseOrRightsNote: text("license_or_rights_note"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type SourceRecord = typeof sources.$inferSelect;
export type NewSourceRecord = typeof sources.$inferInsert;

