/**
 * Zero-Infrastructure In-Memory Sliding-Window Token Bucket Rate Limiter
 * Conforms to ADR-008 and docs/API_DESIGN.md
 */

export type RateLimitTier = "standard" | "ai" | "health";

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetTime: number; // Unix timestamp in seconds
  retryAfter: number; // Seconds to wait before retrying (0 if allowed)
}

interface WindowBucket {
  timestamps: number[];
}

export const RATE_LIMIT_CONFIGS: Record<RateLimitTier, RateLimitConfig> = {
  standard: {
    maxRequests: 60,
    windowMs: 60 * 1000, // 60 seconds
  },
  ai: {
    maxRequests: 10,
    windowMs: 60 * 1000, // 60 seconds
  },
  health: {
    maxRequests: 120,
    windowMs: 60 * 1000, // 60 seconds
  },
};

const MAX_TRACKED_CLIENTS = 5000;
const storage = new Map<string, WindowBucket>();

/**
 * Checks and updates sliding window rate limit for a client identifier and tier.
 */
export function checkRateLimit(
  identifier: string,
  tier: RateLimitTier = "standard",
  now: number = Date.now()
): RateLimitResult {
  const config = RATE_LIMIT_CONFIGS[tier] || RATE_LIMIT_CONFIGS.standard;
  const key = `${tier}:${identifier}`;
  const windowStart = now - config.windowMs;

  let bucket = storage.get(key);

  if (!bucket) {
    // If storage is growing too large, prune oldest entries
    if (storage.size >= MAX_TRACKED_CLIENTS) {
      const keysToDelete: string[] = [];
      let count = 0;
      storage.forEach((b, k) => {
        if (count < 1000 && (b.timestamps.length === 0 || b.timestamps[b.timestamps.length - 1] < windowStart)) {
          keysToDelete.push(k);
          count++;
        }
      });
      for (const k of keysToDelete) {
        storage.delete(k);
      }
    }

    bucket = { timestamps: [] };
    storage.set(key, bucket);
  }

  // Filter timestamps within current sliding window
  bucket.timestamps = bucket.timestamps.filter((ts) => ts > windowStart);

  const resetTimeSec = Math.ceil((now + config.windowMs) / 1000);

  if (bucket.timestamps.length >= config.maxRequests) {
    const oldestInWindow = bucket.timestamps[0];
    const retryAfterMs = Math.max(0, oldestInWindow + config.windowMs - now);
    const retryAfterSec = Math.ceil(retryAfterMs / 1000) || 1;

    return {
      allowed: false,
      limit: config.maxRequests,
      remaining: 0,
      resetTime: Math.ceil((oldestInWindow + config.windowMs) / 1000),
      retryAfter: retryAfterSec,
    };
  }

  // Record this request
  bucket.timestamps.push(now);
  const remaining = Math.max(0, config.maxRequests - bucket.timestamps.length);

  return {
    allowed: true,
    limit: config.maxRequests,
    remaining,
    resetTime: resetTimeSec,
    retryAfter: 0,
  };
}

/**
 * Generates standard rate limiting HTTP headers
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  const headers: Record<string, string> = {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(result.resetTime),
  };

  if (!result.allowed && result.retryAfter > 0) {
    headers["Retry-After"] = String(result.retryAfter);
  }

  return headers;
}

/**
 * Resets the in-memory rate limiter (used for testing and cache reset)
 */
export function resetRateLimiter(): void {
  storage.clear();
}
