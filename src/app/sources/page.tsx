import { initialSources } from "@/lib/data/historicalSeed";
import { BookOpen, Globe, ShieldCheck, ExternalLink } from "lucide-react";

export const metadata = {
  title: "Sources & Citation Register | Islamic History Atlas",
  description: "Scholarly sources, literature citations, and evidence hierarchy for the Islamic History Atlas.",
};

export default function SourcesPage() {
  const sources = initialSources;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-10">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-archival-surface border border-archival-border text-archival-gold">
          <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Evidence & Provenance</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-archival-ink tracking-tight">
          Historical Sources & Citation Register
        </h1>
        <p className="text-sm sm:text-base text-archival-muted leading-relaxed font-sans">
          Every polity, territorial boundary, date, and historical event published in the atlas is grounded in peer-reviewed academic scholarship and reputable historical reference works.
        </p>
      </div>

      {/* Source Hierarchy Principles */}
      <div className="bg-archival-surface border border-archival-border rounded-xl p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-serif font-bold text-archival-ink flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-archival-gold" aria-hidden="true" />
          <span>Citation Policy & Evidence Hierarchy</span>
        </h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-archival-muted">
          <li className="bg-archival-bg p-3 rounded border border-archival-border/60">
            <strong className="text-archival-ink block mb-0.5">1. Peer-Reviewed Scholarship:</strong>
            Standard works by established historians (e.g. Hugh Kennedy, C.E. Bosworth).
          </li>
          <li className="bg-archival-bg p-3 rounded border border-archival-border/60">
            <strong className="text-archival-ink block mb-0.5">2. Scholarly Encyclopedias:</strong>
            Major reference works such as the <em>Encyclopaedia of Islam</em> (Brill) and <em>Encyclopaedia Iranica</em>.
          </li>
          <li className="bg-archival-bg p-3 rounded border border-archival-border/60">
            <strong className="text-archival-ink block mb-0.5">3. Explicit Uncertainty:</strong>
            Boundaries and dates without unassailable primary proof are marked as <em>approximate</em> or <em>disputed</em>.
          </li>
          <li className="bg-archival-bg p-3 rounded border border-archival-border/60">
            <strong className="text-archival-ink block mb-0.5">4. No Unvetted AI Claims:</strong>
            Historical records are human-reviewed against source citations before publication.
          </li>
        </ul>
      </div>

      {/* Bibliography Register */}
      <section aria-labelledby="sources-list-heading" className="space-y-4">
        <h2 id="sources-list-heading" className="text-2xl font-serif font-bold text-archival-ink">
          Academic Reference Works (MVP Register)
        </h2>

        <div className="space-y-4">
          {sources.map((src) => (
            <article
              key={src.id}
              className="bg-archival-surface border border-archival-border rounded-xl p-6 space-y-3 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="font-serif font-bold text-lg text-archival-ink">
                  {src.title}
                </h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-archival-bg border border-archival-border text-archival-muted shrink-0 self-start sm:self-auto">
                  {src.publicationDate || "Reference"}
                </span>
              </div>

              <div className="text-xs font-medium text-archival-ink font-sans">
                Author / Editorial Body: <span className="text-archival-gold">{src.authorOrOrganization}</span>
              </div>

              <blockquote className="text-xs text-archival-muted bg-archival-bg border-l-2 border-archival-gold p-3 rounded-r font-mono">
                {src.citationText}
              </blockquote>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 text-xs text-archival-muted border-t border-archival-border/60">
                <span>Usage Note: {src.licenseOrRightsNote || "Academic citation."}</span>
                {src.url && (
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-archival-gold hover:underline font-mono text-[11px]"
                  >
                    <Globe className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>View Publisher Record</span>
                    <ExternalLink className="w-3 h-3 ml-0.5" aria-hidden="true" />
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

