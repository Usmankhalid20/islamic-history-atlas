import { NextRequest, NextResponse } from "next/server";
import {
  initialCampaigns,
  initialPolities,
  initialRulers,
  initialSources,
} from "@/lib/data/historicalSeed";
import { db } from "@/lib/db";
import { campaigns } from "@/lib/db/schema/campaigns";
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

    let campaign = initialCampaigns.find((c) => c.id === id);

    if (db) {
      try {
        const found = await db.select().from(campaigns).where(eq(campaigns.id, id));
        if (found.length > 0) {
          campaign = found[0] as any;
        }
      } catch {
        // Fall back to seed fixtures
      }
    }

    if (!campaign) {
      return NextResponse.json(
        { error: "Military campaign not found", id },
        { status: 404 }
      );
    }

    const polity = initialPolities.find((p) => p.id === campaign?.polityId);
    const ruler = campaign?.rulerId
      ? initialRulers.find((r) => r.id === campaign?.rulerId)
      : null;

    const responseData = {
      ...campaign,
      polity: polity
        ? {
            id: polity.id,
            canonicalName: polity.canonicalName,
            colorHex: getPolityColor(polity.id),
          }
        : null,
      ruler: ruler
        ? {
            id: ruler.id,
            preferredName: ruler.preferredName,
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
