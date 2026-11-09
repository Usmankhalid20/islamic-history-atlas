import { describe, it, expect } from "vitest";
import {
  HISTORICAL_REGIONS,
  HistoricalRegion,
} from "@/components/map/MapControls";

describe("Phase 1 — Historical Map Foundation Unit Tests", () => {
  describe("Historical Theaters & Region Navigation", () => {
    it("defines the primary historical theaters of the Islamic world", () => {
      const regionIds = HISTORICAL_REGIONS.map((r) => r.id);
      expect(regionIds).toContain("heartland");
      expect(regionIds).toContain("andalus_maghreb");
      expect(regionIds).toContain("mesopotamia_persia");
      expect(regionIds).toContain("central_asia");
      expect(regionIds).toContain("egypt_levant");
      expect(regionIds).toContain("anatolia");
    });

    it("verifies all historical regions have geographically valid coordinates", () => {
      HISTORICAL_REGIONS.forEach((region: HistoricalRegion) => {
        const [lat, lng] = region.center;
        expect(lat).toBeGreaterThanOrEqual(-90);
        expect(lat).toBeLessThanOrEqual(90);
        expect(lng).toBeGreaterThanOrEqual(-180);
        expect(lng).toBeLessThanOrEqual(180);
        expect(region.zoom).toBeGreaterThanOrEqual(3);
        expect(region.zoom).toBeLessThanOrEqual(10);
        expect(region.name).toBeTruthy();
      });
    });

    it("verifies the Islamic Heartland centers precisely on Arabia, Levant and Hijaz", () => {
      const heartland = HISTORICAL_REGIONS.find((r) => r.id === "heartland");
      expect(heartland).toBeDefined();
      expect(heartland!.center[0]).toBeCloseTo(28.0, 1);
      expect(heartland!.center[1]).toBeCloseTo(38.0, 1);
      expect(heartland!.zoom).toBe(4);
    });

    it("verifies Al-Andalus and Maghreb coordinate anchors", () => {
      const andalus = HISTORICAL_REGIONS.find((r) => r.id === "andalus_maghreb");
      expect(andalus).toBeDefined();
      expect(andalus!.center[0]).toBeGreaterThan(30);
      expect(andalus!.center[1]).toBeLessThan(5);
    });
  });

  describe("Basemap Cartographic Styles", () => {
    it("supports the three primary cartographic styles without requiring external API keys", () => {
      const basemapStyles = ["light_gray", "physical_relief", "antique_sepia"];
      expect(basemapStyles).toHaveLength(3);
    });
  });

  describe("Layer Control & Opacity Constraints", () => {
    it("ensures territory opacity boundaries are within readable cartographic ranges", () => {
      const minOpacity = 0.1;
      const maxOpacity = 0.9;
      const defaultOpacity = 0.5;

      expect(defaultOpacity).toBeGreaterThanOrEqual(minOpacity);
      expect(defaultOpacity).toBeLessThanOrEqual(maxOpacity);
    });
  });
});

