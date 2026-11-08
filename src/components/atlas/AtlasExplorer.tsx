"use client";

import React, { useState, useMemo, Suspense } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { YearSlider } from "@/components/timeline/YearSlider";
import { TerritoryDetailPanel } from "@/components/atlas/TerritoryDetailPanel";
import { EventDetailPanel } from "@/components/atlas/EventDetailPanel";
import { RouteDetailPanel } from "@/components/atlas/RouteDetailPanel";
import { MonumentDetailPanel } from "@/components/atlas/MonumentDetailPanel";
import { HistoricalInquiryWidget } from "@/components/atlas/HistoricalInquiryWidget";
import {
  initialTerritoryPeriods,
  initialPolities,
  initialHistoricalEvents,
  initialTradeRoutes,
  initialMonuments,
} from "@/lib/data/historicalSeed";
import { filterActiveTerritories } from "@/lib/geo/territoryUtils";
import type { TerritoryPeriodRecord } from "@/lib/db/schema/territoryPeriods";
import type { HistoricalEventRecord } from "@/lib/db/schema/historicalEvents";
import type { TradeRouteRecord } from "@/lib/db/schema/tradeRoutes";
import type { NewMonumentRecord } from "@/lib/db/schema/monuments";
import { formatHistoricalYear } from "@/lib/utils";
import { Layers, MapPin, Info, Swords, Sparkles, Filter, Navigation, Landmark } from "lucide-react";

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

interface AtlasExplorerProps {
  initialYear?: number;
}

function AtlasExplorerContent({ initialYear }: AtlasExplorerProps) {
  const searchParams = useSearchParams();
  const paramYear = searchParams?.get("year");
  const parsedParamYear = paramYear ? parseInt(paramYear, 10) : undefined;

  const defaultYear = (parsedParamYear && !isNaN(parsedParamYear)) 
    ? parsedParamYear 
    : (initialYear || 750);

  const [selectedYear, setSelectedYear] = useState<number>(defaultYear);
  const [selectedTerritory, setSelectedTerritory] = useState<TerritoryPeriodRecord | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<HistoricalEventRecord | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<(Omit<TradeRouteRecord, "createdAt"> & { createdAt?: Date }) | null>(null);
  const [selectedMonument, setSelectedMonument] = useState<(Omit<NewMonumentRecord, "createdAt"> & { createdAt?: Date }) | null>(null);
  const [showAllEvents, setShowAllEvents] = useState<boolean>(false);
  const [showRoutes, setShowRoutes] = useState<boolean>(true);
  const [showMonuments, setShowMonuments] = useState<boolean>(true);
  const [showAiInquiry, setShowAiInquiry] = useState<boolean>(false);

  // Filter active territories for the current year (pure, deterministic)
  const activeTerritories = useMemo(() => {
    return filterActiveTerritories(initialTerritoryPeriods, selectedYear);
  }, [selectedYear]);

  // Identify unique polities active in the selected year
  const activePolities = useMemo(() => {
    const activePolityIds = new Set(activeTerritories.map((t) => t.polityId));
    return initialPolities.filter((p) => activePolityIds.has(p.id));
  }, [activeTerritories]);

  // Filter events: either all events or events near selected year (within ±25 years)
  const displayedEvents = useMemo(() => {
    if (showAllEvents) {
      return initialHistoricalEvents;
    }
    return initialHistoricalEvents.filter(
      (e) => Math.abs(e.eventYear - selectedYear) <= 25
    );
  }, [selectedYear, showAllEvents]);

  // Filter active trade and pilgrimage routes for selected year
  const activeRoutes = useMemo(() => {
    if (!showRoutes) return [];
    return initialTradeRoutes.filter((r) => {
      const end = r.activeToYear ?? 2000;
      return r.activeFromYear <= selectedYear && end >= selectedYear;
    });
  }, [selectedYear, showRoutes]);

  // Filter active monuments founded on or before selected year
  const activeMonuments = useMemo(() => {
    if (!showMonuments) return [];
    return initialMonuments.filter((m) => m.foundingYear <= selectedYear);
  }, [selectedYear, showMonuments]);

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

      {/* Concurrent Polities & Events Controls */}
      <div 
        className="bg-archival-surface border border-archival-border rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
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

        {/* Action Buttons: Routes Toggle, Monuments Toggle, Event Scope Toggle & AI Scholar */}
        <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-archival-border">
          <button
            type="button"
            onClick={() => setShowRoutes(!showRoutes)}
            className={`px-2.5 py-1 rounded border text-[11px] font-sans flex items-center gap-1.5 transition-colors ${
              showRoutes
                ? "bg-archival-gold text-white border-archival-gold"
                : "bg-archival-bg text-archival-ink border-archival-border hover:bg-archival-surface"
            }`}
            title="Toggle trade and pilgrimage routes on map"
          >
            <Navigation className="w-3 h-3" aria-hidden="true" />
            <span>{showRoutes ? `Routes (${activeRoutes.length})` : "Routes Off"}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowMonuments(!showMonuments)}
            className={`px-2.5 py-1 rounded border text-[11px] font-sans flex items-center gap-1.5 transition-colors ${
              showMonuments
                ? "bg-purple-700 text-white border-purple-800"
                : "bg-archival-bg text-archival-ink border-archival-border hover:bg-archival-surface"
            }`}
            title="Toggle monuments and intellectual centers on map"
          >
            <Landmark className="w-3 h-3" aria-hidden="true" />
            <span>{showMonuments ? `Monuments (${activeMonuments.length})` : "Monuments Off"}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAllEvents(!showAllEvents)}
            className={`px-2.5 py-1 rounded border text-[11px] font-sans flex items-center gap-1.5 transition-colors ${
              showAllEvents
                ? "bg-archival-gold text-white border-archival-gold"
                : "bg-archival-bg text-archival-ink border-archival-border hover:bg-archival-surface"
            }`}
            title="Toggle between all historical events or events within ±25 years of the selected date"
          >
            <Filter className="w-3 h-3" aria-hidden="true" />
            <span>{showAllEvents ? "All Events" : `Era Events (${displayedEvents.length})`}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAiInquiry(!showAiInquiry)}
            className="px-2.5 py-1 rounded border border-archival-gold text-[11px] font-sans font-medium text-archival-gold hover:bg-archival-gold/10 flex items-center gap-1.5 transition-colors"
            title="Open Historical AI Inquiry Scholar"
          >
            <Sparkles className="w-3 h-3 text-archival-gold" aria-hidden="true" />
            <span>AI Scholar</span>
          </button>
        </div>
      </div>

      {/* AI Inquiry Drawer if active */}
      {showAiInquiry && (
        <HistoricalInquiryWidget
          currentYear={selectedYear}
          activePolities={activePolities.map((p) => p.canonicalName)}
          onClose={() => setShowAiInquiry(false)}
        />
      )}

      {/* Map and Detail Drawer Layout */}
      <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Map Canvas (2 cols on large screens) */}
        <div className="lg:col-span-2 h-[480px] sm:h-[540px] w-full relative">
          <HistoricalMap
            territories={activeTerritories}
            events={displayedEvents}
            routes={activeRoutes}
            monuments={activeMonuments}
            selectedTerritoryId={selectedTerritory?.id}
            selectedEventId={selectedEvent?.id}
            selectedRouteId={selectedRoute?.id}
            selectedMonumentId={selectedMonument?.id}
            onSelectTerritory={(t) => {
              setSelectedTerritory(t);
              setSelectedEvent(null);
              setSelectedRoute(null);
              setSelectedMonument(null);
            }}
            onSelectEvent={(e) => {
              setSelectedEvent(e);
              setSelectedTerritory(null);
              setSelectedRoute(null);
              setSelectedMonument(null);
            }}
            onSelectRoute={(r) => {
              setSelectedRoute(r);
              setSelectedTerritory(null);
              setSelectedEvent(null);
              setSelectedMonument(null);
            }}
            onSelectMonument={(m) => {
              setSelectedMonument(m);
              setSelectedTerritory(null);
              setSelectedEvent(null);
              setSelectedRoute(null);
            }}
          />

          {/* Map Overlay Prompt & Legend */}
          <div className="absolute bottom-3 left-3 z-[400] bg-archival-surface/90 backdrop-blur-sm border border-archival-border/80 px-3 py-1.5 rounded-lg text-xs text-archival-muted flex flex-wrap items-center gap-3 shadow-sm">
            <span className="flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-archival-gold" aria-hidden="true" />
              <span>Polygon: Territory</span>
            </span>
            <span className="text-archival-border">•</span>
            <span className="flex items-center gap-1">
              <Swords className="w-3.5 h-3.5 text-red-600" aria-hidden="true" />
              <span>Circle: Event</span>
            </span>
            {showRoutes && (
              <>
                <span className="text-archival-border">•</span>
                <span className="flex items-center gap-1">
                  <Navigation className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
                  <span>Dashed: Trade Route</span>
                </span>
              </>
            )}
            {showMonuments && (
              <>
                <span className="text-archival-border">•</span>
                <span className="flex items-center gap-1">
                  <Landmark className="w-3.5 h-3.5 text-purple-600" aria-hidden="true" />
                  <span>Purple: Monument</span>
                </span>
              </>
            )}
          </div>
        </div>

        {/* Territory, Event, Route & Monument Inspection Drawer */}
        <div className="lg:col-span-1 w-full space-y-4">
          {selectedMonument ? (
            <MonumentDetailPanel
              monument={selectedMonument}
              onClose={() => setSelectedMonument(null)}
            />
          ) : selectedRoute ? (
            <RouteDetailPanel
              route={selectedRoute}
              onClose={() => setSelectedRoute(null)}
            />
          ) : selectedEvent ? (
            <EventDetailPanel
              event={selectedEvent}
              onClose={() => setSelectedEvent(null)}
            />
          ) : selectedTerritory ? (
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
                Historical Inspector
              </h3>
              <p className="text-xs text-archival-muted leading-relaxed">
                Click any territory polygon, battle marker, monument, or trade route on the map to inspect evidence, architectural features, rulers, and scholarly sources.
              </p>
              <div className="pt-3 border-t border-archival-border/60 text-[11px] text-archival-muted space-y-1.5 text-left">
                <p>• <strong>Dashed borders:</strong> Approximate / disputed zones.</p>
                <p>• <strong>Solid borders:</strong> Directly administered territories.</p>
                <p>• <strong>Event circles:</strong> Decisive battles, conquests, and foundations.</p>
                <p>• <strong>Caravan lines:</strong> Ancient trade corridors and Hajj highways.</p>
                <p>• <strong>Purple circles:</strong> Monuments, libraries, and universities.</p>
              </div>
            </div>
          )}

          {/* Quick Era Events List */}
          {displayedEvents.length > 0 && (
            <div className="bg-archival-surface border border-archival-border rounded-xl p-4 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-serif font-semibold text-archival-ink">
                <span className="flex items-center gap-1.5">
                  <Swords className="w-3.5 h-3.5 text-archival-gold" aria-hidden="true" />
                  <span>Era Events ({displayedEvents.length})</span>
                </span>
                <span className="text-[10px] text-archival-muted font-sans">
                  {showAllEvents ? "All 632–1000 CE" : `±25y of ${selectedYear} CE`}
                </span>
              </div>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {displayedEvents.map((ev) => (
                  <button
                    key={ev.id}
                    type="button"
                    onClick={() => {
                      setSelectedEvent(ev);
                      setSelectedTerritory(null);
                      setSelectedRoute(null);
                    }}
                    className={`w-full text-left p-2 rounded text-xs transition-colors border ${
                      selectedEvent?.id === ev.id
                        ? "bg-archival-gold/10 border-archival-gold text-archival-ink"
                        : "bg-archival-bg hover:bg-archival-border/40 border-archival-border/40 text-archival-muted"
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-[11px]">
                      <span className="font-semibold text-archival-ink truncate mr-2">{ev.title}</span>
                      <span className="text-archival-gold shrink-0">{formatHistoricalYear(ev.eventYear)}</span>
                    </div>
                    <div className="text-[10px] text-archival-muted truncate mt-0.5 capitalize">
                      {ev.eventType} • {ev.locationName || "Recorded site"}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function AtlasExplorer(props: AtlasExplorerProps) {
  return (
    <Suspense
      fallback={
        <div className="w-full h-96 rounded-xl border border-archival-border bg-archival-surface flex items-center justify-center text-archival-muted font-serif text-sm">
          Loading Atlas Explorer...
        </div>
      }
    >
      <AtlasExplorerContent {...props} />
    </Suspense>
  );
}
