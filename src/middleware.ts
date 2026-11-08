import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getRateLimitHeaders, RateLimitTier } from "@/lib/api/rateLimiter";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only apply rate limiting to /api endpoints
  if (!pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Determine client identifier from standard proxy headers
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const clientIp = (forwardedFor ? forwardedFor.split(",")[0].trim() : realIp) || "127.0.0.1";

  // Select rate limit tier according to endpoint sensitivity
  let tier: RateLimitTier = "standard";
  if (pathname.startsWith("/api/ai")) {
    tier = "ai";
  } else if (pathname.startsWith("/api/health")) {
    tier = "health";
  }

  const rateLimit = checkRateLimit(clientIp, tier);
  const rateHeaders = getRateLimitHeaders(rateLimit);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: "Rate limit exceeded",
        message: "Too many requests. Please wait before submitting additional inquiries.",
        status: 429,
        retryAfterSeconds: rateLimit.retryAfter,
      },
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          ...rateHeaders,
        },
      }
    );
  }

  const response = NextResponse.next();
  for (const [headerKey, headerVal] of Object.entries(rateHeaders)) {
    response.headers.set(headerKey, headerVal);
  }

  return response;
}

export const config = {
  matcher: ["/api/:path*"],
};
