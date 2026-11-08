"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Swords, Flag, Landmark, Calendar, MapPin, ExternalLink, Filter, BookOpen } from "lucide-react";
import { initialHistoricalEvents, initialSources } from "@/lib/data/historicalSeed";
import { formatHistoricalYear } from "@/lib/utils";

type EventTypeFilter = "all" | "battle" | "conquest" | "founding";

export default function EventsPage() {
  const [filterType, setFilterType] = useState<EventTypeFilter>("all");

  const sortedEvents = useMemo(() => {
    const list = [...initialHistoricalEvents].sort((a, b) => a.eventYear - b.eventYear);
    if (filterType === "all") return list;
    return list.filter((e) => e.eventType === filterType);
  }, [filterType]);

  const getEventIcon = (type: string) => {
    switch (type) {
      case "battle":
        return <Swords className="w-4 h-4 text-red-600" aria-hidden="true" />;
      case "conquest":
        return <Flag className="w-4 h-4 text-orange-600" aria-hidden="true" />;
      case "founding":
        return <Landmark className="w-4 h-4 text-emerald-600" aria-hidden="true" />;
      default:
        return <Calendar className="w-4 h-4 text-archival-gold" aria-hidden="true" />;
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "battle":
        return "bg-red-100 text-red-900 border-red-200";
      case "conquest":
        return "bg-orange-100 text-orange-900 border-orange-200";
      case "founding":
        return "bg-emerald-100 text-emerald-900 border-emerald-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      {/* Editorial Header */}
      <section className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-archival-surface border border-archival-border text-archival-gold">
          <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Chronological Register • 7th–10th Centuries CE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-archival-ink tracking-tight">
          Historical Events & Turning Points
        </h1>
        <p className="text-sm sm:text-base text-archival-muted leading-relaxed max-w-3xl font-sans">
          Decisive military engagements, territorial conquests, and dynastic capital foundations across the Islamic world. Each event is anchored to geographical coordinates and linked to peer-reviewed historiography.
        </p>
      </section>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-archival-border pb-4">
        <span className="text-xs font-serif font-semibold text-archival-ink mr-2 flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-archival-gold" aria-hidden="true" />
          <span>Filter by Type:</span>
        </span>

        {(["all", "battle", "conquest", "founding"] as const).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setFilterType(type)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
              filterType === type
                ? "bg-archival-gold text-white font-semibold"
                : "bg-archival-surface hover:bg-archival-border/40 text-archival-muted border border-archival-border"
            }`}
          >
            {type === "all" ? "All Events" : `${type}s`}
          </button>
        ))}

        <span className="ml-auto text-xs text-archival-muted font-mono">
          Showing {sortedEvents.length} events
        </span>
      </div>

      {/* Events Timeline List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sortedEvents.map((event) => {
          const coords = (event.locationGeojson as { coordinates?: [number, number] })?.coordinates;

          return (
            <article
              key={event.id}
              className="bg-archival-surface border border-archival-border rounded-xl p-5 shadow-sm hover:border-archival-gold/50 transition-colors flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Header: Year, Type Badge, and Title */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm bg-archival-bg px-2.5 py-1 rounded border border-archival-border text-archival-gold">
                      {formatHistoricalYear(event.eventYear)}
                    </span>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full border capitalize font-medium flex items-center gap-1 ${getBadgeColor(
                        event.eventType
                      )}`}
                    >
                      {getEventIcon(event.eventType)}
                      <span>{event.eventType}</span>
                    </span>
                  </div>
                </div>

                <h2 className="text-lg font-serif font-bold text-archival-ink leading-snug">
                  {event.title}
                </h2>

                {/* Location */}
                <div className="flex items-center gap-1.5 text-xs text-archival-muted">
                  <MapPin className="w-3.5 h-3.5 text-archival-gold shrink-0" aria-hidden="true" />
                  <span className="font-medium text-archival-ink">{event.locationName}</span>
                  {coords && (
                    <span className="font-mono text-[10px] text-archival-muted">
                      ({coords[1].toFixed(2)}° N, {coords[0].toFixed(2)}° E)
                    </span>
                  )}
                </div>

                {/* Summary */}
                <p className="text-xs text-archival-muted leading-relaxed font-sans">
                  {event.summary}
                </p>
              </div>

              {/* Footer: Citations & View on Map button */}
              <div className="pt-3 border-t border-archival-border/60 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-[11px] text-archival-muted truncate">
                  <BookOpen className="w-3.5 h-3.5 text-archival-gold shrink-0" aria-hidden="true" />
                  <span className="truncate">{initialSources[0]?.title}</span>
                </div>

                <Link
                  href={`/?year=${event.eventYear}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-archival-gold hover:text-amber-800 transition-colors shrink-0"
                >
                  <span>View on Map</span>
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
