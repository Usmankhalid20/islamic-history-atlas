"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import {
  COMPARISON_PRESETS,
  computeEraDelta,
  type ComparisonPreset,
} from "@/lib/geo/comparisonUtils";
import { ComparisonDeltaPanel } from "@/components/compare/ComparisonDeltaPanel";
import { YearSlider } from "@/components/timeline/YearSlider";
import {
  initialTerritoryPeriods,
  initialTradeRoutes,
  initialMonuments,
  initialCampaigns,
  initialHistoricalEvents,
} from "@/lib/data/historicalSeed";
import { filterActiveTerritories } from "@/lib/geo/territoryUtils";
import { formatHistoricalYear } from "@/lib/utils";
import type { TerritoryPeriodRecord } from "@/lib/db/schema/territoryPeriods";
import {
  GitCompare,
  Layers,
  Share2,
  Check,
  Calendar,
  Sparkles,
  ArrowRightLeft,
} from "lucide-react";

// Dynamically import Leaflet Map to ensure SSR compatibility
const HistoricalMap = dynamic(
  () => import("@/components/map/HistoricalMap").then((mod) => mod.HistoricalMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[400px] rounded-lg border border-archival-border bg-archival-surface flex items-center justify-center text-archival-muted font-serif text-sm">
        Loading historical comparison canvas...
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

function ComparisonViewContent() {
  const searchParams = useSearchParams();

  // Read initial query params
  const paramYearA = searchParams?.get("yearA");
  const paramYearB = searchParams?.get("yearB");
  const paramPreset = searchParams?.get("preset");

  const initialA = paramYearA && !isNaN(parseInt(paramYearA, 10)) ? parseInt(paramYearA, 10) : 661;
  const initialB = paramYearB && !isNaN(parseInt(paramYearB, 10)) ? parseInt(paramYearB, 10) : 750;

  const [yearA, setYearA] = useState<number>(initialA);
  const [yearB, setYearB] = useState<number>(initialB);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(
    paramPreset || "preset_umayyad_to_abbasid"
  );
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const [selectedTerritoryA, setSelectedTerritoryA] = useState<TerritoryPeriodRecord | null>(null);
  const [selectedTerritoryB, setSelectedTerritoryB] = useState<TerritoryPeriodRecord | null>(null);

  // Sync state to URL without reloading
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams();
    params.set("yearA", yearA.toString());
    params.set("yearB", yearB.toString());
    if (selectedPresetId) params.set("preset", selectedPresetId);

    window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
  }, [yearA, yearB, selectedPresetId]);

  // Handle Preset Selection
  const handleSelectPreset = (preset: ComparisonPreset) => {
    setSelectedPresetId(preset.id);
    setYearA(preset.yearA);
    setYearB(preset.yearB);
    setSelectedTerritoryA(null);
    setSelectedTerritoryB(null);
  };

  // Swap Years
  const handleSwapYears = () => {
    const tempA = yearA;
    setYearA(yearB);
    setYearB(tempA);
    setSelectedPresetId(null);
  };

  // Copy shareable comparison URL
  const handleShare = async () => {
    if (typeof window === "undefined") return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // Fallback
    }
  };

  // Compute Active Layers for Year A
  const activeTerritoriesA = useMemo(() => filterActiveTerritories(initialTerritoryPeriods, yearA), [yearA]);
  const activeRoutesA = useMemo(
    () => initialTradeRoutes.filter((r) => r.activeFromYear <= yearA && (r.activeToYear ?? 2000) >= yearA),
    [yearA]
  );
  const activeMonumentsA = useMemo(
    () => initialMonuments.filter((m) => m.foundingYear <= yearA),
    [yearA]
  );
  const activeCampaignsA = useMemo(
    () => initialCampaigns.filter((c) => c.startYear <= yearA && c.endYear >= yearA),
    [yearA]
  );
  const displayedEventsA = useMemo(
    () => initialHistoricalEvents.filter((e) => Math.abs(e.eventYear - yearA) <= 25),
    [yearA]
  );

  // Compute Active Layers for Year B
  const activeTerritoriesB = useMemo(() => filterActiveTerritories(initialTerritoryPeriods, yearB), [yearB]);
  const activeRoutesB = useMemo(
    () => initialTradeRoutes.filter((r) => r.activeFromYear <= yearB && (r.activeToYear ?? 2000) >= yearB),
    [yearB]
  );
  const activeMonumentsB = useMemo(
    () => initialMonuments.filter((m) => m.foundingYear <= yearB),
    [yearB]
  );
  const activeCampaignsB = useMemo(
    () => initialCampaigns.filter((c) => c.startYear <= yearB && c.endYear >= yearB),
    [yearB]
  );
  const displayedEventsB = useMemo(
    () => initialHistoricalEvents.filter((e) => Math.abs(e.eventYear - yearB) <= 25),
    [yearB]
  );

  // Computed Comparative Delta
  const delta = useMemo(() => computeEraDelta(yearA, yearB), [yearA, yearB]);
  const currentPreset = COMPARISON_PRESETS.find((p) => p.id === selectedPresetId) || null;

  return (
    <div className="space-y-6 w-full">
      {/* Preset Transition Toolbar */}
      <div className="bg-archival-surface border border-archival-border rounded-xl p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-archival-border pb-2.5">
          <div className="flex items-center gap-2 text-archival-ink font-serif font-bold text-sm">
            <Sparkles className="w-4 h-4 text-archival-gold" aria-hidden="true" />
            <span>Curated Historical Transitions:</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSwapYears}
              className="px-2.5 py-1 rounded border border-archival-border bg-archival-bg hover:bg-archival-surface text-[11px] font-sans font-medium text-archival-ink flex items-center gap-1.5 transition-colors"
              title="Swap Epoch A and Epoch B"
            >
              <ArrowRightLeft className="w-3 h-3 text-archival-gold" aria-hidden="true" />
              <span>Swap Eras</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="px-2.5 py-1 rounded border border-archival-border bg-archival-bg hover:bg-archival-surface text-[11px] font-sans font-medium text-archival-ink flex items-center gap-1.5 transition-colors"
              title="Copy shareable link to this comparison"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" aria-hidden="true" />
                  <span className="text-emerald-700">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3 h-3 text-archival-gold" aria-hidden="true" />
                  <span>Share Comparison</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Preset Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {COMPARISON_PRESETS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`p-2.5 rounded-lg border text-left transition-all ${
                  isSelected
                    ? "bg-archival-gold/15 border-archival-gold shadow-sm"
                    : "bg-archival-bg hover:bg-archival-surface border-archival-border text-archival-muted"
                }`}
              >
                <div className="flex items-center justify-between font-mono text-[11px] font-bold">
                  <span className={isSelected ? "text-archival-gold" : "text-archival-ink"}>
                    {preset.shortName}
                  </span>
                  {isSelected && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-archival-gold text-white font-sans uppercase">
                      Active
                    </span>
                  )}
                </div>
                <div className="text-xs font-serif font-semibold text-archival-ink mt-0.5 line-clamp-1">
                  {preset.title}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dual Synchronized Map Display */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Map: Epoch A */}
        <div className="bg-archival-surface border border-archival-border rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-archival-border pb-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-archival-ink text-archival-surface font-mono font-bold text-xs flex items-center justify-center">
                A
              </span>
              <div>
                <h3 className="font-serif font-bold text-sm text-archival-ink">
                  Epoch A: {formatHistoricalYear(yearA)}
                </h3>
                <span className="text-[11px] text-archival-muted">
                  {delta.politiesA.length} sovereign polities active
                </span>
              </div>
            </div>
            <div className="text-xs font-mono font-bold text-archival-gold">
              {formatHistoricalYear(yearA)}
            </div>
          </div>

          <YearSlider
            year={yearA}
            minYear={500}
            maxYear={1980}
            onChange={(y) => {
              setYearA(y);
              setSelectedPresetId(null);
            }}
          />

          {/* Active Polities in Epoch A */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {delta.politiesA.map((p) => (
              <span
                key={p.id}
                className={`px-2 py-0.5 rounded-full border text-[10px] font-medium font-sans ${
                  POLITY_BADGE_COLORS[p.id] || "bg-gray-100 text-gray-800 border-gray-300"
                }`}
              >
                {p.canonicalName}
              </span>
            ))}
          </div>

          {/* Map Canvas A */}
          <div className="h-[380px] w-full relative rounded-lg overflow-hidden border border-archival-border">
            <HistoricalMap
              territories={activeTerritoriesA}
              events={displayedEventsA}
              routes={activeRoutesA}
              monuments={activeMonumentsA}
              campaigns={activeCampaignsA}
              selectedTerritoryId={selectedTerritoryA?.id}
              onSelectTerritory={(t) => setSelectedTerritoryA(t)}
            />
          </div>
        </div>

        {/* Right Map: Epoch B */}
        <div className="bg-archival-surface border border-archival-border rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-archival-border pb-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-archival-gold text-white font-mono font-bold text-xs flex items-center justify-center">
                B
              </span>
              <div>
                <h3 className="font-serif font-bold text-sm text-archival-ink">
                  Epoch B: {formatHistoricalYear(yearB)}
                </h3>
                <span className="text-[11px] text-archival-muted">
                  {delta.politiesB.length} sovereign polities active
                </span>
              </div>
            </div>
            <div className="text-xs font-mono font-bold text-archival-gold">
              {formatHistoricalYear(yearB)}
            </div>
          </div>

          <YearSlider
            year={yearB}
            minYear={500}
            maxYear={1980}
            onChange={(y) => {
              setYearB(y);
              setSelectedPresetId(null);
            }}
          />

          {/* Active Polities in Epoch B */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {delta.politiesB.map((p) => (
              <span
                key={p.id}
                className={`px-2 py-0.5 rounded-full border text-[10px] font-medium font-sans ${
                  POLITY_BADGE_COLORS[p.id] || "bg-gray-100 text-gray-800 border-gray-300"
                }`}
              >
                {p.canonicalName}
              </span>
            ))}
          </div>

          {/* Map Canvas B */}
          <div className="h-[380px] w-full relative rounded-lg overflow-hidden border border-archival-border">
            <HistoricalMap
              territories={activeTerritoriesB}
              events={displayedEventsB}
              routes={activeRoutesB}
              monuments={activeMonumentsB}
              campaigns={activeCampaignsB}
              selectedTerritoryId={selectedTerritoryB?.id}
              onSelectTerritory={(t) => setSelectedTerritoryB(t)}
            />
          </div>
        </div>
      </div>

      {/* Historiographical Delta & Analytical Breakdown */}
      <ComparisonDeltaPanel delta={delta} activePreset={currentPreset} />
    </div>
  );
}

export function ComparisonView() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-96 rounded-xl border border-archival-border bg-archival-surface flex items-center justify-center text-archival-muted font-serif text-sm">
          Loading Historiographical Comparison Mode...
        </div>
      }
    >
      <ComparisonViewContent />
    </Suspense>
  );
}
