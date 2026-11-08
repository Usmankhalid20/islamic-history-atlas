import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind and conditional class names safely.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats a historical year into standard historical notation (CE).
 */
export function formatHistoricalYear(year: number): string {
  if (year < 0) {
    return `${Math.abs(year)} BCE`;
  }
  return `${year} CE`;
}

export const POLITY_COLOR_MAP: Record<string, string> = {
  pol_rashidun: "#9A3412",
  pol_umayyad: "#D97706",
  pol_abbasid_early: "#1C1917",
  pol_cordoba_emirate: "#059669",
  pol_fatimid: "#2563EB",
};

export function getPolityColor(polityId?: string | null): string {
  if (!polityId) return "#475569";
  return POLITY_COLOR_MAP[polityId] || "#475569";
}


