/**
 * Territory Dynamics & Boundary Change Engine
 * Analyzes geopolitical expansion, contraction, status changes, and territorial gains/losses
 * across historical epochs for the Islamic Historical Atlas.
 */

import { initialTerritoryPeriods, initialPolities } from "@/lib/data/historicalSeed";
import { filterActiveTerritories } from "@/lib/geo/territoryUtils";
import type { TerritoryPeriodRecord } from "@/lib/db/schema/territoryPeriods";

export type AdministrativeControlType =
  | "direct"
  | "vassal_state"
  | "tributary"
  | "disputed"
  | "temporary_occupation";

export interface AdministrativeTypeMetadata {
  type: AdministrativeControlType;
  label: string;
  description: string;
  cartographicStyle: {
    strokeDash?: string;
    weightMultiplier: number;
    opacityMultiplier: number;
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
  };
}

export const ADMINISTRATIVE_TYPES: Record<AdministrativeControlType, AdministrativeTypeMetadata> = {
  direct: {
    type: "direct",
    label: "Direct Imperial Governance",
    description:
      "Core provincial administration with caliphal governors, garrison towns (amsar), direct tax collection (kharaj & jizya), and imperial judicial courts.",
    cartographicStyle: {
      strokeDash: undefined,
      weightMultiplier: 1.0,
      opacityMultiplier: 1.0,
      badgeBg: "bg-emerald-100",
      badgeText: "text-emerald-950",
      badgeBorder: "border-emerald-300",
    },
  },
  vassal_state: {
    type: "vassal_state",
    label: "Vassal State Protectorate",
    description:
      "Autonomous regional principality or dynasty recognizing the caliph's or sultan's suzerainty, minting coinage in their name, and supplying allied troops during imperial campaigns.",
    cartographicStyle: {
      strokeDash: "2, 4",
      weightMultiplier: 0.8,
      opacityMultiplier: 0.65,
      badgeBg: "bg-amber-100",
      badgeText: "text-amber-950",
      badgeBorder: "border-amber-300",
    },
  },
  tributary: {
    type: "tributary",
    label: "Tributary Realm",
    description:
      "Borderland kingdom or emirate paying annual financial tribute or security subsidies to maintain non-belligerence and border security without direct imperial administration.",
    cartographicStyle: {
      strokeDash: "2, 4",
      weightMultiplier: 0.8,
      opacityMultiplier: 0.65,
      badgeBg: "bg-orange-100",
      badgeText: "text-orange-950",
      badgeBorder: "border-orange-300",
    },
  },
  disputed: {
    type: "disputed",
    label: "Contested Frontier / Disputed Zone",
    description:
      "Heavily contested border marches (al-Thughur) or frontier marches subject to continuous military incursions, contested sovereignty, and frequent changes of control.",
    cartographicStyle: {
      strokeDash: "5, 5",
      weightMultiplier: 1.1,
      opacityMultiplier: 0.75,
      badgeBg: "bg-rose-100",
      badgeText: "text-rose-950",
      badgeBorder: "border-rose-300",
    },
  },
  temporary_occupation: {
    type: "temporary_occupation",
    label: "Temporary Military Occupation",
    description:
      "Short-term military control or staging theater established during imperial campaigns before formal administrative treaty or withdrawal.",
    cartographicStyle: {
      strokeDash: "6, 3, 2, 3",
      weightMultiplier: 0.9,
      opacityMultiplier: 0.7,
      badgeBg: "bg-purple-100",
      badgeText: "text-purple-950",
      badgeBorder: "border-purple-300",
    },
  },
};

export interface TerritoryShiftSummary {
  fromYear: number;
  toYear: number;
  elapsedYears: number;
  gainedTerritories: TerritoryPeriodRecord[];
  lostTerritories: TerritoryPeriodRecord[];
  persistentTerritories: TerritoryPeriodRecord[];
  netProvinceDelta: number;
  polityDeltas: {
    polityId: string;
    canonicalName: string;
    gainedCount: number;
    lostCount: number;
    netDelta: number;
  }[];
}

/**
 * Computes territorial gains, losses, and sovereignty transfers between two historical years.
 */
export function computeTerritoryShift(
  fromYear: number,
  toYear: number
): TerritoryShiftSummary {
  const activeFrom = filterActiveTerritories(initialTerritoryPeriods, fromYear);
  const activeTo = filterActiveTerritories(initialTerritoryPeriods, toYear);

  const idsFrom = new Set(activeFrom.map((t) => t.id));
  const idsTo = new Set(activeTo.map((t) => t.id));

  // Gained: territories active in toYear but not active in fromYear
  const gainedTerritories = activeTo.filter((t) => !idsFrom.has(t.id));

  // Lost: territories active in fromYear that are no longer active in toYear
  const lostTerritories = activeFrom.filter((t) => !idsTo.has(t.id));

  // Persistent: territories active across both years
  const persistentTerritories = activeTo.filter((t) => idsFrom.has(t.id));

  // Aggregate polity changes
  const allAffectedPolityIds = new Set<string>();
  gainedTerritories.forEach((t) => allAffectedPolityIds.add(t.polityId));
  lostTerritories.forEach((t) => allAffectedPolityIds.add(t.polityId));

  const polityDeltas = Array.from(allAffectedPolityIds)
    .map((polityId) => {
      const polity = initialPolities.find((p) => p.id === polityId);
      const gainedCount = gainedTerritories.filter((t) => t.polityId === polityId).length;
      const lostCount = lostTerritories.filter((t) => t.polityId === polityId).length;
      return {
        polityId,
        canonicalName: polity?.canonicalName || polityId,
        gainedCount,
        lostCount,
        netDelta: gainedCount - lostCount,
      };
    })
    .sort((a, b) => Math.abs(b.netDelta) - Math.abs(a.netDelta));

  return {
    fromYear,
    toYear,
    elapsedYears: Math.abs(toYear - fromYear),
    gainedTerritories,
    lostTerritories,
    persistentTerritories,
    netProvinceDelta: activeTo.length - activeFrom.length,
    polityDeltas,
  };
}

export interface EmpireTerritorialEpoch {
  epochId: string;
  polityId: string;
  regionName: string;
  startYear: number;
  endYear: number;
  controlType: string;
  explanatoryNote: string | null;
  phase: "expansion" | "zenith" | "contraction" | "successor";
}

/**
 * Returns the chronological territorial epochs for an empire, classifying each as
 * expansion, zenith, contraction, or successor state.
 */
export function getEmpireTerritorialEpochs(polityId: string): EmpireTerritorialEpoch[] {
  const territoryList = initialTerritoryPeriods
    .filter((t) => t.polityId === polityId)
    .sort((a, b) => a.validFromYear - b.validFromYear);

  if (territoryList.length === 0) return [];

  const polity = initialPolities.find((p) => p.id === polityId);

  return territoryList.map((t, idx) => {
    let phase: "expansion" | "zenith" | "contraction" | "successor" = "expansion";

    if (territoryList.length === 1) {
      phase = "zenith";
    } else if (idx === 0) {
      phase = "expansion";
    } else if (idx === territoryList.length - 1 && t.validToYear >= (polity?.endYear || 1922) - 10) {
      phase = "contraction";
    } else {
      phase = "zenith";
    }

    return {
      epochId: t.id,
      polityId: t.polityId,
      regionName: t.regionName,
      startYear: t.validFromYear,
      endYear: t.validToYear,
      controlType: t.controlType,
      explanatoryNote: t.explanatoryNote,
      phase,
    };
  });
}
