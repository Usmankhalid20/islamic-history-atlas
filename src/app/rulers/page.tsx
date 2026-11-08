"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Crown, Search, Calendar, ChevronRight, ExternalLink, Filter } from "lucide-react";
import { initialRulers, initialReigns, initialPolities } from "@/lib/data/historicalSeed";
import { formatHistoricalYear } from "@/lib/utils";

const POLITY_COLORS: Record<string, string> = {
  pol_rashidun: "bg-orange-100 text-orange-900 border-orange-200",
  pol_umayyad: "bg-amber-100 text-amber-900 border-amber-200",
  pol_abbasid_early: "bg-stone-200 text-stone-900 border-stone-300",
  pol_cordoba_emirate: "bg-emerald-100 text-emerald-900 border-emerald-200",
  pol_fatimid: "bg-blue-100 text-blue-900 border-blue-200",
};

export default function RulersPage() {
  const [selectedPolityId, setSelectedPolityId] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const combinedRulers = useMemo(() => {
    return initialRulers.map((ruler) => {
      const reign = initialReigns.find((r) => r.rulerId === ruler.id);
      const polity = reign ? initialPolities.find((p) => p.id === reign.polityId) : undefined;
      return {
        ...ruler,
        reign,
        polity,
      };
    }).sort((a, b) => {
      const aStart = a.reign?.startYear ?? a.birthYear ?? 0;
      const bStart = b.reign?.startYear ?? b.birthYear ?? 0;
      return aStart - bStart;
    });
  }, []);

  const filteredRulers = useMemo(() => {
    return combinedRulers.filter((r) => {
      const matchesPolity = selectedPolityId === "all" || r.reign?.polityId === selectedPolityId;
      const matchesSearch = searchQuery.trim() === "" ||
        r.preferredName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.biography?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesPolity && matchesSearch;
    });
  }, [combinedRulers, selectedPolityId, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      {/* Editorial Header */}
      <section className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-archival-surface border border-archival-border text-archival-gold">
          <Crown className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Biographical Register • 7th–10th Centuries CE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-archival-ink tracking-tight">
          Rulers & Caliphs Directory
        </h1>
        <p className="text-sm sm:text-base text-archival-muted leading-relaxed max-w-3xl font-sans">
          Historical caliphs, emirs, and political leaders across the early and classical Islamic eras. Every ruler record documents authenticated reign intervals, dynastic affiliations, and peer-reviewed citations from C.E. Bosworth and Hugh Kennedy.
        </p>
      </section>

      {/* Search and Filters */}
      <div className="bg-archival-surface border border-archival-border rounded-xl p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-archival-muted absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ruler name or keyword..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-archival-border bg-archival-bg text-archival-ink placeholder:text-archival-muted focus:outline-none focus:ring-1 focus:ring-archival-gold"
            />
          </div>

          <span className="text-xs text-archival-muted font-mono">
            Showing {filteredRulers.length} of {combinedRulers.length} rulers
          </span>
        </div>

        {/* Dynasty Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-archival-border/60">
          <span className="text-xs font-serif font-semibold text-archival-ink mr-2 flex items-center gap-1">
            <Filter className="w-3 h-3 text-archival-gold" aria-hidden="true" />
            <span>Dynasty:</span>
          </span>

          <button
            type="button"
            onClick={() => setSelectedPolityId("all")}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              selectedPolityId === "all"
                ? "bg-archival-gold text-white font-semibold"
                : "bg-archival-bg hover:bg-archival-border/40 text-archival-muted border border-archival-border"
            }`}
          >
            All Dynasties
          </button>

          {initialPolities.map((polity) => (
            <button
              key={polity.id}
              type="button"
              onClick={() => setSelectedPolityId(polity.id)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                selectedPolityId === polity.id
                  ? "bg-archival-gold text-white font-semibold"
                  : "bg-archival-bg hover:bg-archival-border/40 text-archival-muted border border-archival-border"
              }`}
            >
              {polity.canonicalName}
            </button>
          ))}
        </div>
      </div>

      {/* Rulers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRulers.map((ruler) => {
          const badgeClass = ruler.reign?.polityId
            ? POLITY_COLORS[ruler.reign.polityId] || "bg-gray-100 text-gray-800 border-gray-200"
            : "bg-gray-100 text-gray-800 border-gray-200";

          return (
            <article
              key={ruler.id}
              className="bg-archival-surface border border-archival-border rounded-xl p-5 shadow-sm hover:border-archival-gold/50 transition-colors flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Header: Dynasty Badge & Reign Year */}
                <div className="flex items-center justify-between gap-2">
                  {ruler.polity ? (
                    <span className={`text-[11px] px-2.5 py-0.5 rounded-full border font-medium truncate ${badgeClass}`}>
                      {ruler.polity.canonicalName}
                    </span>
                  ) : (
                    <span className="text-[11px] text-archival-muted italic">Independent</span>
                  )}

                  {ruler.reign && (
                    <span className="text-xs font-mono font-bold text-archival-gold bg-archival-bg px-2 py-0.5 rounded border border-archival-border">
                      {formatHistoricalYear(ruler.reign.startYear)}–{ruler.reign.endYear ? formatHistoricalYear(ruler.reign.endYear) : "present"}
                    </span>
                  )}
                </div>

                {/* Ruler Name & Title */}
                <div>
                  <h2 className="text-lg font-serif font-bold text-archival-ink leading-snug">
                    <Link
                      href={`/rulers/${ruler.id}`}
                      className="hover:text-archival-gold transition-colors focus-visible:rounded"
                    >
                      {ruler.preferredName}
                    </Link>
                  </h2>
                  {ruler.reign?.title && (
                    <p className="text-xs font-medium text-archival-muted mt-0.5">
                      {ruler.reign.title}
                    </p>
                  )}
                </div>

                {/* Lifespan */}
                {(ruler.birthYear || ruler.deathYear) && (
                  <div className="flex items-center gap-1.5 text-xs text-archival-muted">
                    <Calendar className="w-3.5 h-3.5 text-archival-gold shrink-0" aria-hidden="true" />
                    <span>
                      Lifespan: {ruler.birthYear ? formatHistoricalYear(ruler.birthYear) : "c."} – {ruler.deathYear ? formatHistoricalYear(ruler.deathYear) : "unknown"}
                    </span>
                  </div>
                )}

                {/* Biography excerpt */}
                {ruler.biography && (
                  <p className="text-xs text-archival-muted leading-relaxed font-sans line-clamp-3">
                    {ruler.biography}
                  </p>
                )}
              </div>

              {/* Card Footer: Detail Link & Map Jump */}
              <div className="pt-3 border-t border-archival-border/60 flex items-center justify-between gap-2">
                <Link
                  href={`/rulers/${ruler.id}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-archival-ink hover:text-archival-gold transition-colors"
                >
                  <span>View Bio & Timeline</span>
                  <ChevronRight className="w-3.5 h-3.5 text-archival-gold" aria-hidden="true" />
                </Link>

                {ruler.reign && (
                  <Link
                    href={`/?year=${ruler.reign.startYear}`}
                    className="inline-flex items-center gap-1 text-[11px] text-archival-gold hover:text-amber-800 transition-colors"
                    title={`Explore atlas map in reign accession year (${ruler.reign.startYear} CE)`}
                  >
                    <span>Map at Accession</span>
                    <ExternalLink className="w-3 h-3" aria-hidden="true" />
                  </Link>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
