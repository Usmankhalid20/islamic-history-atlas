import React from "react";
import { X, Calendar, MapPin, Swords, Flag, Landmark, BookOpen } from "lucide-react";
import type { HistoricalEventRecord } from "@/lib/db/schema/historicalEvents";
import { initialSources } from "@/lib/data/historicalSeed";
import { formatHistoricalYear } from "@/lib/utils";

interface EventDetailPanelProps {
  event: HistoricalEventRecord;
  onClose: () => void;
}

export function EventDetailPanel({ event, onClose }: EventDetailPanelProps) {
  const sources = initialSources;

  const getEventIcon = () => {
    switch (event.eventType) {
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

  return (
    <div
      role="dialog"
      aria-labelledby="event-title"
      className="bg-archival-surface border border-archival-border rounded-xl p-5 shadow-lg space-y-4 max-w-md w-full animate-in fade-in duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-archival-border">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            {getEventIcon()}
            <span className="text-xs font-mono uppercase tracking-wider text-archival-gold">
              Historical Event • {event.eventType}
            </span>
          </div>
          <h3 id="event-title" className="text-xl font-serif font-bold text-archival-ink">
            {event.title}
          </h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-archival-muted hover:text-archival-ink hover:bg-archival-bg transition-colors"
          aria-label="Close event details"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>

      {/* Date & Location Badges */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-archival-bg p-2.5 rounded border border-archival-border/60">
          <span className="text-archival-muted block mb-0.5">Year</span>
          <span className="font-mono font-semibold text-archival-ink">
            {formatHistoricalYear(event.eventYear)}
          </span>
        </div>
        <div className="bg-archival-bg p-2.5 rounded border border-archival-border/60">
          <span className="text-archival-muted block mb-0.5">Location</span>
          <span className="font-semibold text-archival-ink flex items-center gap-1 truncate">
            <MapPin className="w-3.5 h-3.5 text-archival-muted shrink-0" aria-hidden="true" />
            <span className="truncate">{event.locationName || "Recorded site"}</span>
          </span>
        </div>
      </div>

      {/* Summary */}
      <div className="space-y-1 text-xs">
        <span className="font-serif font-semibold text-archival-ink">Event Summary:</span>
        <p className="text-archival-muted leading-relaxed font-sans">{event.summary}</p>
      </div>

      {/* Cited Sources */}
      <div className="pt-3 border-t border-archival-border/60 space-y-2">
        <span className="text-xs font-semibold font-serif text-archival-ink flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-archival-gold" aria-hidden="true" />
          <span>Cited Reference:</span>
        </span>
        <div className="bg-archival-bg p-2.5 rounded border border-archival-border/40 text-[11px] text-archival-muted">
          <p className="font-medium text-archival-ink">{sources[0]?.title}</p>
          <p className="mt-0.5">{sources[0]?.citationText}</p>
        </div>
      </div>
    </div>
  );
}
