import { NextRequest, NextResponse } from "next/server";
import { scholarsQuerySchema } from "@/lib/api/validators";
import { initialScholars } from "@/lib/data/historicalSeed";
import { db } from "@/lib/db";
import { scholars } from "@/lib/db/schema/scholars";
import { paginateWithOffset } from "@/lib/api/pagination";
import { getCacheControlHeader, generateETag, isNotModified } from "@/lib/api/cacheHeaders";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = scholarsQuerySchema.safeParse({
      fieldsOfStudy: searchParams.get("fieldsOfStudy") || undefined,
      patronizedByPolityId: searchParams.get("patronizedByPolityId") || undefined,
      activeYear: searchParams.get("activeYear") || undefined,
      primaryCity: searchParams.get("primaryCity") || undefined,
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

    const { fieldsOfStudy, patronizedByPolityId, activeYear, primaryCity, name, page, limit } = parsed.data;

    let results = initialScholars;

    if (db) {
      try {
        const rows = await db.select().from(scholars);
        if (rows.length > 0) {
          results = rows as any;
        }
      } catch {
        // Fall back to seed fixtures
      }
    }

    if (fieldsOfStudy) {
      const lower = fieldsOfStudy.toLowerCase();
      results = results.filter((s) => s.fieldsOfStudy.toLowerCase().includes(lower));
    }

    if (patronizedByPolityId) {
      results = results.filter((s) => s.patronizedByPolityId === patronizedByPolityId);
    }

    if (activeYear !== undefined) {
      results = results.filter((s) => {
        const birth = s.birthYear ?? -Infinity;
        const death = s.deathYear ?? Infinity;
        return birth <= activeYear && death >= activeYear;
      });
    }

    if (primaryCity) {
      const lower = primaryCity.toLowerCase();
      results = results.filter((s) => s.primaryCity.toLowerCase().includes(lower));
    }

    if (name) {
      const lower = name.toLowerCase();
      results = results.filter((s) => s.name.toLowerCase().includes(lower));
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
