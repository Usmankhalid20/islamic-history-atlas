"use client";

import React, { useEffect } from "react";
import {
  X,
  AlertTriangle,
  BookOpen,
  MapPin,
  Layers,
  Sparkles,
  Info,
} from "lucide-react";
import type { HistoricalDiscrepancy } from "@/lib/data/discrepanciesSeed";
import { formatHistoricalYear } from "@/lib/utils";

interface DiscrepancyInspectorModalProps {
  discrepancy: HistoricalDiscrepancy | null;
  isOpen: boolean;
  onClose: () => void;
}

const TRADITION_BADGES: Record<string, { label: string; className: string }> = {
  early_arabic_chronicle: {
    label: "Early Arabic Futuh / Chronicle",
    className: "bg-amber-100 text-amber-900 border-amber-300",
  },
  byzantine_chronicle: {
    label: "Byzantine Greek Chronicle",
    className: "bg-blue-100 text-blue-900 border-blue-300",
  },
  latin_western: {
    label: "Latin / Mozarabic Chronicle",
    className: "bg-stone-200 text-stone-900 border-stone-400",
  },
  modern_peer_reviewed: {
    label: "Modern Peer-Reviewed Consensus",
    className: "bg-emerald-100 text-emerald-900 border-emerald-300",
  },
};

const CONFIDENCE_BADGES: Record<string, { label: string; className: string }> = {
  disputed: {
    label: "Historiographically Disputed",
    className: "bg-red-100 text-red-900 border-red-300",
  },
  approximate: {
    label: "Approximate Geographic Bounds",
    className: "bg-amber-100 text-amber-900 border-amber-300",
  },
  inferred: {
    label: "Inferred from Proxy Literature",
    className: "bg-purple-100 text-purple-900 border-purple-300",
  },
  conjectural: {
    label: "Conjectural Reconstruction",
    className: "bg-gray-100 text-gray-900 border-gray-300",
  },
};

export function DiscrepancyInspectorModal({
  discrepancy,
  isOpen,
  onClose,
}: DiscrepancyInspectorModalProps) {
  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !discrepancy) return null;

  const confInfo = CONFIDENCE_BADGES[discrepancy.confidenceRating] || {
    label: discrepancy.confidenceRating,
    className: "bg-gray-100 text-gray-800 border-gray-300",
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="discrepancy-title"
      onClick={onClose}
    >
      <div
        className="bg-archival-surface border border-archival-border rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden text-archival-ink"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-4 border-b border-archival-border bg-archival-bg">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle className="w-4 h-4" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded border ${confInfo.className}`}
                >
                  {confInfo.label}
                </span>
                <span className="text-[11px] font-mono font-semibold text-archival-muted">
                  {formatHistoricalYear(discrepancy.activeFromYear)} –{" "}
                  {formatHistoricalYear(discrepancy.activeToYear)}
                </span>
              </div>
              <h2
                id="discrepancy-title"
                className="font-serif font-bold text-lg text-archival-ink"
              >
                {discrepancy.title}
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-archival-muted">
                <MapPin className="w-3.5 h-3.5 text-archival-gold" aria-hidden="true" />
                <span>{discrepancy.regionName}</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-archival-muted hover:text-archival-ink hover:bg-archival-border/30 transition-colors"
            aria-label="Close discrepancy inspector"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Historiographical Context */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-archival-muted flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-archival-gold" aria-hidden="true" />
              <span>Historical Debate & Problem Statement</span>
            </h3>
            <p className="text-xs sm:text-sm text-archival-ink leading-relaxed font-serif bg-archival-bg p-3.5 rounded-lg border border-archival-border">
              {discrepancy.historiographicalSummary}
            </p>
          </div>

          {/* Divergent Primary Perspectives */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-archival-muted flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-archival-gold" aria-hidden="true" />
              <span>Conflicting Chronicler & Scholarly Perspectives</span>
            </h3>

            <div className="space-y-3">
              {discrepancy.perspectives.map((persp, idx) => {
                const badge = TRADITION_BADGES[persp.traditionOrSchool] || {
                  label: persp.traditionOrSchool,
                  className: "bg-gray-100 text-gray-800 border-gray-300",
                };
                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-archival-border bg-archival-bg space-y-2"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-serif font-bold text-xs text-archival-ink">
                        {persp.sourceOrScholar}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded border font-medium ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                    </div>

                    <p className="text-xs text-archival-muted leading-relaxed">
                      {persp.claimSummary}
                    </p>

                    <blockquote className="text-xs font-serif italic text-archival-ink bg-archival-surface p-2.5 rounded border-l-2 border-archival-gold leading-relaxed select-all">
                      &ldquo;{persp.sourceTextExcerpt}&rdquo;
                    </blockquote>

                    <div className="text-[11px] font-mono text-archival-muted pt-1 border-t border-archival-border/60">
                      Citation: {persp.citation}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cartographic Impact & Recommendation */}
          <div className="space-y-3 pt-2 border-t border-archival-border">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-archival-muted flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-archival-gold" aria-hidden="true" />
              <span>Cartographic Representation & Editorial Consensus</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg border border-archival-border bg-archival-bg space-y-1">
                <span className="font-semibold font-serif text-archival-ink block">
                  Cartographic Protocol:
                </span>
                <p className="text-[11px] text-archival-muted leading-relaxed">
                  {discrepancy.cartographicImpact}
                </p>
              </div>

              <div className="p-3 rounded-lg border border-archival-border bg-archival-bg space-y-1">
                <span className="font-semibold font-serif text-archival-ink block">
                  Editorial Consensus:
                </span>
                <p className="text-[11px] text-archival-muted leading-relaxed">
                  {discrepancy.consensusRecommendation}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-archival-bg border-t border-archival-border flex justify-between items-center text-xs text-archival-muted">
          <span className="flex items-center gap-1 text-[11px]">
            <Info className="w-3.5 h-3.5 text-archival-gold" aria-hidden="true" />
            <span>Islamic History Atlas Historiographical Integrity System</span>
          </span>
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
