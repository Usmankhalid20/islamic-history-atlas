import { describe, it, expect } from "vitest";
import {
  initialHistoricalDiscrepancies,
  type HistoricalDiscrepancy,
} from "@/lib/data/discrepanciesSeed";

describe("Historical Uncertainty & Source Discrepancy Register", () => {
  it("contains curated historical discrepancies with balanced chronicler perspectives", () => {
    expect(initialHistoricalDiscrepancies.length).toBeGreaterThanOrEqual(4);

    initialHistoricalDiscrepancies.forEach((d) => {
      expect(d.id).toBeDefined();
      expect(d.title.length).toBeGreaterThan(10);
      expect(d.regionName.length).toBeGreaterThan(5);
      expect(d.activeFromYear).toBeGreaterThanOrEqual(632);
      expect(d.activeToYear).toBeGreaterThanOrEqual(d.activeFromYear);
      expect(d.historiographicalSummary.length).toBeGreaterThan(30);
      expect(d.cartographicImpact.length).toBeGreaterThan(15);
      expect(d.consensusRecommendation.length).toBeGreaterThan(15);

      // GeoJSON geometry validation
      const geo = d.geometryGeojson as { type: string; coordinates: [number, number][][] };
      expect(geo).toBeDefined();
      expect(geo.type).toBe("Polygon");
      expect(Array.isArray(geo.coordinates)).toBe(true);
      expect(geo.coordinates[0].length).toBeGreaterThanOrEqual(4);

      // Perspective balance validation: minimum 2 divergent scholarly/chronicler perspectives
      expect(d.perspectives.length).toBeGreaterThanOrEqual(2);
      const traditions = new Set(d.perspectives.map((p) => p.traditionOrSchool));
      expect(traditions.size).toBeGreaterThanOrEqual(2);

      d.perspectives.forEach((p) => {
        expect(p.sourceOrScholar.length).toBeGreaterThan(3);
        expect(p.claimSummary.length).toBeGreaterThan(15);
        expect(p.sourceTextExcerpt.length).toBeGreaterThan(15);
        expect(p.citation.length).toBeGreaterThan(10);
      });
    });
  });

  it("filters active discrepancies accurately for specific historical years", () => {
    // In 800 CE (Harun al-Rashid's era), the Al-Awasim Byzantine-Abbasid frontier dispute is active
    const activeIn800 = initialHistoricalDiscrepancies.filter(
      (d) => d.activeFromYear <= 800 && d.activeToYear >= 800
    );
    expect(activeIn800.some((d) => d.id === "disc_byzantine_abbasid_awasim")).toBe(true);

    // In 950 CE, Buyid sovereignty and Maghreb suzerainty disputes are active
    const activeIn950 = initialHistoricalDiscrepancies.filter(
      (d) => d.activeFromYear <= 950 && d.activeToYear >= 950
    );
    expect(activeIn950.some((d) => d.id === "disc_buyid_abbasid_sovereignty")).toBe(true);
    expect(activeIn950.some((d) => d.id === "disc_maghreb_umayyad_fatimid")).toBe(true);

    // In 640 CE, none of these 8th-10th century imperial disputes were active
    const activeIn640 = initialHistoricalDiscrepancies.filter(
      (d) => d.activeFromYear <= 640 && d.activeToYear >= 640
    );
    expect(activeIn640.length).toBe(0);
  });

  it("validates categories and confidence rating classifications", () => {
    const validCategories = [
      "boundary_dispute",
      "dating_variance",
      "chronicle_conflict",
      "sovereignty_ambiguity",
    ];
    const validConfidenceRatings = ["disputed", "approximate", "inferred", "conjectural"];

    initialHistoricalDiscrepancies.forEach((d) => {
      expect(validCategories).toContain(d.category);
      expect(validConfidenceRatings).toContain(d.confidenceRating);
    });

    const boundaryDisputes = initialHistoricalDiscrepancies.filter(
      (d) => d.category === "boundary_dispute"
    );
    expect(boundaryDisputes.length).toBeGreaterThanOrEqual(1);

    const disputedRating = initialHistoricalDiscrepancies.filter(
      (d) => d.confidenceRating === "disputed"
    );
    expect(disputedRating.length).toBeGreaterThanOrEqual(2);
  });
});
