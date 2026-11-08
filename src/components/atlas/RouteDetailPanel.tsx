import React from "react";
import { X, Navigation, Compass, Package, Calendar, BookOpen } from "lucide-react";
import type { TradeRouteRecord } from "@/lib/db/schema/tradeRoutes";
import { initialSources } from "@/lib/data/historicalSeed";
import { formatHistoricalYear } from "@/lib/utils";

interface RouteDetailPanelProps {
  route: (Omit<TradeRouteRecord, "createdAt"> & { createdAt?: Date });
  onClose: () => void;
}

export function RouteDetailPanel({ route, onClose }: RouteDetailPanelProps) {
  const source = initialSources[0];

  const getRouteBadgeColor = () => {
    switch (route.routeType) {
      case "pilgrim_road":
        return "bg-amber-100 text-amber-900 border-amber-300";
      case "maritime_lane":
        return "bg-blue-100 text-blue-900 border-blue-300";
      case "caravan_route":
      default:
        return "bg-orange-100 text-orange-900 border-orange-300";
    }
  };

  const getRouteLabel = () => {
    switch (route.routeType) {
      case "pilgrim_road":
        return "Pilgrim Highway (Darb)";
      case "maritime_lane":
        return "Maritime Sea Lane";
      case "caravan_route":
      default:
        return "Overland Caravan Route";
    }
  };

  return (
    <div
      role="dialog"
      aria-labelledby="route-title"
      className="bg-archival-surface border border-archival-border rounded-xl p-5 shadow-lg space-y-4 max-w-md w-full animate-in fade-in duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-archival-border">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <Navigation className="w-4 h-4 text-archival-gold" aria-hidden="true" />
            <span
              className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border ${getRouteBadgeColor()}`}
            >
              {getRouteLabel()}
            </span>
          </div>
          <h3 id="route-title" className="text-xl font-serif font-bold text-archival-ink">
            {route.name}
          </h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-archival-muted hover:text-archival-ink hover:bg-archival-bg transition-colors"
          aria-label="Close route details"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>

      {/* Active Centuries & Commodities */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-archival-bg p-2.5 rounded border border-archival-border/60">
          <span className="text-archival-muted block mb-0.5 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-archival-gold" aria-hidden="true" />
            <span>Active Era</span>
          </span>
          <span className="font-mono font-semibold text-archival-ink">
            {formatHistoricalYear(route.activeFromYear)} – {route.activeToYear ? formatHistoricalYear(route.activeToYear) : "present"}
          </span>
        </div>
        <div className="bg-archival-bg p-2.5 rounded border border-archival-border/60">
          <span className="text-archival-muted block mb-0.5 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-archival-gold" aria-hidden="true" />
            <span>Type</span>
          </span>
          <span className="font-medium text-archival-ink capitalize truncate block">
            {route.routeType.replace("_", " ")}
          </span>
        </div>
      </div>

      {/* Commodities */}
      {route.primaryCommodities && (
        <div className="bg-archival-bg p-3 rounded-lg border border-archival-border/60 space-y-1">
          <span className="text-xs font-semibold font-serif text-archival-ink flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5 text-archival-gold" aria-hidden="true" />
            <span>Primary Freight & Traffic:</span>
          </span>
          <p className="text-xs text-archival-ink/90 font-sans">
            {route.primaryCommodities}
          </p>
        </div>
      )}

      {/* Description */}
      <div className="space-y-1 text-xs">
        <span className="font-serif font-semibold text-archival-ink">Historical Significance:</span>
        <p className="text-archival-muted leading-relaxed font-sans">{route.description}</p>
      </div>

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
