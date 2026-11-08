import Link from "next/link";
import { initialPolities, initialTerritoryPeriods } from "@/lib/data/historicalSeed";
import { formatHistoricalYear } from "@/lib/utils";
import { Landmark, Calendar, MapPin, ArrowRight, Layers } from "lucide-react";

export const metadata = {
  title: "Historical Polities & Dynasties | Islamic History Atlas",
  description: "Browse Islamic caliphates, emirates, and dynasties across the 7th to 10th centuries CE.",
};

export default function PolitiesPage() {
  const polities = initialPolities;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-10">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-archival-surface border border-archival-border text-archival-gold">
          <Landmark className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Polity Directory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-archival-ink tracking-tight">
          Islamic Dynasties & Polities (632 – 1000 CE)
        </h1>
        <p className="text-sm sm:text-base text-archival-muted leading-relaxed font-sans">
          Explore the major caliphates and regional emirates represented in the atlas MVP. Each entity record links to its territorial control records and scholarly citations.
        </p>
      </div>

      {/* Polities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {polities.map((polity) => {
          const associatedTerritories = initialTerritoryPeriods.filter(
            (t) => t.polityId === polity.id
          );

          return (
            <article
              key={polity.id}
              className="bg-archival-surface border border-archival-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium uppercase tracking-wider bg-archival-bg border border-archival-border text-archival-gold font-mono">
                    {polity.entityType}
                  </span>
                  <span className="text-xs font-mono text-archival-muted">
                    {polity.precision}
                  </span>
                </div>

                <h2 className="text-xl font-serif font-bold text-archival-ink">
                  {polity.canonicalName}
                </h2>

                <div className="flex flex-col gap-1 text-xs text-archival-muted font-sans">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-archival-gold" aria-hidden="true" />
                    <span className="font-mono font-medium text-archival-ink">
                      {formatHistoricalYear(polity.startYear)} – {polity.endYear ? formatHistoricalYear(polity.endYear) : "present"}
                    </span>
                  </div>
                  {polity.capitalCity && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-archival-muted" aria-hidden="true" />
                      <span>Capital: {polity.capitalCity}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-archival-muted" aria-hidden="true" />
                    <span>{associatedTerritories.length} territorial claim(s) recorded</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-archival-muted leading-relaxed line-clamp-3">
                  {polity.overview}
                </p>
              </div>

              <div className="pt-4 border-t border-archival-border/60 flex items-center justify-between">
                <Link
                  href={`/polities/${polity.id}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-archival-gold hover:text-archival-gold/80 transition-colors"
                >
                  <span>Detailed Record</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
                <Link
                  href={`/?year=${polity.startYear}`}
                  className="text-xs text-archival-muted hover:text-archival-ink underline transition-colors"
                >
                  Map ({polity.startYear} CE)
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

