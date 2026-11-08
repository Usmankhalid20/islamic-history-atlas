"use client";

import React, { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { YearSlider } from "@/components/timeline/YearSlider";
import { TerritoryDetailPanel } from "@/components/atlas/TerritoryDetailPanel";
import { initialTerritoryPeriods, initialPolities } from "@/lib/data/historicalSeed";
import { filterActiveTerritories } from "@/lib/geo/territoryUtils";
import type { TerritoryPeriodRecord } from "@/lib/db/schema/territoryPeriods";
import { formatHistoricalYear } from "@/lib/utils";
import { Layers, MapPin, Info } from "lucide-react";

// Dynamically import Leaflet Map to ensure SSR compatibility
const HistoricalMap = dynamic(
  () => import("@/components/map/HistoricalMap").then((mod) => mod.HistoricalMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[460px] rounded-lg border border-archival-border bg-archival-surface flex items-center justify-center text-archival-muted font-serif text-sm">
        Loading historical cartography engine...
      </div>
    ),
  }
);

const POLITY_BADGE_COLORS: Record<string, string> = {
  pol_rashidun: "bg-orange-100 text-orange-900 border-orange-300",
  pol_umayyad: "bg-amber-100 text-amber-900 border-amber-300",
  pol_abbasid_early: "bg-stone-200 text-stone-900 border-stone-400",
  pol_cordoba_emirate: "bg-emerald-100 text-emerald-900 border-emerald-300",
  pol_fatimid: "bg-blue-100 text-blue-900 border-blue-300",
};

export function AtlasExplorer() {
  const [selectedYear, setSelectedYear] = useState<number>(750);
  const [selectedTerritory, setSelectedTerritory] = useState<TerritoryPeriodRecord | null>(null);

  // Filter active territories for the current year (pure, deterministic)
  const activeTerritories = useMemo(() => {
    return filterActiveTerritories(initialTerritoryPeriods, selectedYear);
  }, [selectedYear]);

  // Identify unique polities active in the selected year
  const activePolities = useMemo(() => {
    const activePolityIds = new Set(activeTerritories.map((t) => t.polityId));
    return initialPolities.filter((p) => activePolityIds.has(p.id));
  }, [activeTerritories]);

  return (
    <div className="space-y-6 w-full">
      {/* Timeline Control */}
      <YearSlider
        year={selectedYear}
        minYear={632}
        maxYear={1000}
        onChange={(year) => {
          setSelectedYear(year);
          // If selected territory is no longer active in the new year, deselect it
          if (
            selectedTerritory &&
            (selectedTerritory.validFromYear > year || selectedTerritory.validToYear < year)
          ) {
            setSelectedTerritory(null);
          }
        }}
      />

      {/* Concurrent Polities Active in Selected Year */}
      <div 
        className="bg-archival-surface border border-archival-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
        role="status"
        aria-live="polite"
      >
        <div className="flex items-center gap-2 text-archival-ink font-serif font-semibold">
          <Layers className="w-4 h-4 text-archival-gold" aria-hidden="true" />
          <span>Active Polities in {formatHistoricalYear(selectedYear)}:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {activePolities.length === 0 ? (
            <span className="text-archival-muted italic">
              No recorded territorial claims in database for this specific year.
            </span>
          ) : (
            activePolities.map((polity) => (
              <span
                key={polity.id}
                className={`px-2.5 py-1 rounded-full border text-[11px] font-medium font-sans ${
                  POLITY_BADGE_COLORS[polity.id] || "bg-gray-100 text-gray-800 border-gray-300"
                }`}
              >
                {polity.canonicalName} ({formatHistoricalYear(polity.startYear)}–{polity.endYear ? formatHistoricalYear(polity.endYear) : "present"})
              </span>
            ))
          )}
        </div>
      </div>

      {/* Map and Detail Drawer Layout */}
      <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Map Canvas (2 cols on large screens) */}
        <div className="lg:col-span-2 h-[480px] sm:h-[540px] w-full relative">
          <HistoricalMap
            territories={activeTerritories}
            selectedTerritoryId={selectedTerritory?.id}
            onSelectTerritory={(t) => setSelectedTerritory(t)}
          />

          {/* Map Overlay Prompt */}
          <div className="absolute bottom-3 left-3 z-[400] bg-archival-surface/90 backdrop-blur-sm border border-archival-border/80 px-3 py-1.5 rounded-lg text-xs text-archival-muted flex items-center gap-1.5 shadow-sm">
            <Info className="w-3.5 h-3.5 text-archival-gold" aria-hidden="true" />
            <span>Click any territory polygon to inspect evidence and sources</span>
          </div>
        </div>

        {/* Territory & Source Inspection Drawer */}
        <div className="lg:col-span-1 w-full">
          {selectedTerritory ? (
            <TerritoryDetailPanel
              territory={selectedTerritory}
              onClose={() => setSelectedTerritory(null)}
            />
          ) : (
            <div className="bg-archival-surface border border-archival-border rounded-xl p-6 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-archival-bg border border-archival-border flex items-center justify-center mx-auto text-archival-muted">
                <MapPin className="w-5 h-5 text-archival-gold" aria-hidden="true" />
              </div>
              <h3 className="font-serif font-semibold text-archival-ink text-base">
                Territory Inspector
              </h3>
              <p className="text-xs text-archival-muted leading-relaxed">
                Click any territory on the map or move the year slider above to explore changing political control across Islamic history.
              </p>
              <div className="pt-3 border-t border-archival-border/60 text-[11px] text-archival-muted space-y-1 text-left">
                <p>• <strong>Dashed borders:</strong> Approximate / disputed zones.</p>
                <p>• <strong>Solid borders:</strong> Directly administered territories.</p>
                <p>• <strong>Attribution:</strong> All claims link to peer-reviewed literature.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

