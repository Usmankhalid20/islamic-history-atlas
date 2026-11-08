import { NextRequest, NextResponse } from "next/server";
import { initialTradeRoutes, initialSources } from "@/lib/data/historicalSeed";
import { db } from "@/lib/db";
import { tradeRoutes } from "@/lib/db/schema/tradeRoutes";
import { eq } from "drizzle-orm";

export async function GET(
  _request: NextRequest,
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

    return NextResponse.json({
      ...route,
      primarySource: initialSources[0], // Hugh Kennedy / Routledge
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
