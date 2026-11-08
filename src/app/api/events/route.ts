import { NextRequest, NextResponse } from "next/server";
import { eventsQuerySchema } from "@/lib/api/validators";
import { initialHistoricalEvents } from "@/lib/data/historicalSeed";
import { db } from "@/lib/db";
import { historicalEvents } from "@/lib/db/schema/historicalEvents";
import { paginateWithCursor } from "@/lib/api/pagination";
import { getCacheControlHeader, generateETag, isNotModified } from "@/lib/api/cacheHeaders";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = eventsQuerySchema.safeParse({
      year: searchParams.get("year") || undefined,
      eventType: searchParams.get("eventType") || undefined,
      limit: searchParams.get("limit") || undefined,
      cursor: searchParams.get("cursor") || undefined,
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

    const { year, eventType, limit, cursor } = parsed.data;

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

    // Default limit is 50 if unspecified so all seed events return for unpaginated calls
    const effectiveLimit = limit !== undefined ? limit : 50;

    const paged = paginateWithCursor(results, {
      limit: effectiveLimit,
      cursor,
      getSortValue: (item) => item.eventYear,
    });

    const responseData = {
      count: paged.items.length,
      items: paged.items,
      pagination: paged.pagination,
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
      { error: "Internal server error", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
