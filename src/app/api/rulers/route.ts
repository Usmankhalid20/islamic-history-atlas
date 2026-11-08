import { NextRequest, NextResponse } from "next/server";
import { rulersQuerySchema } from "@/lib/api/validators";
import { initialRulers, initialReigns, initialPolities } from "@/lib/data/historicalSeed";
import { db } from "@/lib/db";
import { rulers } from "@/lib/db/schema/rulers";
import { reigns } from "@/lib/db/schema/reigns";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = rulersQuerySchema.safeParse({
      polityId: searchParams.get("polityId") || undefined,
      reignYear: searchParams.get("reignYear") || undefined,
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

    const { polityId, reignYear, name } = parsed.data;

    let rulerList = initialRulers;
    let reignList = initialReigns;

    if (db) {
      try {
        const dbRulers = await db.select().from(rulers);
        const dbReigns = await db.select().from(reigns);
        if (dbRulers.length > 0) {
          rulerList = dbRulers;
        }
        if (dbReigns.length > 0) {
          reignList = dbReigns;
        }
      } catch {
        // Fall back to seed fixtures
      }
    }

    // Combine ruler with primary reign and polity info
    let combined = rulerList.map((ruler) => {
      const rulerReigns = reignList.filter((r) => r.rulerId === ruler.id);
      const primaryReign = rulerReigns[0];
      const polity = primaryReign
        ? initialPolities.find((p) => p.id === primaryReign.polityId)
        : undefined;

      return {
        ...ruler,
        reign: primaryReign,
        polity: polity
          ? {
              id: polity.id,
              canonicalName: polity.canonicalName,
            }
          : undefined,
      };
    });

    if (polityId) {
      combined = combined.filter((r) => r.reign?.polityId === polityId);
    }

    if (reignYear !== undefined) {
      combined = combined.filter((r) => {
        if (!r.reign) return false;
        const end = r.reign.endYear ?? r.reign.startYear;
        return r.reign.startYear <= reignYear && end >= reignYear;
      });
    }

    if (name) {
      const lower = name.toLowerCase();
      combined = combined.filter((r) => r.preferredName.toLowerCase().includes(lower));
    }

    // Sort chronologically by reign start year
    combined.sort((a, b) => {
      const aStart = a.reign?.startYear ?? a.birthYear ?? 0;
      const bStart = b.reign?.startYear ?? b.birthYear ?? 0;
      return aStart - bStart;
    });

    return NextResponse.json({
      count: combined.length,
      items: combined,
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
