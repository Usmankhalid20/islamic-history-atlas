import { describe, it, expect } from "vitest";

describe("Timeline Stepping & Clamping Logic", () => {
  const MIN_YEAR = 500;
  const MAX_YEAR = 1980;

  function clampYear(val: number): number {
    return Math.max(MIN_YEAR, Math.min(MAX_YEAR, val));
  }

  function stepYear(current: number, delta: number): number {
    return clampYear(current + delta);
  }

  it("clamps years exceeding maximum bound", () => {
    expect(clampYear(1990)).toBe(1980);
    expect(clampYear(2025)).toBe(1980);
  });

  it("clamps years below minimum bound", () => {
    expect(clampYear(499)).toBe(500);
    expect(clampYear(0)).toBe(500);
  });

  it("retains valid years within bounds", () => {
    expect(clampYear(500)).toBe(500);
    expect(clampYear(632)).toBe(632);
    expect(clampYear(750)).toBe(750);
    expect(clampYear(1550)).toBe(1550);
    expect(clampYear(1980)).toBe(1980);
  });

  it("steps by -50, -10, -1, +1, +10, and +50 correctly", () => {
    expect(stepYear(750, 1)).toBe(751);
    expect(stepYear(750, -1)).toBe(749);
    expect(stepYear(750, 10)).toBe(760);
    expect(stepYear(750, -10)).toBe(740);
    expect(stepYear(750, 50)).toBe(800);
    expect(stepYear(750, -50)).toBe(700);
  });

  it("does not step below minimum or above maximum", () => {
    expect(stepYear(520, -50)).toBe(500);
    expect(stepYear(1960, 50)).toBe(1980);
  });
});

