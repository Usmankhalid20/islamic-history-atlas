export interface HistoricalScholarQueryOptions {
  query: string;
  year?: number;
  polities?: string[];
  model?: string;
  timeoutMs?: number;
  maxTokens?: number;
  temperature?: number;
}

export interface HistoricalScholarResponse {
  answer: string;
  modelUsed: string;
  sourcesSuggested?: string[];
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  error?: string;
  status?: number;
}

export const OPENROUTER_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

/**
 * Default AI Model for Historical Inquiry
 * Configurable via OPENROUTER_MODEL in .env.local
 * Selected default: google/gemini-2.5-flash (optimal balance of speed, cost, context, and historical accuracy)
 */
export const DEFAULT_MODEL =
  process.env.OPENROUTER_MODEL || "google/gemini-2.5-flash";

export const SCHOLAR_SYSTEM_PROMPT = `You are the Islamic History Atlas Academic Scholar, an AI historical research assistant specializing in the classical Islamic world (600–1500 CE), with particular depth in the 7th–10th centuries CE (Rashidun, Umayyad, Abbasid, Cordoba, and Fatimid periods).

Your commitments:
1. Academic Rigor: Ground answers in peer-reviewed modern scholarship (e.g., Hugh Kennedy, C.E. Bosworth, Fred Donner, Patricia Crone, Marshall Hodgson, The Encyclopaedia of Islam / EI2) and classical Arabic historiography (al-Tabari, al-Baladhuri, al-Ya'qubi, Ibn al-Athir).
2. Dating Precision: Provide Common Era (CE) years alongside Hijri (AH) dates whenever discussing specific events or reigns (e.g., "750 CE / 132 AH").
3. Territorial Nuance: Acknowledge that historical borders were often fluid marches, garrison zones (amsar), frontier fortresses (thughur), or tribute relationships rather than modern nation-state borders.
4. Epistemic Humility: When sources dispute an event, date, or boundary, explicitly state the scholarly divergence rather than asserting certainty.
5. Conciseness & Clarity: Provide well-structured answers using clear paragraphs and bullet points where helpful.`;

/**
 * Returns era-appropriate suggested academic literature citations based on current timeline focus
 */
export function getSuggestedLiterature(year?: number, polities: string[] = []): string[] {
  const sources: string[] = [];

  if (year !== undefined && year <= 661) {
    sources.push("Fred Donner, The Early Islamic Conquests (Princeton University Press, 1981)");
    sources.push("Hugh Kennedy, The Great Arab Conquests (Da Capo Press, 2007)");
    sources.push("al-Tabari, Ta'rikh al-Rusul wa'l-Muluk (History of the Prophets and Kings)");
  } else if (year !== undefined && year <= 750) {
    sources.push("G.R. Hawting, The First Dynasty of Islam: The Umayyad Caliphate (Routledge, 2000)");
    sources.push("Hugh Kennedy, The Prophet and the Age of the Caliphates (Routledge, 2004)");
    sources.push("al-Baladhuri, Futuh al-Buldan (Origins of the Islamic State)");
  } else if (year !== undefined && year <= 1258) {
    sources.push("Hugh Kennedy, The Prophet and the Age of the Caliphates (Routledge, 2004)");
    sources.push("C.E. Bosworth, The New Islamic Dynasties (Columbia University Press, 1996)");
    sources.push("Marshall Hodgson, The Venture of Islam, Vols. 1–2 (University of Chicago Press, 1974)");
  } else {
    sources.push("Hugh Kennedy, The Prophet and the Age of the Caliphates (Routledge, 2004)");
    sources.push("C.E. Bosworth, The New Islamic Dynasties (Columbia University Press, 1996)");
    sources.push("P.M. Holt, Ann K.S. Lambton, Bernard Lewis, The Cambridge History of Islam (Cambridge, 1970)");
  }

  const politiesStr = polities.join(" ").toLowerCase();
  if (politiesStr.includes("cordoba") || politiesStr.includes("andalus") || politiesStr.includes("spain")) {
    sources.unshift("Hugh Kennedy, Muslim Spain and Portugal: A Political History of al-Andalus (Longman, 1996)");
  }
  if (politiesStr.includes("fatimid") || politiesStr.includes("cairo")) {
    sources.unshift("Paul E. Walker, Exploring an Islamic Empire: Fatimid History and its Sources (I.B. Tauris, 2002)");
  }

  return Array.from(new Set(sources)).slice(0, 3);
}

/**
 * Query the OpenRouter OpenAI-compatible Chat Completions API
 * Server-side only: never executes on or exposes keys to the client
 */
export async function queryHistoricalScholar({
  query,
  year,
  polities = [],
  model,
  timeoutMs = 20000,
  maxTokens = 1000,
  temperature = 0.3,
}: HistoricalScholarQueryOptions): Promise<HistoricalScholarResponse> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const effectiveModel = model || process.env.OPENROUTER_MODEL || DEFAULT_MODEL;

  // Validate API key presence
  if (!apiKey || apiKey.trim() === "" || apiKey === "your-openrouter-api-key") {
    return {
      answer:
        "The OpenRouter API key is not configured in `.env.local`. Please provide a valid `OPENROUTER_API_KEY` to enable live AI historical inquiry.",
      modelUsed: "none",
      error: "Missing API key",
      status: 401,
    };
  }

  // Construct context-rich historical user prompt
  let contextPrefix = "";
  if (year !== undefined) {
    contextPrefix += `Current Chronological Focus: ${year} CE.\n`;
  }
  if (polities.length > 0) {
    contextPrefix += `Active Polities in Focus: ${polities.join(", ")}.\n`;
  }

  const promptContent = contextPrefix
    ? `${contextPrefix}\nUser Historical Inquiry: ${query}`
    : query;

  // Timeout handler with AbortController
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(OPENROUTER_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey.trim()}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        "X-Title": "Islamic History Atlas",
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: effectiveModel,
        messages: [
          { role: "system", content: SCHOLAR_SYSTEM_PROMPT },
          { role: "user", content: promptContent },
        ],
        temperature,
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let parsedMessage = response.statusText || `HTTP ${response.status}`;
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson?.error?.message) {
          parsedMessage = errorJson.error.message;
        }
      } catch {
        if (errorText && errorText.trim().length > 0) {
          parsedMessage = errorText;
        }
      }

      let userFacingAnswer = `Scholarly inquiry request failed (${response.status}): ${parsedMessage}`;
      if (response.status === 401) {
        userFacingAnswer =
          "Authentication failed: The configured OpenRouter API key is invalid or unauthorized. Please verify OPENROUTER_API_KEY in .env.local.";
      } else if (response.status === 402) {
        userFacingAnswer = `Insufficient OpenRouter account credits: ${parsedMessage}. Please review account credits at https://openrouter.ai/settings/credits.`;
      } else if (response.status === 429) {
        userFacingAnswer =
          "OpenRouter rate limit reached. Please wait a moment before submitting additional inquiries.";
      } else if (response.status === 404) {
        userFacingAnswer = `The requested AI model "${effectiveModel}" was not found or is unavailable on OpenRouter.`;
      }

      return {
        answer: userFacingAnswer,
        modelUsed: effectiveModel,
        error: parsedMessage,
        status: response.status,
      };
    }

    const data = await response.json();
    const content =
      data.choices?.[0]?.message?.content ||
      "No textual response received from scholar service.";

    return {
      answer: content,
      modelUsed: data.model || effectiveModel,
      sourcesSuggested: getSuggestedLiterature(year, polities),
      usage: data.usage
        ? {
            promptTokens: data.usage.prompt_tokens ?? 0,
            completionTokens: data.usage.completion_tokens ?? 0,
            totalTokens: data.usage.total_tokens ?? 0,
          }
        : undefined,
      status: 200,
    };
  } catch (err) {
    if (
      err instanceof Error &&
      (err.name === "AbortError" || err.message.toLowerCase().includes("abort"))
    ) {
      return {
        answer: `Scholarly inquiry request timed out after ${Math.round(
          timeoutMs / 1000
        )} seconds. Please try again or refine your query.`,
        modelUsed: effectiveModel,
        error: "Request timeout",
        status: 504,
      };
    }

    return {
      answer:
        "A network or client error occurred while contacting the scholarly inquiry engine.",
      modelUsed: effectiveModel,
      error: err instanceof Error ? err.message : "Unknown network error",
      status: 500,
    };
  } finally {
    clearTimeout(timer);
  }
}
