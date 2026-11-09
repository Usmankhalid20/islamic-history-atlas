"use client";

import React, { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, GeoJSON as LeafletGeoJSON, LayerGroup } from "leaflet";
import type { TerritoryPeriodRecord } from "@/lib/db/schema/territoryPeriods";
import type { HistoricalEventRecord } from "@/lib/db/schema/historicalEvents";
import type { TradeRouteRecord } from "@/lib/db/schema/tradeRoutes";
import type { NewMonumentRecord } from "@/lib/db/schema/monuments";
import type { NewCampaignRecord } from "@/lib/db/schema/campaigns";
import type { HistoricalDiscrepancy } from "@/lib/data/discrepanciesSeed";
import { Compass, RotateCcw } from "lucide-react";

interface HistoricalMapProps {
  territories: TerritoryPeriodRecord[];
  events?: HistoricalEventRecord[];
  routes?: (Omit<TradeRouteRecord, "createdAt"> & { createdAt?: Date })[];
  monuments?: (Omit<NewMonumentRecord, "createdAt"> & { createdAt?: Date })[];
  campaigns?: (Omit<NewCampaignRecord, "createdAt"> & { createdAt?: Date })[];
  discrepancies?: HistoricalDiscrepancy[];
  onSelectTerritory?: (territory: TerritoryPeriodRecord) => void;
  onSelectEvent?: (event: HistoricalEventRecord) => void;
  onSelectRoute?: (route: (Omit<TradeRouteRecord, "createdAt"> & { createdAt?: Date })) => void;
  onSelectMonument?: (monument: (Omit<NewMonumentRecord, "createdAt"> & { createdAt?: Date })) => void;
  onSelectCampaign?: (campaign: (Omit<NewCampaignRecord, "createdAt"> & { createdAt?: Date })) => void;
  onSelectDiscrepancy?: (discrepancy: HistoricalDiscrepancy) => void;
  selectedTerritoryId?: string | null;
  selectedEventId?: string | null;
  selectedRouteId?: string | null;
  selectedMonumentId?: string | null;
  selectedCampaignId?: string | null;
  selectedDiscrepancyId?: string | null;
}

const POLITY_COLORS: Record<string, { fill: string; stroke: string }> = {
  pol_rashidun: { fill: "#9A3412", stroke: "#7C2D12" }, // Terracotta
  pol_umayyad: { fill: "#D97706", stroke: "#B45309" }, // Gold / Amber
  pol_abbasid_early: { fill: "#1C1917", stroke: "#000000" }, // Black
  pol_cordoba_emirate: { fill: "#059669", stroke: "#047857" }, // Emerald
  pol_fatimid: { fill: "#2563EB", stroke: "#1D4ED8" }, // Lapis / Royal Blue
};

const EVENT_COLORS: Record<string, { fill: string; stroke: string }> = {
  battle: { fill: "#DC2626", stroke: "#991B1B" }, // Crimson
  conquest: { fill: "#EA580C", stroke: "#C2410C" }, // Terracotta
  founding: { fill: "#059669", stroke: "#047857" }, // Emerald
};

const MONUMENT_COLORS: Record<string, { fill: string; stroke: string }> = {
  mosque: { fill: "#10B981", stroke: "#047857" }, // Emerald
  academy_library: { fill: "#8B5CF6", stroke: "#5B21B6" }, // Purple
  palace: { fill: "#F59E0B", stroke: "#B45309" }, // Amber
  observatory: { fill: "#3B82F6", stroke: "#1D4ED8" }, // Blue
};

const DEFAULT_STYLE = { fill: "#64748B", stroke: "#475569" };

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
}: HistoricalMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const [mapInstance, setMapInstance] = useState<LeafletMap | null>(null);
  const geoJsonLayerRef = useRef<LeafletGeoJSON | null>(null);
  const eventsLayerRef = useRef<LayerGroup | null>(null);
  const routesLayerRef = useRef<LayerGroup | null>(null);
  const monumentsLayerRef = useRef<LayerGroup | null>(null);
  const campaignsLayerRef = useRef<LayerGroup | null>(null);
  const discrepanciesLayerRef = useRef<LayerGroup | null>(null);

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
        maxZoom: 9,
        scrollWheelZoom: true,
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
      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
        {
          attribution:
            'Tiles &copy; <a href="https://www.esri.com/">Esri</a> &mdash; Esri, DeLorme, NAVTEQ',
          maxZoom: 16,
        }
      ).addTo(map);

      mapInstanceRef.current = map;
      if (isMounted) {
        setMapInstance(map);
        // Force dimension recalculation in case container layout completed asynchronously
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

      if (territories.length === 0) return;

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
            weight: isSelected ? 3 : 1.5,
            fillOpacity: isSelected ? 0.65 : 0.45,
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
              target.setStyle({ fillOpacity: 0.7, weight: 2.5 });
            },
            mouseout: (e) => {
              const target = e.target;
              const isSelected = t.id === selectedTerritoryId;
              const colors = POLITY_COLORS[t.polityId] || DEFAULT_STYLE;
              target.setStyle({
                fillOpacity: isSelected ? 0.65 : 0.45,
                weight: isSelected ? 3 : 1.5,
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
  }, [mapInstance, territories, selectedTerritoryId, onSelectTerritory]);

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

      if (events.length === 0) return;

      const markers = events.map((event) => {
        const geojson = event.locationGeojson as { coordinates: [number, number] } | null;
        if (!geojson || !geojson.coordinates) return null;

        // Leaflet takes [lat, lng]; GeoJSON is [lng, lat]
        const lat = geojson.coordinates[1];
        const lng = geojson.coordinates[0];

        const colors = EVENT_COLORS[event.eventType] || { fill: "#B45309", stroke: "#78350F" };
        const isSelected = event.id === selectedEventId;

        const circleMarker = L.circleMarker([lat, lng], {
          pane: "eventsPane",
          radius: isSelected ? 9 : 7,
          fillColor: colors.fill,
          color: isSelected ? "#000000" : colors.stroke,
          weight: isSelected ? 3 : 2,
          opacity: 1,
          fillOpacity: 0.9,
        });

        circleMarker.bindTooltip(
          `<strong>${event.title} (${event.eventYear} CE)</strong><br/><span class="capitalize text-gray-500">${event.eventType}</span> • ${event.locationName || ""}`,
          { direction: "top", offset: [0, -6], className: "font-sans text-xs" }
        );

        circleMarker.bindPopup(
          `<div class="p-1 font-sans">
            <div class="font-serif font-bold text-sm text-stone-900 leading-tight">${event.title}</div>
            <div class="text-[11px] text-red-700 font-semibold tracking-wide uppercase mt-0.5 mb-1.5">${event.eventType} • ${event.eventYear} CE</div>
            <p class="text-xs text-stone-700 leading-relaxed font-sans mb-1">${event.summary}</p>
            ${event.locationName ? `<div class="text-[11px] text-stone-500 italic border-t border-stone-200 pt-1">📍 ${event.locationName}</div>` : ""}
          </div>`,
          { maxWidth: 280 }
        );

        circleMarker.on("click", () => {
          if (onSelectEvent) {
            onSelectEvent(event);
          }
        });

        return circleMarker;
      }).filter(Boolean);

      const group = L.layerGroup(markers as any[]);
      group.addTo(map);
      eventsLayerRef.current = group;
    }

    updateEventMarkers();
  }, [mapInstance, events, selectedEventId, onSelectEvent]);

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

      if (routes.length === 0) return;

      const routeLayers = routes.map((route) => {
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
      }).filter(Boolean);

      const group = L.layerGroup(routeLayers as any[]);
      group.addTo(map);
      routesLayerRef.current = group;
    }

    updateRoutes();
  }, [mapInstance, routes, selectedRouteId, onSelectRoute]);

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

      if (monuments.length === 0) return;

      const markers = monuments
        .map((monument) => {
          const geojson = monument.locationGeojson as { coordinates: [number, number] } | null;
          if (!geojson || !geojson.coordinates) return null;

          // GeoJSON is [lng, lat]; Leaflet expects [lat, lng]
          const lat = geojson.coordinates[1];
          const lng = geojson.coordinates[0];

          const colors = MONUMENT_COLORS[monument.monumentType] || {
            fill: "#8B5CF6",
            stroke: "#5B21B6",
          };
          const isSelected = monument.id === selectedMonumentId;

          const circleMarker = L.circleMarker([lat, lng], {
            pane: "monumentsPane",
            radius: isSelected ? 9.5 : 7.5,
            fillColor: colors.fill,
            color: isSelected ? "#000000" : colors.stroke,
            weight: isSelected ? 3.5 : 2,
            opacity: 1,
            fillOpacity: 0.95,
          });

          circleMarker.bindTooltip(
            `<strong>${monument.name} (${monument.foundingYear} CE)</strong><br/><span class="capitalize text-purple-700 font-medium">${monument.monumentType.replace("_", " ")}</span> • ${monument.cityName}`,
            { direction: "top", offset: [0, -6], className: "font-sans text-xs" }
          );

          circleMarker.bindPopup(
            `<div class="p-1 font-sans">
              <div class="font-serif font-bold text-sm text-stone-900 leading-tight">${monument.name}</div>
              <div class="text-[11px] text-purple-800 font-semibold tracking-wide uppercase mt-0.5 mb-1.5">${monument.monumentType.replace("_", " ")} • Founded ${monument.foundingYear} CE</div>
              <p class="text-xs text-stone-700 leading-relaxed font-sans mb-1">${monument.description || ""}</p>
              ${monument.architecturalFeatures ? `<div class="text-[11px] text-stone-600 bg-purple-50 p-1.5 rounded border border-purple-200"><strong class="text-purple-900">Architecture:</strong> ${monument.architecturalFeatures}</div>` : ""}
              <div class="text-[11px] text-stone-500 italic mt-1">📍 ${monument.cityName}</div>
            </div>`,
            { maxWidth: 280 }
          );

          circleMarker.on("click", () => {
            if (onSelectMonument) {
              onSelectMonument(monument);
            }
          });

          return circleMarker;
        })
        .filter(Boolean);

      const group = L.layerGroup(markers as any[]);
      group.addTo(map);
      monumentsLayerRef.current = group;
    }

    updateMonumentMarkers();
  }, [mapInstance, monuments, selectedMonumentId, onSelectMonument]);

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

      if (campaigns.length === 0) return;

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
  }, [mapInstance, campaigns, selectedCampaignId, onSelectCampaign]);

  // Update Historical Discrepancies & Contested Boundaries Layer
  useEffect(() => {
    async function updateDiscrepancies() {
      const map = mapInstance;
      if (!map) return;

      const L = await import("leaflet");

      if (discrepanciesLayerRef.current) {
        map.removeLayer(discrepanciesLayerRef.current);
        discrepanciesLayerRef.current = null;
      }

      if (discrepancies.length === 0) return;

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
              <div class="font-serif font-bold text-sm text-amber-950 leading-tight">${discrepancy.title}</div>
              <div class="text-[11px] text-amber-800 font-semibold tracking-wide uppercase mt-0.5 mb-1.5">Rating: ${discrepancy.confidenceRating} (${discrepancy.activeFromYear}–${discrepancy.activeToYear} CE)</div>
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
  }, [mapInstance, discrepancies, selectedDiscrepancyId, onSelectDiscrepancy]);

  const handleResetHeartland = () => {
    if (mapInstance) {
      mapInstance.setView([28.0, 38.0], 4);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[420px]">
      <div
        ref={mapContainerRef}
        role="application"
        aria-label="Interactive Historical Atlas Map"
        className="w-full h-full min-h-[420px] rounded-xl overflow-hidden border border-archival-border bg-archival-surface z-0"
      />
      {mapInstance && (
        <button
          type="button"
          onClick={handleResetHeartland}
          className="absolute top-3 right-3 z-[400] bg-archival-surface/90 hover:bg-archival-surface border border-archival-border/80 px-2.5 py-1.5 rounded-md text-xs font-serif text-archival-ink shadow-sm flex items-center gap-1.5 transition-colors backdrop-blur-sm"
          title="Reset map center to historical heartland"
        >
          <RotateCcw className="w-3.5 h-3.5 text-archival-gold" aria-hidden="true" />
          <span>Reset Heartland</span>
        </button>
      )}
    </div>
  );
}
