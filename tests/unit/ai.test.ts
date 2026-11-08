import { describe, it, expect } from "vitest";
import { aiInquirySchema } from "@/lib/api/validators";
import { queryHistoricalScholar } from "@/lib/ai/openrouter";
import { POST as postAiInquireRoute } from "@/app/api/ai/inquire/route";
import { NextRequest } from "next/server";

describe("Historical AI Inquiry & Scholar Validation", () => {
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
    const prevKey = process.env.OPENROUTER_API_KEY;
    delete process.env.OPENROUTER_API_KEY;

    const res = await queryHistoricalScholar({
      query: "Describe the Battle of Yarmouk",
      year: 636,
    });

    expect(res.error).toBe("Missing API key");
    expect(res.answer).toContain("OPENROUTER_API_KEY");

    process.env.OPENROUTER_API_KEY = prevKey;
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
});
