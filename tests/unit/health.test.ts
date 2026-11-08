import { describe, it, expect } from "vitest";
import { GET as getHealthRoute } from "@/app/api/health/route";

describe("Operational Health Probe Endpoint", () => {
  it("returns healthy operational status with runtime metrics", async () => {
    const res = await getHealthRoute();
    const data = await res.json();

    expect([200, 503]).toContain(res.status);
    expect(["healthy", "degraded"]).toContain(data.status);
    expect(data.version).toBe("1.0.0");
    expect(typeof data.timestamp).toBe("string");
    expect(typeof data.uptimeSeconds).toBe("number");
    expect(data.database).toBeDefined();
    expect(typeof data.database.connected).toBe("boolean");
    expect(data.memory).toBeDefined();
    expect(typeof data.memory.rssMb).toBe("number");
    expect(res.headers.get("Cache-Control")).toContain("no-store");
  });
});
