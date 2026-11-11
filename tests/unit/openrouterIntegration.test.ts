import { describe, it, expect } from "vitest";
import { queryHistoricalScholar, DEFAULT_MODEL, OPENROUTER_ENDPOINT } from "@/lib/ai/openrouter";
import { POST as postAiInquireRoute } from "@/app/api/ai/inquire/route";
import { NextRequest } from "next/server";

describe("Live OpenRouter API Verification & Historical Synthesis", () => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const hasLiveKey = !!apiKey && apiKey !== "your-openrouter-api-key" && apiKey.startsWith("sk-or-");

  it("verifies OpenRouter API key validity via /auth/key without exposing secrets", async () => {
    if (!hasLiveKey) {
      console.warn("Skipping live key validation: OPENROUTER_API_KEY not configured.");
      return;
    }

    try {
      const res = await fetch("https://openrouter.ai/api/v1/auth/key", {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data?.data).toBeDefined();
      // Verify auth status metadata without logging key
      expect(typeof data.data.usage).toBe("number");
    } catch (err: unknown) {
      const errorMsg = String(err);
      if (errorMsg.includes("timeout") || errorMsg.includes("UND_ERR_CONNECT_TIMEOUT") || errorMsg.includes("fetch failed")) {
        console.warn("OpenRouter API network connection timed out or unreachable, skipping live ping.");
        return;
      }
      throw err;
    }
  });

  it("verifies selected model availability in the OpenRouter catalog", async () => {
    const res = await fetch("https://openrouter.ai/api/v1/models");
    expect(res.status).toBe(200);
    const data = await res.json();
    const modelIds = (data?.data || []).map((m: { id: string }) => m.id);

    const targetModel = process.env.OPENROUTER_MODEL || DEFAULT_MODEL;
    expect(modelIds).toContain(targetModel);
  });

  it("executes a live historical inquiry completion successfully", async () => {
    if (!hasLiveKey) {
      console.warn("Skipping live completion: OPENROUTER_API_KEY not configured.");
      return;
    }

    const result = await queryHistoricalScholar({
      query: "In 1-2 sentences, explain the significance of the Battle of Yarmouk in 636 CE.",
      year: 636,
      polities: ["Rashidun Caliphate"],
      maxTokens: 150,
    });

    expect(result.error).toBeUndefined();
    expect(result.status).toBe(200);
    expect(result.answer).toBeTruthy();
    expect(result.answer.length).toBeGreaterThan(20);
    expect(result.modelUsed).toBeTruthy();
    expect(result.sourcesSuggested).toBeDefined();
    expect(result.sourcesSuggested!.length).toBeGreaterThan(0);
    expect(result.usage).toBeDefined();
    expect(result.usage!.totalTokens).toBeGreaterThan(0);
  });

  it("verifies live rejection of an invalid API key (HTTP 401)", async () => {
    const savedKey = process.env.OPENROUTER_API_KEY;
    try {
      process.env.OPENROUTER_API_KEY = "invalid-mock-openrouter-key-for-test-purposes";

      const result = await queryHistoricalScholar({
        query: "Test invalid key handling",
        year: 750,
      });

      expect(result.status).toBe(401);
      expect(result.error).toBeDefined();
      expect(result.answer).toContain("Authentication failed");
    } finally {
      process.env.OPENROUTER_API_KEY = savedKey;
    }
  });

  it("verifies live rejection of an invalid model name (HTTP 404 or 400)", async () => {
    if (!hasLiveKey) return;

    const result = await queryHistoricalScholar({
      query: "Test invalid model handling",
      model: "invalid-provider/nonexistent-model-xyz-9999",
      year: 750,
    });

    expect(result.status).toBeGreaterThanOrEqual(400);
    expect(result.error).toBeDefined();
  });

  it("verifies end-to-end route execution via POST /api/ai/inquire with live key", async () => {
    if (!hasLiveKey) return;

    const req = new NextRequest("http://localhost:3000/api/ai/inquire", {
      method: "POST",
      body: JSON.stringify({
        query: "What was the capital of the Umayyad Caliphate in 711 CE?",
        year: 711,
        polities: ["Umayyad Caliphate"],
      }),
    });

    const res = await postAiInquireRoute(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.answer).toBeTruthy();
    expect(body.answer.toLowerCase()).toContain("damascus");
    expect(body.modelUsed).toBeTruthy();
    expect(body.sourcesSuggested?.length).toBeGreaterThan(0);
    expect(res.headers.get("Cache-Control")).toContain("no-store");
  });
});

