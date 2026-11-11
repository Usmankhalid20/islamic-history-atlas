import React from "react";
import {
  X,
  ShieldAlert,
  Calendar,
  User,
  MapPin,
  Award,
  BookOpen,
  Building,
  Swords,
  ArrowRight,
} from "lucide-react";
import type { NewCampaignRecord } from "@/lib/db/schema/campaigns";
import type { HistoricalEventRecord } from "@/lib/db/schema/historicalEvents";
import type { NewPolityRecord } from "@/lib/db/schema/polities";
import { initialSources, initialPolities } from "@/lib/data/historicalSeed";
import { getBattlesForCampaign, convertBattleToEventRecord } from "@/lib/data/historicalBattlesSeed";
import { formatHistoricalYear, getPolityColor } from "@/lib/utils";

interface CampaignDetailPanelProps {
  campaign: Omit<NewCampaignRecord, "createdAt"> & { createdAt?: Date };
  onClose: () => void;
  onSelectEvent?: (event: HistoricalEventRecord) => void;
  onSelectPolity?: (polity: NewPolityRecord) => void;
}

export function CampaignDetailPanel({
  campaign,
  onClose,
  onSelectEvent,
  onSelectPolity,
}: CampaignDetailPanelProps) {
  const source = initialSources[0];
  const polity = initialPolities.find((p) => p.id === campaign.polityId);
  const campaignBattles = getBattlesForCampaign(campaign.id);

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
            <span>Commanding Dynasty:</span>
          </span>
          <div className="flex items-center gap-2">
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
            {onSelectPolity && (
              <button
                type="button"
                onClick={() => onSelectPolity(polity)}
                className="text-archival-gold hover:text-archival-ink transition-colors p-1"
                title={`Inspect ${polity.canonicalName}`}
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Linked Major Historical Battles */}
      {campaignBattles.length > 0 && (
        <div className="bg-archival-bg p-3 rounded-lg border border-archival-border/80 space-y-2">
          <span className="text-xs font-semibold font-serif text-archival-ink flex items-center gap-1.5">
            <Swords className="w-3.5 h-3.5 text-red-600" aria-hidden="true" />
            <span>Pivotal Engagements of this Expedition:</span>
          </span>
          <div className="space-y-1.5">
            {campaignBattles.map((bat) => (
              <div
                key={bat.id}
                className="flex items-center justify-between gap-2 p-2 rounded bg-archival-surface border border-archival-border/60 text-xs"
              >
                <div className="space-y-0.5 truncate">
                  <span className="font-serif font-bold text-archival-ink truncate block">
                    {bat.name}
                  </span>
                  <span className="text-[10px] text-archival-muted font-mono">
                    {formatHistoricalYear(bat.year)} • {bat.locationName}
                  </span>
                </div>
                {onSelectEvent && (
                  <button
                    type="button"
                    onClick={() => onSelectEvent(convertBattleToEventRecord(bat))}
                    className="px-2 py-1 rounded bg-red-100 hover:bg-red-200 text-red-900 text-[11px] font-medium transition-colors shrink-0 flex items-center gap-0.5"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
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
