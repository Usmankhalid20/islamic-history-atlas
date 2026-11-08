import { describe, it, expect } from "vitest";
import { initialCampaigns } from "@/lib/data/historicalSeed";
import { campaignsQuerySchema } from "@/lib/api/validators";
import { GET as getCampaignsRoute } from "@/app/api/campaigns/route";
import { GET as getCampaignByIdRoute } from "@/app/api/campaigns/[id]/route";
import { NextRequest } from "next/server";

describe("Military Campaigns & Strategic Expeditions Verification", () => {
  it("contains curated historical campaigns with valid LineString GeoJSON marches", () => {
    expect(initialCampaigns.length).toBeGreaterThanOrEqual(6);

    initialCampaigns.forEach((campaign) => {
      expect(campaign.id).toBeDefined();
      expect(campaign.name.length).toBeGreaterThan(10);
      expect(campaign.commanderName.length).toBeGreaterThan(5);
      expect(campaign.startYear).toBeGreaterThanOrEqual(632);
      expect(campaign.endYear).toBeGreaterThanOrEqual(campaign.startYear);
      expect(campaign.keyLocations.length).toBeGreaterThan(10);
      expect(campaign.strategicOutcome.length).toBeGreaterThan(15);
      expect(campaign.description).toBeDefined();

      const geo = campaign.routeGeojson as { type: string; coordinates: [number, number][] };
      expect(geo).toBeDefined();
      expect(geo.type).toBe("LineString");
      expect(Array.isArray(geo.coordinates)).toBe(true);
      expect(geo.coordinates.length).toBeGreaterThanOrEqual(5);

      geo.coordinates.forEach(([lng, lat]) => {
        expect(typeof lng).toBe("number");
        expect(typeof lat).toBe("number");
        // Latitude bounds (15°N to 50°N)
        expect(lat).toBeGreaterThan(15);
        expect(lat).toBeLessThan(50);
        // Longitude bounds (-15°W to 75°E)
        expect(lng).toBeGreaterThan(-15);
        expect(lng).toBeLessThan(75);
      });
    });
  });

  it("validates query parameters with campaignsQuerySchema", () => {
    const valid = campaignsQuerySchema.safeParse({
      polityId: "pol_rashidun",
      commander: "Khalid",
      activeYear: 636,
      name: "Yarmouk",
    });
    expect(valid.success).toBe(true);

    const invalidYear = campaignsQuerySchema.safeParse({ activeYear: 400 });
    expect(invalidYear.success).toBe(false);
  });

  it("serves all campaigns via GET /api/campaigns", async () => {
    const req = new NextRequest("http://localhost:3000/api/campaigns");
    const res = await getCampaignsRoute(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.count).toBe(initialCampaigns.length);
    expect(data.items.length).toBe(initialCampaigns.length);
  });

  it("filters campaigns by polity via GET /api/campaigns?polityId=pol_rashidun", async () => {
    const req = new NextRequest("http://localhost:3000/api/campaigns?polityId=pol_rashidun");
    const res = await getCampaignsRoute(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.items.length).toBeGreaterThanOrEqual(3);
    expect(data.items.every((c: any) => c.polityId === "pol_rashidun")).toBe(true);
  });

  it("filters campaigns active in a specific year via GET /api/campaigns?activeYear=711", async () => {
    const req = new NextRequest("http://localhost:3000/api/campaigns?activeYear=711");
    const res = await getCampaignsRoute(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.items.some((c: any) => c.id === "camp_conquest_andalus_711_714")).toBe(true);
    expect(data.items.some((c: any) => c.id === "camp_indus_expedition_711_712")).toBe(true);
  });

  it("serves a single campaign by ID via GET /api/campaigns/[id]", async () => {
    const req = new NextRequest("http://localhost:3000/api/campaigns/camp_yarmouk_634_636");
    const res = await getCampaignByIdRoute(req, { params: { id: "camp_yarmouk_634_636" } });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.id).toBe("camp_yarmouk_634_636");
    expect(data.name).toContain("Yarmouk");
    expect(data.polity).toBeDefined();
    expect(data.polity.id).toBe("pol_rashidun");
    expect(data.ruler).toBeDefined();
    expect(data.primarySource).toBeDefined();
  });

  it("returns 404 for unknown campaign ID", async () => {
    const req = new NextRequest("http://localhost:3000/api/campaigns/unknown_campaign");
    const res = await getCampaignByIdRoute(req, { params: { id: "unknown_campaign" } });
    expect(res.status).toBe(404);
  });
});
