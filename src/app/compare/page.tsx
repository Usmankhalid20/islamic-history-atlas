import type { Metadata } from "next";
import { ComparisonView } from "@/components/compare/ComparisonView";
import { GitCompare } from "lucide-react";

export const metadata: Metadata = {
  title: "Historiographical Timeline Comparison | Islamic History Atlas",
  description:
    "Compare two historical eras side-by-side with synchronized dual cartography, dynastic delta analysis, and primary source citations.",
};

export default function ComparePage() {
  return (
    <div className="space-y-6">
      {/* Page Title & Context Header */}
      <div className="space-y-1 border-b border-archival-border pb-4">
        <div className="flex items-center gap-2 text-archival-gold font-serif">
          <GitCompare className="w-5 h-5" aria-hidden="true" />
          <span className="text-xs uppercase tracking-wider font-semibold font-sans">
            Comparative Historiography
          </span>
        </div>
        <h1 className="font-serif font-bold text-2xl sm:text-3xl text-archival-ink">
          Timeline & Territorial Comparison Mode
        </h1>
        <p className="text-xs sm:text-sm text-archival-muted max-w-3xl leading-relaxed">
          Examine geopolitical transformations across the 7th–10th centuries CE. Contrast territorial control, dynastic turnover, architectural monuments, and trade networks between two historical epochs side-by-side.
        </p>
      </div>

      {/* Interactive Dual-Map Comparison View */}
      <ComparisonView />
    </div>
  );
}
