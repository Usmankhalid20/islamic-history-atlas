import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { aiInquirySchema } from "@/lib/api/validators";
import {
  queryHistoricalScholar,
  getSuggestedLiterature,
  DEFAULT_MODEL,
} from "@/lib/ai/openrouter";
import { POST as postAiInquireRoute } from "@/app/api/ai/inquire/route";
import { NextRequest } from "next/server";

describe("Historical AI Inquiry & Scholar Validation", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.restoreAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("validates valid inquiry payloads via aiInquirySchema", () => {
    const valid = {
      query: "Why did the Abbasid revolution occur in 750 CE?",
      year: 750,
      polities: ["pol_abbasid_early", "pol_umayyad"],
    };

    const parsed = aiInquirySchema.safeParse(valid);
    expect(parsed.success).toBe(true);
  });

  it("rejects queries that are too short", () => {
    const invalid = { query: "no" };
    const parsed = aiInquirySchema.safeParse(invalid);
    expect(parsed.success).toBe(false);
  });

  it("rejects out-of-bounds historical years", () => {
    const invalidYear = { query: "Tell me about this year", year: 250 };
    const parsed = aiInquirySchema.safeParse(invalidYear);
    expect(parsed.success).toBe(false);
  });

  it("handles missing API key gracefully without crashing", async () => {
    delete process.env.OPENROUTER_API_KEY;

    const res = await queryHistoricalScholar({
      query: "Describe the Battle of Yarmouk",
      year: 636,
    });

    expect(res.error).toBe("Missing API key");
    expect(res.status).toBe(401);
    expect(res.answer).toContain("OPENROUTER_API_KEY");
  });

  it("POST /api/ai/inquire returns 400 for invalid body", async () => {
    const req = new NextRequest("http://localhost:3000/api/ai/inquire", {
      method: "POST",
      body: JSON.stringify({ query: "" }),
    });

    const res = await postAiInquireRoute(req);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.error).toBe("Invalid request payload");
  });

  it("generates era-appropriate literature suggestions", () => {
    // Rashidun era
    const earlySources = getSuggestedLiterature(634);
    expect(earlySources.some((s) => s.includes("Fred Donner"))).toBe(true);

    // Umayyad era
    const umayyadSources = getSuggestedLiterature(711);
    expect(umayyadSources.some((s) => s.includes("Hawting"))).toBe(true);

    // Abbasid era
    const abbasidSources = getSuggestedLiterature(800);
    expect(abbasidSources.some((s) => s.includes("Hugh Kennedy"))).toBe(true);

    // Andalus specific
    const andalusSources = getSuggestedLiterature(950, ["Emirate of Cordoba"]);
    expect(andalusSources.some((s) => s.includes("Muslim Spain"))).toBe(true);
  });

  it("successfully parses valid OpenRouter chat completion responses with usage metrics", async () => {
    process.env.OPENROUTER_API_KEY = "test-openrouter-key";

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        id: "gen-test-123",
        model: "google/gemini-2.5-flash",
        choices: [
          {
            message: {
              content: "The Abbasid victory in 750 CE / 132 AH shifted the imperial center eastward to Baghdad.",
            },
          },
        ],
        usage: {
          prompt_tokens: 45,
          completion_tokens: 22,
          total_tokens: 67,
        },
      }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const res = await queryHistoricalScholar({
      query: "What was the result of the Abbasid Revolution?",
      year: 750,
      polities: ["pol_abbasid_early"],
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.answer).toContain("750 CE / 132 AH");
    expect(res.modelUsed).toBe("google/gemini-2.5-flash");
    expect(res.usage).toEqual({
      promptTokens: 45,
      completionTokens: 22,
      totalTokens: 67,
    });
    expect(res.sourcesSuggested?.length).toBeGreaterThan(0);
  });

  it("handles 401 Unauthorized from OpenRouter gracefully", async () => {
    process.env.OPENROUTER_API_KEY = "invalid-key";

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        statusText: "Unauthorized",
        text: async () => JSON.stringify({ error: { message: "Invalid API key" } }),
      })
    );

    const res = await queryHistoricalScholar({
      query: "Analyze 8th century trade routes",
      year: 780,
    });

    expect(res.status).toBe(401);
    expect(res.error).toBe("Invalid API key");
    expect(res.answer).toContain("Authentication failed");
  });

  it("handles 402 Payment Required (insufficient credits) gracefully", async () => {
    process.env.OPENROUTER_API_KEY = "test-key";

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 402,
        statusText: "Payment Required",
        text: async () =>
          JSON.stringify({
            error: {
              message: "This request requires more credits, or fewer max_tokens.",
            },
          }),
      })
    );

    const res = await queryHistoricalScholar({
      query: "Analyze trade in Alexandria",
      year: 800,
    });

    expect(res.status).toBe(402);
    expect(res.error).toContain("This request requires more credits");
    expect(res.answer).toContain("Insufficient OpenRouter account credits");
  });

  it("handles 404 Model Not Found gracefully", async () => {
    process.env.OPENROUTER_API_KEY = "test-key";

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: "Not Found",
        text: async () =>
          JSON.stringify({
            error: {
              message: "Model nonexistent-model does not exist",
            },
          }),
      })
    );

    const res = await queryHistoricalScholar({
      query: "Describe Samarra architecture",
      model: "nonexistent-model",
    });

    expect(res.status).toBe(404);
    expect(res.answer).toContain('The requested AI model "nonexistent-model" was not found');
  });

  it("handles 429 Rate Limit from OpenRouter gracefully", async () => {
    process.env.OPENROUTER_API_KEY = "test-key";

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 429,
        statusText: "Too Many Requests",
        text: async () =>
          JSON.stringify({
            error: {
              message: "Rate limit reached",
            },
          }),
      })
    );

    const res = await queryHistoricalScholar({
      query: "Explain the Battle of Yarmouk",
      year: 636,
    });

    expect(res.status).toBe(429);
    expect(res.answer).toContain("OpenRouter rate limit reached");
  });

  it("handles network failure gracefully", async () => {
    process.env.OPENROUTER_API_KEY = "test-key";

    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("ECONNREFUSED connect to openrouter.ai"))
    );

    const res = await queryHistoricalScholar({
      query: "What happened in 661 CE?",
      year: 661,
    });

    expect(res.status).toBe(500);
    expect(res.error).toContain("ECONNREFUSED");
    expect(res.answer).toContain("A network or client error occurred");
  });

  it("handles request timeout gracefully", async () => {
    process.env.OPENROUTER_API_KEY = "test-key";

    const abortError = new Error("The operation was aborted");
    abortError.name = "AbortError";
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(abortError));

    const res = await queryHistoricalScholar({
      query: "Detailed geopolitical analysis",
      timeoutMs: 1000,
    });

    expect(res.status).toBe(504);
    expect(res.error).toBe("Request timeout");
    expect(res.answer).toContain("timed out");
  });

  it("handles empty or malformed OpenRouter responses without crashing", async () => {
    process.env.OPENROUTER_API_KEY = "test-key";

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          choices: [],
        }),
      })
    );

    const res = await queryHistoricalScholar({
      query: "Tell me about Harun al-Rashid",
      year: 800,
    });

    expect(res.status).toBe(200);
    expect(res.answer).toBe("No textual response received from scholar service.");
  });

  it("POST /api/ai/inquire propagates scholar response and status code", async () => {
    process.env.OPENROUTER_API_KEY = "test-key";

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          model: "google/gemini-2.5-flash",
          choices: [
            {
              message: {
                content: "Academic inquiry succeeded.",
              },
            },
          ],
        }),
      })
    );

    const req = new NextRequest("http://localhost:3000/api/ai/inquire", {
      method: "POST",
      body: JSON.stringify({
        query: "Discuss the House of Wisdom in Baghdad",
        year: 830,
      }),
    });

    const res = await postAiInquireRoute(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.answer).toBe("Academic inquiry succeeded.");
    expect(data.modelUsed).toBe("google/gemini-2.5-flash");
  });
});
