import { NextRequest, NextResponse } from "next/server";
import { initialHistoricalEvents, initialSources } from "@/lib/data/historicalSeed";
import { db } from "@/lib/db";
import { historicalEvents } from "@/lib/db/schema/historicalEvents";
import { eq } from "drizzle-orm";
import { getCacheControlHeader, generateETag, isNotModified } from "@/lib/api/cacheHeaders";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    let event = initialHistoricalEvents.find((e) => e.id === id);

    if (db) {
      try {
        const found = await db.select().from(historicalEvents).where(eq(historicalEvents.id, id));
        if (found.length > 0) {
          event = found[0];
        }
      } catch {
        // Fall back to verified seed fixtures
      }
    }

    if (!event) {
      return NextResponse.json(
        { error: "Historical event not found", id },
        { status: 404 }
      );
    }

    const responseData = {
      ...event,
      primarySource: initialSources[0], // Hugh Kennedy / Routledge
    };

    const etag = generateETag(responseData);
    const ifNoneMatch = request.headers.get("if-none-match");

    if (isNotModified(ifNoneMatch, etag)) {
      return new NextResponse(null, {
        status: 304,
        headers: {
          ETag: etag,
          "Cache-Control": getCacheControlHeader("temporalMap"),
        },
      });
    }

    return NextResponse.json(responseData, {
      headers: {
        ETag: etag,
        "Cache-Control": getCacheControlHeader("temporalMap"),
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

