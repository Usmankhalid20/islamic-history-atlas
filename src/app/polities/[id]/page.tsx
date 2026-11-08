import { notFound } from "next/navigation";
import Link from "next/link";
import {
  initialPolities,
  initialTerritoryPeriods,
  initialSources,
  initialRulers,
  initialReigns,
} from "@/lib/data/historicalSeed";
import { formatHistoricalYear } from "@/lib/utils";
import {
  Calendar,
  MapPin,
  BookOpen,
  ArrowLeft,
  Layers,
  Globe,
  Compass,
  CheckCircle2,
  ShieldAlert,
  Crown,
  ChevronRight,
} from "lucide-react";

interface PolityDetailPageProps {
  params: { id: string };
}

export function generateStaticParams() {
  return initialPolities.map((polity) => ({
    id: polity.id,
  }));
}

export default function PolityDetailPage({ params }: PolityDetailPageProps) {
  const polity = initialPolities.find((p) => p.id === params.id);

  if (!polity) {
    notFound();
  }

  const territories = initialTerritoryPeriods.filter((t) => t.polityId === polity.id);
  const sources = initialSources; // In MVP, baseline scholarly bibliography applies to all polities

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-10">
      {/* Back Link */}
      <div>
        <Link
          href="/polities"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-archival-muted hover:text-archival-ink transition-colors"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Back to Polity Directory</span>
        </Link>
      </div>

      {/* Polity Header */}
      <div className="bg-archival-surface border border-archival-border rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-archival-border">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider bg-archival-bg border border-archival-border text-archival-gold font-mono">
                {polity.entityType}
              </span>
              <span className="text-xs text-archival-muted font-mono capitalize">
                Evidence: {polity.precision}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-archival-ink">
              {polity.canonicalName}
            </h1>
          </div>

          <Link
            href={`/?year=${polity.startYear}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-archival-gold text-white hover:bg-archival-gold/90 transition-colors shadow-sm"
          >
            <Compass className="w-4 h-4" aria-hidden="true" />
            <span>Explore on Map ({polity.startYear} CE)</span>
          </Link>
        </div>

        {/* Quick Facts */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-archival-bg p-3 rounded-lg border border-archival-border/60">
            <span className="text-archival-muted block mb-1">Lifespan</span>
            <span className="font-serif font-bold text-sm text-archival-ink flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-archival-gold" aria-hidden="true" />
              <span>
                {formatHistoricalYear(polity.startYear)} – {polity.endYear ? formatHistoricalYear(polity.endYear) : "present"}
              </span>
            </span>
          </div>

          <div className="bg-archival-bg p-3 rounded-lg border border-archival-border/60">
            <span className="text-archival-muted block mb-1">Seat of Power</span>
            <span className="font-serif font-bold text-sm text-archival-ink flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-archival-muted" aria-hidden="true" />
              <span>{polity.capitalCity || "Not established"}</span>
            </span>
          </div>

          <div className="bg-archival-bg p-3 rounded-lg border border-archival-border/60">
            <span className="text-archival-muted block mb-1">Territorial Claims</span>
            <span className="font-serif font-bold text-sm text-archival-ink flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-archival-muted" aria-hidden="true" />
              <span>{territories.length} Region(s) Recorded</span>
            </span>
          </div>
        </div>

        {/* Overview */}
        <div className="space-y-2">
          <h2 className="text-lg font-serif font-semibold text-archival-ink">
            Historical Overview
          </h2>
          <p className="text-sm sm:text-base text-archival-muted leading-relaxed font-sans">
            {polity.overview}
          </p>
        </div>
      </div>

      {/* Prominent Caliphs & Rulers */}
      {(() => {
        const polityReigns = initialReigns
          .filter((r) => r.polityId === polity.id)
          .sort((a, b) => a.startYear - b.startYear);

        if (polityReigns.length === 0) return null;

        return (
          <section aria-labelledby="rulers-heading" className="space-y-4">
            <div>
              <h2 id="rulers-heading" className="text-2xl font-serif font-bold text-archival-ink flex items-center gap-2">
                <Crown className="w-5 h-5 text-archival-gold" aria-hidden="true" />
                <span>Prominent Caliphs & Rulers ({polityReigns.length})</span>
              </h2>
              <p className="text-xs sm:text-sm text-archival-muted">
                Documented rulers of this dynasty, citing Bosworth’s New Islamic Dynasties.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {polityReigns.map((reign) => {
                const ruler = initialRulers.find((rul) => rul.id === reign.rulerId);
                if (!ruler) return null;

                return (
                  <Link
                    key={reign.id}
                    href={`/rulers/${ruler.id}`}
                    className="bg-archival-surface border border-archival-border hover:border-archival-gold/60 p-4 rounded-xl transition-colors space-y-2 group block"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-archival-gold font-bold">
                        {formatHistoricalYear(reign.startYear)}–{reign.endYear ? formatHistoricalYear(reign.endYear) : "present"}
                      </span>
                      <ChevronRight className="w-4 h-4 text-archival-muted group-hover:text-archival-gold transition-colors" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-archival-ink group-hover:text-archival-gold transition-colors">
                        {ruler.preferredName}
                      </h3>
                      {reign.title && (
                        <p className="text-[11px] text-archival-muted">{reign.title}</p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })()}

      {/* Territorial Control Records */}
      <section aria-labelledby="territories-heading" className="space-y-4">
        <div>
          <h2 id="territories-heading" className="text-2xl font-serif font-bold text-archival-ink">
            Recorded Territorial Periods
          </h2>
          <p className="text-xs sm:text-sm text-archival-muted">
            In accordance with our historical modeling rule, territorial control has its own dates separate from the dynasty’s total lifespan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {territories.length === 0 ? (
            <p className="text-xs text-archival-muted italic">
              No specific territorial polygons currently mapped for this polity in MVP scope.
            </p>
          ) : (
            territories.map((territory) => (
              <div
                key={territory.id}
                className="bg-archival-surface border border-archival-border rounded-lg p-5 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-serif font-bold text-base text-archival-ink">
                    {territory.regionName}
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium capitalize bg-archival-bg border border-archival-border text-archival-ink">
                    {territory.controlType} control
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-archival-muted">
                  <Calendar className="w-3.5 h-3.5 text-archival-gold" aria-hidden="true" />
                  <span>
                    {formatHistoricalYear(territory.validFromYear)} – {formatHistoricalYear(territory.validToYear)}
                  </span>
                </div>

                <div className="flex items-start gap-1.5 text-xs text-archival-muted">
                  {territory.confidence === "well-attested" ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-archival-emerald shrink-0 mt-0.5" aria-hidden="true" />
                  ) : (
                    <ShieldAlert className="w-3.5 h-3.5 text-archival-gold shrink-0 mt-0.5" aria-hidden="true" />
                  )}
                  <span>{territory.explanatoryNote || "Standard territorial extent based on scholarly maps."}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Cited Sources */}
      <section aria-labelledby="sources-heading" className="bg-archival-surface border border-archival-border rounded-xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-archival-border">
          <BookOpen className="w-5 h-5 text-archival-gold" aria-hidden="true" />
          <h2 id="sources-heading" className="text-xl font-serif font-bold text-archival-ink">
            Cited Scholarly Literature
          </h2>
        </div>

        <ul className="space-y-3">
          {sources.map((source) => (
            <li
              key={source.id}
              className="bg-archival-bg border border-archival-border/60 rounded-lg p-4 space-y-1.5 text-xs"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-archival-ink text-sm font-serif">
                  {source.title}
                </span>
                {source.publicationDate && (
                  <span className="font-mono text-archival-muted">{source.publicationDate}</span>
                )}
              </div>
              <p className="text-archival-muted font-sans">{source.citationText}</p>
              {source.url && (
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-archival-gold hover:underline pt-1 font-mono text-[11px]"
                >
                  <Globe className="w-3 h-3" aria-hidden="true" />
                  <span>Publisher & Citation Reference</span>
                </a>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

