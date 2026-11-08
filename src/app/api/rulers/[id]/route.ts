import { NextRequest, NextResponse } from "next/server";
import {
  initialRulers,
  initialReigns,
  initialPolities,
  initialHistoricalEvents,
  initialSources,
} from "@/lib/data/historicalSeed";
import { db } from "@/lib/db";
import { rulers } from "@/lib/db/schema/rulers";
import { reigns } from "@/lib/db/schema/reigns";
import { eq } from "drizzle-orm";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    let ruler = initialRulers.find((r) => r.id === id);
    let allReigns = initialReigns;

    if (db) {
      try {
        const found = await db.select().from(rulers).where(eq(rulers.id, id));
        if (found.length > 0) {
          ruler = found[0];
        }
        const dbReigns = await db.select().from(reigns).where(eq(reigns.rulerId, id));
        if (dbReigns.length > 0) {
          allReigns = dbReigns;
        }
      } catch {
        // Fall back to seed fixtures
      }
    }

    if (!ruler) {
      return NextResponse.json(
        { error: "Ruler not found", id },
        { status: 404 }
      );
    }

    const rulerReigns = allReigns.filter((r) => r.rulerId === ruler!.id);
    const primaryReign = rulerReigns[0];
    const polity = primaryReign
      ? initialPolities.find((p) => p.id === primaryReign.polityId)
      : null;

    // Find historical events that occurred during this ruler's reign
    const relatedEvents = primaryReign
      ? initialHistoricalEvents.filter(
          (e) =>
            e.eventYear >= primaryReign.startYear &&
            (!primaryReign.endYear || e.eventYear <= primaryReign.endYear)
        )
      : [];

    return NextResponse.json({
      ...ruler,
      reigns: rulerReigns,
      polity,
      relatedEvents,
      primarySource: initialSources[1] || initialSources[0], // Bosworth or Kennedy
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
