import Link from "next/link";
import { Compass, BookOpen, Clock, Landmark } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-archival-border bg-archival-surface/90 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link 
          href="/" 
          className="flex items-center gap-3 font-serif text-xl tracking-tight text-archival-ink hover:text-archival-gold transition-colors focus-visible:rounded"
        >
          <Compass className="w-6 h-6 text-archival-gold" aria-hidden="true" />
          <span className="font-semibold">Islamic History Atlas</span>
        </Link>

        <nav aria-label="Main Navigation" className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm font-medium text-archival-ink hover:text-archival-gold transition-colors focus-visible:rounded py-1"
          >
            <Clock className="w-4 h-4 text-archival-muted" aria-hidden="true" />
            <span>Explore Map</span>
          </Link>
          <Link
            href="/polities"
            className="flex items-center gap-1.5 text-sm font-medium text-archival-muted hover:text-archival-ink transition-colors focus-visible:rounded py-1"
          >
            <Landmark className="w-4 h-4" aria-hidden="true" />
            <span>Polities</span>
          </Link>
          <Link
            href="/sources"
            className="flex items-center gap-1.5 text-sm font-medium text-archival-muted hover:text-archival-ink transition-colors focus-visible:rounded py-1"
          >
            <BookOpen className="w-4 h-4" aria-hidden="true" />
            <span>Sources</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
