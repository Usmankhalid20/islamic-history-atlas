"use client";

import React, { useEffect, useRef } from "react";
import type { Map as LeafletMap, GeoJSON as LeafletGeoJSON, LayerGroup } from "leaflet";
import type { TerritoryPeriodRecord } from "@/lib/db/schema/territoryPeriods";
import type { HistoricalEventRecord } from "@/lib/db/schema/historicalEvents";
import type { TradeRouteRecord } from "@/lib/db/schema/tradeRoutes";
import type { NewMonumentRecord } from "@/lib/db/schema/monuments";

interface HistoricalMapProps {
  territories: TerritoryPeriodRecord[];
  events?: HistoricalEventRecord[];
  routes?: (Omit<TradeRouteRecord, "createdAt"> & { createdAt?: Date })[];
  monuments?: (Omit<NewMonumentRecord, "createdAt"> & { createdAt?: Date })[];
  onSelectTerritory?: (territory: TerritoryPeriodRecord) => void;
  onSelectEvent?: (event: HistoricalEventRecord) => void;
  onSelectRoute?: (route: (Omit<TradeRouteRecord, "createdAt"> & { createdAt?: Date })) => void;
  onSelectMonument?: (monument: (Omit<NewMonumentRecord, "createdAt"> & { createdAt?: Date })) => void;
  selectedTerritoryId?: string | null;
  selectedEventId?: string | null;
  selectedRouteId?: string | null;
  selectedMonumentId?: string | null;
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
  onSelectTerritory,
  onSelectEvent,
  onSelectRoute,
  onSelectMonument,
  selectedTerritoryId,
  selectedEventId,
  selectedRouteId,
  selectedMonumentId,
}: HistoricalMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const geoJsonLayerRef = useRef<LeafletGeoJSON | null>(null);
  const eventsLayerRef = useRef<LayerGroup | null>(null);
  const routesLayerRef = useRef<LayerGroup | null>(null);
  const monumentsLayerRef = useRef<LayerGroup | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!mapContainerRef.current || mapInstanceRef.current) return;

      const L = await import("leaflet");

      if (!isMounted || !mapContainerRef.current) return;

      // Initialize Leaflet map centered on historical heartland
      const map = L.map(mapContainerRef.current, {
        center: [33.0, 30.0],
        zoom: 4,
        minZoom: 3,
        maxZoom: 9,
        scrollWheelZoom: true,
      });

      // Add CartoDB Positron archival-style light basemap
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 19,
        }
      ).addTo(map);

      mapInstanceRef.current = map;
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update GeoJSON territory layer
  useEffect(() => {
    async function updateLayers() {
      const map = mapInstanceRef.current;
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
  }, [territories, selectedTerritoryId, onSelectTerritory]);

  // Update Event markers layer
  useEffect(() => {
    async function updateEventMarkers() {
      const map = mapInstanceRef.current;
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
  }, [events, selectedEventId, onSelectEvent]);

  // Update Trade & Pilgrimage Routes Layer
  useEffect(() => {
    async function updateRoutes() {
      const map = mapInstanceRef.current;
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
  }, [routes, selectedRouteId, onSelectRoute]);

  // Update Monument markers layer
  useEffect(() => {
    async function updateMonumentMarkers() {
      const map = mapInstanceRef.current;
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
  }, [monuments, selectedMonumentId, onSelectMonument]);

  return (
    <div
      ref={mapContainerRef}
      role="application"
      aria-label="Interactive Historical Atlas Map"
      className="w-full h-full min-h-[420px] rounded-lg overflow-hidden border border-archival-border bg-archival-surface z-0"
    />
  );
}
