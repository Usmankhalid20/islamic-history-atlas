import { NextRequest, NextResponse } from "next/server";
import { routesQuerySchema } from "@/lib/api/validators";
import { initialTradeRoutes } from "@/lib/data/historicalSeed";
import { db } from "@/lib/db";
import { tradeRoutes } from "@/lib/db/schema/tradeRoutes";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = routesQuerySchema.safeParse({
      routeType: searchParams.get("routeType") || undefined,
      activeYear: searchParams.get("activeYear") || undefined,
      name: searchParams.get("name") || undefined,
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

    const { routeType, activeYear, name } = parsed.data;

    let results = initialTradeRoutes;

    if (db) {
      try {
        const rows = await db.select().from(tradeRoutes);
        if (rows.length > 0) {
          results = rows;
        }
      } catch {
        // Fall back to seed fixtures
      }
    }

    if (routeType) {
      results = results.filter((r) => r.routeType === routeType);
    }

    if (activeYear !== undefined) {
      results = results.filter((r) => {
        const end = r.activeToYear ?? 2000;
        return r.activeFromYear <= activeYear && end >= activeYear;
      });
    }

    if (name) {
      const lower = name.toLowerCase();
      results = results.filter((r) => r.name.toLowerCase().includes(lower));
    }

    return NextResponse.json({
      count: results.length,
      items: results,
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
