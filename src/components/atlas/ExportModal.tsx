"use client";

import React, { useState, useEffect } from "react";
import { X, Download, Copy, Check, FileJson, BookOpen, Layers, Info } from "lucide-react";
import {
  generateAtlasGeoJSON,
  generateAcademicCitation,
  downloadJsonFile,
  type AnyPolity,
} from "@/lib/geo/exportUtils";
import type { TerritoryPeriodRecord } from "@/lib/db/schema/territoryPeriods";
import type { HistoricalEventRecord } from "@/lib/db/schema/historicalEvents";
import type { TradeRouteRecord } from "@/lib/db/schema/tradeRoutes";
import type { NewMonumentRecord } from "@/lib/db/schema/monuments";
import type { NewCampaignRecord } from "@/lib/db/schema/campaigns";
import { formatHistoricalYear } from "@/lib/utils";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  year: number;
  activeTerritories: TerritoryPeriodRecord[];
  activeRoutes: (Omit<TradeRouteRecord, "createdAt"> & { createdAt?: Date })[];
  activeMonuments: (Omit<NewMonumentRecord, "createdAt"> & { createdAt?: Date })[];
  activeCampaigns: (Omit<NewCampaignRecord, "createdAt"> & { createdAt?: Date })[];
  displayedEvents: HistoricalEventRecord[];
  activePolities: AnyPolity[];
}

export function ExportModal({
  isOpen,
  onClose,
  year,
  activeTerritories,
  activeRoutes,
  activeMonuments,
  activeCampaigns,
  displayedEvents,
  activePolities,
}: ExportModalProps) {
  const [copiedType, setCopiedType] = useState<"chicago" | "bibtex" | null>(null);

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const geojsonData = generateAtlasGeoJSON({
    year,
    territories: activeTerritories,
    routes: activeRoutes,
    monuments: activeMonuments,
    campaigns: activeCampaigns,
    events: displayedEvents,
    activePolities,
  });

  const citations = generateAcademicCitation({
    year,
    activePolities: activePolities.map((p) => p.canonicalName),
  });

  const formattedYear = formatHistoricalYear(year);

  const handleDownloadGeoJSON = () => {
    downloadJsonFile(`islamic-history-atlas-${year}CE.geojson`, geojsonData);
  };

  const handleDownloadMetadata = () => {
    const metadataBundle = {
      ...geojsonData.metadata,
      citations,
      layerCounts: {
        territories: activeTerritories.length,
        tradeRoutes: activeRoutes.length,
        monuments: activeMonuments.length,
        campaigns: activeCampaigns.length,
        events: displayedEvents.length,
      },
    };
    downloadJsonFile(`islamic-history-atlas-metadata-${year}CE.json`, metadataBundle);
  };

  const handleCopy = async (text: string, type: "chicago" | "bibtex") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-dialog-title"
      onClick={onClose}
    >
      <div
        className="bg-archival-surface border border-archival-border rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden text-archival-ink"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-archival-border bg-archival-bg">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-archival-gold/15 text-archival-gold flex items-center justify-center font-bold">
              <Download className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <h2
                id="export-dialog-title"
                className="font-serif font-bold text-base text-archival-ink"
              >
                Cartographic Export & Academic Citations
              </h2>
              <p className="text-xs text-archival-muted">
                Historical snapshot for {formattedYear} ({geojsonData.features.length} active features)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-archival-muted hover:text-archival-ink hover:bg-archival-border/30 transition-colors"
            aria-label="Close export dialog"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Summary Metric Cards */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-archival-muted mb-2 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-archival-gold" aria-hidden="true" />
              <span>Snapshot Contents ({formattedYear})</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-lg border border-archival-border bg-archival-bg">
                <span className="block text-base font-bold font-mono text-archival-ink">
                  {activeTerritories.length}
                </span>
                <span className="text-[11px] text-archival-muted">Territories</span>
              </div>
              <div className="p-2.5 rounded-lg border border-archival-border bg-archival-bg">
                <span className="block text-base font-bold font-mono text-amber-700">
                  {activeRoutes.length}
                </span>
                <span className="text-[11px] text-archival-muted">Routes</span>
              </div>
              <div className="p-2.5 rounded-lg border border-archival-border bg-archival-bg">
                <span className="block text-base font-bold font-mono text-purple-700">
                  {activeMonuments.length}
                </span>
                <span className="text-[11px] text-archival-muted">Monuments</span>
              </div>
              <div className="p-2.5 rounded-lg border border-archival-border bg-archival-bg">
                <span className="block text-base font-bold font-mono text-red-700">
                  {activeCampaigns.length}
                </span>
                <span className="text-[11px] text-archival-muted">Campaigns</span>
              </div>
              <div className="p-2.5 rounded-lg border border-archival-border bg-archival-bg col-span-2 sm:col-span-1">
                <span className="block text-base font-bold font-mono text-archival-gold">
                  {displayedEvents.length}
                </span>
                <span className="text-[11px] text-archival-muted">Events</span>
              </div>
            </div>
          </div>

          {/* Download Buttons */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-archival-muted flex items-center gap-1.5">
              <FileJson className="w-3.5 h-3.5 text-archival-gold" aria-hidden="true" />
              <span>GIS & Data Formats</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* GeoJSON Download */}
              <div className="p-4 rounded-xl border border-archival-border bg-archival-bg flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <span className="text-xs font-bold font-mono text-archival-ink block">
                    Standard GeoJSON (.geojson)
                  </span>
                  <p className="text-[11px] text-archival-muted leading-relaxed">
                    RFC 7946 compliant FeatureCollection containing polygon boundaries, caravan lines, points, and source citations.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadGeoJSON}
                  className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-archival-ink text-archival-surface hover:bg-stone-800 text-xs font-medium transition-colors shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Download GeoJSON</span>
                </button>
              </div>

              {/* JSON Metadata Bundle */}
              <div className="p-4 rounded-xl border border-archival-border bg-archival-bg flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <span className="text-xs font-bold font-mono text-archival-ink block">
                    Scholarly Metadata Bundle (.json)
                  </span>
                  <p className="text-[11px] text-archival-muted leading-relaxed">
                    Complete historical attribution metadata, primary sources catalog (Kennedy, Bosworth, EI2), and citations.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadMetadata}
                  className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-archival-border bg-archival-surface hover:bg-archival-border/20 text-archival-ink text-xs font-medium transition-colors"
                >
                  <FileJson className="w-3.5 h-3.5 text-archival-gold" aria-hidden="true" />
                  <span>Download Metadata JSON</span>
                </button>
              </div>
            </div>
          </div>

          {/* Academic Citations */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-archival-muted flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-archival-gold" aria-hidden="true" />
              <span>Academic Citations</span>
            </h3>

            {/* Chicago Style */}
            <div className="p-3.5 rounded-xl border border-archival-border bg-archival-bg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold font-serif text-archival-ink">
                  Chicago Manual of Style (17th ed.)
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(citations.chicago, "chicago")}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-sans font-medium border border-archival-border bg-archival-surface hover:bg-archival-border/30 text-archival-ink transition-colors"
                  aria-label="Copy Chicago citation to clipboard"
                >
                  {copiedType === "chicago" ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" aria-hidden="true" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-archival-muted" aria-hidden="true" />
                      <span>Copy Citation</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs font-serif text-archival-muted leading-relaxed select-all bg-archival-surface p-2.5 rounded border border-archival-border/60">
                {citations.chicago}
              </p>
            </div>

            {/* BibTeX */}
            <div className="p-3.5 rounded-xl border border-archival-border bg-archival-bg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold font-serif text-archival-ink">
                  BibTeX Entry
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(citations.bibtex, "bibtex")}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-sans font-medium border border-archival-border bg-archival-surface hover:bg-archival-border/30 text-archival-ink transition-colors"
                  aria-label="Copy BibTeX citation to clipboard"
                >
                  {copiedType === "bibtex" ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" aria-hidden="true" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-archival-muted" aria-hidden="true" />
                      <span>Copy BibTeX</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="text-[11px] font-mono text-archival-muted bg-archival-surface p-2.5 rounded border border-archival-border/60 overflow-x-auto select-all">
                {citations.bibtex}
              </pre>
            </div>
          </div>

          {/* Legal / ODbL Attribution Notice */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-archival-gold/10 border border-archival-gold/30 text-[11px] text-archival-ink">
            <Info className="w-4 h-4 text-archival-gold shrink-0 mt-0.5" aria-hidden="true" />
            <p className="leading-relaxed">
              Historical cartographic data is provided under the Open Database License (ODbL) for research, academic, and non-commercial educational purposes. Please cite the Islamic History Atlas and underlying primary source registers in scholarly publications.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-archival-bg border-t border-archival-border flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-archival-border bg-archival-surface hover:bg-archival-border/30 text-xs font-medium text-archival-ink transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
