"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  initialHistoricalDiscrepancies,
  type HistoricalDiscrepancy,
} from "@/lib/data/discrepanciesSeed";
import { DiscrepancyInspectorModal } from "@/components/atlas/DiscrepancyInspectorModal";
import { formatHistoricalYear } from "@/lib/utils";
import {
  AlertTriangle,
  BookOpen,
  MapPin,
  Compass,
  Filter,
  Layers,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";

const CATEGORY_LABELS: Record<string, string> = {
  all: "All Categories",
  boundary_dispute: "Boundary Disputes",
  sovereignty_ambiguity: "Sovereignty & Vassalage",
  chronicle_conflict: "Chronicle Conflicts",
};

const CONFIDENCE_LABELS: Record<string, string> = {
  all: "All Confidence Levels",
  disputed: "Disputed",
  approximate: "Approximate",
  inferred: "Inferred",
};

export default function UncertaintyPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedConfidence, setSelectedConfidence] = useState<string>("all");
  const [activeDiscrepancy, setActiveDiscrepancy] = useState<HistoricalDiscrepancy | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const filteredDiscrepancies = useMemo(() => {
    return initialHistoricalDiscrepancies.filter((item) => {
      const matchCat = selectedCategory === "all" || item.category === selectedCategory;
      const matchConf =
        selectedConfidence === "all" || item.confidenceRating === selectedConfidence;
      return matchCat && matchConf;
    });
  }, [selectedCategory, selectedConfidence]);

  return (
    <div className="space-y-6">
      {/* Header & Historiographical Standard Overview */}
      <div className="space-y-2 border-b border-archival-border pb-4">
        <div className="flex items-center gap-2 text-amber-700 font-serif">
          <AlertTriangle className="w-5 h-5" aria-hidden="true" />
          <span className="text-xs uppercase tracking-wider font-semibold font-sans">
            Historiographical Integrity Register
          </span>
        </div>
        <h1 className="font-serif font-bold text-2xl sm:text-3xl text-archival-ink">
          Historical Uncertainty & Conflicting Sources
        </h1>
        <p className="text-xs sm:text-sm text-archival-muted max-w-3xl leading-relaxed">
          The Islamic History Atlas adheres to strict academic honesty: we never transform historical ambiguity into false precision. Where medieval Arabic chronicles, Byzantine annals, Mozarabic accounts, and modern peer-reviewed scholarship diverge, we document the debate explicitly.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-archival-surface border border-archival-border rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-archival-gold" aria-hidden="true" />
          <span className="font-serif font-semibold text-archival-ink">Filter Debates:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1.5 rounded border border-archival-border bg-archival-bg text-archival-ink font-sans focus:outline-none focus:border-archival-gold"
          >
            {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
              <option key={val} value={val}>
                {label}
              </option>
            ))}
          </select>

          {/* Confidence Filter */}
          <select
            value={selectedConfidence}
            onChange={(e) => setSelectedConfidence(e.target.value)}
            className="px-2.5 py-1.5 rounded border border-archival-border bg-archival-bg text-archival-ink font-sans focus:outline-none focus:border-archival-gold"
          >
            {Object.entries(CONFIDENCE_LABELS).map(([val, label]) => (
              <option key={val} value={val}>
                {label}
              </option>
            ))}
          </select>

          <span className="text-[11px] font-mono text-archival-muted pl-1">
            Showing {filteredDiscrepancies.length} of {initialHistoricalDiscrepancies.length} disputes
          </span>
        </div>
      </div>

      {/* Discrepancy Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDiscrepancies.map((d) => (
          <div
            key={d.id}
            className="bg-archival-surface border border-archival-border rounded-xl p-5 flex flex-col justify-between space-y-4 hover:border-archival-gold/60 transition-colors shadow-sm"
          >
            <div className="space-y-2.5">
              {/* Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                  {d.confidenceRating}
                </span>
                <span className="font-mono text-xs text-archival-gold font-bold">
                  {formatHistoricalYear(d.activeFromYear)}–{formatHistoricalYear(d.activeToYear)}
                </span>
              </div>

              {/* Title & Region */}
              <div>
                <h3 className="font-serif font-bold text-base text-archival-ink">
                  {d.title}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-archival-muted mt-1">
                  <MapPin className="w-3.5 h-3.5 text-archival-gold" aria-hidden="true" />
                  <span>{d.regionName}</span>
                </div>
              </div>

              {/* Summary */}
              <p className="text-xs text-archival-muted leading-relaxed line-clamp-3">
                {d.historiographicalSummary}
              </p>

              {/* Perspectives Preview */}
              <div className="pt-2 border-t border-archival-border/60 flex items-center justify-between text-[11px] text-archival-muted">
                <span className="flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-archival-gold" aria-hidden="true" />
                  <span>{d.perspectives.length} divergent chronicler perspectives</span>
                </span>
                <span className="capitalize">{d.category.replace("_", " ")}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-archival-border flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setActiveDiscrepancy(d);
                  setIsModalOpen(true);
                }}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-archival-ink text-archival-surface hover:bg-stone-800 text-xs font-medium transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Examine Perspectives</span>
              </button>

              <Link
                href={`/?year=${d.activeFromYear}&discrepancy=${d.id}`}
                className="inline-flex items-center justify-center gap-1 py-1.5 px-3 rounded-lg border border-archival-border bg-archival-surface hover:bg-archival-border/20 text-xs font-medium text-archival-ink transition-colors"
                title="View on interactive atlas map"
              >
                <Compass className="w-3.5 h-3.5 text-archival-gold" aria-hidden="true" />
                <span>Map View</span>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Discrepancy Inspector Modal */}
      <DiscrepancyInspectorModal
        discrepancy={activeDiscrepancy}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setActiveDiscrepancy(null);
        }}
      />
    </div>
  );
}
