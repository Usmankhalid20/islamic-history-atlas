"use client";

import React, { useEffect, useRef } from "react";
import type { Map as LeafletMap, GeoJSON as LeafletGeoJSON } from "leaflet";
import type { TerritoryPeriodRecord } from "@/lib/db/schema/territoryPeriods";

interface HistoricalMapProps {
  territories: TerritoryPeriodRecord[];
  onSelectTerritory?: (territory: TerritoryPeriodRecord) => void;
  selectedTerritoryId?: string | null;
}

const POLITY_COLORS: Record<string, { fill: string; stroke: string }> = {
  pol_rashidun: { fill: "#9A3412", stroke: "#7C2D12" }, // Terracotta
  pol_umayyad: { fill: "#D97706", stroke: "#B45309" }, // Gold / Amber
  pol_abbasid_early: { fill: "#1C1917", stroke: "#000000" }, // Black
  pol_cordoba_emirate: { fill: "#059669", stroke: "#047857" }, // Emerald
  pol_fatimid: { fill: "#2563EB", stroke: "#1D4ED8" }, // Lapis / Royal Blue
};

const DEFAULT_STYLE = { fill: "#64748B", stroke: "#475569" };

export function HistoricalMap({
  territories,
  onSelectTerritory,
  selectedTerritoryId,
}: HistoricalMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const geoJsonLayerRef = useRef<LeafletGeoJSON | null>(null);

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

  // Update GeoJSON layer whenever territories or selection changes
  useEffect(() => {
    async function updateLayers() {
      const map = mapInstanceRef.current;
      if (!map) return;

      const L = await import("leaflet");

      // Remove existing layer
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

          // Tooltip on hover
          featureLayer.bindTooltip(
            `<strong>${t.regionName}</strong><br/>${t.controlType} control (${t.validFromYear}–${t.validToYear} CE)`,
            { sticky: true, className: "font-sans text-xs" }
          );

          // Click handler
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

  return (
    <div
      ref={mapContainerRef}
      role="application"
      aria-label="Interactive Historical Atlas Map"
      className="w-full h-full min-h-[420px] rounded-lg overflow-hidden border border-archival-border bg-archival-surface z-0"
    />
  );
}

