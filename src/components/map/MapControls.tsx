"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Plus,
  Minus,
  RotateCcw,
  Compass,
  Maximize2,
  Minimize2,
  Layers,
  Map as MapIcon,
  ChevronDown,
} from "lucide-react";

export interface HistoricalRegion {
  id: string;
  name: string;
  arabicName?: string;
  center: [number, number];
  zoom: number;
}

export const HISTORICAL_REGIONS: HistoricalRegion[] = [
  {
    id: "heartland",
    name: "Islamic Heartland",
    arabicName: "الحجاز و الشام",
    center: [28.0, 38.0],
    zoom: 4,
  },
  {
    id: "andalus_maghreb",
    name: "Al-Andalus & Maghreb",
    arabicName: "الأندلس والمغرب",
    center: [35.5, -2.5],
    zoom: 5,
  },
  {
    id: "mesopotamia_persia",
    name: "Mesopotamia & Persia",
    arabicName: "العراق وفارس",
    center: [33.0, 48.0],
    zoom: 5,
  },
  {
    id: "central_asia",
    name: "Central Asia & Khorasan",
    arabicName: "خراسان وبلاد ما وراء النهر",
    center: [39.0, 64.0],
    zoom: 5,
  },
  {
    id: "egypt_levant",
    name: "Egypt & Levant",
    arabicName: "مصر وبلاد الشام",
    center: [30.0, 33.0],
    zoom: 5,
  },
  {
    id: "anatolia",
    name: "Anatolia & Rome Frontier",
    arabicName: "الثغور والأناضول",
    center: [38.5, 34.0],
    zoom: 5,
  },
];

export type BasemapStyle = "light_gray" | "physical_relief" | "antique_sepia";

export interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetHeartland: () => void;
  onSelectRegion: (region: HistoricalRegion) => void;
  currentBasemap: BasemapStyle;
  onChangeBasemap: (style: BasemapStyle) => void;
  isTheaterMode?: boolean;
  onToggleTheaterMode?: () => void;
}

export function MapControls({
  onZoomIn,
  onZoomOut,
  onResetHeartland,
  onSelectRegion,
  currentBasemap,
  onChangeBasemap,
  isTheaterMode = false,
  onToggleTheaterMode,
}: MapControlsProps) {
  const [isRegionMenuOpen, setIsRegionMenuOpen] = useState(false);
  const [isBasemapMenuOpen, setIsBasemapMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsRegionMenuOpen(false);
        setIsBasemapMenuOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsRegionMenuOpen(false);
        setIsBasemapMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute top-3 right-3 z-[400] flex flex-col items-end gap-2 pointer-events-auto"
    >
      {/* Top Action Row: Reset, Region Jumper, Basemap & Theater Toggle */}
      <div className="flex items-center gap-1.5 bg-archival-surface/95 backdrop-blur-md border border-archival-border p-1 rounded-xl shadow-md">
        {/* Reset Heartland Button */}
        <button
          type="button"
          onClick={onResetHeartland}
          className="px-2.5 py-1.5 rounded-lg text-xs font-serif font-medium text-archival-ink hover:bg-archival-bg hover:text-archival-gold transition-colors flex items-center gap-1.5"
          title="Reset map view to the Arabian & Levantine Heartland"
          aria-label="Reset map view to historical heartland"
        >
          <RotateCcw className="w-3.5 h-3.5 text-archival-gold" aria-hidden="true" />
          <span className="hidden sm:inline">Heartland</span>
        </button>

        {/* Region Fast Jump Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setIsRegionMenuOpen(!isRegionMenuOpen);
              setIsBasemapMenuOpen(false);
            }}
            className="px-2.5 py-1.5 rounded-lg text-xs font-serif font-medium text-archival-ink hover:bg-archival-bg transition-colors flex items-center gap-1.5 border-l border-archival-border/60"
            title="Fast navigate to key historical theaters and frontiers"
            aria-expanded={isRegionMenuOpen}
            aria-label="Select historical region to navigate"
          >
            <Compass className="w-3.5 h-3.5 text-archival-gold" aria-hidden="true" />
            <span className="hidden md:inline">Jump Region</span>
            <ChevronDown className="w-3 h-3 text-archival-muted" aria-hidden="true" />
          </button>

          {isRegionMenuOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-56 bg-archival-surface/98 backdrop-blur-md border border-archival-border rounded-xl shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1.5 text-[10px] uppercase font-mono tracking-wider text-archival-muted border-b border-archival-border/60">
                Historical Theaters
              </div>
              {HISTORICAL_REGIONS.map((region) => (
                <button
                  key={region.id}
                  type="button"
                  onClick={() => {
                    onSelectRegion(region);
                    setIsRegionMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-archival-bg transition-colors flex items-center justify-between group"
                >
                  <span className="font-serif font-medium text-archival-ink group-hover:text-archival-gold">
                    {region.name}
                  </span>
                  {region.arabicName && (
                    <span className="text-[10px] text-archival-muted font-serif dir-rtl">
                      {region.arabicName}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Basemap Style Switcher */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setIsBasemapMenuOpen(!isBasemapMenuOpen);
              setIsRegionMenuOpen(false);
            }}
            className="p-1.5 rounded-lg text-xs font-serif text-archival-ink hover:bg-archival-bg transition-colors flex items-center gap-1 border-l border-archival-border/60"
            title="Change Basemap Cartographic Style"
            aria-expanded={isBasemapMenuOpen}
            aria-label="Change basemap style"
          >
            <MapIcon className="w-3.5 h-3.5 text-archival-gold" aria-hidden="true" />
          </button>

          {isBasemapMenuOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-48 bg-archival-surface/98 backdrop-blur-md border border-archival-border rounded-xl shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1.5 text-[10px] uppercase font-mono tracking-wider text-archival-muted border-b border-archival-border/60">
                Cartographic Canvas
              </div>
              <button
                type="button"
                onClick={() => {
                  onChangeBasemap("light_gray");
                  setIsBasemapMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-center justify-between ${
                  currentBasemap === "light_gray"
                    ? "bg-archival-gold/10 font-bold text-archival-gold"
                    : "hover:bg-archival-bg text-archival-ink"
                }`}
              >
                <span>Archival Light Gray</span>
                {currentBasemap === "light_gray" && <span className="text-xs">✓</span>}
              </button>
              <button
                type="button"
                onClick={() => {
                  onChangeBasemap("physical_relief");
                  setIsBasemapMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-center justify-between ${
                  currentBasemap === "physical_relief"
                    ? "bg-archival-gold/10 font-bold text-archival-gold"
                    : "hover:bg-archival-bg text-archival-ink"
                }`}
              >
                <span>Topographic Relief</span>
                {currentBasemap === "physical_relief" && <span className="text-xs">✓</span>}
              </button>
              <button
                type="button"
                onClick={() => {
                  onChangeBasemap("antique_sepia");
                  setIsBasemapMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-center justify-between ${
                  currentBasemap === "antique_sepia"
                    ? "bg-archival-gold/10 font-bold text-archival-gold"
                    : "hover:bg-archival-bg text-archival-ink"
                }`}
              >
                <span>Antique Parchment</span>
                {currentBasemap === "antique_sepia" && <span className="text-xs">✓</span>}
              </button>
            </div>
          )}
        </div>

        {/* Theater / Fullscreen Mode Toggle */}
        {onToggleTheaterMode && (
          <button
            type="button"
            onClick={onToggleTheaterMode}
            className="p-1.5 rounded-lg text-xs text-archival-ink hover:bg-archival-bg hover:text-archival-gold transition-colors border-l border-archival-border/60"
            title={isTheaterMode ? "Exit Theater Canvas View" : "Expand to Theater Canvas View"}
            aria-label={isTheaterMode ? "Exit Theater View" : "Enter Theater View"}
          >
            {isTheaterMode ? (
              <Minimize2 className="w-3.5 h-3.5 text-archival-gold" aria-hidden="true" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5 text-archival-gold" aria-hidden="true" />
            )}
          </button>
        )}
      </div>

      {/* Vertical Archival Zoom Controller */}
      <div className="flex flex-col bg-archival-surface/95 backdrop-blur-md border border-archival-border rounded-xl shadow-md overflow-hidden">
        <button
          type="button"
          onClick={onZoomIn}
          className="p-2 text-archival-ink hover:bg-archival-bg hover:text-archival-gold transition-colors border-b border-archival-border/60 flex items-center justify-center"
          title="Zoom in map"
          aria-label="Zoom in"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={onZoomOut}
          className="p-2 text-archival-ink hover:bg-archival-bg hover:text-archival-gold transition-colors flex items-center justify-center"
          title="Zoom out map"
          aria-label="Zoom out"
        >
          <Minus className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

