import React from "react";
import { X, BookOpen, ShieldAlert, CheckCircle2, Globe } from "lucide-react";
import type { TerritoryPeriodRecord } from "@/lib/db/schema/territoryPeriods";
import { initialPolities, initialSources } from "@/lib/data/historicalSeed";
import { formatHistoricalYear } from "@/lib/utils";

interface TerritoryDetailPanelProps {
  territory: TerritoryPeriodRecord;
  onClose: () => void;
}

export function TerritoryDetailPanel({
  territory,
  onClose,
}: TerritoryDetailPanelProps) {
  const polity = initialPolities.find((p) => p.id === territory.polityId);
  const relevantSources = initialSources; // In MVP seed, all claims cite our baseline peer-reviewed works

  return (
    <div
      role="dialog"
      aria-labelledby="territory-title"
      className="bg-archival-surface border border-archival-border rounded-xl p-5 shadow-lg space-y-4 max-w-md w-full animate-in fade-in duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-archival-border">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-archival-gold">
            {polity?.canonicalName || "Polity Record"}
          </span>
          <h3 id="territory-title" className="text-xl font-serif font-bold text-archival-ink">
            {territory.regionName}
          </h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-archival-muted hover:text-archival-ink hover:bg-archival-bg transition-colors"
          aria-label="Close territory details"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>

      {/* Dates and Control Details */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-archival-bg p-2.5 rounded border border-archival-border/60">
          <span className="text-archival-muted block mb-0.5">Control Period</span>
          <span className="font-mono font-semibold text-archival-ink">
            {formatHistoricalYear(territory.validFromYear)} – {formatHistoricalYear(territory.validToYear)}
          </span>
        </div>
        <div className="bg-archival-bg p-2.5 rounded border border-archival-border/60">
          <span className="text-archival-muted block mb-0.5">Control Type</span>
          <span className="font-semibold capitalize text-archival-ink">
            {territory.controlType} control
          </span>
        </div>
      </div>

      {/* Evidence & Confidence Badge (FR-08) */}
      <div className="flex items-center gap-2 p-2.5 rounded bg-archival-bg border border-archival-border/60 text-xs">
        {territory.confidence === "well-attested" ? (
          <CheckCircle2 className="w-4 h-4 text-archival-emerald shrink-0" aria-hidden="true" />
        ) : (
          <ShieldAlert className="w-4 h-4 text-archival-gold shrink-0" aria-hidden="true" />
        )}
        <div className="leading-tight">
          <span className="font-semibold text-archival-ink capitalize">
            Confidence: {territory.confidence}
          </span>
          <p className="text-[11px] text-archival-muted mt-0.5">
            {territory.explanatoryNote || "Historical boundary based on scholarly consensus."}
          </p>
        </div>
      </div>

      {/* Polity Overview */}
      {polity && (
        <div className="space-y-1 text-xs">
          <span className="font-serif font-semibold text-archival-ink">Polity Overview:</span>
          <p className="text-archival-muted leading-relaxed">{polity.overview}</p>
        </div>
      )}

      {/* Cited Sources (FR-09) */}
      <div className="pt-3 border-t border-archival-border/60 space-y-2">
        <span className="text-xs font-semibold font-serif text-archival-ink flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-archival-gold" aria-hidden="true" />
          <span>Cited Sources:</span>
        </span>
        <ul className="space-y-1.5 text-[11px] text-archival-muted">
          {relevantSources.map((src) => (
            <li key={src.id} className="bg-archival-bg p-2 rounded border border-archival-border/40">
              <p className="font-medium text-archival-ink">{src.citationText}</p>
              {src.url && (
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-archival-gold hover:underline mt-1 font-mono text-[10px]"
                >
                  <Globe className="w-3 h-3" aria-hidden="true" />
                  <span>Verify Reference</span>
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

