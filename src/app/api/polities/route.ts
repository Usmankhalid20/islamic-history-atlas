import { NextRequest, NextResponse } from "next/server";
import { politiesQuerySchema } from "@/lib/api/validators";
import { initialPolities } from "@/lib/data/historicalSeed";
import { db } from "@/lib/db";
import { polities } from "@/lib/db/schema/polities";
import { paginateWithOffset } from "@/lib/api/pagination";
import { getCacheControlHeader, generateETag, isNotModified } from "@/lib/api/cacheHeaders";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = politiesQuerySchema.safeParse({
      activeYear: searchParams.get("activeYear") || undefined,
      entityType: searchParams.get("entityType") || undefined,
      page: searchParams.get("page") || undefined,
      limit: searchParams.get("limit") || undefined,
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

    const { activeYear, entityType, page, limit } = parsed.data;

    // Database fallback or fixture query
    let results = initialPolities;

    if (db) {
      try {
        const rows = await db.select().from(polities);
        if (rows.length > 0) {
          results = rows;
        }
      } catch {
        // Fall back to seed fixtures
      }
    }

    if (activeYear !== undefined) {
      results = results.filter(
        (p) =>
          p.startYear <= activeYear &&
          (p.endYear === null || p.endYear === undefined || p.endYear >= activeYear)
      );
    }

    if (entityType) {
      results = results.filter((p) => p.entityType === entityType);
    }

    const effectiveLimit = limit !== undefined ? limit : 50;
    const effectivePage = page !== undefined ? page : 1;

    const paged = paginateWithOffset(results, {
      page: effectivePage,
      limit: effectiveLimit,
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
          "Cache-Control": getCacheControlHeader("staticCatalog"),
        },
      });
    }

    return NextResponse.json(responseData, {
      headers: {
        ETag: etag,
        "Cache-Control": getCacheControlHeader("staticCatalog"),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
