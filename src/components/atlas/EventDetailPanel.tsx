import React from "react";
import {
  X,
  Calendar,
  MapPin,
  Swords,
  Flag,
  Landmark,
  BookOpen,
  Award,
  Shield,
  User,
  ArrowRight,
  Compass,
  ShieldAlert,
} from "lucide-react";
import type { HistoricalEventRecord } from "@/lib/db/schema/historicalEvents";
import type { NewCampaignRecord } from "@/lib/db/schema/campaigns";
import type { NewPolityRecord } from "@/lib/db/schema/polities";
import { initialSources, initialPolities, initialCampaigns } from "@/lib/data/historicalSeed";
import { getBattleById } from "@/lib/data/historicalBattlesSeed";
import { formatHistoricalYear, getPolityColor } from "@/lib/utils";

interface EventDetailPanelProps {
  event: HistoricalEventRecord;
  onClose: () => void;
  onSelectCampaign?: (campaign: Omit<NewCampaignRecord, "createdAt"> & { createdAt?: Date }) => void;
  onSelectPolity?: (polity: NewPolityRecord) => void;
}

export function EventDetailPanel({
  event,
  onClose,
  onSelectCampaign,
  onSelectPolity,
}: EventDetailPanelProps) {
  const sources = initialSources;
  const battle = getBattleById(event.id) || getBattleById(event.title);

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

  // If this event is a catalogued major historical battle, render the dedicated Battle Intelligence interface
  if (battle) {
    const polityA = battle.belligerentA.polityId
      ? initialPolities.find((p) => p.id === battle.belligerentA.polityId)
      : undefined;
    const polityB = battle.belligerentB.polityId
      ? initialPolities.find((p) => p.id === battle.belligerentB.polityId)
      : undefined;

    const relatedCampaign = battle.campaignId
      ? initialCampaigns.find((c) => c.id === battle.campaignId)
      : undefined;

    const isSideAWinner = battle.victor === "belligerentA";
    const isSideBWinner = battle.victor === "belligerentB";

    return (
      <div
        role="dialog"
        aria-labelledby="battle-title"
        className="bg-archival-surface border border-archival-border rounded-xl p-5 shadow-xl space-y-4 max-w-lg w-full animate-in fade-in duration-200"
      >
        {/* Header with Crossed-Swords and Classical Orthography */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-archival-border">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="p-1 rounded-md bg-red-100 text-red-700 border border-red-200">
                <Swords className="w-3.5 h-3.5" aria-hidden="true" />
              </span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-red-700 font-semibold">
                Major Historical Battle • {formatHistoricalYear(battle.year)}
              </span>
            </div>

            <div className="flex flex-col">
              {battle.nativeName && (
                <span
                  dir="rtl"
                  className="font-serif text-sm font-bold text-archival-gold tracking-wide select-all"
                >
                  {battle.nativeName}
                </span>
              )}
              <h3 id="battle-title" className="text-xl font-serif font-bold text-archival-ink leading-tight">
                {battle.name}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-archival-muted hover:text-archival-ink hover:bg-archival-bg transition-colors shrink-0"
            aria-label="Close battle briefing"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Date, Location, and Coordinates Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-archival-bg p-2.5 rounded-lg border border-archival-border/60">
            <span className="text-archival-muted block mb-0.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-archival-gold" aria-hidden="true" />
              <span>Historical Year</span>
            </span>
            <span className="font-mono font-semibold text-archival-ink">
              {formatHistoricalYear(battle.year)}
            </span>
          </div>

          <div className="bg-archival-bg p-2.5 rounded-lg border border-archival-border/60">
            <span className="text-archival-muted block mb-0.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-red-600" aria-hidden="true" />
              <span>Site & Battlefield</span>
            </span>
            <span className="font-medium text-archival-ink truncate block" title={battle.locationName}>
              {battle.locationName}
            </span>
          </div>
        </div>

        {/* Combatants & Field Commanders Faceoff Block */}
        <div className="bg-archival-bg p-3.5 rounded-xl border border-archival-border/80 space-y-3">
          <div className="flex items-center justify-between text-xs border-b border-archival-border/50 pb-2">
            <span className="font-serif font-bold text-archival-ink flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-archival-gold" aria-hidden="true" />
              <span>Opposing Belligerents & Field Commanders</span>
            </span>
            <span className="text-[10px] font-mono text-archival-muted uppercase">Combatants</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative">
            {/* Belligerent A */}
            <div
              className={`p-3 rounded-lg border transition-all ${
                isSideAWinner
                  ? "bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-400/40"
                  : "bg-archival-surface border-archival-border/70"
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-archival-muted">
                  {battle.belligerentA.role}
                </span>
                {isSideAWinner && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white tracking-wide flex items-center gap-0.5">
                    <Award className="w-3 h-3" /> VICTOR
                  </span>
                )}
              </div>

              <div className="font-serif font-bold text-sm text-archival-ink mb-1 flex items-center gap-1.5">
                {polityA && (
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: getPolityColor(polityA.id) }}
                    aria-hidden="true"
                  />
                )}
                <span>{battle.belligerentA.name}</span>
              </div>

              {polityA && onSelectPolity && (
                <button
                  type="button"
                  onClick={() => onSelectPolity(polityA)}
                  className="text-[10px] font-medium text-archival-gold hover:underline flex items-center gap-0.5 mb-2"
                >
                  <span>Inspect {polityA.canonicalName}</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </button>
              )}

              <div className="space-y-1 text-xs">
                <span className="text-[11px] text-archival-muted flex items-center gap-1 font-medium">
                  <User className="w-3 h-3 text-archival-gold" /> Commanders:
                </span>
                <ul className="text-[11px] text-archival-ink space-y-0.5 pl-3 list-disc marker:text-archival-gold">
                  {battle.belligerentA.commanders.map((cmd, idx) => (
                    <li key={idx} className="font-sans leading-tight">
                      {cmd}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Belligerent B */}
            <div
              className={`p-3 rounded-lg border transition-all ${
                isSideBWinner
                  ? "bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-400/40"
                  : "bg-archival-surface border-archival-border/70"
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-archival-muted">
                  {battle.belligerentB.role}
                </span>
                {isSideBWinner && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white tracking-wide flex items-center gap-0.5">
                    <Award className="w-3 h-3" /> VICTOR
                  </span>
                )}
              </div>

              <div className="font-serif font-bold text-sm text-archival-ink mb-1 flex items-center gap-1.5">
                {polityB && (
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: getPolityColor(polityB.id) }}
                    aria-hidden="true"
                  />
                )}
                <span>{battle.belligerentB.name}</span>
              </div>

              {polityB && onSelectPolity && (
                <button
                  type="button"
                  onClick={() => onSelectPolity(polityB)}
                  className="text-[10px] font-medium text-archival-gold hover:underline flex items-center gap-0.5 mb-2"
                >
                  <span>Inspect {polityB.canonicalName}</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </button>
              )}

              <div className="space-y-1 text-xs">
                <span className="text-[11px] text-archival-muted flex items-center gap-1 font-medium">
                  <User className="w-3 h-3 text-archival-gold" /> Commanders:
                </span>
                <ul className="text-[11px] text-archival-ink space-y-0.5 pl-3 list-disc marker:text-archival-gold">
                  {battle.belligerentB.commanders.map((cmd, idx) => (
                    <li key={idx} className="font-sans leading-tight">
                      {cmd}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Strategic Outcome & Victor Banner */}
        <div className="bg-red-50/70 p-3 rounded-lg border border-red-200/90 space-y-1">
          <span className="text-xs font-semibold font-serif text-red-950 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-red-700" aria-hidden="true" />
            <span>Strategic Outcome & Result:</span>
          </span>
          <p className="text-xs text-red-900 font-medium leading-relaxed font-sans">
            {battle.outcome}
          </p>
        </div>

        {/* Historical Significance Card */}
        <div className="bg-archival-bg p-3 rounded-lg border border-archival-border/60 space-y-1">
          <span className="text-xs font-semibold font-serif text-archival-ink flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-archival-gold" aria-hidden="true" />
            <span>Historical Significance & Geopolitical Impact:</span>
          </span>
          <p className="text-xs text-archival-muted leading-relaxed font-sans">
            {battle.historicalSignificance}
          </p>
        </div>

        {/* Tactical Maneuver Analysis */}
        <div className="space-y-1 text-xs">
          <span className="font-serif font-semibold text-archival-ink flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-archival-muted" aria-hidden="true" />
            <span>Tactical Analysis & Maneuvers:</span>
          </span>
          <p className="text-archival-muted leading-relaxed font-sans pl-1">
            {battle.tacticalSummary}
          </p>
        </div>

        {/* Linked Military Campaign Action Button */}
        {relatedCampaign && onSelectCampaign && (
          <div className="bg-archival-bg p-3 rounded-lg border border-archival-border/80 flex items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5 truncate">
              <span className="text-[10px] uppercase font-mono tracking-wider text-archival-muted block">
                Associated Campaign
              </span>
              <span className="font-serif font-bold text-archival-ink truncate block">
                {relatedCampaign.name}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onSelectCampaign(relatedCampaign)}
              className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium text-xs shadow-sm transition-colors flex items-center gap-1 shrink-0"
            >
              <span>View Campaign</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Primary Historiographical Citation */}
        <div className="pt-3 border-t border-archival-border/60 space-y-1.5">
          <span className="text-xs font-semibold font-serif text-archival-ink flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-archival-gold" aria-hidden="true" />
            <span>Historiographical Reference:</span>
          </span>
          <div className="bg-archival-bg p-2.5 rounded border border-archival-border/40 text-[11px] text-archival-muted">
            <p className="font-sans leading-relaxed">{battle.sourceCitation}</p>
          </div>
        </div>
      </div>
    );
  }

  // Standard non-battle historical event fallback (founding, conquest, treaty)
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
