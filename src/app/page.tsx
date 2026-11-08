import { Calendar, MapPin, BookOpen, Layers } from "lucide-react";
import { AtlasExplorer } from "@/components/atlas/AtlasExplorer";

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-10">
      {/* Editorial Hero Section */}
      <section className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-archival-surface border border-archival-border text-archival-gold">
          <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
          <span>MVP Period: 7th – 10th Centuries CE (632 – 1000 CE)</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-archival-ink tracking-tight">
          Islamic History Atlas
        </h1>
        <p className="text-sm sm:text-base text-archival-muted leading-relaxed font-sans">
          An interactive, evidence-based historical atlas. Explore concurrent dynasties, dated territorial control, and cited primary and scholarly literature across time.
        </p>
      </section>

      {/* Main Atlas Explorer: Interactive Map & Year Slider */}
      <section aria-label="Atlas Map Explorer">
        <AtlasExplorer />
      </section>

      {/* Core Atlas Principles */}
      <section aria-labelledby="principles-heading" className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-archival-border">
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
