"use client";

import React, { useState } from "react";
import { Sparkles, X, Send, BookOpen, AlertCircle, Loader2 } from "lucide-react";
import { formatHistoricalYear } from "@/lib/utils";

interface HistoricalInquiryWidgetProps {
  currentYear: number;
  activePolities: string[];
  onClose: () => void;
}

export function HistoricalInquiryWidget({
  currentYear,
  activePolities,
  onClose,
}: HistoricalInquiryWidgetProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [modelUsed, setModelUsed] = useState<string | null>(null);
  const [suggestedSources, setSuggestedSources] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const suggestedPrompts = [
    `What major geopolitical shifts occurred around ${formatHistoricalYear(currentYear)}?`,
    `How did Islamic territorial administration function in this period?`,
    `What primary sources document this era (e.g., al-Tabari, al-Baladhuri)?`,
  ];

  async function handleSubmit(textToSubmit?: string) {
    const text = textToSubmit || query;
    if (!text || text.trim().length < 3) return;

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch("/api/ai/inquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: text,
          year: currentYear,
          polities: activePolities,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.answer || data.error || "Failed to query scholarly engine");
      }

      setResponse(data.answer);
      setModelUsed(data.modelUsed);
      if (data.sourcesSuggested) {
        setSuggestedSources(data.sourcesSuggested);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      role="region"
      aria-label="Historical AI Scholar"
      className="bg-archival-surface border border-archival-gold/40 rounded-xl p-5 shadow-lg space-y-4 animate-in fade-in slide-in-from-top-2 duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-archival-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-archival-gold/15 text-archival-gold flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-archival-ink text-base">
              Historical AI Research Scholar
            </h3>
            <p className="text-xs text-archival-muted">
              Grounded in peer-reviewed historiography & classical chronicles
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-archival-muted hover:text-archival-ink hover:bg-archival-bg transition-colors"
          aria-label="Close AI Scholar"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>

      {/* Context Pill */}
      <div className="flex flex-wrap items-center gap-2 text-xs bg-archival-bg p-2.5 rounded-lg border border-archival-border/60">
        <span className="font-serif font-semibold text-archival-ink">Atlas Focus:</span>
        <span className="font-mono bg-archival-gold/15 text-archival-ink px-2 py-0.5 rounded font-medium">
          {formatHistoricalYear(currentYear)}
        </span>
        {activePolities.length > 0 && (
          <span className="text-archival-muted">
            • Polities: {activePolities.join(", ")}
          </span>
        )}
      </div>

      {/* Suggested Prompts */}
      {!response && !loading && (
        <div className="space-y-1.5">
          <span className="text-xs text-archival-muted block font-serif">
            Suggested scholarly questions:
          </span>
          <div className="flex flex-wrap gap-2">
            {suggestedPrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setQuery(prompt);
                  handleSubmit(prompt);
                }}
                className="text-left text-xs bg-archival-bg hover:bg-archival-gold/10 hover:border-archival-gold/50 border border-archival-border px-3 py-1.5 rounded-lg text-archival-ink transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="flex items-center gap-2"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Inquire about events, borders, or rulers around ${currentYear} CE...`}
          disabled={loading}
          className="flex-1 px-3 py-2 text-xs rounded-lg border border-archival-border bg-archival-bg text-archival-ink placeholder:text-archival-muted focus:outline-none focus:ring-1 focus:ring-archival-gold"
        />
        <button
          type="submit"
          disabled={loading || query.trim().length < 3}
          className="px-4 py-2 rounded-lg bg-archival-gold text-white text-xs font-semibold hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors"
        >
          {loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Inquire</span>
            </>
          )}
        </button>
      </form>

      {/* Error state */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" aria-hidden="true" />
          <div>
            <span className="font-semibold block">Inquiry failed:</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Response Display */}
      {response && (
        <div className="space-y-3 pt-3 border-t border-archival-border">
          <div className="flex items-center justify-between text-xs text-archival-muted">
            <span className="font-serif font-semibold text-archival-ink flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-archival-gold" aria-hidden="true" />
              <span>Scholar Analysis</span>
            </span>
            {modelUsed && (
              <span className="font-mono text-[10px] bg-archival-bg px-2 py-0.5 rounded border border-archival-border">
                {modelUsed}
              </span>
            )}
          </div>

          <div className="bg-archival-bg p-4 rounded-lg border border-archival-border/70 text-xs text-archival-ink space-y-2 font-sans leading-relaxed whitespace-pre-line">
            {response}
          </div>

          {suggestedSources.length > 0 && (
            <div className="pt-2 text-xs space-y-1">
              <span className="font-serif font-semibold text-archival-ink flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-archival-gold" aria-hidden="true" />
                <span>Recommended Literature:</span>
              </span>
              <ul className="list-disc pl-5 text-[11px] text-archival-muted space-y-0.5">
                {suggestedSources.map((src, i) => (
                  <li key={i}>{src}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
