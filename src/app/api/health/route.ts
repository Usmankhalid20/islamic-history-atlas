import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";
import { getCacheControlHeader } from "@/lib/api/cacheHeaders";

export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();
  let dbConnected = false;
  let dbLatencyMs: number | undefined;
  let dbMessage = "Database client offline (running on verified fixtures)";

  if (db) {
    try {
      const dbCheckStart = Date.now();
      await db.execute(sql`SELECT 1`);
      dbLatencyMs = Date.now() - dbCheckStart;
      dbConnected = true;
      dbMessage = "PostgreSQL connection pool healthy";
    } catch (err) {
      dbConnected = false;
      dbMessage = err instanceof Error ? err.message : "Database connection failed";
    }
  }

  const memoryUsage = process.memoryUsage ? process.memoryUsage() : null;
  const memory = memoryUsage
    ? {
        rssMb: Math.round((memoryUsage.rss / 1024 / 1024) * 100) / 100,
        heapTotalMb: Math.round((memoryUsage.heapTotal / 1024 / 1024) * 100) / 100,
        heapUsedMb: Math.round((memoryUsage.heapUsed / 1024 / 1024) * 100) / 100,
      }
    : undefined;

  const durationMs = Date.now() - startTime;
  const status = db ? (dbConnected ? "healthy" : "degraded") : "healthy";

  const responseBody = {
    status,
    timestamp: new Date().toISOString(),
    uptimeSeconds: typeof process.uptime === "function" ? Math.floor(process.uptime()) : 0,
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
    responseTimeMs: durationMs,
    database: {
      connected: dbConnected,
      latencyMs: dbLatencyMs,
      message: dbMessage,
    },
    memory,
  };

  return NextResponse.json(responseBody, {
    status: status === "healthy" ? 200 : 503,
    headers: {
      "Cache-Control": getCacheControlHeader("health"),
    },
  });
}
