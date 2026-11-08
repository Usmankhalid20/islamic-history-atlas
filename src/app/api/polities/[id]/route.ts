import { NextRequest, NextResponse } from "next/server";
import { initialPolities, initialTerritoryPeriods, initialSources } from "@/lib/data/historicalSeed";
import { db } from "@/lib/db";
import { polities } from "@/lib/db/schema/polities";
import { eq } from "drizzle-orm";
import { getCacheControlHeader, generateETag, isNotModified } from "@/lib/api/cacheHeaders";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    let polity = initialPolities.find((p) => p.id === id);

    if (db) {
      try {
        const rows = await db.select().from(polities).where(eq(polities.id, id));
        if (rows.length > 0) {
          polity = rows[0];
        }
      } catch {
        // Fall back to seed fixtures
      }
    }

    if (!polity) {
      return NextResponse.json(
        { error: "Polity not found", id },
        { status: 404 }
      );
    }

    const territoryPeriods = initialTerritoryPeriods.filter(
      (t) => t.polityId === id
    );

    const responseData = {
      polity,
      territories: territoryPeriods,
      sources: initialSources,
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
