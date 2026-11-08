import { NextRequest, NextResponse } from "next/server";
import { politiesQuerySchema } from "@/lib/api/validators";
import { initialPolities } from "@/lib/data/historicalSeed";
import { db } from "@/lib/db";
import { polities } from "@/lib/db/schema/polities";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = politiesQuerySchema.safeParse({
      activeYear: searchParams.get("activeYear") || undefined,
      entityType: searchParams.get("entityType") || undefined,
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

    const { activeYear, entityType } = parsed.data;

    // Database fallback or fixture query
    let results = initialPolities;

    if (db) {
      try {
        const rows = await db.select().from(polities);
        if (rows.length > 0) {
          results = rows;
        }
      } catch {
        // Fall back to seed fixtures
      }
    }

    if (activeYear !== undefined) {
      results = results.filter(
        (p) =>
          p.startYear <= activeYear &&
          (p.endYear === null || p.endYear === undefined || p.endYear >= activeYear)
      );
    }

    if (entityType) {
      results = results.filter((p) => p.entityType === entityType);
    }

    return NextResponse.json({
      count: results.length,
      items: results,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

