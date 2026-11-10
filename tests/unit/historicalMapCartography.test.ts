import { describe, it, expect } from "vitest";
import { HISTORICAL_CITIES } from "@/lib/data/historicalCitiesSeed";
import { POLITY_COLORS } from "@/components/map/HistoricalMap";

describe("Historical Map Cartography & Urban Geography Verification", () => {
  describe("Historical Cities & Imperial Capitals Seed Dataset", () => {
    it("defines comprehensive major historical cities across the Islamic world", () => {
      expect(HISTORICAL_CITIES.length).toBeGreaterThanOrEqual(18);

      const cityIds = new Set(HISTORICAL_CITIES.map((c) => c.id));
      const requiredCities = [
        "city_medina",
        "city_kufa",
        "city_damascus",
        "city_baghdad",
        "city_samarra",
        "city_cordoba",
        "city_cairo",
        "city_mahdia",
        "city_bukhara",
        "city_samarkand",
        "city_ghazna",
        "city_isfahan",
        "city_marrakech",
        "city_delhi",
        "city_istanbul",
        "city_agra",
        "city_jerusalem",
        "city_mecca",
      ];

      for (const id of requiredCities) {
        expect(cityIds.has(id), `Missing required historical city: ${id}`).toBe(true);
      }
    });

    it("ensures every city has valid GeoJSON coordinates and rich metadata", () => {
      HISTORICAL_CITIES.forEach((city) => {
        expect(city.name.length).toBeGreaterThan(0);
        expect(city.region.length).toBeGreaterThan(0);
        expect(city.significance.length).toBeGreaterThan(10);

        // Coordinates [lng, lat]
        const [lng, lat] = city.coordinates;
        expect(lat).toBeGreaterThanOrEqual(10);
        expect(lat).toBeLessThanOrEqual(55);
        expect(lng).toBeGreaterThanOrEqual(-15);
        expect(lng).toBeLessThanOrEqual(95);

        // Capital eras validation
        city.capitalEras.forEach((era) => {
          expect(era.fromYear).toBeLessThanOrEqual(era.toYear);
          expect(era.capitalTitle.length).toBeGreaterThan(0);
          expect(era.polityId).toMatch(/^pol_/);
        });

        // Ruling powers validation
        city.rulingPowers.forEach((rp) => {
          expect(rp.fromYear).toBeLessThanOrEqual(rp.toYear);
          expect(rp.polityId).toMatch(/^pol_/);
        });
      });
    });

    it("resolves the correct imperial capital for benchmark historical dates", () => {
      function getActiveCapitals(year: number) {
        return HISTORICAL_CITIES.filter((city) =>
          city.capitalEras.some((era) => year >= era.fromYear && year <= era.toYear)
        ).map((c) => c.name);
      }

      // 634 CE (Abu Bakr / Umar) -> Medina
      expect(getActiveCapitals(634)).toContain("Medina");

      // 700 CE (Umayyad zenith) -> Damascus
      expect(getActiveCapitals(700)).toContain("Damascus");

      // 800 CE (Harun al-Rashid) -> Baghdad
      expect(getActiveCapitals(800)).toContain("Baghdad");

      // 850 CE (al-Mutawakkil) -> Samarra
      expect(getActiveCapitals(850)).toContain("Samarra");

      // 950 CE (Abd al-Rahman III) -> Córdoba
      expect(getActiveCapitals(950)).toContain("Córdoba");

      // 1000 CE (al-Hakim) -> Cairo
      expect(getActiveCapitals(1000)).toContain("Cairo");

      // 1080 CE (Malik Shah) -> Isfahan
      expect(getActiveCapitals(1080)).toContain("Isfahan");

      // 1400 CE (Timur) -> Samarkand
      expect(getActiveCapitals(1400)).toContain("Samarkand");

      // 1550 CE (Suleiman the Magnificent) -> Istanbul
      expect(getActiveCapitals(1550)).toContain("Istanbul / Constantinople");

      // 1600 CE (Akbar the Great) -> Agra
      expect(getActiveCapitals(1600)).toContain("Agra");
    });
  });

  describe("Scholarly Dynastic Archival Palette Adherence", () => {
    it("strictly satisfies the color specifications defined in Phase 5.4", () => {
      expect(POLITY_COLORS["pol_seljuk"].fill).toBe("#3978C5"); // Seljuk Azure
      expect(POLITY_COLORS["pol_ghaznavid"].fill).toBe("#94633E"); // Ghaznavid Earth Brown
      expect(POLITY_COLORS["pol_mamluk"].fill).toBe("#D94B45"); // Mamluk Crimson
      expect(POLITY_COLORS["pol_ayyubid"].fill).toBe("#39966A"); // Ayyubid Emerald
      expect(POLITY_COLORS["pol_zengid"].fill).toBe("#8656B9"); // Zengid Violet
      expect(POLITY_COLORS["pol_abbasid_early"].fill).toBe("#D6A642"); // Abbasid Gold
      expect(POLITY_COLORS["pol_mongol"].fill).toBe("#626B76"); // Mongol Steppe Slate
      expect(POLITY_COLORS["pol_umayyad"].fill).toBe("#299B9B"); // Umayyad Teal
    });
  });
});
