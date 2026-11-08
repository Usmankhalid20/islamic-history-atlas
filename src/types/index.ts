/**
 * Date precision categories reflecting historical evidence.
 */
export type DatePrecision =
  | "exact"
  | "approximate"
  | "disputed"
  | "inferred"
  | "unknown";

/**
 * Control type categories for historical territorial claims.
 */
export type TerritoryControlType =
  | "direct"
  | "tributary"
  | "vassal"
  | "claimed"
  | "contested"
  | "influence";

/**
 * Baseline source attribution interface.
 */
export interface HistoricalSource {
  id: string;
  title: string;
  authorOrOrganization: string;
  publication?: string;
  publicationDate?: string;
  url?: string;
  accessedAt?: string;
  citationText: string;
}

/**
 * Conceptual Polity model interface.
 */
export interface Polity {
  id: string;
  canonicalName: string;
  entityType: string;
  startYear: number;
  endYear?: number;
  precision: DatePrecision;
  overview: string;
}

