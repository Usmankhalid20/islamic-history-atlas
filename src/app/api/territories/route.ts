import { NextRequest, NextResponse } from "next/server";
import { territoriesQuerySchema } from "@/lib/api/validators";
import { filterActiveTerritories } from "@/lib/geo/territoryUtils";
import { initialTerritoryPeriods, initialPolities } from "@/lib/data/historicalSeed";
import { queryTerritoriesForYear } from "@/lib/db/queries";
import { db } from "@/lib/db";
import { getCacheControlHeader, generateETag, isNotModified } from "@/lib/api/cacheHeaders";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = territoriesQuerySchema.safeParse({
      year: searchParams.get("year"),
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

    const { year } = parsed.data;

    let responseData;

    // If a PostgreSQL database connection is live, query it
    if (db) {
      try {
        const rows = await queryTerritoriesForYear(year);
        responseData = {
          year,
          count: rows.length,
          source: "database",
          items: rows.map((r) => ({
            id: r.territory.id,
            regionName: r.territory.regionName,
            validFromYear: r.territory.validFromYear,
            validToYear: r.territory.validToYear,
            controlType: r.territory.controlType,
            confidence: r.territory.confidence,
            explanatoryNote: r.territory.explanatoryNote,
            geometry: r.territory.geometryGeojson,
            polity: {
              id: r.polity.id,
              name: r.polity.canonicalName,
              type: r.polity.entityType,
            },
          })),
        };
      } catch {
        // Fall back to seed fixtures if database is unseeded or offline
      }
    }

    if (!responseData) {
      // Default: use verified seed fixtures
      const active = filterActiveTerritories(initialTerritoryPeriods, year);
      const polityMap = new Map(initialPolities.map((p) => [p.id, p]));

      responseData = {
        year,
        count: active.length,
        source: "fixtures",
        items: active.map((t) => {
          const polity = polityMap.get(t.polityId);
          return {
            id: t.id,
            regionName: t.regionName,
            validFromYear: t.validFromYear,
            validToYear: t.validToYear,
            controlType: t.controlType,
            confidence: t.confidence,
            explanatoryNote: t.explanatoryNote,
            geometry: t.geometryGeojson,
            polity: {
              id: t.polityId,
              name: polity?.canonicalName || t.polityId,
              type: polity?.entityType || "polity",
            },
          };
        }),
      };
    }

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
