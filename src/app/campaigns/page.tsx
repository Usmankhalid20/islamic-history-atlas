"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ShieldAlert, Calendar, User, MapPin, Award, ExternalLink, Filter, BookOpen } from "lucide-react";
import { initialCampaigns, initialPolities, initialSources } from "@/lib/data/historicalSeed";
import { formatHistoricalYear, getPolityColor } from "@/lib/utils";

type CampaignFilter = "all" | "pol_rashidun" | "pol_umayyad";

export default function CampaignsPage() {
  const [filterType, setFilterType] = useState<CampaignFilter>("all");

  const filteredCampaigns = useMemo(() => {
    if (filterType === "all") return initialCampaigns;
    return initialCampaigns.filter((c) => c.polityId === filterType);
  }, [filterType]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      {/* Editorial Header */}
      <section className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-archival-surface border border-archival-border text-red-700">
          <ShieldAlert className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Strategic Cartography • 7th–8th Centuries CE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-archival-ink tracking-tight">
          Military Campaigns & Expedition Corridors
        </h1>
        <p className="text-sm sm:text-base text-archival-muted leading-relaxed max-w-3xl font-sans">
          Trace the rapid geopolitical expansion of the early Caliphates through verified military expedition vectors. From Khalid ibn al-Walid&apos;s perilous waterless Syrian desert crossing to Sa&apos;d ibn Abi Waqqas at al-Qadisiyyah, Tariq ibn Ziyad at Gibraltar, and Muhammad ibn al-Qasim in the Indus Valley.
        </p>
      </section>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-archival-border pb-4">
        <span className="text-xs font-serif font-semibold text-archival-ink mr-2 flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-archival-gold" aria-hidden="true" />
          <span>Filter by Dynasty:</span>
        </span>

        <button
          type="button"
          onClick={() => setFilterType("all")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            filterType === "all"
              ? "bg-red-700 text-white font-semibold"
              : "bg-archival-surface hover:bg-archival-border/40 text-archival-muted border border-archival-border"
          }`}
        >
          All Campaigns ({initialCampaigns.length})
        </button>
        <button
          type="button"
          onClick={() => setFilterType("pol_rashidun")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            filterType === "pol_rashidun"
              ? "bg-red-700 text-white font-semibold"
              : "bg-archival-surface hover:bg-archival-border/40 text-archival-muted border border-archival-border"
          }`}
        >
          Rashidun Expeditions (632–661 CE)
        </button>
        <button
          type="button"
          onClick={() => setFilterType("pol_umayyad")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            filterType === "pol_umayyad"
              ? "bg-red-700 text-white font-semibold"
              : "bg-archival-surface hover:bg-archival-border/40 text-archival-muted border border-archival-border"
          }`}
        >
          Umayyad Campaigns (661–750 CE)
        </button>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCampaigns.map((campaign) => {
          const polity = initialPolities.find((p) => p.id === campaign.polityId);

          const yearLabel =
            campaign.startYear === campaign.endYear
              ? formatHistoricalYear(campaign.startYear)
              : `${formatHistoricalYear(campaign.startYear)} – ${formatHistoricalYear(campaign.endYear)}`;

          return (
            <article
              key={campaign.id}
              className="bg-archival-surface border border-archival-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div className="space-y-4">
                {/* Header: Title, Years & Polity */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-archival-border">
                  <div>
                    <h2 className="text-xl font-serif font-bold text-archival-ink">
                      {campaign.name}
                    </h2>
                    <div className="flex items-center gap-2 mt-1 text-xs text-archival-muted">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-archival-gold" aria-hidden="true" />
                        <span className="font-medium text-archival-ink">{campaign.commanderName}</span>
                      </span>
                      {polity && (
                        <>
                          <span>•</span>
                          <span
                            className="font-medium px-1.5 py-0.5 rounded text-[10px]"
                            style={{
                              backgroundColor: `${getPolityColor(polity.id)}15`,
                              color: getPolityColor(polity.id),
                            }}
                          >
                            {polity.canonicalName}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-archival-bg border border-archival-border text-archival-ink shrink-0">
                    <Calendar className="w-3 h-3 inline mr-1 text-archival-gold" aria-hidden="true" />
                    {yearLabel}
                  </span>
                </div>

                {/* Key March Corridors */}
                <div className="bg-archival-bg p-3 rounded-lg border border-archival-border/60 text-xs space-y-1">
                  <span className="font-serif font-semibold text-archival-ink flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-red-600" aria-hidden="true" />
                    <span>March Route & Staging Points:</span>
                  </span>
                  <p className="text-archival-ink/90 font-mono text-[11px] leading-relaxed">
                    {campaign.keyLocations}
                  </p>
                </div>

                {/* Strategic Outcome */}
                <div className="bg-red-50/50 p-3 rounded-lg border border-red-200/80 text-xs space-y-1">
                  <span className="font-serif font-semibold text-red-950 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-red-600" aria-hidden="true" />
                    <span>Strategic Outcome:</span>
                  </span>
                  <p className="text-red-900 font-sans leading-relaxed">
                    {campaign.strategicOutcome}
                  </p>
                </div>

                {/* Description */}
                <p className="text-xs text-archival-muted leading-relaxed font-sans">
                  {campaign.description}
                </p>
              </div>

              {/* Action Button: Explore on Map */}
              <div className="pt-3 border-t border-archival-border/60 flex items-center justify-between text-xs">
                <span className="text-[11px] text-archival-muted font-mono">
                  Vector: {campaign.routeGeojson ? "GeoJSON LineString" : ""}
                </span>
                <Link
                  href={`/?year=${campaign.startYear}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-700 hover:bg-red-800 text-white font-medium text-xs transition-colors shadow-sm"
                  aria-label={`Explore ${campaign.name} on map at year ${campaign.startYear}`}
                >
                  <span>Explore March on Map</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      {/* Primary Historiographical Sources */}
      <section className="bg-archival-surface border border-archival-border rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2 text-archival-ink font-serif font-semibold text-sm">
          <BookOpen className="w-4 h-4 text-archival-gold" aria-hidden="true" />
          <span>Historiographical Documentation & Military Chronicles</span>
        </div>
        <p className="text-xs text-archival-muted leading-relaxed font-sans">
          Expedition waypoints, army strengths, and tactical maneuvers are corroborated against al-Tabari (*Ta&apos;rikh al-Rusul wa&apos;l-Muluk*), al-Baladhuri (*Futuh al-Buldan*), Ibn Abd al-Hakam (*Futuh Misr wa-Akhbaruha*), and Hugh Kennedy (*The Great Arab Conquests: How the Spread of Islam Changed the World We Live In*).
        </p>
        <div className="text-[11px] font-mono text-archival-muted pt-2 border-t border-archival-border/40">
          Source Citation: {initialSources[0]?.citationText}
        </div>
      </section>
    </div>
  );
}
