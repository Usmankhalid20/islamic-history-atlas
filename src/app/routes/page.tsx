"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Navigation, Compass, Package, Calendar, ExternalLink, Filter, BookOpen } from "lucide-react";
import { initialTradeRoutes, initialSources } from "@/lib/data/historicalSeed";
import { formatHistoricalYear } from "@/lib/utils";

type RouteFilter = "all" | "pilgrim_road" | "caravan_route" | "maritime_lane";

export default function RoutesPage() {
  const [filterType, setFilterType] = useState<RouteFilter>("all");

  const filteredRoutes = useMemo(() => {
    if (filterType === "all") return initialTradeRoutes;
    return initialTradeRoutes.filter((r) => r.routeType === filterType);
  }, [filterType]);

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case "pilgrim_road":
        return "bg-amber-100 text-amber-900 border-amber-300";
      case "maritime_lane":
        return "bg-blue-100 text-blue-900 border-blue-300";
      case "caravan_route":
      default:
        return "bg-orange-100 text-orange-900 border-orange-300";
    }
  };

  const getRouteLabel = (type: string) => {
    switch (type) {
      case "pilgrim_road":
        return "Pilgrim Highway";
      case "maritime_lane":
        return "Maritime Sea Lane";
      case "caravan_route":
      default:
        return "Overland Caravan Route";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      {/* Editorial Header */}
      <section className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-archival-surface border border-archival-border text-archival-gold">
          <Navigation className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Historical Connectivity • 7th–10th Centuries CE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-archival-ink tracking-tight">
          Trade Corridors & Pilgrimage Highways
        </h1>
        <p className="text-sm sm:text-base text-archival-muted leading-relaxed max-w-3xl font-sans">
          The medieval Islamic world was unified by vital overland caravan networks, engineered caliphal pilgrimage roads (*darb*), and Indian Ocean sea lanes. Documented by classical geographers Ibn Khordadbeh and al-Muqaddasi.
        </p>
      </section>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-archival-border pb-4">
        <span className="text-xs font-serif font-semibold text-archival-ink mr-2 flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-archival-gold" aria-hidden="true" />
          <span>Filter by Type:</span>
        </span>

        <button
          type="button"
          onClick={() => setFilterType("all")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            filterType === "all"
              ? "bg-archival-gold text-white font-semibold"
              : "bg-archival-surface hover:bg-archival-border/40 text-archival-muted border border-archival-border"
          }`}
        >
          All Networks ({initialTradeRoutes.length})
        </button>
        <button
          type="button"
          onClick={() => setFilterType("pilgrim_road")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            filterType === "pilgrim_road"
              ? "bg-archival-gold text-white font-semibold"
              : "bg-archival-surface hover:bg-archival-border/40 text-archival-muted border border-archival-border"
          }`}
        >
          Pilgrim Highways
        </button>
        <button
          type="button"
          onClick={() => setFilterType("caravan_route")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            filterType === "caravan_route"
              ? "bg-archival-gold text-white font-semibold"
              : "bg-archival-surface hover:bg-archival-border/40 text-archival-muted border border-archival-border"
          }`}
        >
          Overland Caravan Routes
        </button>
        <button
          type="button"
          onClick={() => setFilterType("maritime_lane")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            filterType === "maritime_lane"
              ? "bg-archival-gold text-white font-semibold"
              : "bg-archival-surface hover:bg-archival-border/40 text-archival-muted border border-archival-border"
          }`}
        >
          Maritime Sea Lanes
        </button>
      </div>

      {/* Routes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRoutes.map((route) => {
          const coords = (route.pathGeojson as { coordinates?: [number, number][] })?.coordinates || [];

          return (
            <article
              key={route.id}
              className="bg-archival-surface border border-archival-border rounded-xl p-5 shadow-sm hover:border-archival-gold/50 transition-colors flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Header: Type Badge & Active Years */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[11px] px-2.5 py-0.5 rounded-full border font-medium uppercase tracking-wider font-mono ${getBadgeStyle(
                      route.routeType
                    )}`}
                  >
                    {getRouteLabel(route.routeType)}
                  </span>

                  <span className="text-xs font-mono font-bold text-archival-gold bg-archival-bg px-2 py-0.5 rounded border border-archival-border">
                    {formatHistoricalYear(route.activeFromYear)} – {route.activeToYear ? formatHistoricalYear(route.activeToYear) : "present"}
                  </span>
                </div>

                <h2 className="text-lg font-serif font-bold text-archival-ink leading-snug">
                  {route.name}
                </h2>

                {/* Primary Freight */}
                {route.primaryCommodities && (
                  <div className="flex items-start gap-1.5 text-xs bg-archival-bg p-2.5 rounded border border-archival-border/60">
                    <Package className="w-3.5 h-3.5 text-archival-gold shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <span className="font-semibold text-archival-ink block">Key Freight & Traffic:</span>
                      <span className="text-archival-muted">{route.primaryCommodities}</span>
                    </div>
                  </div>
                )}

                {/* Historical Description */}
                <p className="text-xs text-archival-muted leading-relaxed font-sans">
                  {route.description}
                </p>

                {/* Waypoints Count */}
                <div className="flex items-center gap-2 text-[11px] text-archival-muted font-mono pt-1">
                  <Compass className="w-3 h-3 text-archival-gold" aria-hidden="true" />
                  <span>Mapped with {coords.length} geographic waypoints</span>
                </div>
              </div>

              {/* Card Footer: Literature & View on Map */}
              <div className="pt-3 border-t border-archival-border/60 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-[11px] text-archival-muted truncate">
                  <BookOpen className="w-3.5 h-3.5 text-archival-gold shrink-0" aria-hidden="true" />
                  <span className="truncate">{initialSources[0]?.title}</span>
                </div>

                <Link
                  href={`/?year=${route.activeFromYear}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-archival-gold hover:text-amber-800 transition-colors shrink-0"
                >
                  <span>Explore on Map</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
