"use client";

import React, { useState } from "react";
import { Layers, Sliders, ChevronDown, Check } from "lucide-react";

export interface MapLayerControlProps {
  showTerritories: boolean;
  setShowTerritories: (val: boolean) => void;
  showEvents: boolean;
  setShowEvents: (val: boolean) => void;
  showRoutes: boolean;
  setShowRoutes: (val: boolean) => void;
  showMonuments: boolean;
  setShowMonuments: (val: boolean) => void;
  showCampaigns: boolean;
  setShowCampaigns: (val: boolean) => void;
  showDiscrepancies: boolean;
  setShowDiscrepancies: (val: boolean) => void;
  territoryOpacity: number;
  setTerritoryOpacity: (val: number) => void;
  counts?: {
    territories?: number;
    events?: number;
    routes?: number;
    monuments?: number;
    campaigns?: number;
    discrepancies?: number;
  };
}

export function MapLayerControl({
  showTerritories,
  setShowTerritories,
  showEvents,
  setShowEvents,
  showRoutes,
  setShowRoutes,
  showMonuments,
  setShowMonuments,
  showCampaigns,
  setShowCampaigns,
  showDiscrepancies,
  setShowDiscrepancies,
  territoryOpacity,
  setTerritoryOpacity,
  counts = {},
}: MapLayerControlProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="absolute top-3 left-3 z-[400] pointer-events-auto">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-archival-surface/95 backdrop-blur-md border border-archival-border px-3 py-1.5 rounded-xl text-xs font-serif text-archival-ink shadow-md flex items-center gap-1.5 hover:bg-archival-bg transition-colors"
        title="Toggle Map Cartographic Layers"
        aria-expanded={isOpen}
        aria-label="Toggle map cartographic layers"
      >
        <Layers className="w-3.5 h-3.5 text-archival-gold" aria-hidden="true" />
        <span className="font-medium text-[11px]">Cartographic Layers</span>
        <ChevronDown
          className={`w-3 h-3 text-archival-muted transition-transform ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1.5 w-64 bg-archival-surface/98 backdrop-blur-md border border-archival-border rounded-xl shadow-xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-3">
          <div className="flex items-center justify-between pb-1.5 border-b border-archival-border/60">
            <span className="text-[10px] uppercase font-mono tracking-wider text-archival-muted">
              Active Layers
            </span>
            <span className="text-[10px] text-archival-gold font-mono">
              {[showTerritories, showEvents, showRoutes, showMonuments, showCampaigns, showDiscrepancies].filter(Boolean).length}/6 Active
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            {/* Territory Polygons */}
            <label className="flex items-center justify-between p-1.5 rounded-lg hover:bg-archival-bg cursor-pointer transition-colors">
              <span className="flex items-center gap-2 text-archival-ink">
                <input
                  type="checkbox"
                  checked={showTerritories}
                  onChange={(e) => setShowTerritories(e.target.checked)}
                  className="rounded text-archival-gold focus:ring-archival-gold"
                />
                <span className="font-serif">Empire Territories</span>
              </span>
              <span className="text-[10px] font-mono text-archival-muted">
                {counts.territories ?? 0}
              </span>
            </label>

            {/* Battles & Events */}
            <label className="flex items-center justify-between p-1.5 rounded-lg hover:bg-archival-bg cursor-pointer transition-colors">
              <span className="flex items-center gap-2 text-archival-ink">
                <input
                  type="checkbox"
                  checked={showEvents}
                  onChange={(e) => setShowEvents(e.target.checked)}
                  className="rounded text-archival-gold focus:ring-archival-gold"
                />
                <span className="font-serif">Battles & Events</span>
              </span>
              <span className="text-[10px] font-mono text-archival-muted">
                {counts.events ?? 0}
              </span>
            </label>

            {/* Trade Routes */}
            <label className="flex items-center justify-between p-1.5 rounded-lg hover:bg-archival-bg cursor-pointer transition-colors">
              <span className="flex items-center gap-2 text-archival-ink">
                <input
                  type="checkbox"
                  checked={showRoutes}
                  onChange={(e) => setShowRoutes(e.target.checked)}
                  className="rounded text-archival-gold focus:ring-archival-gold"
                />
                <span className="font-serif">Trade & Hajj Routes</span>
              </span>
              <span className="text-[10px] font-mono text-archival-muted">
                {counts.routes ?? 0}
              </span>
            </label>

            {/* Cultural Monuments */}
            <label className="flex items-center justify-between p-1.5 rounded-lg hover:bg-archival-bg cursor-pointer transition-colors">
              <span className="flex items-center gap-2 text-archival-ink">
                <input
                  type="checkbox"
                  checked={showMonuments}
                  onChange={(e) => setShowMonuments(e.target.checked)}
                  className="rounded text-archival-gold focus:ring-archival-gold"
                />
                <span className="font-serif">Academies & Mosques</span>
              </span>
              <span className="text-[10px] font-mono text-archival-muted">
                {counts.monuments ?? 0}
              </span>
            </label>

            {/* Military Campaigns */}
            <label className="flex items-center justify-between p-1.5 rounded-lg hover:bg-archival-bg cursor-pointer transition-colors">
              <span className="flex items-center gap-2 text-archival-ink">
                <input
                  type="checkbox"
                  checked={showCampaigns}
                  onChange={(e) => setShowCampaigns(e.target.checked)}
                  className="rounded text-archival-gold focus:ring-archival-gold"
                />
                <span className="font-serif">Military Campaigns</span>
              </span>
              <span className="text-[10px] font-mono text-archival-muted">
                {counts.campaigns ?? 0}
              </span>
            </label>

            {/* Contested Frontiers */}
            <label className="flex items-center justify-between p-1.5 rounded-lg hover:bg-archival-bg cursor-pointer transition-colors">
              <span className="flex items-center gap-2 text-archival-ink">
                <input
                  type="checkbox"
                  checked={showDiscrepancies}
                  onChange={(e) => setShowDiscrepancies(e.target.checked)}
                  className="rounded text-archival-gold focus:ring-archival-gold"
                />
                <span className="font-serif">Contested Frontiers</span>
              </span>
              <span className="text-[10px] font-mono text-archival-muted">
                {counts.discrepancies ?? 0}
              </span>
            </label>
          </div>

          {/* Territory Opacity Slider */}
          <div className="pt-2 border-t border-archival-border/60 space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1 text-archival-muted font-serif">
                <Sliders className="w-3 h-3 text-archival-gold" aria-hidden="true" />
                <span>Territory Opacity</span>
              </span>
              <span className="font-mono text-archival-ink text-[10px]">
                {Math.round(territoryOpacity * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.9"
              step="0.05"
              value={territoryOpacity}
              onChange={(e) => setTerritoryOpacity(parseFloat(e.target.value))}
              className="w-full h-1 bg-archival-border rounded-lg appearance-none cursor-pointer accent-archival-gold"
              aria-label="Territory polygon opacity"
            />
          </div>
        </div>
      )}
    </div>
  );
}
