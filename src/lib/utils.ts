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

