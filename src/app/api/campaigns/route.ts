import { NextRequest, NextResponse } from "next/server";
import { campaignsQuerySchema } from "@/lib/api/validators";
import { initialCampaigns } from "@/lib/data/historicalSeed";
import { db } from "@/lib/db";
import { campaigns } from "@/lib/db/schema/campaigns";
import { paginateWithOffset } from "@/lib/api/pagination";
import { getCacheControlHeader, generateETag, isNotModified } from "@/lib/api/cacheHeaders";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = campaignsQuerySchema.safeParse({
      polityId: searchParams.get("polityId") || undefined,
      commander: searchParams.get("commander") || undefined,
      activeYear: searchParams.get("activeYear") || undefined,
      name: searchParams.get("name") || undefined,
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

    const { polityId, commander, activeYear, name, page, limit } = parsed.data;

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
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
