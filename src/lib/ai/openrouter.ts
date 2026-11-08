export interface HistoricalScholarQueryOptions {
  query: string;
  year?: number;
  polities?: string[];
  model?: string;
}

export interface HistoricalScholarResponse {
  answer: string;
  modelUsed: string;
  sourcesSuggested?: string[];
  error?: string;
}

const DEFAULT_MODEL = "google/gemini-2.0-flash-001";

const SCHOLAR_SYSTEM_PROMPT = `You are the Islamic History Atlas Academic Scholar, an AI historical research assistant specializing in the classical Islamic world (600–1500 CE), with particular depth in the 7th–10th centuries CE (Rashidun, Umayyad, Abbasid, Cordoba, and Fatimid periods).

Your commitments:
1. Academic Rigor: Ground answers in peer-reviewed modern scholarship (e.g., Hugh Kennedy, C.E. Bosworth, Fred Donner, Patricia Crone, Marshall Hodgson, The Encyclopaedia of Islam / EI2) and classical Arabic historiography (al-Tabari, al-Baladhuri, al-Ya'qubi, Ibn al-Athir).
2. Dating Precision: Provide Common Era (CE) years alongside Hijri (AH) dates whenever discussing specific events or reigns (e.g., "750 CE / 132 AH").
3. Territorial Nuance: Acknowledge that historical borders were often fluid marches, garrison zones (amsar), frontier fortresses (thughur), or tribute relationships rather than modern nation-state borders.
4. Epistemic Humility: When sources dispute an event, date, or boundary, explicitly state the scholarly divergence rather than asserting certainty.
5. Conciseness & Clarity: Provide well-structured answers using clear paragraphs and bullet points where helpful.`;

export async function queryHistoricalScholar({
  query,
  year,
  polities = [],
  model = DEFAULT_MODEL,
}: HistoricalScholarQueryOptions): Promise<HistoricalScholarResponse> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey || apiKey.trim() === "" || apiKey === "your-openrouter-api-key") {
    return {
      answer:
        "The OpenRouter API key is not configured in `.env.local`. Please provide a valid `OPENROUTER_API_KEY` to enable live AI historical inquiry.",
      modelUsed: "none",
      error: "Missing API key",
    };
  }

  // Construct context-rich user prompt
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

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Islamic History Atlas",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: SCHOLAR_SYSTEM_PROMPT },
          { role: "user", content: promptContent },
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        answer: `Scholarly inquiry request failed (${response.status}): ${response.statusText}`,
        modelUsed: model,
        error: errorText,
      };
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "No response received from scholar service.";

    return {
      answer: content,
      modelUsed: data.model || model,
      sourcesSuggested: [
        "Hugh Kennedy, The Prophet and the Age of the Caliphates (Routledge, 2004)",
        "C.E. Bosworth, The New Islamic Dynasties (Columbia University Press, 1996)",
      ],
    };
  } catch (err) {
    return {
      answer: "A network or client error occurred while contacting the scholarly inquiry engine.",
      modelUsed: model,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
