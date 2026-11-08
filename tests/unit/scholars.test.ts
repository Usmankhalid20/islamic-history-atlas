import { describe, it, expect } from "vitest";
import { initialScholars } from "@/lib/data/historicalSeed";
import { scholarsQuerySchema } from "@/lib/api/validators";
import { GET as getScholarsRoute } from "@/app/api/scholars/route";
import { GET as getScholarByIdRoute } from "@/app/api/scholars/[id]/route";
import { NextRequest } from "next/server";

describe("Islamic Golden Age Scholars & Polymaths Verification", () => {
  it("contains curated historical scholars with biographical records and major works", () => {
    expect(initialScholars.length).toBeGreaterThanOrEqual(6);

    initialScholars.forEach((scholar) => {
      expect(scholar.id).toBeDefined();
      expect(scholar.name.length).toBeGreaterThan(5);
      expect(scholar.fieldsOfStudy.length).toBeGreaterThan(3);
      expect(scholar.primaryCity.length).toBeGreaterThan(2);
      expect(scholar.biography).toBeDefined();
      expect(scholar.biography!.length).toBeGreaterThan(30);

      if (scholar.birthYear && scholar.deathYear) {
        expect(scholar.deathYear).toBeGreaterThan(scholar.birthYear);
        expect(scholar.birthYear).toBeGreaterThanOrEqual(700);
        expect(scholar.deathYear).toBeLessThanOrEqual(1100);
      }
    });
  });

  it("validates query parameters with scholarsQuerySchema", () => {
    const valid = scholarsQuerySchema.safeParse({
      fieldsOfStudy: "Mathematics",
      activeYear: 820,
      primaryCity: "Baghdad",
    });
    expect(valid.success).toBe(true);

    const invalidYear = scholarsQuerySchema.safeParse({ activeYear: 400 });
    expect(invalidYear.success).toBe(false);
  });

  it("serves all scholars via GET /api/scholars", async () => {
    const req = new NextRequest("http://localhost:3000/api/scholars");
    const res = await getScholarsRoute(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.count).toBe(initialScholars.length);
    expect(data.items.length).toBe(initialScholars.length);
  });

  it("filters scholars by discipline via GET /api/scholars?fieldsOfStudy=Optics", async () => {
    const req = new NextRequest("http://localhost:3000/api/scholars?fieldsOfStudy=Optics");
    const res = await getScholarsRoute(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.items.length).toBeGreaterThanOrEqual(1);
    expect(data.items.some((s: any) => s.id === "sch_ibn_al_haytham")).toBe(true);
  });

  it("filters scholars active during a specific year via GET /api/scholars?activeYear=820", async () => {
    const req = new NextRequest("http://localhost:3000/api/scholars?activeYear=820");
    const res = await getScholarsRoute(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.items.some((s: any) => s.id === "sch_al_khwarizmi")).toBe(true);
  });

  it("serves a single scholar by ID via GET /api/scholars/[id]", async () => {
    const req = new NextRequest("http://localhost:3000/api/scholars/sch_al_khwarizmi");
    const res = await getScholarByIdRoute(req, { params: { id: "sch_al_khwarizmi" } });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.id).toBe("sch_al_khwarizmi");
    expect(data.name).toContain("al-Khwarizmi");
    expect(data.patronPolity).toBeDefined();
    expect(data.patronPolity.id).toBe("pol_abbasid_early");
    expect(data.primarySource).toBeDefined();
  });

  it("returns 404 for unknown scholar ID", async () => {
    const req = new NextRequest("http://localhost:3000/api/scholars/unknown_scholar");
    const res = await getScholarByIdRoute(req, { params: { id: "unknown_scholar" } });
    expect(res.status).toBe(404);
  });
});
