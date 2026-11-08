"use client";

import React, { useEffect, useState, useRef } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { formatHistoricalYear } from "@/lib/utils";

interface YearSliderProps {
  year: number;
  minYear?: number;
  maxYear?: number;
  onChange: (year: number) => void;
}

export function YearSlider({
  year,
  minYear = 632,
  maxYear = 1000,
  onChange,
}: YearSliderProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const playTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      playTimerRef.current = setInterval(() => {
        onChange(year >= maxYear ? minYear : year + 1);
      }, 750);
    } else if (playTimerRef.current) {
      clearInterval(playTimerRef.current);
      playTimerRef.current = null;
    }

    return () => {
      if (playTimerRef.current) {
        clearInterval(playTimerRef.current);
      }
    };
  }, [isPlaying, year, minYear, maxYear, onChange]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (!isNaN(val)) {
      const clamped = Math.max(minYear, Math.min(maxYear, val));
      onChange(clamped);
    }
  };

  const step = (delta: number) => {
    const next = Math.max(minYear, Math.min(maxYear, year + delta));
    onChange(next);
  };

  return (
    <div 
      className="bg-archival-surface border border-archival-border rounded-xl p-4 sm:p-6 shadow-sm space-y-4"
      role="region"
      aria-label="Historical Timeline Controls"
    >
      {/* Header & Numeric Input */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-archival-muted">
            Timeline Navigator
          </span>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-archival-ink flex items-center gap-2">
            <span>Selected Year:</span>
            <span className="text-archival-gold font-mono">{formatHistoricalYear(year)}</span>
          </h2>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <label htmlFor="numeric-year-input" className="text-xs text-archival-muted font-medium">
            Jump to Year:
          </label>
          <input
            id="numeric-year-input"
            type="number"
            min={minYear}
            max={maxYear}
            value={year}
            onChange={handleInputChange}
            className="w-24 px-2.5 py-1 text-sm font-mono font-semibold bg-archival-bg border border-archival-border rounded text-archival-ink focus:outline-none focus:ring-2 focus:ring-archival-gold"
            aria-label="Direct numeric year input"
          />
        </div>
      </div>

      {/* Main Slider Track */}
      <div className="space-y-1">
        <label htmlFor="historical-year-slider" className="sr-only">
          Timeline year selector ({minYear} to {maxYear} CE)
        </label>
        <input
          id="historical-year-slider"
          type="range"
          min={minYear}
          max={maxYear}
          value={year}
          onChange={handleSliderChange}
          aria-valuemin={minYear}
          aria-valuemax={maxYear}
          aria-valuenow={year}
          aria-valuetext={`${year} Common Era`}
          className="w-full h-2 bg-archival-border rounded-lg appearance-none cursor-pointer accent-archival-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-archival-gold"
        />
        <div className="flex justify-between text-[11px] font-mono text-archival-muted pt-1">
          <span>{minYear} CE (Founding)</span>
          <span>750 CE (Abbasid Era)</span>
          <span>909 CE (Fatimid Era)</span>
          <span>{maxYear} CE (Turn of Millenium)</span>
        </div>
      </div>

      {/* Playback & Step Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-archival-border/60">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-archival-gold text-white hover:bg-archival-gold/90 transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-archival-gold"
            aria-label={isPlaying ? "Pause timeline playback" : "Start timeline playback"}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Play</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setIsPlaying(false);
              onChange(minYear);
            }}
            className="p-1.5 rounded-lg text-archival-muted hover:text-archival-ink hover:bg-archival-bg transition-colors"
            title="Reset to 632 CE"
            aria-label="Reset to start of MVP era"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>

        {/* Step Buttons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => step(-10)}
            className="inline-flex items-center gap-0.5 px-2 py-1 rounded text-xs font-mono bg-archival-bg border border-archival-border text-archival-ink hover:bg-archival-surface transition-colors"
            aria-label="Step backward 10 years"
          >
            <ChevronsLeft className="w-3 h-3" aria-hidden="true" />
            <span>-10y</span>
          </button>
          <button
            type="button"
            onClick={() => step(-1)}
            className="inline-flex items-center gap-0.5 px-2 py-1 rounded text-xs font-mono bg-archival-bg border border-archival-border text-archival-ink hover:bg-archival-surface transition-colors"
            aria-label="Step backward 1 year"
          >
            <ChevronLeft className="w-3 h-3" aria-hidden="true" />
            <span>-1y</span>
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            className="inline-flex items-center gap-0.5 px-2 py-1 rounded text-xs font-mono bg-archival-bg border border-archival-border text-archival-ink hover:bg-archival-surface transition-colors"
            aria-label="Step forward 1 year"
          >
            <span>+1y</span>
            <ChevronRight className="w-3 h-3" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => step(10)}
            className="inline-flex items-center gap-0.5 px-2 py-1 rounded text-xs font-mono bg-archival-bg border border-archival-border text-archival-ink hover:bg-archival-surface transition-colors"
            aria-label="Step forward 10 years"
          >
            <span>+10y</span>
            <ChevronsRight className="w-3 h-3" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

