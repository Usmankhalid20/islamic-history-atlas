import { describe, it, expect } from "vitest";
import { initialTradeRoutes } from "@/lib/data/historicalSeed";
import { routesQuerySchema } from "@/lib/api/validators";
import { GET as getRoutesRoute } from "@/app/api/routes/route";
import { GET as getRouteByIdRoute } from "@/app/api/routes/[id]/route";
import { NextRequest } from "next/server";

describe("Trade & Pilgrimage Routes Verification", () => {
  it("contains curated historical routes with valid LineString GeoJSON", () => {
    expect(initialTradeRoutes.length).toBeGreaterThanOrEqual(6);

    initialTradeRoutes.forEach((route) => {
      expect(route.id).toBeDefined();
      expect(route.name.length).toBeGreaterThan(5);
      expect(["pilgrim_road", "caravan_route", "maritime_lane"]).toContain(route.routeType);
      expect(route.activeFromYear).toBeGreaterThanOrEqual(600);

      const geo = route.pathGeojson as { type: string; coordinates: [number, number][] };
      expect(geo).toBeDefined();
      expect(geo.type).toBe("LineString");
      expect(Array.isArray(geo.coordinates)).toBe(true);
      expect(geo.coordinates.length).toBeGreaterThanOrEqual(5);

      geo.coordinates.forEach(([lng, lat]) => {
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
  });

  it("validates query parameters with routesQuerySchema", () => {
    const valid = routesQuerySchema.safeParse({
      routeType: "pilgrim_road",
      activeYear: 800,
      name: "Darb",
    });
    expect(valid.success).toBe(true);

    const invalidYear = routesQuerySchema.safeParse({ activeYear: 400 });
    expect(invalidYear.success).toBe(false);
  });

  it("serves all trade routes via GET /api/routes", async () => {
    const req = new NextRequest("http://localhost:3000/api/routes");
    const res = await getRoutesRoute(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.count).toBe(initialTradeRoutes.length);
    expect(data.items.length).toBe(initialTradeRoutes.length);
  });

  it("filters routes by routeType via GET /api/routes?routeType=pilgrim_road", async () => {
    const req = new NextRequest("http://localhost:3000/api/routes?routeType=pilgrim_road");
    const res = await getRoutesRoute(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.items.length).toBeGreaterThanOrEqual(2);
    expect(data.items.every((r: any) => r.routeType === "pilgrim_road")).toBe(true);
  });

  it("filters routes active in a specific year via GET /api/routes?activeYear=750", async () => {
    const req = new NextRequest("http://localhost:3000/api/routes?activeYear=750");
    const res = await getRoutesRoute(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.items.some((r: any) => r.id === "route_darb_zubaydah")).toBe(true);
  });

  it("serves a single route by ID via GET /api/routes/[id]", async () => {
    const req = new NextRequest("http://localhost:3000/api/routes/route_darb_zubaydah");
    const res = await getRouteByIdRoute(req, { params: { id: "route_darb_zubaydah" } });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.id).toBe("route_darb_zubaydah");
    expect(data.name).toContain("Darb Zubaydah");
    expect(data.primarySource).toBeDefined();
  });

  it("returns 404 for unknown route ID", async () => {
    const req = new NextRequest("http://localhost:3000/api/routes/unknown_route");
    const res = await getRouteByIdRoute(req, { params: { id: "unknown_route" } });
    expect(res.status).toBe(404);
  });
});
