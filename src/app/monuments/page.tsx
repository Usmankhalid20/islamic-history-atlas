"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Landmark, MapPin, Calendar, Building, ExternalLink, Filter, BookOpen } from "lucide-react";
import { initialMonuments, initialPolities, initialSources } from "@/lib/data/historicalSeed";
import { formatHistoricalYear, getPolityColor } from "@/lib/utils";

type MonumentFilter = "all" | "mosque" | "academy_library";

export default function MonumentsPage() {
  const [filterType, setFilterType] = useState<MonumentFilter>("all");

  const filteredMonuments = useMemo(() => {
    if (filterType === "all") return initialMonuments;
    return initialMonuments.filter((m) => m.monumentType === filterType);
  }, [filterType]);

  const getBadgeStyle = (type: string) => {
    switch (type) {
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

  const getMonumentLabel = (type: string) => {
    switch (type) {
      case "mosque":
        return "Mosque & Sanctuary";
      case "academy_library":
        return "Academy & Library";
      case "palace":
        return "Palace & Citadel";
      case "observatory":
        return "Astronomical Observatory";
      default:
        return type.replace("_", " ");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      {/* Editorial Header */}
      <section className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-archival-surface border border-archival-border text-purple-700">
          <Landmark className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Monumental Heritage • 7th–10th Centuries CE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-archival-ink tracking-tight">
          Monumental Architecture & Intellectual Centers
        </h1>
        <p className="text-sm sm:text-base text-archival-muted leading-relaxed max-w-3xl font-sans">
          From the golden mosaics of the Dome of the Rock and the hypostyle arches of Córdoba to the caliphal scriptoriums of Baghdad&apos;s House of Wisdom and the academies of Fez and Cairo, explore the architectural and intellectual landmarks that shaped the Islamic Golden Age.
        </p>
      </section>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-archival-border pb-4">
        <span className="text-xs font-serif font-semibold text-archival-ink mr-2 flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-archival-gold" aria-hidden="true" />
          <span>Filter by Category:</span>
        </span>

        <button
          type="button"
          onClick={() => setFilterType("all")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            filterType === "all"
              ? "bg-purple-700 text-white font-semibold"
              : "bg-archival-surface hover:bg-archival-border/40 text-archival-muted border border-archival-border"
          }`}
        >
          All Monuments ({initialMonuments.length})
        </button>
        <button
          type="button"
          onClick={() => setFilterType("mosque")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            filterType === "mosque"
              ? "bg-purple-700 text-white font-semibold"
              : "bg-archival-surface hover:bg-archival-border/40 text-archival-muted border border-archival-border"
          }`}
        >
          Mosques & Sanctuaries
        </button>
        <button
          type="button"
          onClick={() => setFilterType("academy_library")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            filterType === "academy_library"
              ? "bg-purple-700 text-white font-semibold"
              : "bg-archival-surface hover:bg-archival-border/40 text-archival-muted border border-archival-border"
          }`}
        >
          Academies & Libraries
        </button>
      </div>

      {/* Monuments Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMonuments.map((monument) => {
          const polity = initialPolities.find((p) => p.id === monument.polityId);

          return (
            <article
              key={monument.id}
              className="bg-archival-surface border border-archival-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Badge and Founded Year */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getBadgeStyle(
                      monument.monumentType
                    )}`}
                  >
                    {getMonumentLabel(monument.monumentType)}
                  </span>
                  <span className="text-xs font-mono text-archival-muted flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-archival-gold" aria-hidden="true" />
                    <span>Founded {formatHistoricalYear(monument.foundingYear)}</span>
                  </span>
                </div>

                {/* Monument Title */}
                <div>
                  <h2 className="text-lg font-serif font-bold text-archival-ink group-hover:text-purple-700 transition-colors">
                    {monument.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-1 text-xs text-archival-muted">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-archival-gold" aria-hidden="true" />
                      <span>{monument.cityName}</span>
                    </span>
                    {polity && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Building className="w-3 h-3 text-archival-gold" aria-hidden="true" />
                          <span
                            className="font-medium px-1.5 py-0.5 rounded text-[10px]"
                            style={{
                              backgroundColor: `${getPolityColor(polity.id)}15`,
                              color: getPolityColor(polity.id),
                            }}
                          >
                            {polity.canonicalName}
                          </span>
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Architectural Features */}
                {monument.architecturalFeatures && (
                  <div className="bg-archival-bg p-3 rounded-lg border border-archival-border/60 text-xs space-y-1">
                    <span className="font-serif font-semibold text-archival-ink block">
                      Architectural Innovations:
                    </span>
                    <p className="text-archival-ink/90 font-sans leading-relaxed">
                      {monument.architecturalFeatures}
                    </p>
                  </div>
                )}

                {/* Historical Description */}
                <p className="text-xs text-archival-muted leading-relaxed font-sans line-clamp-3">
                  {monument.description}
                </p>
              </div>

              {/* Action Button: View on Atlas Map */}
              <div className="pt-3 border-t border-archival-border/60 flex items-center justify-between text-xs">
                <span className="text-[11px] text-archival-muted font-mono">
                  {formatHistoricalYear(monument.foundingYear)}
                </span>
                <Link
                  href={`/?year=${monument.foundingYear}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-medium text-xs transition-colors shadow-sm"
                  aria-label={`View ${monument.name} on map at year ${monument.foundingYear}`}
                >
                  <span>View on Map</span>
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
          <span>Historiographical Documentation & Architectural Surveys</span>
        </div>
        <p className="text-xs text-archival-muted leading-relaxed font-sans">
          Monument chronologies, architectural measurements, and dynastic foundation decrees are grounded in the peer-reviewed works of K.A.C. Creswell (*Early Muslim Architecture*), Robert Hillenbrand (*Islamic Architecture: Form, Function, and Meaning*), and Hugh Kennedy (*The Prophet and the Age of the Caliphates*).
        </p>
        <div className="text-[11px] font-mono text-archival-muted pt-2 border-t border-archival-border/40">
          Source Citation: {initialSources[0]?.citationText}
        </div>
      </section>
    </div>
  );
}
