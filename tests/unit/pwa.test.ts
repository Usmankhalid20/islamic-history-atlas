import { describe, it, expect } from "vitest";
import manifest from "@/app/manifest";
import fs from "node:fs";
import path from "node:path";

describe("Progressive Web App (PWA) & Offline Caching", () => {
  it("generates a valid W3C Web App Manifest", () => {
    const data = manifest();

    expect(data.name).toContain("Islamic History Atlas");
    expect(data.short_name).toBe("Islamic Atlas");
    expect(data.start_url).toBe("/");
    expect(data.display).toBe("standalone");
    expect(data.theme_color).toBe("#1C1917");
    expect(data.background_color).toBe("#FDFBF7");
    expect(data.icons?.length).toBeGreaterThanOrEqual(2);

    data.icons?.forEach((icon) => {
      expect(icon.src).toBeDefined();
      expect(icon.sizes).toBeDefined();
      expect(icon.type).toBe("image/png");
    });
  });

  it("verifies public/sw.js service worker implementation and caching strategies", () => {
    const swPath = path.join(process.cwd(), "public", "sw.js");
    expect(fs.existsSync(swPath)).toBe(true);

    const content = fs.readFileSync(swPath, "utf-8");

    // Cache name and versioning
    expect(content).toContain("islamic-history-atlas-v1");

    // Precache routes
    expect(content).toContain("/events");
    expect(content).toContain("/campaigns");
    expect(content).toContain("/routes");
    expect(content).toContain("/monuments");
    expect(content).toContain("/compare");
    expect(content).toContain("/uncertainty");

    // Standard lifecycle events
    expect(content).toContain('addEventListener("install"');
    expect(content).toContain('addEventListener("activate"');
    expect(content).toContain('addEventListener("fetch"');

    // Cartographic tile caching strategy (stale-while-revalidate for Carto / OSM)
    expect(content).toContain("cartocdn.com");
    expect(content).toContain("caches.open(CACHE_NAME)");
  });
});
