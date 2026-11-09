"use client";

import React, { useState, useRef, useEffect } from "react";
import { Info, ChevronDown, ChevronUp, Layers, Eye, EyeOff } from "lucide-react";

export interface MapLegendProps {
  showTerritories?: boolean;
  showEvents?: boolean;
  showRoutes?: boolean;
  showMonuments?: boolean;
  showCampaigns?: boolean;
  showDiscrepancies?: boolean;
  onToggleLayer?: (layerKey: "territories" | "events" | "routes" | "monuments" | "campaigns" | "discrepancies") => void;
  className?: string;
}

export function MapLegend({
  showTerritories = true,
  showEvents = true,
  showRoutes = true,
  showMonuments = true,
  showCampaigns = true,
  showDiscrepancies = true,
  onToggleLayer,
  className = "",
}: MapLegendProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsExpanded(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute bottom-3 left-3 z-[400] transition-all duration-200 pointer-events-auto ${className}`}
      role="region"
      aria-label="Map Cartographic Legend"
    >
      {isExpanded ? (
        <div className="bg-archival-surface/98 backdrop-blur-md border border-archival-border rounded-xl p-3 shadow-xl max-w-sm sm:max-w-md w-full animate-in fade-in zoom-in-95 duration-150 space-y-2.5">
          {/* Legend Header */}
          <div className="flex items-center justify-between pb-2 border-b border-archival-border/60">
            <div className="flex items-center gap-1.5 text-xs font-serif font-bold text-archival-ink">
              <Info className="w-3.5 h-3.5 text-archival-gold" aria-hidden="true" />
              <span>Cartographic Legend</span>
            </div>
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="p-1 rounded-md text-archival-muted hover:text-archival-ink hover:bg-archival-bg transition-colors"
              title="Collapse Cartographic Legend"
              aria-label="Collapse legend"
            >
              <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>

          {/* Legend Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-archival-muted">
            {/* Direct Imperial Administration */}
            <div
              className={`flex items-center justify-between p-1.5 rounded-lg border transition-colors ${
                showTerritories
                  ? "bg-archival-bg/70 border-archival-border/60 text-archival-ink"
                  : "bg-archival-bg/30 border-transparent text-archival-muted opacity-60"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="inline-block w-3.5 h-3 rounded bg-amber-700/60 border border-amber-900 shadow-2xs" />
                <span className="font-medium">Direct Control</span>
              </div>
              {onToggleLayer && (
                <button
                  type="button"
                  onClick={() => onToggleLayer("territories")}
                  className="text-archival-muted hover:text-archival-gold"
                  title="Toggle territory polygon visibility"
                >
                  {showTerritories ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                </button>
              )}
            </div>

            {/* Contested Frontiers / Historical Discrepancies */}
            <div
              className={`flex items-center justify-between p-1.5 rounded-lg border transition-colors ${
                showDiscrepancies
                  ? "bg-archival-bg/70 border-archival-border/60 text-archival-ink"
                  : "bg-archival-bg/30 border-transparent text-archival-muted opacity-60"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="inline-block w-3.5 h-3 rounded bg-amber-200 border border-dashed border-amber-600 shadow-2xs" />
                <span className="font-medium">Contested Frontier</span>
              </div>
              {onToggleLayer && (
                <button
                  type="button"
                  onClick={() => onToggleLayer("discrepancies")}
                  className="text-archival-muted hover:text-archival-gold"
                  title="Toggle disputed boundary overlay"
                >
                  {showDiscrepancies ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                </button>
              )}
            </div>

            {/* Key Battles & Engagements */}
            <div
              className={`flex items-center justify-between p-1.5 rounded-lg border transition-colors ${
                showEvents
                  ? "bg-archival-bg/70 border-archival-border/60 text-archival-ink"
                  : "bg-archival-bg/30 border-transparent text-archival-muted opacity-60"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-600 border border-red-800 shadow-2xs" />
                <span className="font-medium">Battles & Events</span>
              </div>
              {onToggleLayer && (
                <button
                  type="button"
                  onClick={() => onToggleLayer("events")}
                  className="text-archival-muted hover:text-archival-gold"
                  title="Toggle event markers"
                >
                  {showEvents ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                </button>
              )}
            </div>

            {/* Trade & Pilgrimage Corridors */}
            <div
              className={`flex items-center justify-between p-1.5 rounded-lg border transition-colors ${
                showRoutes
                  ? "bg-archival-bg/70 border-archival-border/60 text-archival-ink"
                  : "bg-archival-bg/30 border-transparent text-archival-muted opacity-60"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="inline-block w-3.5 border-t-2 border-dashed border-amber-600" />
                <span className="font-medium">Trade & Hajj Routes</span>
              </div>
              {onToggleLayer && (
                <button
                  type="button"
                  onClick={() => onToggleLayer("routes")}
                  className="text-archival-muted hover:text-archival-gold"
                  title="Toggle trade route paths"
                >
                  {showRoutes ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                </button>
              )}
            </div>

            {/* Monuments, Academies & Libraries */}
            <div
              className={`flex items-center justify-between p-1.5 rounded-lg border transition-colors ${
                showMonuments
                  ? "bg-archival-bg/70 border-archival-border/60 text-archival-ink"
                  : "bg-archival-bg/30 border-transparent text-archival-muted opacity-60"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-purple-600 border border-purple-800 shadow-2xs" />
                <span className="font-medium">Academies & Mosques</span>
              </div>
              {onToggleLayer && (
                <button
                  type="button"
                  onClick={() => onToggleLayer("monuments")}
                  className="text-archival-muted hover:text-archival-gold"
                  title="Toggle monuments"
                >
                  {showMonuments ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                </button>
              )}
            </div>

            {/* Military Campaigns */}
            <div
              className={`flex items-center justify-between p-1.5 rounded-lg border transition-colors ${
                showCampaigns
                  ? "bg-archival-bg/70 border-archival-border/60 text-archival-ink"
                  : "bg-archival-bg/30 border-transparent text-archival-muted opacity-60"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="inline-block w-3.5 border-t-2 border-dashed border-red-600" />
                <span className="font-medium">Campaign Marches</span>
              </div>
              {onToggleLayer && (
                <button
                  type="button"
                  onClick={() => onToggleLayer("campaigns")}
                  className="text-archival-muted hover:text-archival-gold"
                  title="Toggle campaign marches"
                >
                  {showCampaigns ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          className="bg-archival-surface/95 backdrop-blur-md border border-archival-border px-3 py-1.5 rounded-xl text-xs font-serif text-archival-ink shadow-md flex items-center gap-1.5 hover:bg-archival-bg transition-colors"
          title="Expand Cartographic Legend"
          aria-expanded={false}
          aria-label="Expand map legend"
        >
          <Info className="w-3.5 h-3.5 text-archival-gold" aria-hidden="true" />
          <span className="font-medium text-[11px]">Legend</span>
          <ChevronUp className="w-3 h-3 text-archival-muted ml-0.5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

