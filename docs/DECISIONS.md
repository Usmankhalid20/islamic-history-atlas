# Architecture Decision Records

Record important decisions here. Do not treat proposed choices as final until they have been tested or explicitly approved.

## ADR-001: Application architecture

**Status:** Accepted

**Decision:** Build as a modular monolith in a Next.js (App Router) TypeScript application.

**Reason:** The initial scope is optimal for a unified application. It eliminates cross-service network latency, reduces operational complexity, and allows direct server components to query PostgreSQL with zero API overhead.

**Revisit when:** Measured performance, team size, or independent deployment requirements justify a different structure.

## ADR-002: Historical territory records

**Status:** Accepted as a domain principle

**Decision:** Model territorial control as separate time-bounded records, not as one static polygon attached to a dynasty.

**Reason:** Political control changes over time and can overlap, fragment, or be contested.

## ADR-003: ORM

**Status:** Accepted

**Decision:** Use Drizzle ORM with PostgreSQL.

**Reason:** Drizzle is a lightweight, zero-overhead TypeScript SQL query builder that provides complete SQL transparency. It does not require a heavy Rust engine binary, compiles to pure SQL, offers first-class support for PostgreSQL types (including JSONB, arrays, and PostGIS geometries), and makes complex temporal filtering (`valid_from <= Y AND valid_to >= Y`) and spatial joins performant and explicit.

**Revisit when:** Schema complexity or team preferences specifically mandate Prisma's abstract modeling.

## ADR-004: Map renderer & Basemap Layer

**Status:** Accepted for MVP (Updated in Milestone 18: Basemap migrated to Esri World Light Gray Base)

**Decision:** Use Leaflet for the interactive historical map prototype with Esri World Light Gray Base (`https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}`) as the foundational archival basemap layer.

**Reason:** Leaflet provides a proven, lightweight rendering engine for interactive GeoJSON layers without requiring complex WebGL shaders or vector tile pipeline infrastructure. CARTO Positron tiles were deprecated for unauthenticated requests and enforced disruptive watermarks ("API KEY REQUIRED"); Esri World Light Gray Base provides an identical clean, muted, archival aesthetic specifically designed for thematic overlays and historical GIS, completely watermark-free and requiring zero API key.

**Revisit when:** Vector tile rendering or dynamic 3D cartographic projections are required for later phases.

## ADR-005: Hosting

**Status:** Open

**Evaluation:** Current free-tier limits, commercial-use rules, database availability, backups, deployment workflow, and expected traffic.

## ADR-006: Multi-tier Caching Strategy (Next.js + PostgreSQL, Redis Postponed)

**Status:** Accepted (Implemented in Milestone 16 via `src/lib/api/cacheHeaders.ts` with profile-based `Cache-Control` headers and deterministic ETag conditional requests)

**Decision:** Adopt a multi-tier caching architecture centered on Next.js App Router Data Cache (`unstable_cache` with tag-based revalidation), HTTP cache headers (`Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400`), client-side cache, and PostgreSQL native shared buffers. Postpone external distributed caching infrastructure (Redis / Upstash) until high traffic or multi-region deployments justify it.

**Reason:** Historical cartography and timeline data are overwhelmingly read-heavy (>99.5% read traffic) and change only upon curated editorial releases. Caching query results via Next.js Data Cache and HTTP reverse proxies eliminates repeated database queries and external AI token costs, maintaining sub-50ms response times with zero added infrastructure overhead.

**Revisit when:** Multi-instance deployments experience cache drift, serverless cold starts degrade cache warm-up, or traffic surpasses 1,000,000 requests/day.

## ADR-007: Dual Pagination Strategy (Cursor-Based for Large Series, Offset for Directories)

**Status:** Accepted (Implemented in Milestone 16 via `src/lib/api/pagination.ts` with URL-safe base64 opaque cursor tokens and offset/limit directory slicing)

**Decision:** Use cursor-based (keyset) pagination for large, unbounded historical collections (events, territory periods, future bibliographic registers, audit logs). Retain offset/limit pagination for small, discrete entity directories (polities, rulers, monuments, scholars, campaigns) where total count is low (<100 items) and UI requirements require discrete page jumping.

**Reason:** In PostgreSQL, `OFFSET N` queries degrade linearly ($O(N)$) as page depth increases because the database must scan and discard $N$ rows before returning results. Keyset pagination (`WHERE id > :cursor ORDER BY id ASC LIMIT :limit`) performs an $O(1)$ B-Tree index seek regardless of page depth. Small directories do not suffer from offset degradation and benefit from explicit page-number navigation.

**Revisit when:** Any catalog collection exceeds 500 records or requires infinite scrolling, at which point it transitions to keyset pagination.

## ADR-008: In-Memory Zero-Infrastructure API Rate Limiting

**Status:** Accepted (Implemented in Milestone 16 via `src/lib/api/rateLimiter.ts` and `src/middleware.ts` with standard and AI tiers)

**Decision:** Enforce API rate limiting using an in-memory sliding-window token bucket implemented via a zero-dependency LRU cache at the route layer. Rate limits are differentiated by endpoint sensitivity:
- Public Historical Read Endpoints (`/api/territories`, `/api/events`, etc.): 60 requests/minute per IP.
- AI Scholar Inquiry Endpoint (`/api/ai/inquire`): 10 requests/minute per IP.

**Reason:** Protects the atlas from accidental scrape loops, denial-of-service attempts, and upstream OpenRouter API quota exhaustion without introducing third-party service dependencies or external Redis infrastructure during early project phases.

**Revisit when:** Application scales to multiple independent nodes or edge workers requiring synchronized global rate limit counters.

## ADR-009: Postponement of Authentication

**Status:** Accepted

**Decision:** Do not design or implement user authentication, login sessions, or user management in the current phases. Explicitly postpone authentication to a dedicated future Admin/Editorial milestone.

**Reason:** The core mission of the Islamic History Atlas is open educational access to historical geography. All current features are public read operations. Introducing authentication now would introduce premature security surface area, session management complexity, cookie/token overhead, and database migrations for user tables before editorial contribution workflows are required.

**Revisit when:** Editorial curation, user annotations, or private bookmarking features are scheduled for development.

## ADR-010: Observability and Performance Monitoring

**Status:** Accepted (Implemented in Milestone 16 via `GET /api/health` providing database connection latency, system uptime, and memory metrics)

**Decision:** Implement application observability through:
1. Structured JSON logging (timestamp, level, requestId, route, method, durationMs, status, error).
2. Dedicated health and readiness check probe (`GET /api/health`) verifying database connectivity and memory usage.
3. Client-side Web Vitals monitoring (LCP, FID/INP, CLS) and API latency tracking (p50, p95, p99).

**Reason:** Provides operational visibility into slow queries, error rates, and API consumption without vendor lock-in or heavyweight third-party APM agent performance penalties.

