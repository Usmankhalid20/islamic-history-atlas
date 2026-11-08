import { NextRequest, NextResponse } from "next/server";
import { initialTradeRoutes, initialSources } from "@/lib/data/historicalSeed";
import { db } from "@/lib/db";
import { tradeRoutes } from "@/lib/db/schema/tradeRoutes";
import { eq } from "drizzle-orm";
import { getCacheControlHeader, generateETag, isNotModified } from "@/lib/api/cacheHeaders";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    let route = initialTradeRoutes.find((r) => r.id === id);

    if (db) {
      try {
        const found = await db.select().from(tradeRoutes).where(eq(tradeRoutes.id, id));
        if (found.length > 0) {
          route = found[0];
        }
      } catch {
        // Fall back to seed fixtures
      }
    }

    if (!route) {
      return NextResponse.json(
        { error: "Trade or pilgrimage route not found", id },
        { status: 404 }
      );
    }

    const responseData = {
      ...route,
      primarySource: initialSources[0], // Hugh Kennedy / Routledge
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
