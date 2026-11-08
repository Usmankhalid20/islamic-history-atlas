import { NextRequest, NextResponse } from "next/server";
import { eventsQuerySchema } from "@/lib/api/validators";
import { initialHistoricalEvents } from "@/lib/data/historicalSeed";
import { db } from "@/lib/db";
import { historicalEvents } from "@/lib/db/schema/historicalEvents";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = eventsQuerySchema.safeParse({
      year: searchParams.get("year") || undefined,
      eventType: searchParams.get("eventType") || undefined,
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

    const { year, eventType } = parsed.data;

    let results = initialHistoricalEvents;

    if (db) {
      try {
        const rows = await db.select().from(historicalEvents);
        if (rows.length > 0) {
          results = rows;
        }
      } catch {
        // Fall back to seed fixtures
      }
    }

    if (year !== undefined) {
      results = results.filter((e) => e.eventYear === year);
    }

    if (eventType) {
      results = results.filter((e) => e.eventType === eventType);
    }

    return NextResponse.json({
      count: results.length,
      items: results,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

