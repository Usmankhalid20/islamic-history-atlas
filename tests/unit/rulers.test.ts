import { describe, it, expect } from "vitest";
import { initialRulers, initialReigns, initialPolities } from "@/lib/data/historicalSeed";
import { rulersQuerySchema } from "@/lib/api/validators";
import { GET as getRulersRoute } from "@/app/api/rulers/route";
import { GET as getRulerByIdRoute } from "@/app/api/rulers/[id]/route";
import { NextRequest } from "next/server";

describe("Rulers & Reigns Data & API Verification", () => {
  it("verifies initialRulers records have valid biographical intervals", () => {
    expect(initialRulers.length).toBeGreaterThanOrEqual(15);

    initialRulers.forEach((ruler) => {
      expect(ruler.id).toBeDefined();
      expect(ruler.preferredName.length).toBeGreaterThan(2);
      expect(ruler.biography).toBeDefined();
      if (ruler.birthYear && ruler.deathYear) {
        expect(ruler.birthYear).toBeLessThan(ruler.deathYear);
      }
    });
  });

  it("verifies initialReigns link validly to polities and rulers", () => {
    const polityIds = new Set(initialPolities.map((p) => p.id));
    const rulerIds = new Set(initialRulers.map((r) => r.id));

    initialReigns.forEach((reign) => {
      expect(rulerIds.has(reign.rulerId)).toBe(true);
      expect(polityIds.has(reign.polityId)).toBe(true);
      if (reign.endYear) {
        expect(reign.startYear).toBeLessThanOrEqual(reign.endYear);
      }
    });
  });

  it("validates query parameters with rulersQuerySchema", () => {
    const valid = rulersQuerySchema.safeParse({
      polityId: "pol_umayyad",
      reignYear: 700,
      name: "Abd al-Malik",
    });
    expect(valid.success).toBe(true);

    const invalidYear = rulersQuerySchema.safeParse({ reignYear: "invalid" });
    expect(invalidYear.success).toBe(false);
  });

  it("serves all rulers via GET /api/rulers", async () => {
    const req = new NextRequest("http://localhost:3000/api/rulers");
    const res = await getRulersRoute(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.count).toBe(initialRulers.length);
    expect(data.items.length).toBe(initialRulers.length);
  });

  it("filters rulers by polityId via GET /api/rulers?polityId=pol_rashidun", async () => {
    const req = new NextRequest("http://localhost:3000/api/rulers?polityId=pol_rashidun");
    const res = await getRulersRoute(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.items.length).toBe(4);
    expect(data.items.every((r: any) => r.reign?.polityId === "pol_rashidun")).toBe(true);
  });

  it("filters rulers active in a specific year via GET /api/rulers?reignYear=750", async () => {
    const req = new NextRequest("http://localhost:3000/api/rulers?reignYear=750");
    const res = await getRulersRoute(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.items.length).toBeGreaterThanOrEqual(1);
    // al-Saffah (750-754) is active in 750 CE
    expect(data.items.some((r: any) => r.id === "rul_al_saffah")).toBe(true);
  });

  it("serves a single ruler by ID via GET /api/rulers/[id]", async () => {
    const req = new NextRequest("http://localhost:3000/api/rulers/rul_harun_al_rashid");
    const res = await getRulerByIdRoute(req, { params: { id: "rul_harun_al_rashid" } });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.id).toBe("rul_harun_al_rashid");
    expect(data.preferredName).toContain("Harun al-Rashid");
    expect(data.polity?.id).toBe("pol_abbasid_early");
  });

  it("returns 404 for unknown ruler ID", async () => {
    const req = new NextRequest("http://localhost:3000/api/rulers/unknown_ruler");
    const res = await getRulerByIdRoute(req, { params: { id: "unknown_ruler" } });
    expect(res.status).toBe(404);
  });
});
