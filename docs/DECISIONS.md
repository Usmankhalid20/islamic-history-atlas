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

## ADR-004: Map renderer

**Status:** Accepted for MVP

**Decision:** Use Leaflet (with React-Leaflet or direct imperative wrapper) for the MVP historical map prototype.

**Reason:** Leaflet provides a proven, lightweight rendering engine for interactive GeoJSON layers without requiring complex WebGL shaders or vector tile pipeline infrastructure. It supports accessible keyboard navigation, custom SVG polygon styling, straightforward multi-layer control, and works seamlessly across mobile and desktop devices with minimal bundle footprint.

**Revisit when:** Vector tile rendering or dynamic 3D cartographic projections are required for later phases.

## ADR-005: Hosting

**Status:** Open

**Evaluation:** Current free-tier limits, commercial-use rules, database availability, backups, deployment workflow, and expected traffic.
