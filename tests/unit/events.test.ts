import { describe, it, expect } from "vitest";
import { initialHistoricalEvents } from "@/lib/data/historicalSeed";
import { GET as getEventsRoute } from "@/app/api/events/route";
import { NextRequest } from "next/server";

describe("Historical Events Data & API", () => {
  it("contains curated historical events between 632 and 1000 CE", () => {
    expect(initialHistoricalEvents.length).toBeGreaterThanOrEqual(5);

    initialHistoricalEvents.forEach((ev) => {
      expect(ev.eventYear).toBeGreaterThanOrEqual(632);
      expect(ev.eventYear).toBeLessThanOrEqual(1000);
      expect(["battle", "conquest", "founding"]).toContain(ev.eventType);
      expect(ev.title.length).toBeGreaterThan(3);
      expect(ev.summary.length).toBeGreaterThan(10);
    });
  });

  it("ensures each event has valid GeoJSON coordinates within Islamic world bounds", () => {
    initialHistoricalEvents.forEach((ev) => {
      const geo = ev.locationGeojson as { type: string; coordinates: [number, number] };
      expect(geo).toBeDefined();
      expect(geo.type).toBe("Point");
      expect(Array.isArray(geo.coordinates)).toBe(true);
      expect(geo.coordinates.length).toBe(2);

      const [lng, lat] = geo.coordinates;
      // Latitude between 10°N and 55°N
      expect(lat).toBeGreaterThan(10);
      expect(lat).toBeLessThan(55);
      // Longitude between -15°W and 75°E
      expect(lng).toBeGreaterThan(-15);
      expect(lng).toBeLessThan(75);
    });
  });

  it("serves all events from GET /api/events", async () => {
    const req = new NextRequest("http://localhost:3000/api/events");
    const res = await getEventsRoute(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.count).toBe(initialHistoricalEvents.length);
    expect(data.items.length).toBe(initialHistoricalEvents.length);
  });

  it("filters events by year correctly via GET /api/events?year=750", async () => {
    const req = new NextRequest("http://localhost:3000/api/events?year=750");
    const res = await getEventsRoute(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.items.every((e: any) => e.eventYear === 750)).toBe(true);
  });

  it("filters events by eventType via GET /api/events?eventType=battle", async () => {
    const req = new NextRequest("http://localhost:3000/api/events?eventType=battle");
    const res = await getEventsRoute(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.items.length).toBeGreaterThanOrEqual(1);
    expect(data.items.every((e: any) => e.eventType === "battle")).toBe(true);
  });
});
