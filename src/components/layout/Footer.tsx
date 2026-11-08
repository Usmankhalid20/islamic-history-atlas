export function Footer() {
  return (
    <footer className="border-t border-archival-border bg-archival-surface mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-archival-muted">
        <p>
          &copy; {new Date().getFullYear()} Islamic History Atlas. An evidence-based historical reference project.
        </p>
        <p>
          Historical boundaries and dates are evidence-based interpretations, not modern borders.
        </p>
      </div>
    </footer>
  );
}

