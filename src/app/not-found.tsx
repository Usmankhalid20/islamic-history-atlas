import Link from "next/link";
import { Compass, Clock, GitCompare, Building2 } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-archival-surface border border-archival-border rounded-xl p-8 space-y-4 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-archival-bg border border-archival-border flex items-center justify-center mx-auto text-archival-gold">
          <Compass className="w-6 h-6" aria-hidden="true" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-mono uppercase tracking-widest text-archival-gold font-bold">
            Status 404
          </span>
          <h1 className="font-serif font-bold text-2xl text-archival-ink">
            Cartographic Region Not Found
          </h1>
        </div>

        <p className="text-xs text-archival-muted leading-relaxed">
          The coordinate, document, or historical record you navigated to does not exist in the Islamic History Atlas registry.
        </p>

        <div className="pt-4 border-t border-archival-border space-y-2">
          <Link
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-archival-ink text-archival-surface hover:bg-stone-800 text-xs font-medium transition-colors"
          >
            <Clock className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Return to Interactive Map</span>
          </Link>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <Link
              href="/compare"
              className="inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg border border-archival-border bg-archival-bg hover:bg-archival-surface text-xs font-medium text-archival-ink transition-colors"
            >
              <GitCompare className="w-3.5 h-3.5 text-archival-gold" aria-hidden="true" />
              <span>Compare Eras</span>
            </Link>

            <Link
              href="/polities"
              className="inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg border border-archival-border bg-archival-bg hover:bg-archival-surface text-xs font-medium text-archival-ink transition-colors"
            >
              <Building2 className="w-3.5 h-3.5 text-archival-gold" aria-hidden="true" />
              <span>Polities</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
