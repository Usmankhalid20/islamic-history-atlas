"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  X,
  Crown,
  Calendar,
  MapPin,
  Landmark,
  GraduationCap,
  Layers,
  BookOpen,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import type { NewPolityRecord } from "@/lib/db/schema/polities";
import type { TerritoryPeriodRecord } from "@/lib/db/schema/territoryPeriods";
import {
  initialTerritoryPeriods,
  initialRulers,
  initialReigns,
  initialMonuments,
  initialScholars,
  initialSources,
} from "@/lib/data/historicalSeed";
import { POLITY_COLORS } from "@/components/map/HistoricalMap";
import { formatHistoricalYear } from "@/lib/utils";

/**
 * Classical Native Script (Arabic/Persian) titles for all 21 major Islamic polities
 */
export const POLITY_NATIVE_TITLES: Record<string, { script: string; language: string }> = {
  pol_rashidun: { script: "الخلافة الراشدة", language: "Arabic" },
  pol_umayyad: { script: "الدولة الأموية", language: "Arabic" },
  pol_abbasid_early: { script: "الخلافة العباسية", language: "Arabic" },
  pol_cordoba_emirate: { script: "إمارة قرطبة", language: "Arabic" },
  pol_cordoba_caliphate: { script: "خلافة قرطبة", language: "Arabic" },
  pol_fatimid: { script: "الدولة الفاطمية", language: "Arabic" },
  pol_samanid: { script: "سامانیان", language: "Persian" },
  pol_buyid: { script: "آل بویه (دیلمیان)", language: "Persian" },
  pol_ghaznavid: { script: "غزنویان", language: "Persian" },
  pol_seljuk: { script: "سلجوقیان", language: "Persian" },
  pol_almoravid: { script: "دولة المرابطين", language: "Arabic" },
  pol_almohad: { script: "دولة الموحدين", language: "Arabic" },
  pol_zengid: { script: "الدولة الزنكية", language: "Arabic" },
  pol_ayyubid: { script: "الدولة الأيوبية", language: "Arabic" },
  pol_mamluk: { script: "سلطنة المماليك", language: "Arabic" },
  pol_mongol: { script: "ایلخانان", language: "Persian" },
  pol_delhi_sultanate: { script: "سلطنت دهلی", language: "Persian/Urdu" },
  pol_timurid: { script: "تیموریان", language: "Persian" },
  pol_ottoman: { script: "دولت علیه عثمانیه", language: "Ottoman Turkish" },
  pol_safavid: { script: "شاهنشاهی صفویه", language: "Persian" },
  pol_mughal: { script: "مغل بادشاهت (گورکانیان)", language: "Persian/Chagatai" },
};

export interface EmpireDetailPanelProps {
  polity: NewPolityRecord;
  selectedYear?: number;
  onClose: () => void;
  onSelectTerritory?: (territory: TerritoryPeriodRecord) => void;
}

type TabType = "overview" | "rulers" | "culture" | "territories" | "sources";

export function EmpireDetailPanel({
  polity,
  selectedYear,
  onClose,
  onSelectTerritory,
}: EmpireDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  const colors = POLITY_COLORS[polity.id] || { fill: "#D6A642", stroke: "#B3862B" };
  const nativeTitle = POLITY_NATIVE_TITLES[polity.id];

  // Resolve territories for this polity
  const empireTerritories = useMemo(() => {
    return initialTerritoryPeriods.filter((t) => t.polityId === polity.id);
  }, [polity.id]);

  // Find active territory in current selected year (if any)
  const activeCurrentTerritory = useMemo(() => {
    if (!selectedYear) return null;
    return empireTerritories.find(
      (t) => t.validFromYear <= selectedYear && t.validToYear >= selectedYear
    );
  }, [empireTerritories, selectedYear]);

  // Resolve rulers and reigns for this polity
  const empireReigns = useMemo(() => {
    return initialReigns.filter((r) => r.polityId === polity.id);
  }, [polity.id]);

  const empireRulersWithReigns = useMemo(() => {
    return empireReigns
      .map((reign) => {
        const ruler = initialRulers.find((r) => r.id === reign.rulerId);
        return {
          reign,
          ruler,
        };
      })
      .sort((a, b) => a.reign.startYear - b.reign.startYear);
  }, [empireReigns]);

  // Active monarch in selectedYear
  const activeReigningRuler = useMemo(() => {
    if (!selectedYear) return null;
    return empireRulersWithReigns.find(
      (item) => item.reign.startYear <= selectedYear && (item.reign.endYear ? item.reign.endYear >= selectedYear : true)
    );
  }, [empireRulersWithReigns, selectedYear]);

  // Associated monuments
  const empireMonuments = useMemo(() => {
    return initialMonuments.filter((m) => m.polityId === polity.id);
  }, [polity.id]);

  // Associated scholars
  const empireScholars = useMemo(() => {
    return initialScholars.filter((s) => s.patronizedByPolityId === polity.id);
  }, [polity.id]);

  const isCurrentlyActiveInSelectedYear =
    selectedYear !== undefined &&
    polity.startYear <= selectedYear &&
    (polity.endYear == null || polity.endYear >= selectedYear);

  const durationYears = polity.endYear != null ? polity.endYear - polity.startYear : null;

  return (
    <div
      role="dialog"
      aria-labelledby="empire-panel-title"
      className="bg-archival-surface border border-archival-border rounded-xl shadow-xl max-w-lg w-full flex flex-col max-h-[85vh] animate-in fade-in duration-200 overflow-hidden"
    >
      {/* Top Banner & Header */}
      <div
        className="p-5 border-b border-archival-border relative"
        style={{
          background: `linear-gradient(135deg, ${colors.fill}15 0%, rgba(254, 250, 242, 0.95) 100%)`,
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className="w-3.5 h-3.5 rounded-full border shadow-2xs inline-block shrink-0"
                style={{
                  backgroundColor: colors.fill,
                  borderColor: colors.stroke,
                }}
                aria-hidden="true"
              />
              <span className="text-[11px] font-mono uppercase tracking-wider text-archival-gold font-bold">
                {polity.entityType}
              </span>
              {isCurrentlyActiveInSelectedYear && selectedYear && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Active in {formatHistoricalYear(selectedYear)}
                </span>
              )}
            </div>

            <h3 id="empire-panel-title" className="text-xl sm:text-2xl font-serif font-bold text-archival-ink leading-tight">
              {polity.canonicalName}
            </h3>

            {nativeTitle && (
              <div className="text-sm font-serif font-medium text-archival-gold flex items-center gap-2" dir="rtl">
                <span>{nativeTitle.script}</span>
                <span className="text-[10px] font-mono text-archival-muted" dir="ltr">
                  ({nativeTitle.language})
                </span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-archival-muted hover:text-archival-ink hover:bg-archival-bg/80 transition-colors shrink-0"
            aria-label="Close empire information panel"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Quick Facts Grid */}
        <div className="grid grid-cols-3 gap-2 mt-4 text-[11px]">
          <div className="bg-archival-bg/80 backdrop-blur-xs p-2 rounded-lg border border-archival-border/60">
            <span className="text-archival-muted block text-[10px] uppercase font-mono">Lifespan</span>
            <span className="font-serif font-bold text-archival-ink">
              {formatHistoricalYear(polity.startYear)}–{polity.endYear ? formatHistoricalYear(polity.endYear) : "present"}
            </span>
            {durationYears && (
              <span className="text-[10px] text-archival-muted block font-mono">
                {durationYears} years
              </span>
            )}
          </div>

          <div className="bg-archival-bg/80 backdrop-blur-xs p-2 rounded-lg border border-archival-border/60">
            <span className="text-archival-muted block text-[10px] uppercase font-mono">Imperial Capital</span>
            <span className="font-serif font-bold text-archival-ink truncate block" title={polity.capitalCity || "Not established"}>
              📍 {polity.capitalCity || "Regional"}
            </span>
          </div>

          <div className="bg-archival-bg/80 backdrop-blur-xs p-2 rounded-lg border border-archival-border/60">
            <span className="text-archival-muted block text-[10px] uppercase font-mono">Attestation</span>
            <span className="font-serif font-bold text-archival-ink flex items-center gap-1 capitalize">
              <ShieldCheck className="w-3.5 h-3.5 text-archival-emerald shrink-0" />
              <span>{polity.precision}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Selected Year Active Ruler Banner (Dynamic Temporal Sync) */}
      {selectedYear && (
        <div className="bg-archival-bg px-4 py-2.5 border-b border-archival-border text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <Crown className="w-4 h-4 text-archival-gold shrink-0" />
            <span className="text-archival-muted text-[11px] shrink-0">In {formatHistoricalYear(selectedYear)}:</span>
            {activeReigningRuler ? (
              <span className="font-serif font-bold text-archival-ink truncate">
                {activeReigningRuler.ruler?.preferredName || activeReigningRuler.reign.title}
                <span className="font-mono text-archival-gold text-[10px] font-normal ml-1">
                  (r. {activeReigningRuler.reign.startYear}–{activeReigningRuler.reign.endYear} CE)
                </span>
              </span>
            ) : isCurrentlyActiveInSelectedYear ? (
              <span className="text-archival-muted italic text-[11px]">Sovereign recorded in archival registers</span>
            ) : (
              <span className="text-archival-muted italic text-[11px]">Polity not active in this year</span>
            )}
          </div>

          {activeCurrentTerritory && (
            <button
              type="button"
              onClick={() => onSelectTerritory && onSelectTerritory(activeCurrentTerritory)}
              className="text-[10px] font-mono text-archival-gold hover:underline shrink-0 flex items-center gap-0.5"
            >
              <span>Map Focus</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex border-b border-archival-border bg-archival-bg/50 px-3 gap-1 overflow-x-auto text-xs shrink-0">
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`px-3 py-2 border-b-2 font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "overview"
              ? "border-archival-gold text-archival-ink font-semibold"
              : "border-transparent text-archival-muted hover:text-archival-ink"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Overview</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("rulers")}
          className={`px-3 py-2 border-b-2 font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "rulers"
              ? "border-archival-gold text-archival-ink font-semibold"
              : "border-transparent text-archival-muted hover:text-archival-ink"
          }`}
        >
          <Crown className="w-3.5 h-3.5" />
          <span>Rulers ({empireRulersWithReigns.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("culture")}
          className={`px-3 py-2 border-b-2 font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "culture"
              ? "border-archival-gold text-archival-ink font-semibold"
              : "border-transparent text-archival-muted hover:text-archival-ink"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Monuments & Polymaths ({empireMonuments.length + empireScholars.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("territories")}
          className={`px-3 py-2 border-b-2 font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "territories"
              ? "border-archival-gold text-archival-ink font-semibold"
              : "border-transparent text-archival-muted hover:text-archival-ink"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Domains ({empireTerritories.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("sources")}
          className={`px-3 py-2 border-b-2 font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "sources"
              ? "border-archival-gold text-archival-ink font-semibold"
              : "border-transparent text-archival-muted hover:text-archival-ink"
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Sources</span>
        </button>
      </div>

      {/* Tab Content Area (Scrollable) */}
      <div className="p-5 overflow-y-auto space-y-4 text-xs leading-relaxed flex-1">
        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            <div>
              <h4 className="font-serif font-bold text-sm text-archival-ink mb-1.5">
                Historical Overview
              </h4>
              <p className="text-archival-muted leading-relaxed font-sans text-xs">
                {polity.overview}
              </p>
            </div>

            {/* Capital Migrations & Seat of Governance */}
            {polity.capitalCity && (
              <div className="bg-archival-bg p-3 rounded-lg border border-archival-border/60 space-y-1.5">
                <div className="font-serif font-bold text-xs text-archival-ink flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-archival-gold" />
                  <span>Imperial Administrative Centers & Capitals</span>
                </div>
                <p className="text-[11px] text-archival-muted font-sans">
                  The primary royal seats and administrative hubs recorded for this dynasty include:{" "}
                  <strong className="text-archival-ink font-semibold">{polity.capitalCity}</strong>.
                </p>
              </div>
            )}

            {/* Territorial Extent Summary */}
            <div className="bg-archival-bg p-3 rounded-lg border border-archival-border/60 space-y-1.5">
              <div className="font-serif font-bold text-xs text-archival-ink flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-archival-gold" />
                <span>Territorial Footprint ({empireTerritories.length} Historical Epochs)</span>
              </div>
              <p className="text-[11px] text-archival-muted font-sans">
                Features {empireTerritories.length} mapped geographical boundary periods from{" "}
                <span className="font-mono text-archival-ink font-semibold">
                  {formatHistoricalYear(polity.startYear)}
                </span>{" "}
                to{" "}
                <span className="font-mono text-archival-ink font-semibold">
                  {polity.endYear ? formatHistoricalYear(polity.endYear) : "present"}
                </span>.
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: RULERS */}
        {activeTab === "rulers" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-archival-border/60">
              <span className="font-serif font-bold text-sm text-archival-ink">
                Dynastic Sovereigns & Reigns
              </span>
              <span className="text-[11px] text-archival-muted font-mono">
                {empireRulersWithReigns.length} recorded
              </span>
            </div>

            {empireRulersWithReigns.length === 0 ? (
              <p className="text-archival-muted italic text-[11px] p-3 text-center bg-archival-bg rounded-lg">
                No specific monarchs individually cataloged in this seed period.
              </p>
            ) : (
              <div className="space-y-2">
                {empireRulersWithReigns.map(({ reign, ruler }) => {
                  const isActiveNow =
                    selectedYear !== undefined &&
                    reign.startYear <= selectedYear &&
                    (reign.endYear ? reign.endYear >= selectedYear : true);

                  return (
                    <div
                      key={reign.id}
                      className={`p-3 rounded-lg border transition-all text-xs ${
                        isActiveNow
                          ? "bg-amber-50/80 border-amber-300 shadow-2xs"
                          : "bg-archival-bg border-archival-border/60"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-serif font-bold text-sm text-archival-ink flex items-center gap-1.5">
                            {isActiveNow && <Crown className="w-3.5 h-3.5 text-amber-700 shrink-0" />}
                            <span>{ruler?.preferredName || reign.title}</span>
                          </div>
                          <span className="text-[11px] text-archival-gold font-medium">
                            {reign.title}
                          </span>
                        </div>
                        <span className="font-mono text-[11px] font-bold text-archival-ink bg-archival-surface px-2 py-0.5 rounded border border-archival-border shrink-0">
                          {reign.startYear}–{reign.endYear} CE
                        </span>
                      </div>

                      {ruler?.biography && (
                        <p className="text-[11px] text-archival-muted mt-2 leading-relaxed font-sans">
                          {ruler.biography}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CULTURE (MONUMENTS & SCHOLARS) */}
        {activeTab === "culture" && (
          <div className="space-y-4">
            {/* Architectural Monuments */}
            <div className="space-y-2">
              <span className="font-serif font-bold text-xs text-archival-ink flex items-center gap-1.5 pb-1 border-b border-archival-border/60">
                <Landmark className="w-3.5 h-3.5 text-archival-gold" />
                <span>Architectural Monuments ({empireMonuments.length})</span>
              </span>

              {empireMonuments.length === 0 ? (
                <p className="text-archival-muted italic text-[11px] p-2 bg-archival-bg rounded">
                  No prominent architectural monuments linked in current catalog.
                </p>
              ) : (
                <div className="space-y-1.5">
                  {empireMonuments.map((m) => (
                    <div
                      key={m.id}
                      className="p-2.5 rounded-lg bg-archival-bg border border-archival-border/60 flex items-start justify-between gap-2"
                    >
                      <div>
                        <div className="font-serif font-bold text-archival-ink">{m.name}</div>
                        <div className="text-[10px] text-archival-muted font-sans capitalize">
                          {m.monumentType} • Built {m.foundingYear ? `${m.foundingYear} CE` : "Historical Era"}
                        </div>
                        {m.description && (
                          <p className="text-[11px] text-archival-muted mt-1 leading-snug">
                            {m.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Polymaths & Scholars */}
            <div className="space-y-2 pt-2">
              <span className="font-serif font-bold text-xs text-archival-ink flex items-center gap-1.5 pb-1 border-b border-archival-border/60">
                <GraduationCap className="w-3.5 h-3.5 text-archival-gold" />
                <span>Golden Age Polymaths & Scholars ({empireScholars.length})</span>
              </span>

              {empireScholars.length === 0 ? (
                <p className="text-archival-muted italic text-[11px] p-2 bg-archival-bg rounded">
                  No primary polymath records cataloged specifically under this dynastic court.
                </p>
              ) : (
                <div className="space-y-1.5">
                  {empireScholars.map((s) => (
                    <div
                      key={s.id}
                      className="p-2.5 rounded-lg bg-archival-bg border border-archival-border/60 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-serif font-bold text-archival-ink">{s.name}</span>
                        {s.deathYear && (
                          <span className="font-mono text-[10px] text-archival-gold font-semibold">
                            d. {s.deathYear} CE
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] font-mono text-archival-muted">
                        Field: {s.fieldsOfStudy}
                      </div>
                      {s.biography && (
                        <p className="text-[11px] text-archival-muted leading-snug">
                          {s.biography}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: TERRITORIES & DOMAINS */}
        {activeTab === "territories" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-archival-border/60">
              <span className="font-serif font-bold text-sm text-archival-ink">
                Historical Mapped Boundaries
              </span>
              <span className="text-[11px] text-archival-muted font-mono">
                {empireTerritories.length} epochs
              </span>
            </div>

            <div className="space-y-2">
              {empireTerritories.map((t) => {
                const isActiveNow =
                  selectedYear !== undefined &&
                  t.validFromYear <= selectedYear &&
                  t.validToYear >= selectedYear;

                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => onSelectTerritory && onSelectTerritory(t)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      isActiveNow
                        ? "bg-amber-50/90 border-amber-300 shadow-2xs"
                        : "bg-archival-bg hover:bg-archival-surface border-archival-border/60"
                    }`}
                  >
                    <div className="flex items-center justify-between font-serif font-bold text-xs text-archival-ink">
                      <span>{t.regionName}</span>
                      <span className="font-mono text-[11px] text-archival-gold font-semibold">
                        {t.validFromYear}–{t.validToYear} CE
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-[10px] font-mono capitalize text-archival-muted">
                      <span>{t.controlType.replace("_", " ")} control</span>
                      <span>•</span>
                      <span>{t.confidence}</span>
                    </div>

                    {t.explanatoryNote && (
                      <p className="text-[11px] text-archival-muted mt-1.5 font-sans leading-snug">
                        {t.explanatoryNote}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: SOURCES & CITATIONS */}
        {activeTab === "sources" && (
          <div className="space-y-3">
            <span className="font-serif font-bold text-sm text-archival-ink block pb-1 border-b border-archival-border/60">
              Academic Citations & Reference Corpus
            </span>

            <ul className="space-y-2">
              {initialSources.map((src) => (
                <li
                  key={src.id}
                  className="bg-archival-bg p-3 rounded-lg border border-archival-border/60 text-[11px] space-y-1.5"
                >
                  <p className="font-serif font-medium text-archival-ink leading-relaxed">
                    {src.citationText}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-archival-muted font-mono">
                    <span>{src.publication} ({src.publicationDate})</span>
                    {src.url && (
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-archival-gold hover:underline inline-flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Source</span>
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-3 bg-archival-surface border-t border-archival-border flex items-center justify-between gap-3 shrink-0">
        <Link
          href={`/polities/${polity.id}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-archival-bg hover:bg-archival-border/40 border border-archival-border text-archival-ink transition-colors shadow-2xs"
        >
          <ExternalLink className="w-3.5 h-3.5 text-archival-gold" />
          <span>Full Polity Profile</span>
        </Link>

        <button
          type="button"
          onClick={onClose}
          className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-archival-gold text-white hover:bg-archival-gold/90 transition-colors shadow-xs"
        >
          Close
        </button>
      </div>
    </div>
  );
}
