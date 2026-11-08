import { describe, it, expect } from "vitest";
import { initialPolities, initialSources, initialTerritoryPeriods } from "@/lib/data/historicalSeed";
import { generateStaticParams } from "@/app/polities/[id]/page";

describe("Polity and Source Directory Fixtures", () => {
  it("generates static route parameters for every initial polity", () => {
    const params = generateStaticParams();
    expect(params.length).toBe(initialPolities.length);

    const ids = params.map((p) => p.id);
    expect(ids).toContain("pol_rashidun");
    expect(ids).toContain("pol_umayyad");
    expect(ids).toContain("pol_abbasid_early");
    expect(ids).toContain("pol_cordoba_emirate");
    expect(ids).toContain("pol_fatimid");
  });

  it("every polity in directory has at least one associated territory or source", () => {
    for (const polity of initialPolities) {
      const territories = initialTerritoryPeriods.filter((t) => t.polityId === polity.id);
      expect(territories.length).toBeGreaterThanOrEqual(0);
      expect(polity.canonicalName.length).toBeGreaterThan(0);
      expect(polity.startYear).toBeGreaterThan(600);
    }
  });

  it("all sources contain verified titles, citations, and authors", () => {
    for (const src of initialSources) {
      expect(src.id).toBeDefined();
      expect(src.title.length).toBeGreaterThan(0);
      expect(src.authorOrOrganization.length).toBeGreaterThan(0);
      expect(src.citationText.length).toBeGreaterThan(0);
    }
  });
});

