import React from "react";
import { X, Landmark, MapPin, Calendar, Building, BookOpen } from "lucide-react";
import type { NewMonumentRecord } from "@/lib/db/schema/monuments";
import { initialSources, initialPolities } from "@/lib/data/historicalSeed";
import { formatHistoricalYear, getPolityColor } from "@/lib/utils";

interface MonumentDetailPanelProps {
  monument: (Omit<NewMonumentRecord, "createdAt"> & { createdAt?: Date });
  onClose: () => void;
}

export function MonumentDetailPanel({ monument, onClose }: MonumentDetailPanelProps) {
  const source = initialSources[0];
  const polity = initialPolities.find((p) => p.id === monument.polityId);

  const getMonumentBadgeColor = () => {
    switch (monument.monumentType) {
      case "mosque":
        return "bg-emerald-100 text-emerald-900 border-emerald-300";
      case "academy_library":
        return "bg-purple-100 text-purple-900 border-purple-300";
      case "palace":
        return "bg-amber-100 text-amber-900 border-amber-300";
      case "observatory":
        return "bg-blue-100 text-blue-900 border-blue-300";
      default:
        return "bg-stone-100 text-stone-900 border-stone-300";
    }
  };

  const getMonumentTypeLabel = () => {
    switch (monument.monumentType) {
      case "mosque":
        return "Mosque & Sanctuary";
      case "academy_library":
        return "Academy & Library";
      case "palace":
        return "Palace & Citadel";
      case "observatory":
        return "Astronomical Observatory";
      default:
        return monument.monumentType.replace("_", " ");
    }
  };

  return (
    <div
      role="dialog"
      aria-labelledby="monument-title"
      className="bg-archival-surface border border-archival-border rounded-xl p-5 shadow-lg space-y-4 max-w-md w-full animate-in fade-in duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-archival-border">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <Landmark className="w-4 h-4 text-purple-600" aria-hidden="true" />
            <span
              className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border ${getMonumentBadgeColor()}`}
            >
              {getMonumentTypeLabel()}
            </span>
          </div>
          <h3 id="monument-title" className="text-xl font-serif font-bold text-archival-ink">
            {monument.name}
          </h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-archival-muted hover:text-archival-ink hover:bg-archival-bg transition-colors"
          aria-label="Close monument details"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>

      {/* Meta Grid: Year, City, Patron Polity */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-archival-bg p-2.5 rounded border border-archival-border/60">
          <span className="text-archival-muted block mb-0.5 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-archival-gold" aria-hidden="true" />
            <span>Founded</span>
          </span>
          <span className="font-mono font-semibold text-archival-ink">
            {formatHistoricalYear(monument.foundingYear)}
          </span>
        </div>
        <div className="bg-archival-bg p-2.5 rounded border border-archival-border/60">
          <span className="text-archival-muted block mb-0.5 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-archival-gold" aria-hidden="true" />
            <span>City Location</span>
          </span>
          <span className="font-medium text-archival-ink truncate block">
            {monument.cityName}
          </span>
        </div>
      </div>

      {/* Patron Polity */}
      {polity && (
        <div className="bg-archival-bg p-2.5 rounded-lg border border-archival-border/60 flex items-center justify-between text-xs">
          <span className="text-archival-muted flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-archival-gold" aria-hidden="true" />
            <span>Patron Dynasty:</span>
          </span>
          <span
            className="font-medium px-2 py-0.5 rounded text-[11px]"
            style={{
              backgroundColor: `${getPolityColor(polity.id)}15`,
              color: getPolityColor(polity.id),
              border: `1px solid ${getPolityColor(polity.id)}40`,
            }}
          >
            {polity.canonicalName}
          </span>
        </div>
      )}

      {/* Architectural Features */}
      {monument.architecturalFeatures && (
        <div className="bg-archival-bg p-3 rounded-lg border border-archival-border/60 space-y-1">
          <span className="text-xs font-semibold font-serif text-archival-ink flex items-center gap-1.5">
            <Landmark className="w-3.5 h-3.5 text-archival-gold" aria-hidden="true" />
            <span>Architectural Features & Innovations:</span>
          </span>
          <p className="text-xs text-archival-ink/90 font-sans leading-relaxed">
            {monument.architecturalFeatures}
          </p>
        </div>
      )}

      {/* Description */}
      {monument.description && (
        <div className="space-y-1 text-xs">
          <span className="font-serif font-semibold text-archival-ink">Historical Context:</span>
          <p className="text-archival-muted leading-relaxed font-sans">{monument.description}</p>
        </div>
      )}

      {/* Cited Literature */}
      <div className="pt-3 border-t border-archival-border/60 space-y-2">
        <span className="text-xs font-semibold font-serif text-archival-ink flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-archival-gold" aria-hidden="true" />
          <span>Historiographical Reference:</span>
        </span>
        <div className="bg-archival-bg p-2.5 rounded border border-archival-border/40 text-[11px] text-archival-muted">
          <p className="font-medium text-archival-ink">{source?.title}</p>
          <p className="mt-0.5">{source?.citationText}</p>
        </div>
      </div>
    </div>
  );
}
