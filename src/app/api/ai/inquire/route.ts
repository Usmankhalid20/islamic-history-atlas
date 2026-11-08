import { NextRequest, NextResponse } from "next/server";
import { aiInquirySchema } from "@/lib/api/validators";
import { queryHistoricalScholar } from "@/lib/ai/openrouter";
import { getCacheControlHeader } from "@/lib/api/cacheHeaders";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = aiInquirySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid request payload",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { query, year, polities, model } = parsed.data;

    const result = await queryHistoricalScholar({
      query,
      year,
      polities,
      model,
    });

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": getCacheControlHeader("dynamic"),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
