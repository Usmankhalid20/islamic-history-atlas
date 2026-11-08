import { describe, it, expect, beforeEach } from "vitest";
import {
  checkRateLimit,
  getRateLimitHeaders,
  resetRateLimiter,
  RATE_LIMIT_CONFIGS,
} from "@/lib/api/rateLimiter";
import { middleware } from "@/middleware";
import { NextRequest } from "next/server";

describe("In-Memory Sliding-Window Rate Limiter", () => {
  beforeEach(() => {
    resetRateLimiter();
  });

  it("permits standard requests within 60 req/min limit", () => {
    const ip = "192.168.1.100";
    const limit = RATE_LIMIT_CONFIGS.standard.maxRequests;

    for (let i = 0; i < limit; i++) {
      const res = checkRateLimit(ip, "standard");
      expect(res.allowed).toBe(true);
      expect(res.limit).toBe(60);
      expect(res.remaining).toBe(limit - 1 - i);
    }

    // 61st request should be rejected
    const blocked = checkRateLimit(ip, "standard");
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.retryAfter).toBeGreaterThan(0);
  });

  it("enforces stricter limits on the AI tier (10 req/min)", () => {
    const ip = "192.168.1.101";
    const limit = RATE_LIMIT_CONFIGS.ai.maxRequests;

    for (let i = 0; i < limit; i++) {
      const res = checkRateLimit(ip, "ai");
      expect(res.allowed).toBe(true);
      expect(res.remaining).toBe(limit - 1 - i);
    }

    // 11th request must be rejected
    const blocked = checkRateLimit(ip, "ai");
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.retryAfter).toBeGreaterThan(0);
  });

  it("isolates counters across different IP addresses", () => {
    const ipA = "10.0.0.1";
    const ipB = "10.0.0.2";

    // Exhaust ipA
    for (let i = 0; i < 60; i++) {
      checkRateLimit(ipA, "standard");
    }
    expect(checkRateLimit(ipA, "standard").allowed).toBe(false);

    // ipB must still have full allowance
    const resB = checkRateLimit(ipB, "standard");
    expect(resB.allowed).toBe(true);
    expect(resB.remaining).toBe(59);
  });

  it("isolates counters across different tiers for the same IP", () => {
    const ip = "172.16.0.5";

    // Exhaust AI tier (10 requests)
    for (let i = 0; i < 10; i++) {
      checkRateLimit(ip, "ai");
    }
    expect(checkRateLimit(ip, "ai").allowed).toBe(false);

    // Standard tier must still be allowed
    const standardRes = checkRateLimit(ip, "standard");
    expect(standardRes.allowed).toBe(true);
  });

  it("generates compliant HTTP rate limit headers", () => {
    const allowedResult = {
      allowed: true,
      limit: 60,
      remaining: 45,
      resetTime: 1700000060,
      retryAfter: 0,
    };

    const allowedHeaders = getRateLimitHeaders(allowedResult);
    expect(allowedHeaders["X-RateLimit-Limit"]).toBe("60");
    expect(allowedHeaders["X-RateLimit-Remaining"]).toBe("45");
    expect(allowedHeaders["X-RateLimit-Reset"]).toBe("1700000060");
    expect(allowedHeaders["Retry-After"]).toBeUndefined();

    const blockedResult = {
      allowed: false,
      limit: 60,
      remaining: 0,
      resetTime: 1700000060,
      retryAfter: 35,
    };

    const blockedHeaders = getRateLimitHeaders(blockedResult);
    expect(blockedHeaders["X-RateLimit-Limit"]).toBe("60");
    expect(blockedHeaders["X-RateLimit-Remaining"]).toBe("0");
    expect(blockedHeaders["Retry-After"]).toBe("35");
  });

  describe("Next.js Rate Limiting Middleware", () => {
    it("passes through non-API requests unchanged", () => {
      const req = new NextRequest("http://localhost:3000/compare");
      const res = middleware(req);
      expect(res.status).toBe(200);
      expect(res.headers.get("X-RateLimit-Limit")).toBeNull();
    });

    it("attaches rate limit headers on allowed API requests", () => {
      const req = new NextRequest("http://localhost:3000/api/events", {
        headers: { "x-forwarded-for": "203.0.113.195" },
      });
      const res = middleware(req);
      expect(res.status).toBe(200);
      expect(res.headers.get("X-RateLimit-Limit")).toBe("60");
      expect(res.headers.get("X-RateLimit-Remaining")).toBe("59");
    });

    it("returns 429 Too Many Requests when client exceeds tier limit", () => {
      const ip = "203.0.113.199";
      // Exhaust AI limit (10 reqs)
      for (let i = 0; i < 10; i++) {
        const req = new NextRequest("http://localhost:3000/api/ai/inquire", {
          headers: { "x-forwarded-for": ip },
        });
        const res = middleware(req);
        expect(res.status).toBe(200);
      }

      // 11th request triggers 429
      const blockedReq = new NextRequest("http://localhost:3000/api/ai/inquire", {
        headers: { "x-forwarded-for": ip },
      });
      const blockedRes = middleware(blockedReq);
      expect(blockedRes.status).toBe(429);
      expect(blockedRes.headers.get("Retry-After")).toBeDefined();
    });
  });
});
