"use client";

import React from "react";
import type { EraComparisonDelta, ComparisonPreset } from "@/lib/geo/comparisonUtils";
import { formatHistoricalYear } from "@/lib/utils";
import {
  TrendingUp,
  Landmark,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Info,
} from "lucide-react";

interface ComparisonDeltaPanelProps {
  delta: EraComparisonDelta;
  activePreset?: ComparisonPreset | null;
}

export function ComparisonDeltaPanel({ delta, activePreset }: ComparisonDeltaPanelProps) {
  const formattedA = formatHistoricalYear(delta.yearA);
  const formattedB = formatHistoricalYear(delta.yearB);

  return (
    <div className="bg-archival-surface border border-archival-border rounded-xl p-5 space-y-5 text-archival-ink shadow-sm">
      {/* Header & Preset Context */}
      <div className="space-y-1.5 border-b border-archival-border pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-archival-gold" aria-hidden="true" />
            <h3 className="font-serif font-bold text-base text-archival-ink">
              Geopolitical & Historiographical Delta
            </h3>
          </div>
          <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-archival-bg border border-archival-border text-archival-muted">
            {delta.elapsedYears} Years Elapsed ({formattedA} → {formattedB})
          </span>
        </div>

        {activePreset && (
          <div className="pt-2 text-xs text-archival-muted leading-relaxed">
            <strong className="text-archival-ink font-serif block mb-0.5">
              {activePreset.title}:
            </strong>
            <p>{activePreset.keyHistoricalTakeaway}</p>
          </div>
        )}
      </div>

      {/* Dynastic & Territorial Transitions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        {/* Emerged Polities */}
        <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50/50 space-y-2">
          <div className="flex items-center gap-1.5 font-serif font-semibold text-emerald-900">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
            <span>Emerged Polities ({delta.emergedPolities.length})</span>
          </div>
          {delta.emergedPolities.length === 0 ? (
            <p className="text-[11px] text-emerald-800/70 italic">
              No new polities emerged by {formattedB}.
            </p>
          ) : (
            <div className="space-y-1">
              {delta.emergedPolities.map((p) => (
                <div
                  key={p.id}
                  className="px-2 py-1 rounded bg-white/80 border border-emerald-200 text-emerald-950 font-medium text-[11px]"
                >
                  <span className="font-semibold">{p.canonicalName}</span>
                  <span className="text-[10px] text-emerald-700 block">
                    {formatHistoricalYear(p.startYear)} –{" "}
                    {p.endYear ? formatHistoricalYear(p.endYear) : "present"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dissolved Polities */}
        <div className="p-3 rounded-lg border border-red-200 bg-red-50/50 space-y-2">
          <div className="flex items-center gap-1.5 font-serif font-semibold text-red-900">
            <ShieldAlert className="w-3.5 h-3.5 text-red-600" aria-hidden="true" />
            <span>Dissolved / Displaced ({delta.dissolvedPolities.length})</span>
          </div>
          {delta.dissolvedPolities.length === 0 ? (
            <p className="text-[11px] text-red-800/70 italic">
              No polities from {formattedA} had collapsed by {formattedB}.
            </p>
          ) : (
            <div className="space-y-1">
              {delta.dissolvedPolities.map((p) => (
                <div
                  key={p.id}
                  className="px-2 py-1 rounded bg-white/80 border border-red-200 text-red-950 font-medium text-[11px]"
                >
                  <span className="line-through font-semibold text-red-800">
                    {p.canonicalName}
                  </span>
                  <span className="text-[10px] text-red-600 block">
                    Ceased direct rule c. {p.endYear ? formatHistoricalYear(p.endYear) : "unknown"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Persistent Polities */}
        <div className="p-3 rounded-lg border border-archival-border bg-archival-bg space-y-2">
          <div className="flex items-center gap-1.5 font-serif font-semibold text-archival-ink">
            <Info className="w-3.5 h-3.5 text-archival-gold" aria-hidden="true" />
            <span>Continuing Sovereignties ({delta.persistentPolities.length})</span>
          </div>
          {delta.persistentPolities.length === 0 ? (
            <p className="text-[11px] text-archival-muted italic">
              Complete dynastic turnover between both eras.
            </p>
          ) : (
            <div className="space-y-1">
              {delta.persistentPolities.map((p) => (
                <div
                  key={p.id}
                  className="px-2 py-1 rounded bg-archival-surface border border-archival-border text-archival-ink text-[11px]"
                >
                  <span className="font-semibold">{p.canonicalName}</span>
                  <span className="text-[10px] text-archival-muted block capitalize">
                    {p.entityType} ({p.capitalCity || "Imperial capital"})
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Monuments & Intellectual Foundations in between */}
      {delta.newMonumentsBetween.length > 0 && (
        <div className="p-3.5 rounded-lg border border-purple-200 bg-purple-50/40 space-y-2 text-xs">
          <div className="flex items-center gap-1.5 font-serif font-semibold text-purple-900">
            <Landmark className="w-3.5 h-3.5 text-purple-700" aria-hidden="true" />
            <span>
              Architectural & Intellectual Foundations Between {formattedA} and {formattedB} (
              {delta.newMonumentsBetween.length})
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {delta.newMonumentsBetween.map((m) => (
              <div
                key={m.id}
                className="p-2 rounded bg-white/90 border border-purple-200 text-purple-950 text-[11px]"
              >
                <div className="flex items-center justify-between font-semibold">
                  <span>{m.name}</span>
                  <span className="font-mono text-purple-700">
                    {formatHistoricalYear(m.foundingYear)}
                  </span>
                </div>
                <span className="text-[10px] text-purple-700 block truncate">
                  {m.cityName} • {m.monumentType}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scholarly Citations for this Transition */}
      <div className="pt-2 border-t border-archival-border text-[11px] text-archival-muted flex items-start gap-2">
        <BookOpen className="w-3.5 h-3.5 text-archival-gold shrink-0 mt-0.5" aria-hidden="true" />
        <div className="space-y-0.5">
          <span className="font-semibold text-archival-ink font-serif block">
            Comparative Historiographical Sources:
          </span>
          <p>
            Hugh Kennedy, <em>The Prophet and the Age of the Caliphates</em> (2004); C.E. Bosworth,{" "}
            <em>The New Islamic Dynasties</em> (1996); <em>Encyclopaedia of Islam</em> (EI2).
          </p>
        </div>
      </div>
    </div>
  );
}
