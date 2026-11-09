"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import type { Map as LeafletMap, GeoJSON as LeafletGeoJSON, LayerGroup, TileLayer } from "leaflet";
import type { TerritoryPeriodRecord } from "@/lib/db/schema/territoryPeriods";
import type { HistoricalEventRecord } from "@/lib/db/schema/historicalEvents";
import type { TradeRouteRecord } from "@/lib/db/schema/tradeRoutes";
import type { NewMonumentRecord } from "@/lib/db/schema/monuments";
import type { NewCampaignRecord } from "@/lib/db/schema/campaigns";
import type { HistoricalDiscrepancy } from "@/lib/data/discrepanciesSeed";
import { MapControls, HISTORICAL_REGIONS, HistoricalRegion, BasemapStyle } from "./MapControls";
import { MapLegend } from "./MapLegend";
import { MapLayerControl } from "./MapLayerControl";

export interface HistoricalMapProps {
  territories: TerritoryPeriodRecord[];
  events?: HistoricalEventRecord[];
  routes?: (Omit<TradeRouteRecord, "createdAt"> & { createdAt?: Date })[];
  monuments?: (Omit<NewMonumentRecord, "createdAt"> & { createdAt?: Date })[];
  campaigns?: (Omit<NewCampaignRecord, "createdAt"> & { createdAt?: Date })[];
  discrepancies?: HistoricalDiscrepancy[];
  onSelectTerritory?: (territory: TerritoryPeriodRecord) => void;
  onSelectEvent?: (event: HistoricalEventRecord) => void;
  onSelectRoute?: (route: Omit<TradeRouteRecord, "createdAt"> & { createdAt?: Date }) => void;
  onSelectMonument?: (monument: Omit<NewMonumentRecord, "createdAt"> & { createdAt?: Date }) => void;
  onSelectCampaign?: (campaign: Omit<NewCampaignRecord, "createdAt"> & { createdAt?: Date }) => void;
  onSelectDiscrepancy?: (discrepancy: HistoricalDiscrepancy) => void;
  selectedTerritoryId?: string | null;
  selectedEventId?: string | null;
  selectedRouteId?: string | null;
  selectedMonumentId?: string | null;
  selectedCampaignId?: string | null;
  selectedDiscrepancyId?: string | null;
  showTerritories?: boolean;
  setShowTerritories?: (val: boolean) => void;
  showEvents?: boolean;
  setShowEvents?: (val: boolean) => void;
  showRoutes?: boolean;
  setShowRoutes?: (val: boolean) => void;
  showMonuments?: boolean;
  setShowMonuments?: (val: boolean) => void;
  showCampaigns?: boolean;
  setShowCampaigns?: (val: boolean) => void;
  showDiscrepancies?: boolean;
  setShowDiscrepancies?: (val: boolean) => void;
  isTheaterMode?: boolean;
  onToggleTheaterMode?: () => void;
  territoryOpacity?: number;
  setTerritoryOpacity?: (val: number) => void;
}

const POLITY_COLORS: Record<string, { fill: string; stroke: string }> = {
  pol_rashidun: { fill: "#9A3412", stroke: "#7C2D12" }, // Terracotta
  pol_umayyad: { fill: "#D97706", stroke: "#B45309" }, // Gold / Amber
  pol_abbasid_early: { fill: "#1C1917", stroke: "#000000" }, // Black
  pol_cordoba_emirate: { fill: "#059669", stroke: "#047857" }, // Emerald
  pol_fatimid: { fill: "#2563EB", stroke: "#1D4ED8" }, // Lapis / Royal Blue
};

const DEFAULT_STYLE = { fill: "#64748B", stroke: "#475569" };

const BASEMAP_CONFIGS: Record<BasemapStyle, { url: string; attribution: string; maxZoom: number }> = {
  light_gray: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    attribution: 'Tiles &copy; <a href="https://www.esri.com/">Esri</a> &mdash; Esri, DeLorme, NAVTEQ',
    maxZoom: 16,
  },
  physical_relief: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}",
    attribution: 'Tiles &copy; <a href="https://www.esri.com/">Esri</a> &mdash; U.S. National Park Service',
    maxZoom: 8,
  },
  antique_sepia: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}",
    attribution: 'Tiles &copy; <a href="https://www.esri.com/">Esri</a> &mdash; NOAA, USGS',
    maxZoom: 13,
  },
};

/**
 * Creates custom SVG icon HTML for historical battle markers
 */
function createBattleIconSvg(isSelected: boolean): string {
  const size = isSelected ? 30 : 24;
  return `
    <div style="width: ${size}px; height: ${size}px; position: relative; display: flex; align-items: center; justify-content: center;">
      ${isSelected ? `<div style="position: absolute; inset: -4px; border-radius: 9999px; border: 2px solid #DC2626; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite; opacity: 0.75;"></div>` : ""}
      <div style="width: 100%; height: 100%; border-radius: 9999px; background: #DC2626; border: 2px solid ${isSelected ? "#000000" : "#991B1B"}; box-shadow: 0 2px 5px rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center;">
        <svg xmlns="http://www.w3.org/2000/svg" width="${size * 0.58}" height="${size * 0.58}" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
          <line x1="13" y1="19" x2="19" y2="13" />
          <line x1="16" y1="16" x2="20" y2="20" />
          <line x1="19" y1="21" x2="21" y2="19" />
          <polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5" />
          <line x1="5" y1="14" x2="9" y2="18" />
          <line x1="7" y1="17" x2="4" y2="20" />
          <line x1="3" y1="19" x2="5" y2="21" />
        </svg>
      </div>
    </div>
  `;
}

/**
 * Creates custom SVG icon HTML for historical monument markers
 */
function createMonumentIconSvg(type: string, isSelected: boolean): string {
  const size = isSelected ? 30 : 24;
  const isAcademy = type === "academy_library";
  const bg = isAcademy ? "#7C3AED" : "#059669";
  const stroke = isAcademy ? "#5B21B6" : "#047857";

  return `
    <div style="width: ${size}px; height: ${size}px; position: relative; display: flex; align-items: center; justify-content: center;">
      ${isSelected ? `<div style="position: absolute; inset: -4px; border-radius: 9999px; border: 2px solid ${bg}; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite; opacity: 0.75;"></div>` : ""}
      <div style="width: 100%; height: 100%; border-radius: 9999px; background: ${bg}; border: 2px solid ${isSelected ? "#000000" : stroke}; box-shadow: 0 2px 5px rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center;">
        <svg xmlns="http://www.w3.org/2000/svg" width="${size * 0.58}" height="${size * 0.58}" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="21" x2="21" y2="21" />
          <line x1="6" y1="21" x2="6" y2="10" />
          <line x1="18" y1="21" x2="18" y2="10" />
          <line x1="12" y1="21" x2="12" y2="10" />
          <path d="M12 2L3 8h18L12 2z" />
        </svg>
      </div>
    </div>
  `;
}

export function HistoricalMap({
  territories,
  events = [],
  routes = [],
  monuments = [],
  campaigns = [],
  discrepancies = [],
  onSelectTerritory,
  onSelectEvent,
  onSelectRoute,
  onSelectMonument,
  onSelectCampaign,
  onSelectDiscrepancy,
  selectedTerritoryId,
  selectedEventId,
  selectedRouteId,
  selectedMonumentId,
  selectedCampaignId,
  selectedDiscrepancyId,
  showTerritories = true,
  setShowTerritories,
  showEvents = true,
  setShowEvents,
  showRoutes = true,
  setShowRoutes,
  showMonuments = true,
  setShowMonuments,
  showCampaigns = true,
  setShowCampaigns,
  showDiscrepancies = true,
  setShowDiscrepancies,
  isTheaterMode = false,
  onToggleTheaterMode,
  territoryOpacity: controlledOpacity,
  setTerritoryOpacity: setControlledOpacity,
}: HistoricalMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const [mapInstance, setMapInstance] = useState<LeafletMap | null>(null);

  // Basemap & Layer state
  const [basemapStyle, setBasemapStyle] = useState<BasemapStyle>("light_gray");
  const basemapLayerRef = useRef<TileLayer | null>(null);

  // Internal territory opacity fallback if uncontrolled
  const [internalOpacity, setInternalOpacity] = useState<number>(0.5);
  const territoryOpacity = controlledOpacity ?? internalOpacity;
  const setTerritoryOpacity = setControlledOpacity ?? setInternalOpacity;

  // Layer groups refs
  const geoJsonLayerRef = useRef<LeafletGeoJSON | null>(null);
  const eventsLayerRef = useRef<LayerGroup | null>(null);
  const routesLayerRef = useRef<LayerGroup | null>(null);
  const monumentsLayerRef = useRef<LayerGroup | null>(null);
  const campaignsLayerRef = useRef<LayerGroup | null>(null);
  const discrepanciesLayerRef = useRef<LayerGroup | null>(null);

  // Initialize Map
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!mapContainerRef.current || mapInstanceRef.current) return;

      const L = await import("leaflet");
      if (!isMounted || !mapContainerRef.current) return;

      // Initialize Leaflet map centered on historical heartland (Arabia, Levant, Iraq, Egypt)
      const map = L.map(mapContainerRef.current, {
        center: [28.0, 38.0],
        zoom: 4,
        minZoom: 3,
        maxZoom: 10,
        scrollWheelZoom: true,
        zoomControl: false, // We supply custom archival zoom controls
      });

      // Create dedicated panes with deterministic stacking order to prevent SVG/marker click hijacking
      map.createPane("territoriesPane");
      const terPane = map.getPane("territoriesPane");
      if (terPane) terPane.style.zIndex = "410";

      map.createPane("discrepanciesPane");
      const discPane = map.getPane("discrepanciesPane");
      if (discPane) discPane.style.zIndex = "420";

      map.createPane("routesPane");
      const routesPane = map.getPane("routesPane");
      if (routesPane) routesPane.style.zIndex = "430";

      map.createPane("campaignsPane");
      const campPane = map.getPane("campaignsPane");
      if (campPane) campPane.style.zIndex = "440";

      map.createPane("monumentsPane");
      const monPane = map.getPane("monumentsPane");
      if (monPane) monPane.style.zIndex = "450";

      map.createPane("eventsPane");
      const eventsPane = map.getPane("eventsPane");
      if (eventsPane) eventsPane.style.zIndex = "460";

      // Add archival light gray canvas basemap (neutral, watermark-free, zero API key required)
      const baseConfig = BASEMAP_CONFIGS.light_gray;
      const initialBasemap = L.tileLayer(baseConfig.url, {
        attribution: baseConfig.attribution,
        maxZoom: baseConfig.maxZoom,
      }).addTo(map);
      basemapLayerRef.current = initialBasemap;

      // Add Leaflet metric scale control at bottom right
      L.control
        .scale({
          position: "bottomright",
          metric: true,
          imperial: false,
          maxWidth: 120,
        })
        .addTo(map);

      mapInstanceRef.current = map;
      if (isMounted) {
        setMapInstance(map);
        setTimeout(() => {
          if (isMounted) {
            map.invalidateSize();
          }
        }, 150);
      }
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      setMapInstance(null);
    };
  }, []);

  // Handle Basemap Style Changes
  useEffect(() => {
    async function updateBasemap() {
      const map = mapInstance;
      if (!map) return;
      const L = await import("leaflet");

      if (basemapLayerRef.current) {
        map.removeLayer(basemapLayerRef.current);
        basemapLayerRef.current = null;
      }

      const cfg = BASEMAP_CONFIGS[basemapStyle] || BASEMAP_CONFIGS.light_gray;
      const newLayer = L.tileLayer(cfg.url, {
        attribution: cfg.attribution,
        maxZoom: cfg.maxZoom,
      }).addTo(map);

      basemapLayerRef.current = newLayer;
    }

    updateBasemap();
  }, [mapInstance, basemapStyle]);

  // Invalidate size whenever theater mode changes
  useEffect(() => {
    if (mapInstance) {
      setTimeout(() => {
        mapInstance.invalidateSize();
      }, 200);
    }
  }, [mapInstance, isTheaterMode]);

  // Update GeoJSON territory layer
  useEffect(() => {
    async function updateLayers() {
      const map = mapInstance;
      if (!map) return;

      const L = await import("leaflet");

      // Remove existing territory layer
      if (geoJsonLayerRef.current) {
        map.removeLayer(geoJsonLayerRef.current);
        geoJsonLayerRef.current = null;
      }

      if (!showTerritories || territories.length === 0) return;

      const geoJsonData = {
        type: "FeatureCollection" as const,
        features: territories.map((t) => ({
          type: "Feature" as const,
          id: t.id,
          properties: t,
          geometry: t.geometryGeojson as GeoJSON.Geometry,
        })),
      };

      const layer = L.geoJSON(geoJsonData, {
        pane: "territoriesPane",
        style: (feature) => {
          const t = feature?.properties as TerritoryPeriodRecord;
          const colors = POLITY_COLORS[t.polityId] || DEFAULT_STYLE;
          const isSelected = t.id === selectedTerritoryId;

          return {
            fillColor: colors.fill,
            color: isSelected ? "#DC2626" : colors.stroke,
            weight: isSelected ? 3.5 : 1.75,
            fillOpacity: isSelected ? Math.min(0.85, territoryOpacity + 0.2) : territoryOpacity,
            dashArray: t.confidence === "approximate" ? "4, 4" : undefined,
          };
        },
        onEachFeature: (feature, featureLayer) => {
          const t = feature.properties as TerritoryPeriodRecord;

          featureLayer.bindTooltip(
            `<strong>${t.regionName}</strong><br/>${t.controlType} control (${t.validFromYear}–${t.validToYear} CE)`,
            { sticky: true, className: "font-sans text-xs" }
          );

          featureLayer.bindPopup(
            `<div class="p-1 font-sans">
              <div class="font-serif font-bold text-sm text-stone-900 leading-tight">${t.regionName}</div>
              <div class="text-[11px] text-stone-600 font-semibold tracking-wide uppercase mt-0.5 mb-1.5">${t.controlType} control • ${t.validFromYear}–${t.validToYear} CE</div>
              ${t.explanatoryNote ? `<p class="text-xs text-stone-700 leading-relaxed font-sans mb-1">${t.explanatoryNote}</p>` : ""}
              <div class="text-[11px] text-stone-500 italic">Confidence: ${t.confidence}</div>
            </div>`,
            { maxWidth: 280 }
          );

          featureLayer.on({
            click: () => {
              if (onSelectTerritory) {
                onSelectTerritory(t);
              }
            },
            mouseover: (e) => {
              const target = e.target;
              target.setStyle({ fillOpacity: Math.min(0.9, territoryOpacity + 0.25), weight: 2.75 });
            },
            mouseout: (e) => {
              const target = e.target;
              const isSelected = t.id === selectedTerritoryId;
              const colors = POLITY_COLORS[t.polityId] || DEFAULT_STYLE;
              target.setStyle({
                fillOpacity: isSelected ? Math.min(0.85, territoryOpacity + 0.2) : territoryOpacity,
                weight: isSelected ? 3.5 : 1.75,
                color: isSelected ? "#DC2626" : colors.stroke,
              });
            },
          });
        },
      });

      layer.addTo(map);
      geoJsonLayerRef.current = layer;
    }

    updateLayers();
  }, [mapInstance, territories, selectedTerritoryId, onSelectTerritory, showTerritories, territoryOpacity]);

  // Update Event markers layer
  useEffect(() => {
    async function updateEventMarkers() {
      const map = mapInstance;
      if (!map) return;

      const L = await import("leaflet");

      if (eventsLayerRef.current) {
        map.removeLayer(eventsLayerRef.current);
        eventsLayerRef.current = null;
      }

      if (!showEvents || events.length === 0) return;

      const markers = events
        .map((event) => {
          const geojson = event.locationGeojson as { coordinates: [number, number] } | null;
          if (!geojson || !geojson.coordinates) return null;

          // Leaflet takes [lat, lng]; GeoJSON is [lng, lat]
          const lat = geojson.coordinates[1];
          const lng = geojson.coordinates[0];
          const isSelected = event.id === selectedEventId;

          // Render high-precision SVG icon
          const iconHtml = createBattleIconSvg(isSelected);
          const customIcon = L.divIcon({
            html: iconHtml,
            className: "historical-map-battle-icon",
            iconSize: [isSelected ? 30 : 24, isSelected ? 30 : 24],
            iconAnchor: [isSelected ? 15 : 12, isSelected ? 15 : 12],
          });

          const marker = L.marker([lat, lng], {
            icon: customIcon,
            pane: "eventsPane",
          });

          marker.bindTooltip(
            `<strong>${event.title} (${event.eventYear} CE)</strong><br/><span class="capitalize text-gray-500">${event.eventType}</span> • ${event.locationName || ""}`,
            { direction: "top", offset: [0, -12], className: "font-sans text-xs" }
          );

          marker.bindPopup(
            `<div class="p-1 font-sans">
              <div class="font-serif font-bold text-sm text-stone-900 leading-tight">${event.title}</div>
              <div class="text-[11px] text-red-700 font-semibold tracking-wide uppercase mt-0.5 mb-1.5">${event.eventType} • ${event.eventYear} CE</div>
              <p class="text-xs text-stone-700 leading-relaxed font-sans mb-1">${event.summary}</p>
              ${event.locationName ? `<div class="text-[11px] text-stone-500 italic border-t border-stone-200 pt-1">📍 ${event.locationName}</div>` : ""}
            </div>`,
            { maxWidth: 280 }
          );

          marker.on("click", () => {
            if (onSelectEvent) {
              onSelectEvent(event);
            }
          });

          return marker;
        })
        .filter(Boolean);

      const group = L.layerGroup(markers as any[]);
      group.addTo(map);
      eventsLayerRef.current = group;
    }

    updateEventMarkers();
  }, [mapInstance, events, selectedEventId, onSelectEvent, showEvents]);

  // Update Trade & Pilgrimage Routes Layer
  useEffect(() => {
    async function updateRoutes() {
      const map = mapInstance;
      if (!map) return;

      const L = await import("leaflet");

      if (routesLayerRef.current) {
        map.removeLayer(routesLayerRef.current);
        routesLayerRef.current = null;
      }

      if (!showRoutes || routes.length === 0) return;

      const routeLayers = routes
        .map((route) => {
          const geojson = route.pathGeojson as any;
          if (!geojson || !geojson.coordinates) return null;

          const isSelected = route.id === selectedRouteId;

          let strokeColor = "#9A3412"; // Terracotta caravan
          let dashArray = "5, 5";

          if (route.routeType === "pilgrim_road") {
            strokeColor = "#D97706"; // Amber / Gold
            dashArray = "6, 4";
          } else if (route.routeType === "maritime_lane") {
            strokeColor = "#2563EB"; // Blue / Azure
            dashArray = "4, 6";
          }

          const layer = L.geoJSON(geojson, {
            pane: "routesPane",
            style: {
              color: isSelected ? "#000000" : strokeColor,
              weight: isSelected ? 4.5 : 2.5,
              opacity: isSelected ? 1 : 0.85,
              dashArray: isSelected ? undefined : dashArray,
            },
          });

          layer.bindTooltip(
            `<strong>${route.name}</strong><br/><span class="capitalize text-gray-500">${route.routeType.replace("_", " ")}</span>${route.primaryCommodities ? `<br/><span class="text-[11px]">${route.primaryCommodities}</span>` : ""}`,
            { sticky: true, className: "font-sans text-xs" }
          );

          layer.bindPopup(
            `<div class="p-1 font-sans">
              <div class="font-serif font-bold text-sm text-stone-900 leading-tight">${route.name}</div>
              <div class="text-[11px] text-amber-800 font-semibold tracking-wide uppercase mt-0.5 mb-1.5">${route.routeType.replace("_", " ")} • Active ${route.activeFromYear}–${route.activeToYear ?? "present"} CE</div>
              <p class="text-xs text-stone-700 leading-relaxed font-sans mb-1">${route.description || ""}</p>
              ${route.primaryCommodities ? `<div class="text-[11px] text-stone-600 bg-amber-50 p-1.5 rounded border border-amber-200"><strong class="text-amber-900">Primary Goods:</strong> ${route.primaryCommodities}</div>` : ""}
            </div>`,
            { maxWidth: 280 }
          );

          layer.on("click", () => {
            if (onSelectRoute) {
              onSelectRoute(route);
            }
          });

          return layer;
        })
        .filter(Boolean);

      const group = L.layerGroup(routeLayers as any[]);
      group.addTo(map);
      routesLayerRef.current = group;
    }

    updateRoutes();
  }, [mapInstance, routes, selectedRouteId, onSelectRoute, showRoutes]);

  // Update Monument markers layer
  useEffect(() => {
    async function updateMonumentMarkers() {
      const map = mapInstance;
      if (!map) return;

      const L = await import("leaflet");

      if (monumentsLayerRef.current) {
        map.removeLayer(monumentsLayerRef.current);
        monumentsLayerRef.current = null;
      }

      if (!showMonuments || monuments.length === 0) return;

      const markers = monuments
        .map((monument) => {
          const geojson = monument.locationGeojson as { coordinates: [number, number] } | null;
          if (!geojson || !geojson.coordinates) return null;

          const lat = geojson.coordinates[1];
          const lng = geojson.coordinates[0];
          const isSelected = monument.id === selectedMonumentId;

          const iconHtml = createMonumentIconSvg(monument.monumentType, isSelected);
          const customIcon = L.divIcon({
            html: iconHtml,
            className: "historical-map-monument-icon",
            iconSize: [isSelected ? 30 : 24, isSelected ? 30 : 24],
            iconAnchor: [isSelected ? 15 : 12, isSelected ? 15 : 12],
          });

          const marker = L.marker([lat, lng], {
            icon: customIcon,
            pane: "monumentsPane",
          });

          marker.bindTooltip(
            `<strong>${monument.name} (${monument.foundingYear} CE)</strong><br/><span class="capitalize text-purple-700 font-medium">${monument.monumentType.replace("_", " ")}</span> • ${monument.cityName}`,
            { direction: "top", offset: [0, -12], className: "font-sans text-xs" }
          );

          marker.bindPopup(
            `<div class="p-1 font-sans">
              <div class="font-serif font-bold text-sm text-stone-900 leading-tight">${monument.name}</div>
              <div class="text-[11px] text-purple-800 font-semibold tracking-wide uppercase mt-0.5 mb-1.5">${monument.monumentType.replace("_", " ")} • Founded ${monument.foundingYear} CE</div>
              <p class="text-xs text-stone-700 leading-relaxed font-sans mb-1">${monument.description || ""}</p>
              ${monument.architecturalFeatures ? `<div class="text-[11px] text-stone-600 bg-purple-50 p-1.5 rounded border border-purple-200"><strong class="text-purple-900">Architecture:</strong> ${monument.architecturalFeatures}</div>` : ""}
              <div class="text-[11px] text-stone-500 italic mt-1">📍 ${monument.cityName}</div>
            </div>`,
            { maxWidth: 280 }
          );

          marker.on("click", () => {
            if (onSelectMonument) {
              onSelectMonument(monument);
            }
          });

          return marker;
        })
        .filter(Boolean);

      const group = L.layerGroup(markers as any[]);
      group.addTo(map);
      monumentsLayerRef.current = group;
    }

    updateMonumentMarkers();
  }, [mapInstance, monuments, selectedMonumentId, onSelectMonument, showMonuments]);

  // Update Military Campaigns Layer
  useEffect(() => {
    async function updateCampaigns() {
      const map = mapInstance;
      if (!map) return;

      const L = await import("leaflet");

      if (campaignsLayerRef.current) {
        map.removeLayer(campaignsLayerRef.current);
        campaignsLayerRef.current = null;
      }

      if (!showCampaigns || campaigns.length === 0) return;

      const campaignLayers = campaigns
        .map((campaign) => {
          const geojson = campaign.routeGeojson as any;
          if (!geojson || !geojson.coordinates) return null;

          const isSelected = campaign.id === selectedCampaignId;

          const layer = L.geoJSON(geojson, {
            pane: "campaignsPane",
            style: {
              color: isSelected ? "#000000" : "#DC2626", // Bold Crimson
              weight: isSelected ? 4.5 : 2.75,
              opacity: isSelected ? 1 : 0.9,
              dashArray: isSelected ? undefined : "6, 4",
            },
          });

          const yearLabel =
            campaign.startYear === campaign.endYear
              ? `${campaign.startYear} CE`
              : `${campaign.startYear}–${campaign.endYear} CE`;

          layer.bindTooltip(
            `<strong>${campaign.name} (${yearLabel})</strong><br/><span class="text-red-700 font-medium">Cmdr: ${campaign.commanderName}</span><br/><span class="text-[11px]">${campaign.keyLocations}</span>`,
            { sticky: true, className: "font-sans text-xs" }
          );

          layer.bindPopup(
            `<div class="p-1 font-sans">
              <div class="font-serif font-bold text-sm text-stone-900 leading-tight">${campaign.name}</div>
              <div class="text-[11px] text-red-800 font-semibold tracking-wide uppercase mt-0.5 mb-1.5">Commander: ${campaign.commanderName} (${yearLabel})</div>
              <p class="text-xs text-stone-700 leading-relaxed font-sans mb-1">${campaign.description || ""}</p>
              <div class="text-[11px] text-stone-600 bg-red-50 p-1.5 rounded border border-red-200 mb-1"><strong class="text-red-900">Strategic Outcome:</strong> ${campaign.strategicOutcome}</div>
              <div class="text-[11px] text-stone-500 italic">Route: ${campaign.keyLocations}</div>
            </div>`,
            { maxWidth: 290 }
          );

          layer.on("click", () => {
            if (onSelectCampaign) {
              onSelectCampaign(campaign);
            }
          });

          return layer;
        })
        .filter(Boolean);

      const group = L.layerGroup(campaignLayers as any[]);
      group.addTo(map);
      campaignsLayerRef.current = group;
    }

    updateCampaigns();
  }, [mapInstance, campaigns, selectedCampaignId, onSelectCampaign, showCampaigns]);

  // Update Historical Discrepancies Layer
  useEffect(() => {
    async function updateDiscrepancies() {
      const map = mapInstance;
      if (!map) return;

      const L = await import("leaflet");

      if (discrepanciesLayerRef.current) {
        map.removeLayer(discrepanciesLayerRef.current);
        discrepanciesLayerRef.current = null;
      }

      if (!showDiscrepancies || discrepancies.length === 0) return;

      const discrepancyLayers = discrepancies
        .map((discrepancy) => {
          const geojson = discrepancy.geometryGeojson as any;
          if (!geojson) return null;

          const isSelected = discrepancy.id === selectedDiscrepancyId;

          const layer = L.geoJSON(geojson, {
            pane: "discrepanciesPane",
            style: {
              color: isSelected ? "#B45309" : "#D97706",
              weight: isSelected ? 3.5 : 2,
              fillColor: "#FDE68A",
              fillOpacity: isSelected ? 0.45 : 0.25,
              dashArray: "6, 6",
            },
          });

          layer.bindTooltip(
            `<strong>${discrepancy.title}</strong><br/><span class="text-amber-800 font-medium">Status: ${discrepancy.confidenceRating}</span><br/><span class="text-[11px]">${discrepancy.regionName}</span>`,
            { sticky: true, className: "font-sans text-xs" }
          );

          layer.bindPopup(
            `<div class="p-1 font-sans">
              <div class="font-serif font-bold text-sm text-stone-900 leading-tight">${discrepancy.title}</div>
              <div class="text-[11px] text-amber-700 font-semibold tracking-wide uppercase mt-0.5 mb-1.5">Confidence: ${discrepancy.confidenceRating} • Active ${discrepancy.activeFromYear}–${discrepancy.activeToYear} CE</div>
              <p class="text-xs text-stone-700 leading-relaxed font-sans mb-1">${discrepancy.historiographicalSummary}</p>
              <div class="text-[11px] text-amber-900 bg-amber-50 p-1.5 rounded border border-amber-200"><strong>Region:</strong> ${discrepancy.regionName}</div>
            </div>`,
            { maxWidth: 280 }
          );

          layer.on("click", () => {
            if (onSelectDiscrepancy) {
              onSelectDiscrepancy(discrepancy);
            }
          });

          return layer;
        })
        .filter(Boolean);

      const group = L.layerGroup(discrepancyLayers as any[]);
      group.addTo(map);
      discrepanciesLayerRef.current = group;
    }

    updateDiscrepancies();
  }, [mapInstance, discrepancies, selectedDiscrepancyId, onSelectDiscrepancy, showDiscrepancies]);

  // Navigation callbacks
  const handleZoomIn = useCallback(() => {
    if (mapInstance) {
      mapInstance.zoomIn();
    }
  }, [mapInstance]);

  const handleZoomOut = useCallback(() => {
    if (mapInstance) {
      mapInstance.zoomOut();
    }
  }, [mapInstance]);

  const handleResetHeartland = useCallback(() => {
    if (mapInstance) {
      mapInstance.flyTo([28.0, 38.0], 4, { duration: 1.25 });
    }
  }, [mapInstance]);

  const handleSelectRegion = useCallback(
    (region: HistoricalRegion) => {
      if (mapInstance) {
        mapInstance.flyTo(region.center, region.zoom, { duration: 1.5 });
      }
    },
    [mapInstance]
  );

  return (
    <div className="relative w-full h-full min-h-[460px]">
      <div
        ref={mapContainerRef}
        role="application"
        aria-label="Interactive Historical Atlas Map"
        className="w-full h-full min-h-[460px] rounded-xl overflow-hidden border border-archival-border bg-archival-surface z-0"
      />

      {/* Map Controls: Custom Zoom, Region Jump, Basemap & Theater View */}
      {mapInstance && (
        <>
          <MapControls
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onResetHeartland={handleResetHeartland}
            onSelectRegion={handleSelectRegion}
            currentBasemap={basemapStyle}
            onChangeBasemap={setBasemapStyle}
            isTheaterMode={isTheaterMode}
            onToggleTheaterMode={onToggleTheaterMode}
          />

          {/* Quick-Access In-Map Cartographic Layer & Opacity Control */}
          {setShowTerritories && setShowEvents && setShowRoutes && setShowMonuments && setShowCampaigns && setShowDiscrepancies && (
            <MapLayerControl
              showTerritories={showTerritories}
              setShowTerritories={setShowTerritories}
              showEvents={showEvents}
              setShowEvents={setShowEvents}
              showRoutes={showRoutes}
              setShowRoutes={setShowRoutes}
              showMonuments={showMonuments}
              setShowMonuments={setShowMonuments}
              showCampaigns={showCampaigns}
              setShowCampaigns={setShowCampaigns}
              showDiscrepancies={showDiscrepancies}
              setShowDiscrepancies={setShowDiscrepancies}
              territoryOpacity={territoryOpacity}
              setTerritoryOpacity={setTerritoryOpacity}
              counts={{
                territories: territories.length,
                events: events.length,
                routes: routes.length,
                monuments: monuments.length,
                campaigns: campaigns.length,
                discrepancies: discrepancies.length,
              }}
            />
          )}

          {/* Professional Map Cartographic Legend */}
          <MapLegend
            showTerritories={showTerritories}
            showEvents={showEvents}
            showRoutes={showRoutes}
            showMonuments={showMonuments}
            showCampaigns={showCampaigns}
            showDiscrepancies={showDiscrepancies}
            onToggleLayer={(key) => {
              if (key === "territories" && setShowTerritories) setShowTerritories(!showTerritories);
              else if (key === "events" && setShowEvents) setShowEvents(!showEvents);
              else if (key === "routes" && setShowRoutes) setShowRoutes(!showRoutes);
              else if (key === "monuments" && setShowMonuments) setShowMonuments(!showMonuments);
              else if (key === "campaigns" && setShowCampaigns) setShowCampaigns(!showCampaigns);
              else if (key === "discrepancies" && setShowDiscrepancies) setShowDiscrepancies(!showDiscrepancies);
            }}
          />
        </>
      )}
    </div>
  );
}
