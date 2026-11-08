"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { YearSlider } from "@/components/timeline/YearSlider";
import { TerritoryDetailPanel } from "@/components/atlas/TerritoryDetailPanel";
import { EventDetailPanel } from "@/components/atlas/EventDetailPanel";
import { RouteDetailPanel } from "@/components/atlas/RouteDetailPanel";
import { MonumentDetailPanel } from "@/components/atlas/MonumentDetailPanel";
import { CampaignDetailPanel } from "@/components/atlas/CampaignDetailPanel";
import { HistoricalInquiryWidget } from "@/components/atlas/HistoricalInquiryWidget";
import { ExportModal } from "@/components/atlas/ExportModal";
import { DiscrepancyInspectorModal } from "@/components/atlas/DiscrepancyInspectorModal";
import {
  initialTerritoryPeriods,
  initialPolities,
  initialHistoricalEvents,
  initialTradeRoutes,
  initialMonuments,
  initialCampaigns,
} from "@/lib/data/historicalSeed";
import {
  initialHistoricalDiscrepancies,
  type HistoricalDiscrepancy,
} from "@/lib/data/discrepanciesSeed";
import { filterActiveTerritories } from "@/lib/geo/territoryUtils";
import type { TerritoryPeriodRecord } from "@/lib/db/schema/territoryPeriods";
import type { HistoricalEventRecord } from "@/lib/db/schema/historicalEvents";
import type { TradeRouteRecord } from "@/lib/db/schema/tradeRoutes";
import type { NewMonumentRecord } from "@/lib/db/schema/monuments";
import type { NewCampaignRecord } from "@/lib/db/schema/campaigns";
import { formatHistoricalYear } from "@/lib/utils";
import {
  Layers,
  MapPin,
  Info,
  Swords,
  Sparkles,
  Filter,
  Navigation,
  Landmark,
  ShieldAlert,
  Share2,
  Download,
  Check,
  AlertTriangle,
  BookOpen,
} from "lucide-react";

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

  const defaultYear =
    parsedParamYear && !isNaN(parsedParamYear) ? parsedParamYear : initialYear || 750;

  const [selectedYear, setSelectedYear] = useState<number>(defaultYear);
  const [selectedTerritory, setSelectedTerritory] = useState<TerritoryPeriodRecord | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<HistoricalEventRecord | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<
    (Omit<TradeRouteRecord, "createdAt"> & { createdAt?: Date }) | null
  >(null);
  const [selectedMonument, setSelectedMonument] = useState<
    (Omit<NewMonumentRecord, "createdAt"> & { createdAt?: Date }) | null
  >(null);
  const [selectedCampaign, setSelectedCampaign] = useState<
    (Omit<NewCampaignRecord, "createdAt"> & { createdAt?: Date }) | null
  >(null);
  const [selectedDiscrepancy, setSelectedDiscrepancy] = useState<HistoricalDiscrepancy | null>(null);

  const [showAllEvents, setShowAllEvents] = useState<boolean>(false);
  const [showRoutes, setShowRoutes] = useState<boolean>(true);
  const [showMonuments, setShowMonuments] = useState<boolean>(true);
  const [showCampaigns, setShowCampaigns] = useState<boolean>(true);
  const [showDiscrepancies, setShowDiscrepancies] = useState<boolean>(true);
  const [showAiInquiry, setShowAiInquiry] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isDiscrepancyModalOpen, setIsDiscrepancyModalOpen] = useState<boolean>(false);
  const [copiedShareLink, setCopiedShareLink] = useState<boolean>(false);

  // Sync state from URL parameters on initial mount
  useEffect(() => {
    if (!searchParams) return;

    // Layers
    const routesParam = searchParams.get("routes");
    if (routesParam === "0") setShowRoutes(false);
    else if (routesParam === "1") setShowRoutes(true);

    const monParam = searchParams.get("monuments");
    if (monParam === "0") setShowMonuments(false);
    else if (monParam === "1") setShowMonuments(true);

    const campParam = searchParams.get("campaigns");
    if (campParam === "0") setShowCampaigns(false);
    else if (campParam === "1") setShowCampaigns(true);

    const discParam = searchParams.get("discrepancies");
    if (discParam === "0") setShowDiscrepancies(false);
    else if (discParam === "1") setShowDiscrepancies(true);

    const eventsParam = searchParams.get("events");
    if (eventsParam === "all") setShowAllEvents(true);
    else if (eventsParam === "era") setShowAllEvents(false);

    // Entity inspection deep link
    const entityParam = searchParams.get("entity");
    const idParam = searchParams.get("id");
    const discrepancyParam = searchParams.get("discrepancy");

    if (discrepancyParam || (entityParam === "discrepancy" && idParam)) {
      const targetId = discrepancyParam || idParam;
      const found = initialHistoricalDiscrepancies.find((d) => d.id === targetId);
      if (found) {
        setSelectedDiscrepancy(found);
        setIsDiscrepancyModalOpen(true);
      }
    } else if (entityParam && idParam) {
      if (entityParam === "campaign") {
        const found = initialCampaigns.find((c) => c.id === idParam);
        if (found) setSelectedCampaign(found);
      } else if (entityParam === "monument") {
        const found = initialMonuments.find((m) => m.id === idParam);
        if (found) setSelectedMonument(found);
      } else if (entityParam === "route") {
        const found = initialTradeRoutes.find((r) => r.id === idParam);
        if (found) setSelectedRoute(found);
      } else if (entityParam === "event") {
        const found = initialHistoricalEvents.find((e) => e.id === idParam);
        if (found) setSelectedEvent(found);
      } else if (entityParam === "territory") {
        const found = initialTerritoryPeriods.find((t) => t.id === idParam);
        if (found) setSelectedTerritory(found);
      }
    }
  }, [searchParams]);

  // Synchronize state changes smoothly to URL query string without reloading page
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams();
    params.set("year", selectedYear.toString());
    if (!showRoutes) params.set("routes", "0");
    if (!showMonuments) params.set("monuments", "0");
    if (!showCampaigns) params.set("campaigns", "0");
    if (!showDiscrepancies) params.set("discrepancies", "0");
    if (showAllEvents) params.set("events", "all");

    if (selectedDiscrepancy) {
      params.set("entity", "discrepancy");
      params.set("id", selectedDiscrepancy.id);
    } else if (selectedCampaign) {
      params.set("entity", "campaign");
      params.set("id", selectedCampaign.id);
    } else if (selectedMonument) {
      params.set("entity", "monument");
      params.set("id", selectedMonument.id);
    } else if (selectedRoute) {
      params.set("entity", "route");
      params.set("id", selectedRoute.id);
    } else if (selectedEvent) {
      params.set("entity", "event");
      params.set("id", selectedEvent.id);
    } else if (selectedTerritory) {
      params.set("entity", "territory");
      params.set("id", selectedTerritory.id);
    }

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", newUrl);
  }, [
    selectedYear,
    showRoutes,
    showMonuments,
    showCampaigns,
    showDiscrepancies,
    showAllEvents,
    selectedDiscrepancy,
    selectedCampaign,
    selectedMonument,
    selectedRoute,
    selectedEvent,
    selectedTerritory,
  ]);

  // Copy shareable view URL to clipboard
  const handleShareView = async () => {
    if (typeof window === "undefined") return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedShareLink(true);
      setTimeout(() => setCopiedShareLink(false), 2500);
    } catch {
      // Fallback
    }
  };

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

  // Filter active military campaigns during selected year
  const activeCampaigns = useMemo(() => {
    if (!showCampaigns) return [];
    return initialCampaigns.filter(
      (c) => c.startYear <= selectedYear && c.endYear >= selectedYear
    );
  }, [selectedYear, showCampaigns]);

  // Filter active historical discrepancies during selected year
  const activeDiscrepancies = useMemo(() => {
    if (!showDiscrepancies) return [];
    return initialHistoricalDiscrepancies.filter(
      (d) => d.activeFromYear <= selectedYear && d.activeToYear >= selectedYear
    );
  }, [selectedYear, showDiscrepancies]);

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

      {/* Concurrent Polities & Layer Controls */}
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
                {polity.canonicalName} ({formatHistoricalYear(polity.startYear)}–
                {polity.endYear ? formatHistoricalYear(polity.endYear) : "present"})
              </span>
            ))
          )}
        </div>

        {/* Action Buttons: Layers, Citations, Share & Export */}
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
            onClick={() => setShowCampaigns(!showCampaigns)}
            className={`px-2.5 py-1 rounded border text-[11px] font-sans flex items-center gap-1.5 transition-colors ${
              showCampaigns
                ? "bg-red-700 text-white border-red-800"
                : "bg-archival-bg text-archival-ink border-archival-border hover:bg-archival-surface"
            }`}
            title="Toggle military expeditions and campaign marches on map"
          >
            <ShieldAlert className="w-3 h-3" aria-hidden="true" />
            <span>{showCampaigns ? `Campaigns (${activeCampaigns.length})` : "Campaigns Off"}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowDiscrepancies(!showDiscrepancies)}
            className={`px-2.5 py-1 rounded border text-[11px] font-sans flex items-center gap-1.5 transition-colors ${
              showDiscrepancies
                ? "bg-amber-600 text-white border-amber-700"
                : "bg-archival-bg text-archival-ink border-archival-border hover:bg-archival-surface"
            }`}
            title="Toggle contested borderlands and historiographical uncertainty overlays"
          >
            <AlertTriangle className="w-3 h-3" aria-hidden="true" />
            <span>{showDiscrepancies ? `Contested (${activeDiscrepancies.length})` : "Contested Off"}</span>
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

          <button
            type="button"
            onClick={handleShareView}
            className="px-2.5 py-1 rounded border border-archival-border bg-archival-bg hover:bg-archival-surface text-[11px] font-sans font-medium text-archival-ink flex items-center gap-1.5 transition-colors"
            title="Copy shareable deep link with current year and active layers"
          >
            {copiedShareLink ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" aria-hidden="true" />
                <span className="text-emerald-700">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3 h-3 text-archival-gold" aria-hidden="true" />
                <span>Share View</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsExportModalOpen(true)}
            className="px-2.5 py-1 rounded border border-archival-border bg-archival-bg hover:bg-archival-surface text-[11px] font-sans font-medium text-archival-ink flex items-center gap-1.5 transition-colors"
            title="Export cartographic snapshot as GeoJSON and academic citations"
          >
            <Download className="w-3 h-3 text-archival-gold" aria-hidden="true" />
            <span>Export Data</span>
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

      {/* Cartographic Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        year={selectedYear}
        activeTerritories={activeTerritories}
        activeRoutes={activeRoutes}
        activeMonuments={activeMonuments}
        activeCampaigns={activeCampaigns}
        displayedEvents={displayedEvents}
        activePolities={activePolities}
      />

      {/* Discrepancy & Uncertainty Inspector Modal */}
      <DiscrepancyInspectorModal
        discrepancy={selectedDiscrepancy}
        isOpen={isDiscrepancyModalOpen}
        onClose={() => {
          setIsDiscrepancyModalOpen(false);
          setSelectedDiscrepancy(null);
        }}
      />

      {/* Map and Detail Drawer Layout */}
      <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Map Canvas (2 cols on large screens) */}
        <div className="lg:col-span-2 h-[480px] sm:h-[540px] w-full relative">
          <HistoricalMap
            territories={activeTerritories}
            events={displayedEvents}
            routes={activeRoutes}
            monuments={activeMonuments}
            campaigns={activeCampaigns}
            discrepancies={activeDiscrepancies}
            selectedTerritoryId={selectedTerritory?.id}
            selectedEventId={selectedEvent?.id}
            selectedRouteId={selectedRoute?.id}
            selectedMonumentId={selectedMonument?.id}
            selectedCampaignId={selectedCampaign?.id}
            selectedDiscrepancyId={selectedDiscrepancy?.id}
            onSelectTerritory={(t) => {
              setSelectedTerritory(t);
              setSelectedEvent(null);
              setSelectedRoute(null);
              setSelectedMonument(null);
              setSelectedCampaign(null);
              setSelectedDiscrepancy(null);
            }}
            onSelectEvent={(e) => {
              setSelectedEvent(e);
              setSelectedTerritory(null);
              setSelectedRoute(null);
              setSelectedMonument(null);
              setSelectedCampaign(null);
              setSelectedDiscrepancy(null);
            }}
            onSelectRoute={(r) => {
              setSelectedRoute(r);
              setSelectedTerritory(null);
              setSelectedEvent(null);
              setSelectedMonument(null);
              setSelectedCampaign(null);
              setSelectedDiscrepancy(null);
            }}
            onSelectMonument={(m) => {
              setSelectedMonument(m);
              setSelectedTerritory(null);
              setSelectedEvent(null);
              setSelectedRoute(null);
              setSelectedCampaign(null);
              setSelectedDiscrepancy(null);
            }}
            onSelectCampaign={(c) => {
              setSelectedCampaign(c);
              setSelectedTerritory(null);
              setSelectedEvent(null);
              setSelectedRoute(null);
              setSelectedMonument(null);
              setSelectedDiscrepancy(null);
            }}
            onSelectDiscrepancy={(d) => {
              setSelectedDiscrepancy(d);
              setIsDiscrepancyModalOpen(true);
              setSelectedTerritory(null);
              setSelectedEvent(null);
              setSelectedRoute(null);
              setSelectedMonument(null);
              setSelectedCampaign(null);
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
            {showCampaigns && (
              <>
                <span className="text-archival-border">•</span>
                <span className="flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-red-600" aria-hidden="true" />
                  <span>Red: Campaign</span>
                </span>
              </>
            )}
            {showDiscrepancies && (
              <>
                <span className="text-archival-border">•</span>
                <span className="flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
                  <span>Dashed Amber: Contested Frontier</span>
                </span>
              </>
            )}
          </div>
        </div>

        {/* Territory, Event, Route, Monument, Campaign & Discrepancy Inspection Drawer */}
        <div className="lg:col-span-1 w-full space-y-4">
          {selectedDiscrepancy ? (
            <div className="bg-archival-surface border border-amber-300 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-amber-800 font-serif font-bold text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Historiographical Discrepancy</span>
              </div>
              <h4 className="font-serif font-bold text-base text-archival-ink">
                {selectedDiscrepancy.title}
              </h4>
              <p className="text-xs text-archival-muted leading-relaxed">
                {selectedDiscrepancy.historiographicalSummary}
              </p>
              <button
                type="button"
                onClick={() => setIsDiscrepancyModalOpen(true)}
                className="w-full py-2 px-3 rounded-lg bg-amber-600 text-white font-medium text-xs hover:bg-amber-700 transition-colors flex items-center justify-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Examine Conflicting Sources ({selectedDiscrepancy.perspectives.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedDiscrepancy(null)}
                className="w-full py-1.5 px-3 rounded-lg border border-archival-border text-archival-muted font-medium text-xs hover:bg-archival-bg transition-colors"
              >
                Dismiss
              </button>
            </div>
          ) : selectedCampaign ? (
            <CampaignDetailPanel
              campaign={selectedCampaign}
              onClose={() => setSelectedCampaign(null)}
            />
          ) : selectedMonument ? (
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
                Click any territory polygon, battle marker, monument, trade route, military campaign, or contested buffer zone on the map to inspect evidence, commanders, architectural features, and conflicting scholarly sources.
              </p>
              <div className="pt-3 border-t border-archival-border/60 text-[11px] text-archival-muted space-y-1.5 text-left">
                <p>• <strong>Dashed borders:</strong> Approximate / disputed zones.</p>
                <p>• <strong>Solid borders:</strong> Directly administered territories.</p>
                <p>• <strong>Event circles:</strong> Decisive battles, conquests, and foundations.</p>
                <p>• <strong>Caravan lines:</strong> Ancient trade corridors and Hajj highways.</p>
                <p>• <strong>Purple circles:</strong> Monuments, libraries, and universities.</p>
                <p>• <strong>Red dashed vectors:</strong> Military campaigns and expedition marches.</p>
                <p>• <strong>Dashed amber:</strong> Disputed frontier buffer zones and conflicting claims.</p>
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
                      setSelectedMonument(null);
                      setSelectedCampaign(null);
                      setSelectedDiscrepancy(null);
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
