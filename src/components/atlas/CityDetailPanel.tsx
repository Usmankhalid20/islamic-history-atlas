"use client";

import React from "react";
import { X, Crown, MapPin, Landmark, Calendar, ShieldCheck } from "lucide-react";
import type { HistoricalCity } from "@/lib/data/historicalCitiesSeed";

interface CityDetailPanelProps {
  city: HistoricalCity;
  selectedYear: number;
  onClose: () => void;
}

export function CityDetailPanel({ city, selectedYear, onClose }: CityDetailPanelProps) {
  // Check if the city was an imperial capital in the selected year
  const currentCapitalEra = city.capitalEras.find(
    (era) => selectedYear >= era.fromYear && selectedYear <= era.toYear
  );

  // Check the ruling power during the selected year
  const currentRulingPower = city.rulingPowers.find(
    (rp) => selectedYear >= rp.fromYear && selectedYear <= rp.toYear
  );

  return (
    <div
      className="bg-archival-surface border border-archival-border rounded-xl p-4 sm:p-5 shadow-md space-y-4 animate-in fade-in zoom-in-95 duration-200"
      role="region"
      aria-label={`Historical details for ${city.name}`}
    >
      {/* Panel Header */}
      <div className="flex items-start justify-between gap-3 border-b border-archival-border/60 pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {currentCapitalEra ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                <Crown className="w-3 h-3 text-amber-700" />
                Imperial Capital ({selectedYear} CE)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-stone-100 text-stone-800 border border-stone-200">
                <Landmark className="w-3 h-3 text-stone-600" />
                Historical Metropolis
              </span>
            )}
            <span className="text-[11px] font-mono text-archival-muted">
              {city.region}
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-serif font-bold text-archival-ink flex items-baseline gap-2">
            <span>{city.name}</span>
            {city.historicalNames.arabic && (
              <span className="text-sm font-serif font-medium text-archival-gold" dir="rtl">
                {city.historicalNames.arabic}
              </span>
            )}
          </h3>

          {city.historicalNames.persian && (
            <div className="text-xs text-archival-muted">
              Persian: <span className="font-serif">{city.historicalNames.persian}</span>
            </div>
          )}
          {city.historicalNames.greek_latin && (
            <div className="text-xs text-archival-muted italic">
              Classical / Latin: {city.historicalNames.greek_latin}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-archival-muted hover:text-archival-ink hover:bg-archival-bg transition-colors"
          title="Close city details"
          aria-label="Close city details"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Current Era Context Banner */}
      {currentCapitalEra && (
        <div className="bg-amber-50/80 border border-amber-200 rounded-lg p-3 text-xs text-amber-950 space-y-1">
          <div className="font-serif font-bold text-amber-900 flex items-center gap-1.5">
            <Crown className="w-3.5 h-3.5 text-amber-700" />
            <span>{currentCapitalEra.capitalTitle}</span>
          </div>
          <p className="font-sans text-[11px] text-amber-800">
            Designated royal seat and imperial administrative hub ({currentCapitalEra.fromYear}–{currentCapitalEra.toYear} CE).
          </p>
        </div>
      )}

      {/* Historical Significance */}
      <div className="space-y-1 text-xs">
        <span className="font-serif font-bold text-archival-ink block">
          Historical Significance:
        </span>
        <p className="text-archival-muted leading-relaxed font-sans">
          {city.significance}
        </p>
      </div>

      {/* Metadata Grid */}
      <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-archival-border/60">
        <div className="bg-archival-bg/70 p-2 rounded-lg border border-archival-border/60">
          <span className="text-archival-muted block font-mono text-[10px]">COORDINATES</span>
          <span className="font-mono text-archival-ink font-medium">
            {city.coordinates[1].toFixed(2)}°N, {city.coordinates[0].toFixed(2)}°E
          </span>
        </div>
        <div className="bg-archival-bg/70 p-2 rounded-lg border border-archival-border/60">
          <span className="text-archival-muted block font-mono text-[10px]">RULING POWER ({selectedYear} CE)</span>
          <span className="font-medium text-archival-ink capitalize">
            {currentRulingPower ? currentRulingPower.polityId.replace("pol_", "").replace("_", " ") : "Autonomous / Regional"}
          </span>
        </div>
      </div>

      {/* Capital History Timeline */}
      {city.capitalEras.length > 0 && (
        <div className="space-y-1.5 text-xs pt-1 border-t border-archival-border/60">
          <span className="font-serif font-bold text-archival-ink flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-archival-gold" />
            <span>Caliphal & Dynastic Capital Eras:</span>
          </span>
          <div className="space-y-1">
            {city.capitalEras.map((era, i) => (
              <div
                key={i}
                className="flex items-center justify-between text-[11px] bg-archival-bg/50 px-2 py-1 rounded border border-archival-border/40"
              >
                <span className="font-medium text-archival-ink">{era.capitalTitle}</span>
                <span className="font-mono text-archival-gold font-semibold">
                  {era.fromYear}–{era.toYear} CE
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
