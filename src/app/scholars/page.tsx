"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { GraduationCap, MapPin, Calendar, Building, ExternalLink, Search, BookOpen, Sparkles } from "lucide-react";
import { initialScholars, initialPolities, initialSources } from "@/lib/data/historicalSeed";
import { formatHistoricalYear, getPolityColor } from "@/lib/utils";

export default function ScholarsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("all");

  const disciplines = [
    { id: "all", label: "All Disciplines" },
    { id: "mathematics", label: "Mathematics & Algebra" },
    { id: "astronomy", label: "Astronomy" },
    { id: "philosophy", label: "Philosophy & Logic" },
    { id: "medicine", label: "Medicine & Pharmacology" },
    { id: "optics", label: "Optics & Physics" },
  ];

  const filteredScholars = useMemo(() => {
    return initialScholars.filter((scholar) => {
      const matchesSearch =
        scholar.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scholar.fieldsOfStudy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scholar.primaryCity.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (scholar.majorWorks && scholar.majorWorks.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (selectedDiscipline === "all") return true;

      return scholar.fieldsOfStudy.toLowerCase().includes(selectedDiscipline.toLowerCase());
    });
  }, [searchQuery, selectedDiscipline]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      {/* Editorial Header */}
      <section className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-archival-surface border border-archival-border text-purple-700">
          <GraduationCap className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Polymaths & Scientific Pioneer Directory • 7th–10th Centuries CE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-archival-ink tracking-tight">
          Scholars, Polymaths & Philosophers
        </h1>
        <p className="text-sm sm:text-base text-archival-muted leading-relaxed max-w-3xl font-sans">
          The intellectual pioneers of the Islamic Golden Age synthesized and transcended Greco-Roman, Persian, and Indian scientific traditions. Through rigorous experimentation, observational mathematics, and systematic empirical verification, they laid the cornerstones of algebra, experimental optics, clinical medicine, and trigonometry.
        </p>
      </section>

      {/* Search and Filter Bar */}
      <div className="bg-archival-surface border border-archival-border rounded-xl p-4 space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-archival-muted" aria-hidden="true" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search scholar, discipline, city, or treatise..."
              className="w-full pl-10 pr-4 py-2 bg-archival-bg border border-archival-border rounded-lg text-xs text-archival-ink placeholder:text-archival-muted focus:outline-none focus:ring-1 focus:ring-archival-gold"
              aria-label="Search scholars by name, field, city, or work"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {disciplines.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setSelectedDiscipline(d.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedDiscipline === d.id
                    ? "bg-purple-700 text-white font-semibold"
                    : "bg-archival-bg hover:bg-archival-border/40 text-archival-muted border border-archival-border"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-archival-muted flex items-center justify-between pt-2 border-t border-archival-border/60">
          <span>Showing {filteredScholars.length} of {initialScholars.length} scholars</span>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="text-purple-700 hover:underline"
            >
              Clear search
            </button>
          )}
        </div>
      </div>

      {/* Scholars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredScholars.map((scholar) => {
          const polity = scholar.patronizedByPolityId
            ? initialPolities.find((p) => p.id === scholar.patronizedByPolityId)
            : null;

          const midpointYear =
            scholar.birthYear && scholar.deathYear
              ? Math.round((scholar.birthYear + scholar.deathYear) / 2)
              : scholar.birthYear || 800;

          return (
            <article
              key={scholar.id}
              className="bg-archival-surface border border-archival-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div className="space-y-4">
                {/* Header: Name & Lifespan */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-archival-border">
                  <div>
                    <h2 className="text-xl font-serif font-bold text-archival-ink">
                      {scholar.name}
                    </h2>
                    <div className="flex items-center gap-2 mt-1 text-xs text-archival-muted">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-archival-gold" aria-hidden="true" />
                        <span>{scholar.primaryCity}</span>
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

                  <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-archival-bg border border-archival-border text-archival-ink shrink-0">
                    <Calendar className="w-3 h-3 inline mr-1 text-archival-gold" aria-hidden="true" />
                    {scholar.birthYear ? formatHistoricalYear(scholar.birthYear) : "?"} –{" "}
                    {scholar.deathYear ? formatHistoricalYear(scholar.deathYear) : "?"}
                  </span>
                </div>

                {/* Fields of Study Badges */}
                <div className="flex flex-wrap gap-1.5">
                  {scholar.fieldsOfStudy.split(",").map((field) => (
                    <span
                      key={field.trim()}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-50 text-purple-900 border border-purple-200"
                    >
                      {field.trim()}
                    </span>
                  ))}
                </div>

                {/* Major Works */}
                {scholar.majorWorks && (
                  <div className="bg-archival-bg p-3 rounded-lg border border-archival-border/60 text-xs space-y-1">
                    <span className="font-serif font-semibold text-archival-ink flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-archival-gold" aria-hidden="true" />
                      <span>Major Treatises & Works:</span>
                    </span>
                    <p className="text-archival-ink/90 font-mono text-[11px] leading-relaxed">
                      {scholar.majorWorks}
                    </p>
                  </div>
                )}

                {/* Biography */}
                <p className="text-xs text-archival-muted leading-relaxed font-sans">
                  {scholar.biography}
                </p>
              </div>

              {/* Action Button: Explore Era on Map */}
              <div className="pt-3 border-t border-archival-border/60 flex items-center justify-between text-xs">
                <span className="text-[11px] text-archival-muted font-sans flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-archival-gold" aria-hidden="true" />
                  <span>Flourished c. {formatHistoricalYear(midpointYear)}</span>
                </span>
                <Link
                  href={`/atlas?year=${midpointYear}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-medium text-xs transition-colors shadow-sm"
                  aria-label={`Explore era on map at year ${midpointYear} during ${scholar.name}'s life`}
                >
                  <span>Explore Era on Map</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      {/* Historiographical Sources */}
      <section className="bg-archival-surface border border-archival-border rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2 text-archival-ink font-serif font-semibold text-sm">
          <BookOpen className="w-4 h-4 text-archival-gold" aria-hidden="true" />
          <span>Biographical Documentation & Primary Canons</span>
        </div>
        <p className="text-xs text-archival-muted leading-relaxed font-sans">
          Scholar chronologies, scientific breakthroughs, and patronage records are corroborated against Ibn al-Nadim (*Kitab al-Fihrist*), George Saliba (*A History of Arabic Astronomy*), A.I. Sabra (*The Optics of Ibn al-Haytham*), and the *Encyclopaedia of Islam, Second Edition* (EI2).
        </p>
        <div className="text-[11px] font-mono text-archival-muted pt-2 border-t border-archival-border/40">
          Source Citation: {initialSources[0]?.citationText}
        </div>
      </section>
    </div>
  );
}
