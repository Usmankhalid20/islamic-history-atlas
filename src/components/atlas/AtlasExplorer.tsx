"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { YearSlider } from "@/components/timeline/YearSlider";
import { TerritoryDetailPanel } from "@/components/atlas/TerritoryDetailPanel";
import { EmpireDetailPanel } from "@/components/atlas/EmpireDetailPanel";
import { EventDetailPanel } from "@/components/atlas/EventDetailPanel";
import { RouteDetailPanel } from "@/components/atlas/RouteDetailPanel";
import { MonumentDetailPanel } from "@/components/atlas/MonumentDetailPanel";
import { CampaignDetailPanel } from "@/components/atlas/CampaignDetailPanel";
import { CityDetailPanel } from "@/components/atlas/CityDetailPanel";
import { HistoricalInquiryWidget } from "@/components/atlas/HistoricalInquiryWidget";
import { ExportModal } from "@/components/atlas/ExportModal";
import { DiscrepancyInspectorModal } from "@/components/atlas/DiscrepancyInspectorModal";
import type { NewPolityRecord } from "@/lib/db/schema/polities";
import {
  initialTerritoryPeriods,
  initialPolities,
  initialHistoricalEvents,
  initialTradeRoutes,
  initialMonuments,
  initialCampaigns,
} from "@/lib/data/historicalSeed";
import { HISTORICAL_CITIES, type HistoricalCity } from "@/lib/data/historicalCitiesSeed";
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
  ChevronDown,
  ChevronUp,
  Compass,
  Globe,
  Maximize2,
  Minimize2,
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
  pol_rashidun: "bg-emerald-100 text-emerald-900 border-emerald-300",
  pol_umayyad: "bg-teal-100 text-teal-950 border-teal-300",
  pol_abbasid_early: "bg-amber-100 text-amber-900 border-amber-300",
  pol_cordoba_emirate: "bg-emerald-100 text-emerald-900 border-emerald-300",
  pol_cordoba_caliphate: "bg-emerald-100 text-emerald-950 border-emerald-400",
  pol_fatimid: "bg-purple-100 text-purple-900 border-purple-300",
  pol_samanid: "bg-sky-100 text-sky-900 border-sky-300",
  pol_buyid: "bg-fuchsia-100 text-fuchsia-900 border-fuchsia-300",
  pol_ghaznavid: "bg-amber-950/15 text-amber-950 border-amber-900/30",
  pol_seljuk: "bg-blue-100 text-blue-900 border-blue-300",
  pol_almoravid: "bg-yellow-100 text-yellow-950 border-yellow-400",
  pol_almohad: "bg-orange-100 text-orange-950 border-orange-400",
  pol_ayyubid: "bg-emerald-100 text-emerald-950 border-emerald-400",
  pol_zengid: "bg-purple-100 text-purple-950 border-purple-300",
  pol_mamluk: "bg-rose-100 text-rose-900 border-rose-300",
  pol_mongol: "bg-slate-200 text-slate-900 border-slate-400",
  pol_delhi_sultanate: "bg-pink-100 text-pink-900 border-pink-300",
  pol_timurid: "bg-violet-100 text-violet-900 border-violet-300",
  pol_ottoman: "bg-red-100 text-red-950 border-red-400",
  pol_safavid: "bg-indigo-100 text-indigo-950 border-indigo-300",
  pol_mughal: "bg-orange-100 text-orange-900 border-orange-300",
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
  const [selectedPolity, setSelectedPolity] = useState<NewPolityRecord | null>(null);
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
  const [selectedCity, setSelectedCity] = useState<HistoricalCity | null>(null);

  const [showTerritories, setShowTerritories] = useState<boolean>(true);
  const [showEvents, setShowEvents] = useState<boolean>(true);
  const [showAllEvents, setShowAllEvents] = useState<boolean>(false);
  const [showRoutes, setShowRoutes] = useState<boolean>(true);
  const [showMonuments, setShowMonuments] = useState<boolean>(true);
  const [showCampaigns, setShowCampaigns] = useState<boolean>(true);
  const [showDiscrepancies, setShowDiscrepancies] = useState<boolean>(true);
  const [showCities, setShowCities] = useState<boolean>(true);
  const [showAiInquiry, setShowAiInquiry] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isDiscrepancyModalOpen, setIsDiscrepancyModalOpen] = useState<boolean>(false);
  const [copiedShareLink, setCopiedShareLink] = useState<boolean>(false);
  const [isTheaterMode, setIsTheaterMode] = useState<boolean>(false);
  const [territoryOpacity, setTerritoryOpacity] = useState<number>(0.5);

  // Sync state from URL parameters on initial mount
  useEffect(() => {
    if (!searchParams) return;

    // Layers
    const terParam = searchParams.get("territories");
    if (terParam === "0") setShowTerritories(false);
    else if (terParam === "1") setShowTerritories(true);

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

    const showEventsParam = searchParams.get("showEvents");
    if (showEventsParam === "0") setShowEvents(false);
    else if (showEventsParam === "1") setShowEvents(true);

    const eventsParam = searchParams.get("events");
    if (eventsParam === "all") setShowAllEvents(true);
    else if (eventsParam === "era") setShowAllEvents(false);

    const theaterParam = searchParams.get("theater");
    if (theaterParam === "1") setIsTheaterMode(true);

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
      } else if (entityParam === "polity") {
        const found = initialPolities.find((p) => p.id === idParam);
        if (found) setSelectedPolity(found);
      }
    }
  }, [searchParams]);

  // Synchronize state changes smoothly to URL query string without reloading page
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams();
    params.set("year", selectedYear.toString());
    if (!showTerritories) params.set("territories", "0");
    if (!showEvents) params.set("showEvents", "0");
    if (!showRoutes) params.set("routes", "0");
    if (!showMonuments) params.set("monuments", "0");
    if (!showCampaigns) params.set("campaigns", "0");
    if (!showDiscrepancies) params.set("discrepancies", "0");
    if (showAllEvents) params.set("events", "all");
    if (isTheaterMode) params.set("theater", "1");

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
    } else if (selectedPolity) {
      params.set("entity", "polity");
      params.set("id", selectedPolity.id);
    }

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", newUrl);
  }, [
    selectedYear,
    showTerritories,
    showEvents,
    showRoutes,
    showMonuments,
    showCampaigns,
    showDiscrepancies,
    showAllEvents,
    isTheaterMode,
    selectedDiscrepancy,
    selectedCampaign,
    selectedMonument,
    selectedRoute,
    selectedEvent,
    selectedTerritory,
    selectedPolity,
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
        minYear={500}
        maxYear={1980}
        onChange={(year) => {
          setSelectedYear(year);
          // If selected territory is no longer active in the new year, deselect it
          if (
            selectedTerritory &&
            (selectedTerritory.validFromYear > year || selectedTerritory.validToYear < year)
          ) {
            setSelectedTerritory(null);
          }
          if (
            selectedPolity &&
            (selectedPolity.startYear > year || (selectedPolity.endYear && selectedPolity.endYear < year))
          ) {
            setSelectedPolity(null);
          }
        }}
      />

      {/* Dynastic Context Banner */}
      <div
        className="bg-archival-surface/90 border border-archival-border rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-sm"
        role="status"
        aria-live="polite"
      >
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 text-archival-ink font-serif font-semibold">
            <Layers className="w-4 h-4 text-archival-gold" aria-hidden="true" />
            <span>Active Polities in {formatHistoricalYear(selectedYear)}:</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {activePolities.length === 0 ? (
              <span className="text-archival-muted italic text-[11px]">
                No recorded territorial claims in database for this specific year.
              </span>
            ) : (
              activePolities.map((polity) => (
                <button
                  key={polity.id}
                  type="button"
                  onClick={() => {
                    if (selectedPolity?.id === polity.id) {
                      setSelectedPolity(null);
                    } else {
                      setSelectedPolity(polity);
                      setSelectedTerritory(null);
                      setSelectedEvent(null);
                      setSelectedRoute(null);
                      setSelectedMonument(null);
                      setSelectedCampaign(null);
                      setSelectedDiscrepancy(null);
                      setSelectedCity(null);
                    }
                  }}
                  className={`px-2.5 py-0.5 rounded-full border text-[11px] font-medium font-sans cursor-pointer transition-all hover:scale-105 active:scale-95 ${
                    POLITY_BADGE_COLORS[polity.id] || "bg-gray-100 text-gray-800 border-gray-300"
                  } ${
                    selectedPolity?.id === polity.id
                      ? "ring-2 ring-archival-gold font-bold shadow-xs scale-105"
                      : "opacity-90 hover:opacity-100"
                  }`}
                  title={`Inspect empire profile: ${polity.canonicalName}`}
                >
                  <span className="mr-1">👑</span>
                  {polity.canonicalName} ({formatHistoricalYear(polity.startYear)}–
                  {polity.endYear ? formatHistoricalYear(polity.endYear) : "present"})
                </button>
              ))
            )}
          </div>
        </div>

        <div className="text-[11px] text-archival-muted font-sans hidden md:flex items-center gap-1.5 shrink-0">
          <span>Temporal Anchor:</span>
          <span className="font-mono font-semibold text-archival-gold bg-archival-bg px-2 py-0.5 rounded border border-archival-border">
            {formatHistoricalYear(selectedYear)}
          </span>
        </div>
      </div>

      {/* Cartographic Controls & Action Toolbar */}
      <div className="bg-archival-surface border border-archival-border rounded-xl p-3 flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs shadow-sm">
        {/* Left: Cartographic Layer Switches */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-archival-muted mr-1 hidden sm:inline">
            Layers:
          </span>

          <button
            type="button"
            onClick={() => setShowTerritories(!showTerritories)}
            className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-sans flex items-center gap-1.5 transition-all ${
              showTerritories
                ? "bg-amber-800 text-white border-amber-900 shadow-xs"
                : "bg-archival-bg text-archival-ink border-archival-border hover:bg-archival-surface"
            }`}
            title="Toggle empire territory polygons on map"
          >
            <Globe className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{showTerritories ? `Territories (${activeTerritories.length})` : "Territories Off"}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowRoutes(!showRoutes)}
            className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-sans flex items-center gap-1.5 transition-all ${
              showRoutes
                ? "bg-archival-gold text-white border-archival-gold shadow-xs"
                : "bg-archival-bg text-archival-ink border-archival-border hover:bg-archival-surface"
            }`}
            title="Toggle trade and pilgrimage routes on map"
          >
            <Navigation className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{showRoutes ? `Routes (${activeRoutes.length})` : "Routes Off"}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowMonuments(!showMonuments)}
            className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-sans flex items-center gap-1.5 transition-all ${
              showMonuments
                ? "bg-purple-700 text-white border-purple-800 shadow-xs"
                : "bg-archival-bg text-archival-ink border-archival-border hover:bg-archival-surface"
            }`}
            title="Toggle monuments and intellectual centers on map"
          >
            <Landmark className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{showMonuments ? `Monuments (${activeMonuments.length})` : "Monuments Off"}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowCampaigns(!showCampaigns)}
            className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-sans flex items-center gap-1.5 transition-all ${
              showCampaigns
                ? "bg-red-700 text-white border-red-800 shadow-xs"
                : "bg-archival-bg text-archival-ink border-archival-border hover:bg-archival-surface"
            }`}
            title="Toggle military expeditions and campaign marches on map"
          >
            <ShieldAlert className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{showCampaigns ? `Campaigns (${activeCampaigns.length})` : "Campaigns Off"}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowCities(!showCities)}
            className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-sans flex items-center gap-1.5 transition-all ${
              showCities
                ? "bg-stone-800 text-white border-stone-900 shadow-xs"
                : "bg-archival-bg text-archival-ink border-archival-border hover:bg-archival-surface"
            }`}
            title="Toggle imperial capitals and major historical cities on map"
          >
            <Compass className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{showCities ? `Capitals & Cities (${HISTORICAL_CITIES.length})` : "Cities Off"}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowDiscrepancies(!showDiscrepancies)}
            className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-sans flex items-center gap-1.5 transition-all ${
              showDiscrepancies
                ? "bg-amber-600 text-white border-amber-700 shadow-xs"
                : "bg-archival-bg text-archival-ink border-archival-border hover:bg-archival-surface"
            }`}
            title="Toggle contested borderlands and historiographical uncertainty overlays"
          >
            <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{showDiscrepancies ? `Contested (${activeDiscrepancies.length})` : "Contested Off"}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAllEvents(!showAllEvents)}
            className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-sans flex items-center gap-1.5 transition-all ${
              showAllEvents
                ? "bg-archival-gold text-white border-archival-gold shadow-xs"
                : "bg-archival-bg text-archival-ink border-archival-border hover:bg-archival-surface"
            }`}
            title="Toggle between all historical events or events within ±25 years of the selected date"
          >
            <Filter className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{showAllEvents ? "All Events" : `Era Events (${displayedEvents.length})`}</span>
          </button>
        </div>

        {/* Right: Analytical Tools & Action Utilities */}
        <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-archival-border">
          <button
            type="button"
            onClick={() => setIsTheaterMode(!isTheaterMode)}
            className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-sans font-medium flex items-center gap-1.5 transition-all ${
              isTheaterMode
                ? "bg-archival-gold text-white border-archival-gold shadow-xs"
                : "border-archival-border bg-archival-bg hover:bg-archival-surface text-archival-ink shadow-xs"
            }`}
            title={isTheaterMode ? "Exit theater mode (return to side-by-side layout)" : "Expand map canvas to theater mode"}
          >
            {isTheaterMode ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Exit Theater</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-archival-gold" aria-hidden="true" />
                <span>Theater View</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setShowAiInquiry(!showAiInquiry)}
            className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-sans font-medium flex items-center gap-1.5 transition-all ${
              showAiInquiry
                ? "bg-archival-gold text-white border-archival-gold shadow-xs"
                : "border-archival-gold text-archival-gold hover:bg-archival-gold/10"
            }`}
            title="Open Historical AI Inquiry Scholar"
          >
            <Sparkles className="w-3.5 h-3.5 text-current" aria-hidden="true" />
            <span>AI Scholar</span>
          </button>

          <button
            type="button"
            onClick={handleShareView}
            className="px-2.5 py-1.5 rounded-lg border border-archival-border bg-archival-bg hover:bg-archival-surface text-[11px] font-sans font-medium text-archival-ink flex items-center gap-1.5 transition-colors shadow-xs"
            title="Copy shareable deep link with current year and active layers"
          >
            {copiedShareLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                <span className="text-emerald-700">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-archival-gold" aria-hidden="true" />
                <span>Share</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsExportModalOpen(true)}
            className="px-2.5 py-1.5 rounded-lg border border-archival-border bg-archival-bg hover:bg-archival-surface text-[11px] font-sans font-medium text-archival-ink flex items-center gap-1.5 transition-colors shadow-xs"
            title="Export cartographic snapshot as GeoJSON and academic citations"
          >
            <Download className="w-3.5 h-3.5 text-archival-gold" aria-hidden="true" />
            <span>Export</span>
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
      <div
        className={`relative transition-all duration-300 ${
          isTheaterMode
            ? "flex flex-col gap-6"
            : "grid grid-cols-1 lg:grid-cols-3 gap-6 items-start"
        }`}
      >
        {/* Map Canvas */}
        <div
          className={`${
            isTheaterMode
              ? "w-full h-[76vh] min-h-[580px] max-h-[820px]"
              : "lg:col-span-2 h-[560px] sm:h-[620px] lg:h-[700px] xl:h-[740px] w-full"
          } relative rounded-xl overflow-hidden shadow-sm transition-all duration-300`}
        >
          <HistoricalMap
            territories={activeTerritories}
            events={displayedEvents}
            routes={activeRoutes}
            monuments={activeMonuments}
            campaigns={activeCampaigns}
            discrepancies={activeDiscrepancies}
            selectedTerritoryId={selectedTerritory?.id}
            selectedPolityId={selectedPolity?.id}
            selectedEventId={selectedEvent?.id}
            selectedRouteId={selectedRoute?.id}
            selectedMonumentId={selectedMonument?.id}
            selectedCampaignId={selectedCampaign?.id}
            selectedDiscrepancyId={selectedDiscrepancy?.id}
            selectedCityId={selectedCity?.id}
            selectedYear={selectedYear}
            onSelectTerritory={(t) => {
              setSelectedTerritory(t);
              setSelectedPolity(null);
              setSelectedEvent(null);
              setSelectedRoute(null);
              setSelectedMonument(null);
              setSelectedCampaign(null);
              setSelectedDiscrepancy(null);
              setSelectedCity(null);
            }}
            onSelectEvent={(e) => {
              setSelectedEvent(e);
              setSelectedPolity(null);
              setSelectedTerritory(null);
              setSelectedRoute(null);
              setSelectedMonument(null);
              setSelectedCampaign(null);
              setSelectedDiscrepancy(null);
              setSelectedCity(null);
            }}
            onSelectRoute={(r) => {
              setSelectedRoute(r);
              setSelectedPolity(null);
              setSelectedTerritory(null);
              setSelectedEvent(null);
              setSelectedMonument(null);
              setSelectedCampaign(null);
              setSelectedDiscrepancy(null);
              setSelectedCity(null);
            }}
            onSelectMonument={(m) => {
              setSelectedMonument(m);
              setSelectedPolity(null);
              setSelectedTerritory(null);
              setSelectedEvent(null);
              setSelectedRoute(null);
              setSelectedCampaign(null);
              setSelectedDiscrepancy(null);
              setSelectedCity(null);
            }}
            onSelectCampaign={(c) => {
              setSelectedCampaign(c);
              setSelectedPolity(null);
              setSelectedTerritory(null);
              setSelectedEvent(null);
              setSelectedRoute(null);
              setSelectedMonument(null);
              setSelectedDiscrepancy(null);
              setSelectedCity(null);
            }}
            onSelectDiscrepancy={(d) => {
              setSelectedDiscrepancy(d);
              setIsDiscrepancyModalOpen(true);
              setSelectedPolity(null);
              setSelectedTerritory(null);
              setSelectedEvent(null);
              setSelectedRoute(null);
              setSelectedMonument(null);
              setSelectedCampaign(null);
              setSelectedCity(null);
            }}
            onSelectCity={(city) => {
              setSelectedCity(city);
              setSelectedPolity(null);
              setSelectedTerritory(null);
              setSelectedEvent(null);
              setSelectedRoute(null);
              setSelectedMonument(null);
              setSelectedCampaign(null);
              setSelectedDiscrepancy(null);
            }}
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
            showCities={showCities}
            setShowCities={setShowCities}
            isTheaterMode={isTheaterMode}
            onToggleTheaterMode={() => setIsTheaterMode(!isTheaterMode)}
            territoryOpacity={territoryOpacity}
            setTerritoryOpacity={setTerritoryOpacity}
          />
        </div>

        {/* Territory, Event, Route, Monument, Campaign & Discrepancy Inspection Drawer */}
        <div
          className={`${
            isTheaterMode
              ? "grid grid-cols-1 md:grid-cols-2 gap-6 w-full"
              : "lg:col-span-1 w-full space-y-4"
          }`}
        >
          {selectedDiscrepancy ? (
            <div className="bg-archival-surface border border-amber-300 rounded-xl p-5 space-y-3 shadow-sm">
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
                className="w-full py-2 px-3 rounded-lg bg-amber-600 text-white font-medium text-xs hover:bg-amber-700 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
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
          ) : selectedPolity ? (
            <EmpireDetailPanel
              polity={selectedPolity}
              selectedYear={selectedYear}
              onClose={() => setSelectedPolity(null)}
              onSelectTerritory={(t) => {
                setSelectedTerritory(t);
                setSelectedPolity(null);
              }}
            />
          ) : selectedCity ? (
            <CityDetailPanel
              city={selectedCity}
              selectedYear={selectedYear}
              onClose={() => setSelectedCity(null)}
              onSelectPolity={(polityId) => {
                const found = initialPolities.find((p) => p.id === polityId);
                if (found) {
                  setSelectedCity(null);
                  setSelectedPolity(found);
                }
              }}
            />
          ) : selectedTerritory ? (
            <TerritoryDetailPanel
              territory={selectedTerritory}
              onClose={() => setSelectedTerritory(null)}
              onSelectPolity={(polity) => {
                setSelectedTerritory(null);
                setSelectedPolity(polity);
              }}
            />
          ) : (
            <div className="bg-archival-surface border border-archival-border rounded-xl p-5 space-y-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-archival-gold/10 border border-archival-gold/30 flex items-center justify-center shrink-0 text-archival-gold">
                  <MapPin className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-archival-ink text-base">
                    Cartographic Inspector
                  </h3>
                  <p className="text-[11px] text-archival-muted">
                    Primary evidence &amp; source citations
                  </p>
                </div>
              </div>

              <p className="text-xs text-archival-muted leading-relaxed">
                Click any territory polygon, battle marker, monument, trade corridor, or military campaign on the map to inspect evidence, commanders, and conflicting scholarly perspectives.
              </p>

              {/* Live Era Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-archival-border/60">
                <div className="bg-archival-bg p-2.5 rounded-lg border border-archival-border/60 flex flex-col">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-archival-muted">
                    Active Empires
                  </span>
                  <span className="text-lg font-serif font-bold text-archival-ink mt-0.5">
                    {activeTerritories.length}
                  </span>
                </div>
                <div className="bg-archival-bg p-2.5 rounded-lg border border-archival-border/60 flex flex-col">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-archival-muted">
                    Era Events
                  </span>
                  <span className="text-lg font-serif font-bold text-archival-ink mt-0.5">
                    {displayedEvents.length}
                  </span>
                </div>
                <div className="bg-archival-bg p-2.5 rounded-lg border border-archival-border/60 flex flex-col">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-archival-muted">
                    Trade Corridors
                  </span>
                  <span className="text-lg font-serif font-bold text-archival-ink mt-0.5">
                    {activeRoutes.length}
                  </span>
                </div>
                <div className="bg-archival-bg p-2.5 rounded-lg border border-archival-border/60 flex flex-col">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-archival-muted">
                    Campaigns
                  </span>
                  <span className="text-lg font-serif font-bold text-archival-ink mt-0.5">
                    {activeCampaigns.length}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Quick Era Events List */}
          {displayedEvents.length > 0 && (
            <div className="bg-archival-surface border border-archival-border rounded-xl p-4 space-y-3 shadow-sm">
              <div className="flex items-center justify-between pb-2 border-b border-archival-border/60 text-xs font-serif font-semibold text-archival-ink">
                <span className="flex items-center gap-1.5">
                  <Swords className="w-3.5 h-3.5 text-archival-gold" aria-hidden="true" />
                  <span>Era Events ({displayedEvents.length})</span>
                </span>
                <span className="text-[10px] text-archival-muted font-sans font-normal">
                  {showAllEvents ? "All 632–1000 CE" : `±25y of ${formatHistoricalYear(selectedYear)}`}
                </span>
              </div>
              <div className="space-y-2 max-h-60 sm:max-h-72 overflow-y-auto pr-1">
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
                    className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors border ${
                      selectedEvent?.id === ev.id
                        ? "bg-archival-gold/10 border-archival-gold text-archival-ink shadow-xs"
                        : "bg-archival-bg hover:bg-archival-border/30 border-archival-border/50 text-archival-muted"
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-[11px]">
                      <span className="font-semibold text-archival-ink truncate mr-2">{ev.title}</span>
                      <span className="text-archival-gold font-bold shrink-0">{formatHistoricalYear(ev.eventYear)}</span>
                    </div>
                    <div className="text-[10px] text-archival-muted truncate mt-1 capitalize flex items-center gap-1.5">
                      <span className="inline-block px-1.5 py-0.5 rounded bg-archival-surface border border-archival-border/60 font-sans">
                        {ev.eventType}
                      </span>
                      <span>{ev.locationName || "Recorded site"}</span>
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
