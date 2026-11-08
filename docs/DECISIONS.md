# Architecture Decision Records

Record important decisions here. Do not treat proposed choices as final until they have been tested or explicitly approved.

## ADR-001: Application architecture

**Status:** Proposed

**Decision:** Start as a modular monolith in one Next.js application.

**Reason:** The initial scope is small enough for one deployable application. Separate services would add operational complexity without a demonstrated benefit.

**Revisit when:** Measured performance, team size, or independent deployment requirements justify a different structure.

## ADR-002: Historical territory records

**Status:** Accepted as a domain principle

**Decision:** Model territorial control as separate time-bounded records, not as one static polygon attached to a dynasty.

**Reason:** Political control changes over time and can overlap, fragment, or be contested.

## ADR-003: ORM

**Status:** Open

**Candidates:** Prisma and Drizzle.

**Evaluation:** Migration workflow, type safety, SQL transparency, PostgreSQL support, spatial-data needs, maintenance, and developer familiarity.

## ADR-004: Map renderer

**Status:** Open

**Candidates:** Leaflet and MapLibre.

**Evaluation:** Historical polygon rendering, styling, performance, accessibility, mobile behavior, tile/data licensing, and implementation complexity.

## ADR-005: Hosting

**Status:** Open

**Evaluation:** Current free-tier limits, commercial-use rules, database availability, backups, deployment workflow, and expected traffic.
