import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Crown, Calendar, BookOpen, ArrowLeft, ExternalLink, Swords, Landmark, ShieldCheck } from "lucide-react";
import {
  initialRulers,
  initialReigns,
  initialPolities,
  initialHistoricalEvents,
  initialSources,
} from "@/lib/data/historicalSeed";
import { formatHistoricalYear } from "@/lib/utils";

interface RulerPageProps {
  params: {
    id: string;
  };
}

export function generateStaticParams() {
  return initialRulers.map((ruler) => ({
    id: ruler.id,
  }));
}

export default function RulerDetailPage({ params }: RulerPageProps) {
  const ruler = initialRulers.find((r) => r.id === params.id);

  if (!ruler) {
    notFound();
  }

  const reign = initialReigns.find((r) => r.rulerId === ruler.id);
  const polity = reign ? initialPolities.find((p) => p.id === reign.polityId) : undefined;
  const source = initialSources[1] || initialSources[0]; // C.E. Bosworth or Kennedy

  // Events occurring during reign
  const reignEvents = reign
    ? initialHistoricalEvents.filter(
        (e) =>
          e.eventYear >= reign.startYear &&
          (!reign.endYear || e.eventYear <= reign.endYear)
      )
    : [];

  const reignDuration = reign
    ? (reign.endYear ? reign.endYear - reign.startYear : 0)
    : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      {/* Back Navigation */}
      <div>
        <Link
          href="/rulers"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-archival-muted hover:text-archival-ink transition-colors focus-visible:rounded"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-archival-gold" aria-hidden="true" />
          <span>Back to Rulers & Caliphs Directory</span>
        </Link>
      </div>

      {/* Header Banner */}
      <section className="bg-archival-surface border border-archival-border rounded-xl p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-archival-gold/15 text-archival-gold">
              <Crown className="w-5 h-5" aria-hidden="true" />
            </span>
            {polity && (
              <Link
                href={`/polities/${polity.id}`}
                className="text-xs font-semibold uppercase tracking-wider text-archival-gold hover:underline"
              >
                {polity.canonicalName}
              </Link>
            )}
          </div>

          {reign && (
            <span className="font-mono font-bold text-sm bg-archival-bg px-3 py-1 rounded-full border border-archival-border text-archival-ink">
              Reign: {formatHistoricalYear(reign.startYear)} – {reign.endYear ? formatHistoricalYear(reign.endYear) : "present"} ({reignDuration} years)
            </span>
          )}
        </div>

        <div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-archival-ink">
            {ruler.preferredName}
          </h1>
          {reign?.title && (
            <p className="text-sm font-medium text-archival-muted mt-1">
              Title: <span className="text-archival-ink font-semibold">{reign.title}</span>
            </p>
          )}
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main Column: Biography & Events */}
        <div className="lg:col-span-2 space-y-6">
          {/* Biography Card */}
          <div className="bg-archival-surface border border-archival-border rounded-xl p-6 space-y-3">
            <h2 className="text-lg font-serif font-bold text-archival-ink flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-archival-gold" aria-hidden="true" />
              <span>Historical Biography & Context</span>
            </h2>
            <p className="text-sm text-archival-ink/90 leading-relaxed font-sans whitespace-pre-line">
              {ruler.biography || "No detailed biography recorded in seed records."}
            </p>
          </div>

          {/* Events During Reign */}
          <div className="bg-archival-surface border border-archival-border rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-serif font-bold text-archival-ink flex items-center gap-2">
                <Swords className="w-4 h-4 text-archival-gold" aria-hidden="true" />
                <span>Notable Events During Reign ({reignEvents.length})</span>
              </h2>
            </div>

            {reignEvents.length === 0 ? (
              <p className="text-xs text-archival-muted italic">
                No major military engagements or city foundations currently cataloged in the MVP seed events for this specific reign window.
              </p>
            ) : (
              <div className="space-y-3">
                {reignEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-3.5 bg-archival-bg rounded-lg border border-archival-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-archival-gold">
                          {formatHistoricalYear(evt.eventYear)}
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded-full border bg-archival-surface text-archival-ink capitalize">
                          {evt.eventType}
                        </span>
                        <span className="font-serif font-semibold text-archival-ink text-sm">
                          {evt.title}
                        </span>
                      </div>
                      <p className="text-xs text-archival-muted font-sans">
                        {evt.summary}
                      </p>
                    </div>

                    <Link
                      href={`/?year=${evt.eventYear}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-archival-gold hover:text-amber-800 transition-colors shrink-0 self-end sm:self-center"
                    >
                      <span>Map</span>
                      <ExternalLink className="w-3 h-3" aria-hidden="true" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Metadata, Dynasty, Map Jump & Literature */}
        <div className="space-y-6">
          {/* Map Accession Action */}
          {reign && (
            <div className="bg-archival-surface border border-archival-gold/40 rounded-xl p-5 space-y-3 text-center">
              <h3 className="font-serif font-bold text-archival-ink text-base">
                Explore in Atlas Map
              </h3>
              <p className="text-xs text-archival-muted">
                Inspect changing territorial boundaries and concurrent dynasties in {formatHistoricalYear(reign.startYear)}.
              </p>
              <Link
                href={`/?year=${reign.startYear}`}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-lg bg-archival-gold text-white text-xs font-semibold hover:bg-amber-700 transition-colors"
              >
                <span>View Map in {formatHistoricalYear(reign.startYear)}</span>
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
          )}

          {/* Chronological Stats Card */}
          <div className="bg-archival-surface border border-archival-border rounded-xl p-5 space-y-3 text-xs">
            <h3 className="font-serif font-bold text-archival-ink text-sm flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-archival-gold" aria-hidden="true" />
              <span>Chronological Record</span>
            </h3>

            <div className="space-y-2 border-t border-archival-border/60 pt-2 text-archival-muted">
              <div className="flex justify-between">
                <span>Birth:</span>
                <span className="font-mono text-archival-ink font-medium">
                  {ruler.birthYear ? formatHistoricalYear(ruler.birthYear) : "Recorded circa"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Death:</span>
                <span className="font-mono text-archival-ink font-medium">
                  {ruler.deathYear ? formatHistoricalYear(ruler.deathYear) : "Recorded circa"}
                </span>
              </div>
              {reign && (
                <>
                  <div className="flex justify-between">
                    <span>Reign Interval:</span>
                    <span className="font-mono text-archival-ink font-medium">
                      {formatHistoricalYear(reign.startYear)} – {reign.endYear ? formatHistoricalYear(reign.endYear) : "present"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Reign Duration:</span>
                    <span className="font-mono text-archival-ink font-medium">
                      {reignDuration} years
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Associated Polity Card */}
          {polity && (
            <div className="bg-archival-surface border border-archival-border rounded-xl p-5 space-y-3 text-xs">
              <h3 className="font-serif font-bold text-archival-ink text-sm flex items-center gap-1.5">
                <Landmark className="w-4 h-4 text-archival-gold" aria-hidden="true" />
                <span>Associated Polity</span>
              </h3>
              <p className="font-serif font-semibold text-archival-ink text-base">
                {polity.canonicalName}
              </p>
              <p className="text-archival-muted leading-relaxed line-clamp-3">
                {polity.overview}
              </p>
              <div className="pt-2 border-t border-archival-border/60">
                <Link
                  href={`/polities/${polity.id}`}
                  className="text-xs font-semibold text-archival-gold hover:underline inline-flex items-center gap-1"
                >
                  <span>View Dynasty Overview</span>
                  <ExternalLink className="w-3 h-3" aria-hidden="true" />
                </Link>
              </div>
            </div>
          )}

          {/* Cited Reference Card */}
          <div className="bg-archival-surface border border-archival-border rounded-xl p-5 space-y-3 text-xs">
            <h3 className="font-serif font-bold text-archival-ink text-sm flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" aria-hidden="true" />
              <span>Evidence & Authority</span>
            </h3>
            <p className="text-archival-muted">
              Chronological dates, caliphal titles, and genealogical relations are sourced from:
            </p>
            <div className="bg-archival-bg p-3 rounded border border-archival-border/60 space-y-1">
              <p className="font-semibold text-archival-ink">{source?.title}</p>
              <p className="text-[11px] text-archival-muted">{source?.citationText}</p>
            </div>
            <Link
              href="/sources"
              className="text-xs font-semibold text-archival-gold hover:underline block pt-1"
            >
              Browse Complete Sources Register →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
