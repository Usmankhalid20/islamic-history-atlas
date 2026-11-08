import { describe, it, expect } from "vitest";
import { initialMonuments } from "@/lib/data/historicalSeed";
import { monumentsQuerySchema } from "@/lib/api/validators";
import { GET as getMonumentsRoute } from "@/app/api/monuments/route";
import { GET as getMonumentByIdRoute } from "@/app/api/monuments/[id]/route";
import { NextRequest } from "next/server";

describe("Historical Monuments & Intellectual Centers Verification", () => {
  it("contains curated historical monuments with valid Point GeoJSON coordinates", () => {
    expect(initialMonuments.length).toBeGreaterThanOrEqual(6);

    initialMonuments.forEach((monument) => {
      expect(monument.id).toBeDefined();
      expect(monument.name.length).toBeGreaterThan(5);
      expect(["mosque", "academy_library", "palace", "observatory"]).toContain(monument.monumentType);
      expect(monument.foundingYear).toBeGreaterThanOrEqual(632);
      expect(monument.cityName.length).toBeGreaterThan(2);
      expect(monument.architecturalFeatures).toBeDefined();

      const geo = monument.locationGeojson as { type: string; coordinates: [number, number] };
      expect(geo).toBeDefined();
      expect(geo.type).toBe("Point");
      expect(Array.isArray(geo.coordinates)).toBe(true);
      expect(geo.coordinates.length).toBe(2);

      const [lng, lat] = geo.coordinates;
      expect(typeof lng).toBe("number");
      expect(typeof lat).toBe("number");
      // Latitude bounds (10°N to 50°N)
      expect(lat).toBeGreaterThan(10);
      expect(lat).toBeLessThan(50);
      // Longitude bounds (-15°W to 75°E)
      expect(lng).toBeGreaterThan(-15);
      expect(lng).toBeLessThan(75);
    });
  });

  it("validates query parameters with monumentsQuerySchema", () => {
    const valid = monumentsQuerySchema.safeParse({
      monumentType: "academy_library",
      foundingYear: 800,
      cityName: "Baghdad",
    });
    expect(valid.success).toBe(true);

    const invalidYear = monumentsQuerySchema.safeParse({ foundingYear: 400 });
    expect(invalidYear.success).toBe(false);
  });

  it("serves all monuments via GET /api/monuments", async () => {
    const req = new NextRequest("http://localhost:3000/api/monuments");
    const res = await getMonumentsRoute(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.count).toBe(initialMonuments.length);
    expect(data.items.length).toBe(initialMonuments.length);
  });

  it("filters monuments by type via GET /api/monuments?monumentType=academy_library", async () => {
    const req = new NextRequest("http://localhost:3000/api/monuments?monumentType=academy_library");
    const res = await getMonumentsRoute(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.items.length).toBeGreaterThanOrEqual(3);
    expect(data.items.every((m: any) => m.monumentType === "academy_library")).toBe(true);
  });

  it("filters monuments founded on or before a given year via GET /api/monuments?foundingYear=700", async () => {
    const req = new NextRequest("http://localhost:3000/api/monuments?foundingYear=700");
    const res = await getMonumentsRoute(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.items.some((m: any) => m.id === "mon_dome_of_the_rock_691")).toBe(true);
    expect(data.items.every((m: any) => m.foundingYear <= 700)).toBe(true);
  });

  it("serves a single monument by ID via GET /api/monuments/[id]", async () => {
    const req = new NextRequest("http://localhost:3000/api/monuments/mon_bayt_al_hikma_762");
    const res = await getMonumentByIdRoute(req, { params: { id: "mon_bayt_al_hikma_762" } });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.id).toBe("mon_bayt_al_hikma_762");
    expect(data.name).toContain("House of Wisdom");
    expect(data.polity).toBeDefined();
    expect(data.polity.id).toBe("pol_abbasid_early");
    expect(data.primarySource).toBeDefined();
  });

  it("returns 404 for unknown monument ID", async () => {
    const req = new NextRequest("http://localhost:3000/api/monuments/unknown_monument");
    const res = await getMonumentByIdRoute(req, { params: { id: "unknown_monument" } });
    expect(res.status).toBe(404);
  });
});
