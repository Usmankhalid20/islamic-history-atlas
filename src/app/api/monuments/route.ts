import { NextRequest, NextResponse } from "next/server";
import { monumentsQuerySchema } from "@/lib/api/validators";
import { initialMonuments } from "@/lib/data/historicalSeed";
import { db } from "@/lib/db";
import { monuments } from "@/lib/db/schema/monuments";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = monumentsQuerySchema.safeParse({
      monumentType: searchParams.get("monumentType") || undefined,
      polityId: searchParams.get("polityId") || undefined,
      foundingYear: searchParams.get("foundingYear") || undefined,
      cityName: searchParams.get("cityName") || undefined,
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

    const { monumentType, polityId, foundingYear, cityName, name } = parsed.data;

    let results = initialMonuments;

    if (db) {
      try {
        const rows = await db.select().from(monuments);
        if (rows.length > 0) {
          results = rows as any;
        }
      } catch {
        // Fall back to seed fixtures
      }
    }

    if (monumentType) {
      results = results.filter((m) => m.monumentType === monumentType);
    }

    if (polityId) {
      results = results.filter((m) => m.polityId === polityId);
    }

    if (foundingYear !== undefined) {
      results = results.filter((m) => m.foundingYear <= foundingYear);
    }

    if (cityName) {
      const lower = cityName.toLowerCase();
      results = results.filter((m) => m.cityName.toLowerCase().includes(lower));
    }

    if (name) {
      const lower = name.toLowerCase();
      results = results.filter((m) => m.name.toLowerCase().includes(lower));
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
