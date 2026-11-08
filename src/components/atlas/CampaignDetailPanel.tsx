import React from "react";
import { X, ShieldAlert, Calendar, User, MapPin, Award, BookOpen, Building } from "lucide-react";
import type { NewCampaignRecord } from "@/lib/db/schema/campaigns";
import { initialSources, initialPolities } from "@/lib/data/historicalSeed";
import { formatHistoricalYear, getPolityColor } from "@/lib/utils";

interface CampaignDetailPanelProps {
  campaign: (Omit<NewCampaignRecord, "createdAt"> & { createdAt?: Date });
  onClose: () => void;
}

export function CampaignDetailPanel({ campaign, onClose }: CampaignDetailPanelProps) {
  const source = initialSources[0];
  const polity = initialPolities.find((p) => p.id === campaign.polityId);

  return (
    <div
      role="dialog"
      aria-labelledby="campaign-title"
      className="bg-archival-surface border border-archival-border rounded-xl p-5 shadow-lg space-y-4 max-w-md w-full animate-in fade-in duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-archival-border">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <ShieldAlert className="w-4 h-4 text-red-600" aria-hidden="true" />
            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border bg-red-100 text-red-900 border-red-300">
              Military Campaign & Expedition
            </span>
          </div>
          <h3 id="campaign-title" className="text-xl font-serif font-bold text-archival-ink">
            {campaign.name}
          </h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-archival-muted hover:text-archival-ink hover:bg-archival-bg transition-colors"
          aria-label="Close campaign details"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>

      {/* Meta Grid: Era, Commander, Dynasty */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-archival-bg p-2.5 rounded border border-archival-border/60">
          <span className="text-archival-muted block mb-0.5 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-archival-gold" aria-hidden="true" />
            <span>Campaign Years</span>
          </span>
          <span className="font-mono font-semibold text-archival-ink">
            {formatHistoricalYear(campaign.startYear)}
            {campaign.endYear !== campaign.startYear ? ` – ${formatHistoricalYear(campaign.endYear)}` : ""}
          </span>
        </div>

        <div className="bg-archival-bg p-2.5 rounded border border-archival-border/60">
          <span className="text-archival-muted block mb-0.5 flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-archival-gold" aria-hidden="true" />
            <span>Field Commander</span>
          </span>
          <span className="font-medium text-archival-ink truncate block">
            {campaign.commanderName}
          </span>
        </div>
      </div>

      {/* Patron Polity */}
      {polity && (
        <div className="bg-archival-bg p-2.5 rounded-lg border border-archival-border/60 flex items-center justify-between text-xs">
          <span className="text-archival-muted flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-archival-gold" aria-hidden="true" />
            <span>Commanding Caliphate:</span>
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

      {/* Key Waypoints & March Stages */}
      <div className="bg-archival-bg p-3 rounded-lg border border-archival-border/60 space-y-1">
        <span className="text-xs font-semibold font-serif text-archival-ink flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-red-600" aria-hidden="true" />
          <span>March Corridors & Staging Points:</span>
        </span>
        <p className="text-xs text-archival-ink/90 font-mono text-[11px] leading-relaxed">
          {campaign.keyLocations}
        </p>
      </div>

      {/* Strategic Outcome */}
      <div className="bg-red-50/60 p-3 rounded-lg border border-red-200/80 space-y-1">
        <span className="text-xs font-semibold font-serif text-red-950 flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-red-600" aria-hidden="true" />
          <span>Strategic Outcome & Impact:</span>
        </span>
        <p className="text-xs text-red-900/95 font-sans leading-relaxed">
          {campaign.strategicOutcome}
        </p>
      </div>

      {/* Historical Description */}
      {campaign.description && (
        <div className="space-y-1 text-xs">
          <span className="font-serif font-semibold text-archival-ink">Tactical Analysis:</span>
          <p className="text-archival-muted leading-relaxed font-sans">{campaign.description}</p>
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
