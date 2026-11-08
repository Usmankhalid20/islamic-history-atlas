import { pgTable, text, integer, timestamp, jsonb } from "drizzle-orm/pg-core";

export const tradeRoutes = pgTable("trade_routes", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  routeType: text("route_type").notNull(), // "pilgrim_road" | "caravan_route" | "maritime_lane"
  description: text("description"),
  primaryCommodities: text("primary_commodities"),
  activeFromYear: integer("active_from_year").notNull(),
  activeToYear: integer("active_to_year"),
  pathGeojson: jsonb("path_geojson").notNull(),
  reviewStatus: text("review_status").default("draft").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type TradeRouteRecord = typeof tradeRoutes.$inferSelect;
export type NewTradeRouteRecord = typeof tradeRoutes.$inferInsert;
