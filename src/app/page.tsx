import { formatHistoricalYear } from "@/lib/utils";
import { MapPin, Calendar, BookOpen, Layers } from "lucide-react";

export default function HomePage() {
  const sampleYear = 750;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-12">
      {/* Editorial Hero Section */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-archival-surface border border-archival-border text-archival-gold">
          <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
          <span>MVP Period: 7th – 10th Centuries CE</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-archival-ink tracking-tight">
          Exploring Islamic Polities & Boundaries Across Time
        </h1>
        <p className="text-base sm:text-lg text-archival-muted leading-relaxed font-sans">
          A research-oriented historical atlas. Discover concurrent dynasties, dated territorial control, and cited primary and scholarly sources.
        </p>
      </section>

      {/* Atlas Explorer Preview Card */}
      <section aria-labelledby="explorer-heading" className="bg-archival-surface border border-archival-border rounded-xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-archival-border">
          <div>
            <h2 id="explorer-heading" className="text-xl font-serif font-semibold text-archival-ink">
              Interactive Map Preview ({formatHistoricalYear(sampleYear)})
            </h2>
            <p className="text-xs sm:text-sm text-archival-muted">
              Select a year to observe concurrent territorial claims and political shifts.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-archival-bg px-3 py-1.5 rounded-lg border border-archival-border text-xs font-mono">
            <span className="text-archival-muted">Active Year:</span>
            <span className="font-semibold text-archival-gold">{sampleYear} CE</span>
          </div>
        </div>

        {/* Map Canvas Placeholder (Ready for Leaflet) */}
        <div 
          role="region" 
          aria-label="Map Canvas Placeholder"
          className="mt-6 aspect-[16/9] sm:aspect-[21/9] bg-archival-bg/80 border border-dashed border-archival-border rounded-lg flex flex-col items-center justify-center p-6 text-center"
        >
          <Layers className="w-10 h-10 text-archival-muted/60 mb-3" aria-hidden="true" />
          <p className="font-serif text-lg font-medium text-archival-ink">
            Interactive Historical Map Engine
          </p>
          <p className="text-xs sm:text-sm text-archival-muted max-w-md mt-1">
            Historical polygon rendering pipeline configured with Leaflet. Dynamic GeoJSON layers and year timeline selector will be integrated in Milestone 2.
          </p>
        </div>
      </section>

      {/* Core Atlas Principles */}
      <section aria-labelledby="principles-heading" className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <h2 id="principles-heading" className="sr-only">Atlas Core Principles</h2>

        <div className="bg-archival-surface border border-archival-border rounded-lg p-5 space-y-2">
          <div className="w-8 h-8 rounded-full bg-archival-gold/10 text-archival-gold flex items-center justify-center font-bold text-sm">
            <MapPin className="w-4 h-4" aria-hidden="true" />
          </div>
          <h3 className="font-serif font-semibold text-archival-ink text-base">
            Time-Bounded Control
          </h3>
          <p className="text-xs sm:text-sm text-archival-muted leading-relaxed">
            Territories have distinct effective date ranges. A dynasty’s total lifespan is never treated as a static border.
          </p>
        </div>

        <div className="bg-archival-surface border border-archival-border rounded-lg p-5 space-y-2">
          <div className="w-8 h-8 rounded-full bg-archival-lapis/10 text-archival-lapis flex items-center justify-center font-bold text-sm">
            <BookOpen className="w-4 h-4" aria-hidden="true" />
          </div>
          <h3 className="font-serif font-semibold text-archival-ink text-base">
            Traceable Sources
          </h3>
          <p className="text-xs sm:text-sm text-archival-muted leading-relaxed">
            Every published polity, ruler, event, and territorial polygon links directly to cited scholarly literature.
          </p>
        </div>

        <div className="bg-archival-surface border border-archival-border rounded-lg p-5 space-y-2">
          <div className="w-8 h-8 rounded-full bg-archival-emerald/10 text-archival-emerald flex items-center justify-center font-bold text-sm">
            <Layers className="w-4 h-4" aria-hidden="true" />
          </div>
          <h3 className="font-serif font-semibold text-archival-ink text-base">
            Explicit Uncertainty
          </h3>
          <p className="text-xs sm:text-sm text-archival-muted leading-relaxed">
            Approximate dates, disputed regions, and frontier zones are explicitly signaled with evidentiary confidence notes.
          </p>
        </div>
      </section>
    </div>
  );
}

