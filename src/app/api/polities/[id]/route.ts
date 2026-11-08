import { NextRequest, NextResponse } from "next/server";
import { initialPolities, initialTerritoryPeriods, initialSources } from "@/lib/data/historicalSeed";
import { db } from "@/lib/db";
import { polities } from "@/lib/db/schema/polities";
import { eq } from "drizzle-orm";

export async function GET(
  _request: NextRequest,
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

    return NextResponse.json({
      polity,
      territories: territoryPeriods,
      sources: initialSources,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

