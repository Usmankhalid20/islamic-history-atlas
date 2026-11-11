import { describe, it, expect } from "vitest";
import {
  POLITY_NATIVE_TITLES,
} from "@/components/atlas/EmpireDetailPanel";
import {
  initialPolities,
  initialTerritoryPeriods,
  initialRulers,
  initialReigns,
  initialMonuments,
  initialScholars,
} from "@/lib/data/historicalSeed";

describe("Phase 5: Empire Information Panel Architecture & Dynastic Synthesis", () => {
  it("provides attested classical native script titles for all 21 major polities", () => {
    expect(initialPolities.length).toBeGreaterThanOrEqual(21);

    initialPolities.forEach((polity) => {
      const native = POLITY_NATIVE_TITLES[polity.id];
      expect(native, `Missing native script title for polity: ${polity.id}`).toBeDefined();
      expect(native.script.length).toBeGreaterThan(0);
      expect(native.language.length).toBeGreaterThan(0);
    });
  });

  it("resolves active reigning monarchs dynamically for polities across historical eras", () => {
    // Helper to resolve reigning ruler for a polity in a given year
    function getReigningRuler(polityId: string, year: number) {
      const reigns = initialReigns.filter(
        (r) => r.polityId === polityId && r.startYear <= year && (r.endYear ? r.endYear >= year : true)
      );
      if (reigns.length === 0) return null;
      const ruler = initialRulers.find((r) => r.id === reigns[0].rulerId);
      return { reign: reigns[0], ruler };
    }

    // 1. Rashidun in 633 CE -> Abu Bakr
    const r633 = getReigningRuler("pol_rashidun", 633);
    expect(r633).toBeDefined();
    expect(r633?.ruler?.preferredName).toContain("Abu Bakr");

    // 2. Rashidun in 640 CE -> Umar ibn al-Khattab
    const r640 = getReigningRuler("pol_rashidun", 640);
    expect(r640).toBeDefined();
    expect(r640?.ruler?.preferredName).toContain("Umar");

    // 3. Rashidun in 650 CE -> Uthman ibn Affan
    const r650 = getReigningRuler("pol_rashidun", 650);
    expect(r650).toBeDefined();
    expect(r650?.ruler?.preferredName).toContain("Uthman");

    // 4. Rashidun in 658 CE -> Ali ibn Abi Talib
    const r658 = getReigningRuler("pol_rashidun", 658);
    expect(r658).toBeDefined();
    expect(r658?.ruler?.preferredName).toContain("Ali");

    // 5. Umayyad in 670 CE -> Mu'awiya I
    const r670 = getReigningRuler("pol_umayyad", 670);
    expect(r670).toBeDefined();
    expect(r670?.ruler?.preferredName).toContain("Mu'awiya");

    // 6. Umayyad in 700 CE -> Abd al-Malik ibn Marwan
    const r700 = getReigningRuler("pol_umayyad", 700);
    expect(r700).toBeDefined();
    expect(r700?.ruler?.preferredName).toContain("Abd al-Malik");

    // 7. Fatimid in 920 CE -> Ubayd Allah al-Mahdi
    const r920 = getReigningRuler("pol_fatimid", 920);
    expect(r920).toBeDefined();
    expect(r920?.ruler?.preferredName).toContain("al-Mahdi");

    // 8. Fatimid in 970 CE -> al-Mu'izz li-Din Allah
    const r970 = getReigningRuler("pol_fatimid", 970);
    expect(r970).toBeDefined();
    expect(r970?.ruler?.preferredName).toContain("al-Mu'izz");
  });

  it("ensures every polity has mapped territory periods and imperial seats", () => {
    initialPolities.forEach((polity) => {
      // Must have capital city recorded
      expect(polity.capitalCity, `Polity ${polity.id} has no capitalCity defined`).toBeDefined();
      expect(polity.capitalCity!.length).toBeGreaterThan(0);

      // Must have at least one mapped territory period
      const territories = initialTerritoryPeriods.filter((t) => t.polityId === polity.id);
      expect(
        territories.length,
        `Polity ${polity.id} has 0 territory periods associated`
      ).toBeGreaterThanOrEqual(1);

      // Territory start year must intersect or align with polity lifespan
      territories.forEach((t) => {
        expect(t.validFromYear).toBeGreaterThanOrEqual(polity.startYear - 5);
      });
    });
  });

  it("links architectural monuments and polymaths to dynastic patrons", () => {
    // Umayyads patronized Dome of the Rock & Great Mosque of Damascus
    const umayyadMonuments = initialMonuments.filter((m) => m.polityId === "pol_umayyad");
    expect(umayyadMonuments.length).toBeGreaterThanOrEqual(1);
    const hasDomeOfRock = umayyadMonuments.some((m) => m.name.includes("Dome of the Rock"));
    expect(hasDomeOfRock).toBe(true);

    // Abbasids patronized House of Wisdom (Bayt al-Hikma) & scholars like al-Khwarizmi
    const abbasidMonuments = initialMonuments.filter((m) => m.polityId === "pol_abbasid_early");
    expect(abbasidMonuments.length).toBeGreaterThanOrEqual(1);

    const abbasidScholars = initialScholars.filter(
      (s) => s.patronizedByPolityId === "pol_abbasid_early"
    );
    expect(abbasidScholars.length).toBeGreaterThanOrEqual(1);
    const hasKhwarizmi = abbasidScholars.some((s) => s.name.includes("al-Khwarizmi"));
    expect(hasKhwarizmi).toBe(true);
  });
});
