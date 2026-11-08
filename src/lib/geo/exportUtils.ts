import type { TerritoryPeriodRecord } from "@/lib/db/schema/territoryPeriods";
import type { HistoricalEventRecord } from "@/lib/db/schema/historicalEvents";
import type { TradeRouteRecord } from "@/lib/db/schema/tradeRoutes";
import type { NewMonumentRecord } from "@/lib/db/schema/monuments";
import type { NewCampaignRecord } from "@/lib/db/schema/campaigns";
import type { PolityRecord, NewPolityRecord } from "@/lib/db/schema/polities";
import { initialSources } from "@/lib/data/historicalSeed";
import { formatHistoricalYear } from "@/lib/utils";

export type AnyPolity = PolityRecord | NewPolityRecord;

export interface AtlasGeoJsonMetadata {
  title: string;
  year: number;
  formattedYear: string;
  exportTimestamp: string;
  activePolities: string[];
  totalFeatures: number;
  attribution: string;
  license: string;
  primarySources: Array<{
    id: string;
    title: string;
    citation: string;
  }>;
}

export interface AtlasExportFeatureCollection {
  type: "FeatureCollection";
  metadata: AtlasGeoJsonMetadata;
  features: Array<{
    type: "Feature";
    id: string;
    geometry: GeoJSON.Geometry;
    properties: Record<string, unknown>;
  }>;
}

/**
 * Pure function that generates a compliant GeoJSON FeatureCollection
 * representing the complete cartographic state of the atlas at a given year.
 */
export function generateAtlasGeoJSON({
  year,
  territories = [],
  routes = [],
  monuments = [],
  campaigns = [],
  events = [],
  activePolities = [],
}: {
  year: number;
  territories?: TerritoryPeriodRecord[];
  routes?: (Omit<TradeRouteRecord, "createdAt"> & { createdAt?: Date })[];
  monuments?: (Omit<NewMonumentRecord, "createdAt"> & { createdAt?: Date })[];
  campaigns?: (Omit<NewCampaignRecord, "createdAt"> & { createdAt?: Date })[];
  events?: HistoricalEventRecord[];
  activePolities?: AnyPolity[];
}): AtlasExportFeatureCollection {
  const features: AtlasExportFeatureCollection["features"] = [];

  // 1. Territories (Polygons / MultiPolygons)
  for (const t of territories) {
    if (t.geometryGeojson) {
      features.push({
        type: "Feature",
        id: `territory_${t.id}`,
        geometry: t.geometryGeojson as GeoJSON.Geometry,
        properties: {
          layerType: "territory",
          id: t.id,
          polityId: t.polityId,
          regionName: t.regionName,
          controlType: t.controlType,
          confidence: t.confidence,
          validFromYear: t.validFromYear,
          validToYear: t.validToYear,
        },
      });
    }
  }

  // 2. Trade & Pilgrimage Routes (LineStrings)
  for (const r of routes) {
    if (r.pathGeojson) {
      features.push({
        type: "Feature",
        id: `route_${r.id}`,
        geometry: r.pathGeojson as GeoJSON.Geometry,
        properties: {
          layerType: "trade_route",
          id: r.id,
          name: r.name,
          routeType: r.routeType,
          activeFromYear: r.activeFromYear,
          activeToYear: r.activeToYear,
          primaryCommodities: r.primaryCommodities,
        },
      });
    }
  }

  // 3. Military Campaigns (LineStrings)
  for (const c of campaigns) {
    if (c.routeGeojson) {
      features.push({
        type: "Feature",
        id: `campaign_${c.id}`,
        geometry: c.routeGeojson as GeoJSON.Geometry,
        properties: {
          layerType: "campaign",
          id: c.id,
          name: c.name,
          startYear: c.startYear,
          endYear: c.endYear,
          commanderName: c.commanderName,
          keyLocations: c.keyLocations,
          strategicOutcome: c.strategicOutcome,
        },
      });
    }
  }

  // 4. Monuments & Intellectual Centers (Points)
  for (const m of monuments) {
    if (m.locationGeojson) {
      features.push({
        type: "Feature",
        id: `monument_${m.id}`,
        geometry: m.locationGeojson as GeoJSON.Geometry,
        properties: {
          layerType: "monument",
          id: m.id,
          name: m.name,
          monumentType: m.monumentType,
          foundingYear: m.foundingYear,
          cityName: m.cityName,
          architecturalFeatures: m.architecturalFeatures,
        },
      });
    }
  }

  // 5. Historical Events (Points)
  for (const e of events) {
    if (e.locationGeojson) {
      features.push({
        type: "Feature",
        id: `event_${e.id}`,
        geometry: e.locationGeojson as GeoJSON.Geometry,
        properties: {
          layerType: "event",
          id: e.id,
          title: e.title,
          eventYear: e.eventYear,
          eventType: e.eventType,
          locationName: e.locationName,
        },
      });
    }
  }

  const metadata: AtlasGeoJsonMetadata = {
    title: `Islamic History Atlas Cartographic Snapshot - ${formatHistoricalYear(year)}`,
    year,
    formattedYear: formatHistoricalYear(year),
    exportTimestamp: new Date().toISOString(),
    activePolities: activePolities.map((p) => p.canonicalName),
    totalFeatures: features.length,
    attribution: "Islamic History Atlas - Evidence-Based Historical Cartography",
    license: "Open Data Commons Open Database License (ODbL) / Academic Use",
    primarySources: initialSources.map((s) => ({
      id: s.id,
      title: s.title,
      citation: s.citationText || s.title,
    })),
  };

  return {
    type: "FeatureCollection",
    metadata,
    features,
  };
}

/**
 * Generates formatted Chicago-style and BibTeX academic citations for the current atlas view.
 */
export function generateAcademicCitation({
  year,
  activePolities = [],
}: {
  year: number;
  activePolities?: string[];
}): {
  chicago: string;
  bibtex: string;
} {
  const formattedYear = formatHistoricalYear(year);
  const politiesText = activePolities.length > 0 ? ` (${activePolities.join(", ")})` : "";
  const accessDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const chicago = `Islamic History Atlas. "Historical Geography and Cartography of the Islamic World, c. ${formattedYear}${politiesText}." Islamic History Atlas Project, accessed ${accessDate}. https://github.com/Usmankhalid20/islamic-history-atlas.`;

  const bibtex = `@misc{islamic_history_atlas_${year},
  author = {{Islamic History Atlas Project}},
  title = {Historical Cartography and Territorial Control, ${formattedYear}},
  year = {${new Date().getFullYear()}},
  url = {https://github.com/Usmankhalid20/islamic-history-atlas},
  note = {Accessed: ${accessDate}}
}`;

  return { chicago, bibtex };
}

/**
 * Triggers a browser download of JSON / GeoJSON data.
 */
export function downloadJsonFile(filename: string, data: object): void {
  if (typeof window === "undefined") return;

  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: "application/geo+json;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
