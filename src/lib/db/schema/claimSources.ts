import { pgTable, text, index } from "drizzle-orm/pg-core";
import { sources } from "./sources";

export const claimSources = pgTable(
  "claim_sources",
  {
    id: text("id").primaryKey(),
    claimType: text("claim_type").notNull(), // 'polity', 'territory_period', 'historical_event', 'reign', 'ruler'
    claimId: text("claim_id").notNull(),
    sourceId: text("source_id")
      .notNull()
      .references(() => sources.id, { onDelete: "cascade" }),
    specificPageOrPassage: text("specific_page_or_passage"),
    notes: text("notes"),
  },
  (table) => ({
    claimIdx: index("claim_sources_claim_idx").on(table.claimType, table.claimId),
    sourceIdx: index("claim_sources_source_idx").on(table.sourceId),
  })
);

export type ClaimSourceRecord = typeof claimSources.$inferSelect;
export type NewClaimSourceRecord = typeof claimSources.$inferInsert;

