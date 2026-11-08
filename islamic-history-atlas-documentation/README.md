# Islamic History Atlas

An interactive historical atlas for exploring Islamic dynasties, rulers, territories, and events across time.

The core experience is a year-based map: users select a year and explore the dynasties and political territories that existed during that period. Multiple dynasties can appear at the same time. The project treats historical boundaries and dates as evidence-based approximations, not perfectly precise modern borders.

## Project status

**Phase 0 — Planning and documentation.** No application code or database has been created yet.

See [`docs/PROGRESS.md`](docs/PROGRESS.md) for the current stage and next actions.

## Planned technology

The initial proposal is:

- Next.js with TypeScript
- Tailwind CSS and a small set of accessible UI components
- PostgreSQL
- Prisma or Drizzle ORM (choose after a short technical evaluation)
- Leaflet or MapLibre for the map (choose after testing historical polygon rendering)
- GeoJSON for territory geometry
- Vitest for unit/integration tests and Playwright for browser-level tests
- GitHub for version control

These are proposed choices, not installed dependencies. Avoid installing packages until the architecture decision is recorded.

## Start here

1. Read [`docs/PROJECT_OVERVIEW.md`](docs/PROJECT_OVERVIEW.md).
2. Read [`docs/REQUIREMENTS.md`](docs/REQUIREMENTS.md).
3. Review [`docs/SYSTEM_ARCHITECTURE.md`](docs/SYSTEM_ARCHITECTURE.md).
4. Follow [`docs/DEVELOPMENT_WORKFLOW.md`](docs/DEVELOPMENT_WORKFLOW.md).
5. Update [`docs/PROGRESS.md`](docs/PROGRESS.md) whenever a stage is completed or blocked.

## Historical-data principle

A dynasty's existence does not mean it controlled every region associated with it throughout its lifetime. Territory must be represented with its own date range, source, confidence, and geographic scope. Overlapping dynasties are expected and must not be forced into one empire per century.

## License

No license has been selected yet. Do not assume that the project or its historical geometry/data is open for unrestricted reuse. Review the license and attribution requirements of every external dataset and asset before incorporating it.
