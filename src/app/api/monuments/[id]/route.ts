import { NextRequest, NextResponse } from "next/server";
import { initialMonuments, initialPolities, initialSources } from "@/lib/data/historicalSeed";
import { db } from "@/lib/db";
import { monuments } from "@/lib/db/schema/monuments";
import { eq } from "drizzle-orm";
import { getPolityColor } from "@/lib/utils";
import { getCacheControlHeader, generateETag, isNotModified } from "@/lib/api/cacheHeaders";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    let monument = initialMonuments.find((m) => m.id === id);

    if (db) {
      try {
        const found = await db.select().from(monuments).where(eq(monuments.id, id));
        if (found.length > 0) {
          monument = found[0] as any;
        }
      } catch {
        // Fall back to seed fixtures
      }
    }

    if (!monument) {
      return NextResponse.json(
        { error: "Monument not found", id },
        { status: 404 }
      );
    }

    const polity = initialPolities.find((p) => p.id === monument?.polityId);

    const responseData = {
      ...monument,
      polity: polity
        ? {
            id: polity.id,
            canonicalName: polity.canonicalName,
            colorHex: getPolityColor(polity.id),
          }
        : null,
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
