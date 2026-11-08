import { describe, it, expect } from "vitest";
import nextConfig from "@/../next.config.mjs";

describe("Navigation & Route Integrity Audit", () => {
  it("verifies that nextConfig declares permanent redirect for legacy /atlas route", async () => {
    expect(nextConfig.redirects).toBeDefined();
    if (nextConfig.redirects) {
      const redirects = await nextConfig.redirects();
      const atlasRedirect = redirects.find((r: any) => r.source === "/atlas");
      expect(atlasRedirect).toBeDefined();
      expect(atlasRedirect?.destination).toBe("/");
      expect(atlasRedirect?.permanent).toBe(true);
    }
  });
});

