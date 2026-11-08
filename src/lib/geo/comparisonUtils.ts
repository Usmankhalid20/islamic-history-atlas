import {
  initialTerritoryPeriods,
  initialPolities,
  initialMonuments,
  initialTradeRoutes,
  initialCampaigns,
} from "@/lib/data/historicalSeed";
import { filterActiveTerritories } from "@/lib/geo/territoryUtils";
import type { PolityRecord, NewPolityRecord } from "@/lib/db/schema/polities";
import type { NewMonumentRecord } from "@/lib/db/schema/monuments";
import type { TradeRouteRecord } from "@/lib/db/schema/tradeRoutes";
import type { NewCampaignRecord } from "@/lib/db/schema/campaigns";

export type AnyPolity = PolityRecord | NewPolityRecord;

export interface ComparisonPreset {
  id: string;
  title: string;
  shortName: string;
  yearA: number;
  yearB: number;
  description: string;
  keyHistoricalTakeaway: string;
  primarySources: string[];
}

export interface EraComparisonDelta {
  yearA: number;
  yearB: number;
  elapsedYears: number;
  politiesA: AnyPolity[];
  politiesB: AnyPolity[];
  emergedPolities: AnyPolity[];
  dissolvedPolities: AnyPolity[];
  persistentPolities: AnyPolity[];
  newMonumentsBetween: (Omit<NewMonumentRecord, "createdAt"> & { createdAt?: Date })[];
  routesActiveA: (Omit<TradeRouteRecord, "createdAt"> & { createdAt?: Date })[];
  routesActiveB: (Omit<TradeRouteRecord, "createdAt"> & { createdAt?: Date })[];
  campaignsActiveA: (Omit<NewCampaignRecord, "createdAt"> & { createdAt?: Date })[];
  campaignsActiveB: (Omit<NewCampaignRecord, "createdAt"> & { createdAt?: Date })[];
  territoriesCountA: number;
  territoriesCountB: number;
}

export const COMPARISON_PRESETS: ComparisonPreset[] = [
  {
    id: "preset_rashidun_to_umayyad",
    title: "The Rashidun to Umayyad Transition",
    shortName: "632 vs. 661 CE",
    yearA: 632,
    yearB: 661,
    description:
      "Witness the rapid geopolitical metamorphosis from the embryonic community state in Medina to a vast imperial caliphate headquartered in Damascus under Mu'awiya I.",
    keyHistoricalTakeaway:
      "In under three decades, territorial administration expanded from the Hijaz across the Levant, Mesopotamia, Sasanian Iran, and Egypt, creating direct bureaucratic institutions.",
    primarySources: [
      "Hugh Kennedy, The Prophet and the Age of the Caliphates (2004), ch. 3-4",
      "al-Baladhuri, Futuh al-Buldan (Book of the Conquest of Lands)",
    ],
  },
  {
    id: "preset_umayyad_to_abbasid",
    title: "The Abbasid Revolution & Umayyad Exile",
    shortName: "749 vs. 756 CE",
    yearA: 749,
    yearB: 756,
    description:
      "Observe the seismic overthrow of the Syrian-based Umayyad dynasty by the Abbasid revolutionary vanguard and the miraculous escape of Abd al-Rahman I to found the Emirate of Córdoba.",
    keyHistoricalTakeaway:
      "The unitary Pax Islamica shattered; the Abbasid realm shifted east toward Iraq and Khurasan, while the Iberian Peninsula split into an autonomous western emirate.",
    primarySources: [
      "Hugh Kennedy (2004), ch. 5 'The Abbasid Revolution'",
      "C.E. Bosworth, The New Islamic Dynasties (1996)",
    ],
  },
  {
    id: "preset_tri_caliphate",
    title: "The Tri-Caliphate Era: Multi-Polar Hegemony",
    shortName: "750 vs. 969 CE",
    yearA: 750,
    yearB: 969,
    description:
      "Contrast the early monolithic Abbasid caliphate with the 10th-century multi-polar world dominated by three rival caliphates: Abbasids in Baghdad, Fatimids in Cairo, and Umayyads in Córdoba.",
    keyHistoricalTakeaway:
      "The 10th century marked the end of single-caliph authority. The Fatimid general Jawhar conquered Egypt in 969 CE and founded al-Qahira (Cairo) as an imperial Shi'i counter-capital.",
    primarySources: [
      "Encyclopaedia of Islam, 2nd ed. (EI2), entries 'Fatimids', 'Khilafa'",
      "Hugh Kennedy (2004), ch. 9 'The Fatimid Empire'",
    ],
  },
  {
    id: "preset_golden_age",
    title: "The Golden Age of Translation & Science",
    shortName: "786 vs. 900 CE",
    yearA: 786,
    yearB: 900,
    description:
      "Trace the intellectual and infrastructural explosion from the accession of Harun al-Rashid to the maturity of Baghdad's Bayt al-Hikma and the flourishing of algebra and astronomy.",
    keyHistoricalTakeaway:
      "A surge in monumental foundations and translation academies catalysed the careers of al-Khwarizmi, al-Kindi, and early polymaths across trans-continental trade corridors.",
    primarySources: [
      "Dimitri Gutas, Greek Thought, Arabic Culture (Routledge 1998)",
      "Kennedy (2004), ch. 6",
    ],
  },
];

/**
 * Pure function computing the geopolitical, architectural, and territorial delta
 * between two historical years.
 */
export function computeEraDelta(yearA: number, yearB: number): EraComparisonDelta {
  const territoriesA = filterActiveTerritories(initialTerritoryPeriods, yearA);
  const territoriesB = filterActiveTerritories(initialTerritoryPeriods, yearB);

  const activePolityIdsA = new Set(territoriesA.map((t) => t.polityId));
  const activePolityIdsB = new Set(territoriesB.map((t) => t.polityId));

  const politiesA = initialPolities.filter((p) => activePolityIdsA.has(p.id));
  const politiesB = initialPolities.filter((p) => activePolityIdsB.has(p.id));

  // Emerged in Year B (not in Year A)
  const emergedPolities = politiesB.filter((p) => !activePolityIdsA.has(p.id));

  // Dissolved by Year B (was in Year A, no longer in Year B)
  const dissolvedPolities = politiesA.filter((p) => !activePolityIdsB.has(p.id));

  // Persistent across both years
  const persistentPolities = politiesA.filter((p) => activePolityIdsB.has(p.id));

  // Monuments founded between yearA and yearB
  const minYear = Math.min(yearA, yearB);
  const maxYear = Math.max(yearA, yearB);
  const newMonumentsBetween = initialMonuments.filter(
    (m) => m.foundingYear > minYear && m.foundingYear <= maxYear
  );

  // Active trade routes
  const routesActiveA = initialTradeRoutes.filter(
    (r) => r.activeFromYear <= yearA && (r.activeToYear ?? 2000) >= yearA
  );
  const routesActiveB = initialTradeRoutes.filter(
    (r) => r.activeFromYear <= yearB && (r.activeToYear ?? 2000) >= yearB
  );

  // Active military campaigns
  const campaignsActiveA = initialCampaigns.filter(
    (c) => c.startYear <= yearA && c.endYear >= yearA
  );
  const campaignsActiveB = initialCampaigns.filter(
    (c) => c.startYear <= yearB && c.endYear >= yearB
  );

  return {
    yearA,
    yearB,
    elapsedYears: Math.abs(yearB - yearA),
    politiesA,
    politiesB,
    emergedPolities,
    dissolvedPolities,
    persistentPolities,
    newMonumentsBetween,
    routesActiveA,
    routesActiveB,
    campaignsActiveA,
    campaignsActiveB,
    territoriesCountA: territoriesA.length,
    territoriesCountB: territoriesB.length,
  };
}
