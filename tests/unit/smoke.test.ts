import { describe, it, expect } from "vitest";
import { formatHistoricalYear, cn } from "@/lib/utils";

describe("Utility Functions Smoke Tests", () => {
  it("formats positive CE years correctly", () => {
    expect(formatHistoricalYear(750)).toBe("750 CE");
    expect(formatHistoricalYear(622)).toBe("622 CE");
    expect(formatHistoricalYear(1000)).toBe("1000 CE");
  });

  it("formats negative BCE years correctly", () => {
    expect(formatHistoricalYear(-500)).toBe("500 BCE");
  });

  it("merges class names safely using cn()", () => {
    const result = cn("base-class", false && "hidden", "extra-class");
    expect(result).toBe("base-class extra-class");
  });
});

