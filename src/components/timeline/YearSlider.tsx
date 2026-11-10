"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  FastForward,
  Rewind,
  Sparkles,
  Calendar,
} from "lucide-react";
import { formatHistoricalYear } from "@/lib/utils";

export interface HistoricalMilestone {
  year: number;
  label: string;
  dynasty?: string;
}

export const HISTORICAL_MILESTONES: HistoricalMilestone[] = [
  { year: 632, label: "Founding of Caliphate", dynasty: "Rashidun" },
  { year: 661, label: "Damascus Capital", dynasty: "Umayyad" },
  { year: 750, label: "Abbasid Revolution", dynasty: "Abbasid" },
  { year: 756, label: "Emirate of Córdoba", dynasty: "Andalusian" },
  { year: 929, label: "Córdoba Caliphate", dynasty: "Andalusian" },
  { year: 969, label: "Founding of Cairo", dynasty: "Fatimid" },
  { year: 1071, label: "Battle of Manzikert", dynasty: "Seljuk" },
  { year: 1187, label: "Battle of Hattin", dynasty: "Ayyubid" },
  { year: 1258, label: "Fall of Baghdad", dynasty: "Abbasid" },
  { year: 1260, label: "Battle of Ain Jalut", dynasty: "Mamluk" },
  { year: 1453, label: "Fall of Constantinople", dynasty: "Ottoman" },
  { year: 1526, label: "First Battle of Panipat", dynasty: "Mughal" },
  { year: 1550, label: "Gunpowder Empires Zenith", dynasty: "Ottoman/Safavid/Mughal" },
  { year: 1683, label: "Second Siege of Vienna", dynasty: "Ottoman" },
  { year: 1857, label: "Fall of Mughal Empire", dynasty: "Mughal" },
  { year: 1922, label: "End of Ottoman Sultanate", dynasty: "Ottoman" },
];

export interface HistoricalEra {
  fromYear: number;
  toYear: number;
  name: string;
  description: string;
}

export const HISTORICAL_ERAS: HistoricalEra[] = [
  {
    fromYear: 500,
    toYear: 621,
    name: "Late Antiquity & Pre-Islamic Arabia",
    description: "Arabian caravan sanctuaries, Ghassanid and Lakhmid frontier buffer marches.",
  },
  {
    fromYear: 622,
    toYear: 661,
    name: "Prophetic Era & Rashidun Caliphate",
    description: "Founding period radiating from Medina across the Levant, Egypt, and Iranian plateau.",
  },
  {
    fromYear: 662,
    toYear: 749,
    name: "High Umayyad Caliphate",
    description: "First imperial dynasty ruling from Damascus, spanning from Iberia to the Indus River.",
  },
  {
    fromYear: 750,
    toYear: 944,
    name: "Early Abbasid Caliphate & Golden Age",
    description: "Flowering of scientific, philosophical, and architectural achievements at Baghdad and Samarra.",
  },
  {
    fromYear: 945,
    toYear: 1054,
    name: "Regional Dynasties & Caliphal Fragmentation",
    description: "Concurrent realms: Fatimids in Cairo, Buyids in Baghdad, Samanids in Bukhara, Umayyads in Córdoba.",
  },
  {
    fromYear: 1055,
    toYear: 1257,
    name: "Age of Great Seljuks, Crusades & Ayyubids",
    description: "Turco-Persian Sunnite consolidation, Crusades, and Saladin's unification of Egypt and Syria.",
  },
  {
    fromYear: 1258,
    toYear: 1499,
    name: "Ilkhanate, Mamluk Sultanate & Timurid Renaissance",
    description: "Post-Mongol transformation, Mamluk defense of Syria, Delhi Sultanate, and Timurid Samarkand.",
  },
  {
    fromYear: 1500,
    toYear: 1799,
    name: "The Three Gunpowder Empires",
    description: "Ottoman, Safavid, and Mughal empires commanding global commerce, architecture, and military power.",
  },
  {
    fromYear: 1800,
    toYear: 1922,
    name: "Modern Transition & Late Ottoman Tanzimat",
    description: "Administrative modernizations, European encroachment, and final dissolution of imperial dynasties.",
  },
  {
    fromYear: 1923,
    toYear: 1980,
    name: "Post-Caliphate 20th Century Era",
    description: "Emergence of modern sovereign republics, constitutional monarchies, and post-colonial nation-states.",
  },
];

export function getHistoricalEra(year: number): HistoricalEra {
  const found = HISTORICAL_ERAS.find((era) => year >= era.fromYear && year <= era.toYear);
  return (
    found || {
      fromYear: 500,
      toYear: 1980,
      name: "Historical Period",
      description: "Islamic history timeline.",
    }
  );
}

export type PlaybackSpeed = "1x" | "2x" | "5x" | "10x";

const SPEED_CONFIGS: Record<PlaybackSpeed, { step: number; intervalMs: number }> = {
  "1x": { step: 1, intervalMs: 800 },
  "2x": { step: 5, intervalMs: 600 },
  "5x": { step: 10, intervalMs: 500 },
  "10x": { step: 25, intervalMs: 400 },
};

interface YearSliderProps {
  year: number;
  minYear?: number;
  maxYear?: number;
  onChange: (year: number) => void;
}

export function YearSlider({
  year,
  minYear = 500,
  maxYear = 1980,
  onChange,
}: YearSliderProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<PlaybackSpeed>("1x");
  const [inputValue, setInputValue] = useState<string>(year.toString());
  const playTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Synchronize local input string when external year changes
  useEffect(() => {
    setInputValue(year.toString());
  }, [year]);

  // Automated playback engine
  useEffect(() => {
    if (isPlaying) {
      const config = SPEED_CONFIGS[playbackSpeed];
      playTimerRef.current = setInterval(() => {
        onChange(year >= maxYear ? minYear : Math.min(maxYear, year + config.step));
      }, config.intervalMs);
    } else if (playTimerRef.current) {
      clearInterval(playTimerRef.current);
      playTimerRef.current = null;
    }

    return () => {
      if (playTimerRef.current) {
        clearInterval(playTimerRef.current);
      }
    };
  }, [isPlaying, year, minYear, maxYear, playbackSpeed, onChange]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    const val = Number(e.target.value);
    if (!isNaN(val) && val >= minYear && val <= maxYear) {
      onChange(val);
    }
  };

  const handleInputBlur = () => {
    const val = Number(inputValue);
    if (isNaN(val)) {
      setInputValue(year.toString());
    } else {
      const clamped = Math.max(minYear, Math.min(maxYear, val));
      setInputValue(clamped.toString());
      onChange(clamped);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleInputBlur();
    }
  };

  const step = useCallback(
    (delta: number) => {
      const next = Math.max(minYear, Math.min(maxYear, year + delta));
      onChange(next);
    },
    [minYear, maxYear, year, onChange]
  );

  const currentEra = getHistoricalEra(year);

  return (
    <div
      className="bg-archival-surface border border-archival-border rounded-xl p-4 sm:p-5 shadow-sm space-y-4"
      role="region"
      aria-label="Historical Timeline Controls"
    >
      {/* Header & Direct Numeric Input */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-archival-border/60">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-archival-gold font-semibold">
              Historical Timeline (500 AD – 1980 AD)
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-archival-gold/60" />
            <span className="text-xs font-serif font-medium text-archival-ink">
              {currentEra.name}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-archival-ink flex items-baseline gap-2">
            <span className="text-archival-gold font-mono">{formatHistoricalYear(year)}</span>
            <span className="text-xs text-archival-muted font-sans font-normal hidden sm:inline">
              ({currentEra.description})
            </span>
          </h2>
        </div>

        {/* Direct Manual Numeric Input */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <label htmlFor="numeric-year-input" className="text-xs text-archival-muted font-serif">
            Jump to Year:
          </label>
          <div className="relative">
            <input
              id="numeric-year-input"
              type="number"
              min={minYear}
              max={maxYear}
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onKeyDown={handleInputKeyDown}
              className="w-24 px-2.5 py-1 text-sm font-mono font-semibold bg-archival-bg border border-archival-border rounded-lg text-archival-ink focus:outline-none focus:ring-2 focus:ring-archival-gold"
              aria-label="Direct numeric year input"
            />
            <span className="absolute right-2 top-1.5 text-[10px] font-mono text-archival-muted pointer-events-none">
              CE
            </span>
          </div>
        </div>
      </div>

      {/* Main Slider Track */}
      <div className="space-y-1.5">
        <label htmlFor="historical-year-slider" className="sr-only">
          Timeline year selector ({minYear} to {maxYear} CE)
        </label>
        <div className="relative flex items-center">
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
            className="w-full h-2.5 bg-archival-border/80 rounded-lg appearance-none cursor-pointer accent-archival-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-archival-gold"
          />
        </div>
        <div className="flex justify-between text-[10px] font-mono text-archival-muted pt-0.5">
          <span>{minYear} CE</span>
          <span className="hidden sm:inline">632 CE (Rashidun)</span>
          <span className="hidden sm:inline">750 CE (Abbasid)</span>
          <span>1071 CE (Seljuk)</span>
          <span className="hidden sm:inline">1258 CE (Mongol)</span>
          <span>1550 CE (Gunpowder)</span>
          <span>{maxYear} CE</span>
        </div>
      </div>

      {/* Playback Engine & Granular Step Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-archival-border/60">
        {/* Playback Toggle & Speed Selectors */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-serif font-bold bg-archival-gold text-white hover:bg-archival-gold/90 transition-colors shadow-xs"
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

          {/* Speed Selector Buttons */}
          <div
            className="inline-flex items-center bg-archival-bg border border-archival-border rounded-lg p-0.5 text-[11px] font-mono"
            role="group"
            aria-label="Playback speed"
          >
            {(["1x", "2x", "5x", "10x"] as PlaybackSpeed[]).map((spd) => (
              <button
                key={spd}
                type="button"
                onClick={() => setPlaybackSpeed(spd)}
                className={`px-2 py-0.5 rounded transition-colors ${
                  playbackSpeed === spd
                    ? "bg-archival-gold text-white font-bold"
                    : "text-archival-muted hover:text-archival-ink"
                }`}
                title={`Playback speed ${spd}`}
              >
                {spd}
              </button>
            ))}
          </div>

          {/* Reset to Benchmark Button */}
          <button
            type="button"
            onClick={() => {
              setIsPlaying(false);
              onChange(632);
            }}
            className="p-1.5 rounded-lg text-archival-muted hover:text-archival-ink hover:bg-archival-bg transition-colors"
            title="Reset to 632 CE (Founding of Caliphate)"
            aria-label="Reset to 632 CE"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>

        {/* Stepper Buttons: Century, Decade, and Single Year */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => step(-50)}
            className="inline-flex items-center px-1.5 py-1 rounded text-xs font-mono bg-archival-bg border border-archival-border text-archival-ink hover:bg-archival-surface transition-colors"
            title="Step backward 50 years"
            aria-label="Step backward 50 years"
          >
            <Rewind className="w-3 h-3 mr-0.5" aria-hidden="true" />
            <span>-50y</span>
          </button>
          <button
            type="button"
            onClick={() => step(-10)}
            className="inline-flex items-center px-1.5 py-1 rounded text-xs font-mono bg-archival-bg border border-archival-border text-archival-ink hover:bg-archival-surface transition-colors"
            title="Step backward 10 years"
            aria-label="Step backward 10 years"
          >
            <ChevronsLeft className="w-3 h-3 mr-0.5" aria-hidden="true" />
            <span>-10y</span>
          </button>
          <button
            type="button"
            onClick={() => step(-1)}
            className="inline-flex items-center px-2 py-1 rounded text-xs font-mono bg-archival-bg border border-archival-border text-archival-ink hover:bg-archival-surface transition-colors"
            title="Step backward 1 year"
            aria-label="Step backward 1 year"
          >
            <ChevronLeft className="w-3 h-3 mr-0.5" aria-hidden="true" />
            <span>-1y</span>
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            className="inline-flex items-center px-2 py-1 rounded text-xs font-mono bg-archival-bg border border-archival-border text-archival-ink hover:bg-archival-surface transition-colors"
            title="Step forward 1 year"
            aria-label="Step forward 1 year"
          >
            <span>+1y</span>
            <ChevronRight className="w-3 h-3 ml-0.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => step(10)}
            className="inline-flex items-center px-1.5 py-1 rounded text-xs font-mono bg-archival-bg border border-archival-border text-archival-ink hover:bg-archival-surface transition-colors"
            title="Step forward 10 years"
            aria-label="Step forward 10 years"
          >
            <span>+10y</span>
            <ChevronsRight className="w-3 h-3 ml-0.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => step(50)}
            className="inline-flex items-center px-1.5 py-1 rounded text-xs font-mono bg-archival-bg border border-archival-border text-archival-ink hover:bg-archival-surface transition-colors"
            title="Step forward 50 years"
            aria-label="Step forward 50 years"
          >
            <span>+50y</span>
            <FastForward className="w-3 h-3 ml-0.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Historical Milestones Quick Jump Chips */}
      <div className="pt-2 border-t border-archival-border/60">
        <div className="flex items-center gap-1.5 mb-2">
          <Calendar className="w-3.5 h-3.5 text-archival-gold" aria-hidden="true" />
          <span className="text-[11px] font-serif font-bold text-archival-ink">
            Key Civilizational Turning Points:
          </span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {HISTORICAL_MILESTONES.map((m) => {
            const isCurrent = Math.abs(year - m.year) <= 5;
            return (
              <button
                key={m.year}
                type="button"
                onClick={() => onChange(m.year)}
                className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-sans border transition-all ${
                  isCurrent
                    ? "bg-archival-gold text-white font-bold border-archival-gold shadow-xs"
                    : "bg-archival-bg/80 text-archival-ink border-archival-border/70 hover:bg-archival-bg hover:border-archival-gold/60"
                }`}
                title={`Jump to ${m.year} CE (${m.label})`}
              >
                <span className="font-mono font-semibold">{m.year}</span>{" "}
                <span className="opacity-80">· {m.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
