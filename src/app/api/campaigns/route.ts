import { NextRequest, NextResponse } from "next/server";
import { campaignsQuerySchema } from "@/lib/api/validators";
import { initialCampaigns } from "@/lib/data/historicalSeed";
import { db } from "@/lib/db";
import { campaigns } from "@/lib/db/schema/campaigns";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = campaignsQuerySchema.safeParse({
      polityId: searchParams.get("polityId") || undefined,
      commander: searchParams.get("commander") || undefined,
      activeYear: searchParams.get("activeYear") || undefined,
      name: searchParams.get("name") || undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid query parameters",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { polityId, commander, activeYear, name } = parsed.data;

    let results = initialCampaigns;

    if (db) {
      try {
        const rows = await db.select().from(campaigns);
        if (rows.length > 0) {
          results = rows as any;
        }
      } catch {
        // Fall back to seed fixtures
      }
    }

    if (polityId) {
      results = results.filter((c) => c.polityId === polityId);
    }

    if (commander) {
      const lower = commander.toLowerCase();
      results = results.filter((c) => c.commanderName.toLowerCase().includes(lower));
    }

    if (activeYear !== undefined) {
      results = results.filter(
        (c) => c.startYear <= activeYear && c.endYear >= activeYear
      );
    }

    if (name) {
      const lower = name.toLowerCase();
      results = results.filter((c) => c.name.toLowerCase().includes(lower));
    }

    return NextResponse.json({
      count: results.length,
      items: results,
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
