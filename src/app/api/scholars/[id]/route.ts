import { NextRequest, NextResponse } from "next/server";
import { initialScholars, initialPolities, initialSources } from "@/lib/data/historicalSeed";
import { db } from "@/lib/db";
import { scholars } from "@/lib/db/schema/scholars";
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

    let scholar = initialScholars.find((s) => s.id === id);

    if (db) {
      try {
        const found = await db.select().from(scholars).where(eq(scholars.id, id));
        if (found.length > 0) {
          scholar = found[0] as any;
        }
      } catch {
        // Fall back to seed fixtures
      }
    }

    if (!scholar) {
      return NextResponse.json(
        { error: "Scholar not found", id },
        { status: 404 }
      );
    }

    const patronPolity = scholar.patronizedByPolityId
      ? initialPolities.find((p) => p.id === scholar?.patronizedByPolityId)
      : null;

    const responseData = {
      ...scholar,
      patronPolity: patronPolity
        ? {
            id: patronPolity.id,
            canonicalName: patronPolity.canonicalName,
            colorHex: getPolityColor(patronPolity.id),
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
