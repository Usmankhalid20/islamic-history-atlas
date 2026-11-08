# Project Progress

## Current phase: Phase 0 — Foundation and planning

**Status:** Documentation drafted. Repository setup and codebase verification are not yet confirmed.

### Completed in this documentation package
- Project purpose and initial scope described.
- Functional and non-functional requirements drafted.
- Modular-monolith architecture proposed.
- Conceptual historical data model documented.
- Initial API shapes documented.
- Development and Git workflow documented.
- Testing, deployment, source, and licensing policies drafted.
- Open technical decisions recorded.
- Researched and documented 5 open-source AI agent skills & engineering tools (Gravitas, UI/UX Pro Max, Unslop, Digital Accessibility Skill, Addy Osmani Agent Skills).
- Added "Feature Branch, Testing and Merge Policy" and agent skills integration to `DEVELOPMENT_WORKFLOW.md`.
- Authored binding `ENGINEERING_RULES.md` covering 12 core rules, solo Git flow, approval gates, and agent invariants.
- Confirmed GitHub remote repository state (`https://github.com/Usmankhalid20/islamic-history-atlas.git` exists and is empty).

### Milestone Log: 2026-11-08 (Documentation & Engineering Rules Extension)
- **Date:** 2026-11-08
- **What changed:**
  - Researched live repository metadata, licenses, capabilities, and installation requirements for 5 open-source AI agent skills and engineering resources.
  - Extended `docs/RESEARCHED_RESOURCES.md` with a detailed comparative matrix and full documentation for each resource.
  - Extended `docs/DEVELOPMENT_WORKFLOW.md` with the "Feature Branch, Testing and Merge Policy" defining a strict solo Git flow, approval gate, and integration of AI skills.
  - Created `docs/ENGINEERING_RULES.md` codifying the 12 core rules, approval gates, test evidence requirements, historical data rules, and Gravitas operational invariants.
- **Files changed:**
  - `docs/RESEARCHED_RESOURCES.md` (updated)
  - `docs/DEVELOPMENT_WORKFLOW.md` (updated)
  - `docs/ENGINEERING_RULES.md` (created)
  - `docs/PROGRESS.md` (updated)
- **Commands/tests actually run and results:**
  - `git ls-remote https://github.com/Usmankhalid20/islamic-history-atlas.git` -> Exit code 0 (repository empty and accessible).
  - `git config --get-regexp user\.` -> Exit code 0 (`Usmankhalid20` / `usmankhalid399354@gmail.com`).
  - GitHub REST API queries via PowerShell for all 5 candidate repositories -> Exit code 0 (verified stars, licenses, descriptions, default branches, and file trees).
- **Decisions made:**
  - Recommended Gravitas (Core Skill mode) for operational discipline.
  - Recommended UI/UX Pro Max and Unslop for archival/editorial cartographic UI design and eliminating generic AI design cliches.
  - Recommended Digital Accessibility Skill (High Priority) for WCAG 2.2 AA and FR-10 compliance.
  - Recommended selective installation of Addy Osmani skills (`test-driven-development`, `incremental-implementation`, `code-review-and-quality`).
  - Adopted strict approval gate: stop before coding changes, and wait for approval.
- **Known issues/blockers:**
  - None. Ready for Git repository initialization and Phase 1 scaffolding upon user approval.
- **Next step:**
  - Await user approval to initialize Git, commit documentation, create `develop` branch, and proceed with technical evaluations (ORM: Prisma vs Drizzle; Map: MapLibre vs Leaflet).

### Milestone Log: 2026-11-08 (Repository Setup & Initial Commit)
- **Date:** 2026-11-08
- **What changed:**
  - Initialized local Git repository on branch `main`.
  - Added comprehensive `.gitignore` for Node/Next.js/TypeScript.
  - Added and committed initial documentation foundation and engineering rules (`docs: add project foundation`).
  - Added remote origin `https://github.com/Usmankhalid20/islamic-history-atlas.git` and pushed `main`.
  - Created integration branch `develop` and pushed `origin/develop`.
- **Files changed:**
  - `.gitignore` (created)
  - `README.md` & `docs/*` (committed to git)
- **Commands/tests actually run and results:**
  - `git init; git branch -M main` -> Exit code 0
  - `git add .` -> Exit code 0
  - `git commit -m "docs: add project foundation"` -> Exit code 0 (commit `51ecca9`)
  - `git remote add origin https://github.com/Usmankhalid20/islamic-history-atlas.git` -> Exit code 0
  - `git push -u origin main` -> Exit code 0 (remote updated)
  - `git switch -c develop; git push -u origin develop` -> Exit code 0 (remote `develop` branch created)
  - `git status` -> Exit code 0 (working tree clean on `develop`)
- **Decisions made:**
  - Repository foundation established on `main` with integration branch `develop` active for all ongoing development.
- **Known issues/blockers:**
  - None.
- **Next step:**
  - Review and approve initial skill installation (e.g. `digital-accessibility` or `gravitas`), technical architecture evaluations (ORM: Prisma vs Drizzle; Map: MapLibre vs Leaflet), and application scaffolding.

### Milestone Log: 2026-11-08 (Repository Cleanup & Architecture Decisions)
- **Date:** 2026-11-08
- **What changed:**
  - Removed duplicate nested `islamic-history-atlas-documentation/` folder, establishing root `docs/` and `README.md` as the authoritative single source of truth.
  - Recorded accepted architecture decisions in `docs/DECISIONS.md`:
    - ADR-001: Next.js App Router modular monolith (Accepted).
    - ADR-003: Drizzle ORM with PostgreSQL (Accepted).
    - ADR-004: Leaflet for MVP interactive GeoJSON map prototype (Accepted).
- **Files changed:**
  - `islamic-history-atlas-documentation/` (deleted from Git)
  - `docs/DECISIONS.md` (updated)
  - `docs/PROGRESS.md` (updated)
- **Commands/tests actually run and results:**
  - `git rm -r islamic-history-atlas-documentation` -> Exit code 0
  - `node --version; npm.cmd --version` -> Exit code 0 (Node v22.23.2, npm 11.6.2)
- **Decisions made:**
  - Architecture decisions ADR-001, ADR-003, and ADR-004 formally accepted.
- **Next step:**
  - Create feature branch `feature/project-scaffold` off `develop`.
  - Install selected agent skills into `.agents/skills/`.
  - Scaffold Next.js application with TypeScript, Tailwind CSS, and Vitest.

### Milestone Log: 2026-11-08 (Milestone 1: Project Scaffolding & Agent Skills)
- **Date:** 2026-11-08
- **What changed:**
  - Installed approved open-source agent skills into `.agents/skills/`:
    - `digital-accessibility` (WCAG 2.2 AA audit and patterns)
    - `gravitas` & `gravitas-typescript` (core reliability invariants and TypeScript checks)
  - Initialized Next.js 14 App Router application scaffold with strict TypeScript, Tailwind CSS, PostCSS, and Autoprefixer.
  - Configured Vitest for unit testing with TypeScript path aliases (`@/*`).
  - Implemented accessible application shell:
    - Root layout with semantic HTML, skip-to-content link, `lang="en"`, and archival design system theme.
    - Header navigation with Lucide icons and ARIA labels.
    - Footer with historical evidence disclaimer and attribution notices.
    - Focus visible rings and `prefers-reduced-motion` CSS overrides.
  - Created initial utility helpers (`cn`, `formatHistoricalYear`) and baseline type definitions (`DatePrecision`, `Polity`, `HistoricalSource`, `TerritoryControlType`).
  - Added unit smoke test suite verifying year formatting and class merging.
- **Files changed:**
  - `.agents/skills/*`
  - `package.json`, `package-lock.json`
  - `tsconfig.json`, `next.config.mjs`, `postcss.config.mjs`, `tailwind.config.ts`, `.eslintrc.json`, `vitest.config.ts`
  - `src/app/globals.css`, `src/app/layout.tsx`, `src/app/page.tsx`
  - `src/components/layout/Header.tsx`, `src/components/layout/Footer.tsx`
  - `src/lib/utils.ts`, `src/types/index.ts`
  - `tests/unit/smoke.test.ts`
  - `docs/PROGRESS.md`
- **Commands/tests actually run and results:**
  - `npm.cmd test` -> Exit code 0 (3 passed in 17ms)
  - `npm.cmd run type-check` -> Exit code 0 (tsc --noEmit passed clean)
  - `npm.cmd run lint` -> Exit code 0 (No ESLint warnings or errors)
  - `npm.cmd run build` -> Exit code 0 (Compiled successfully, static routes generated)
- **Decisions made:**
  - Established project scaffold following modular monolith pattern.
- **Known issues/blockers:**
  - None.
- **Next step:**
  - Merge `feature/project-scaffold` to `develop`.
  - Proceed to Milestone 2: Drizzle ORM schema foundation and initial seed data for 7th–10th century polities.

### Milestone Log: 2026-11-08 (Milestone 2: Database Foundation & Drizzle ORM)
- **Date:** 2026-11-08
- **What changed:**
  - Installed `drizzle-orm`, `pg`, `dotenv`, and developer tooling `drizzle-kit`, `@types/pg`, `@types/geojson`.
  - Configured `drizzle.config.ts` targeting PostgreSQL with migrations folder `./drizzle`.
  - Implemented relational schemas in `src/lib/db/schema/`:
    - `sources` (bibliographic citations, licenses, URLs)
    - `polities` (canonical name, entity type, start/end years, precision, capital)
    - `name_variants` (multilingual alternate names, language codes)
    - `rulers` & `reigns` (biographical data, reign intervals, co-ruler flags)
    - `territory_periods` (GeoJSON polygon geometries, control type, confidence, compound year range index)
    - `historical_events` & `event_participants` (dated events, locations, participant roles)
    - `claim_sources` (source citations mapped to individual claims)
    - Drizzle ORM relations across all entities.
  - Implemented temporal query logic in `src/lib/db/queries.ts` (`isTerritoryActiveInYear`, `filterActiveTerritories`, `formatTerritoriesToGeoJson`).
  - Authored reviewed seed fixtures in `src/lib/data/historicalSeed.ts` covering 7th–10th century CE (Rashidun, Umayyad, Abbasid, Cordoba, Fatimid) with GeoJSON polygons and citations to Hugh Kennedy (2004) and C.E. Bosworth (1996).
  - Added unit test suite in `tests/unit/queries.test.ts` verifying exact year boundaries, concurrent dynasties (e.g. 750, 800, 920 CE), and GeoJSON FeatureCollection generation.
- **Files changed:**
  - `package.json`, `package-lock.json`
  - `drizzle.config.ts`
  - `src/lib/db/index.ts`, `src/lib/db/schema/*`, `src/lib/db/queries.ts`
  - `src/lib/data/historicalSeed.ts`
  - `tests/unit/queries.test.ts`
  - `docs/PROGRESS.md`
- **Commands/tests actually run and results:**
  - `npm.cmd test` -> Exit code 0 (8 passed in 13ms)
  - `npm.cmd run type-check` -> Exit code 0 (zero errors)
  - `npm.cmd run lint` -> Exit code 0 (No ESLint warnings or errors)
  - `npm.cmd run build` -> Exit code 0 (Compiled successfully, static routes generated)
- **Decisions made:**
  - Standardized on Drizzle ORM with clean PostgreSQL schemas and pure functional temporal predicates.
- **Known issues/blockers:**
  - None.
- **Next step:**
  - Merge `feature/database-foundation` into `develop`.
  - Begin Milestone 3: Interactive Leaflet Map Prototype with dynamic year slider.

### Milestone Log: 2026-11-08 (Milestone 3: Interactive Historical Map & Timeline Explorer)
- **Date:** 2026-11-08
- **What changed:**
  - Installed `leaflet` and `@types/leaflet` dependencies.
  - Implemented `src/components/timeline/YearSlider.tsx`:
    - Full keyboard accessibility and ARIA roles (`aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-valuetext`).
    - Direct numeric year input and step buttons (-10y, -1y, +1y, +10y).
    - Play / pause animation timer cycling through years.
  - Implemented `src/components/map/HistoricalMap.tsx`:
    - Dynamic SSR-safe Leaflet initialization with CartoDB Positron basemap.
    - Historical polygon rendering with distinctive polity color codes:
      - Umayyad: Gold / Amber (`#D97706`)
      - Abbasid: Historic Black banner standard (`#1C1917`)
      - Cordoba: Emerald (`#059669`)
      - Fatimid: Lapis Lazuli / Royal Blue (`#2563EB`)
      - Rashidun: Terracotta (`#9A3412`)
    - Dashed border representation for approximate/contested confidence ratings.
    - Hover tooltips and interactive polygon click selection.
  - Implemented `src/components/atlas/TerritoryDetailPanel.tsx`:
    - Accessible dialog detailing polity name, control type, effective date range, confidence status, and peer-reviewed bibliographic citations.
  - Implemented `src/components/atlas/AtlasExplorer.tsx`:
    - Synchronizes timeline state with active territory GeoJSON rendering and concurrent polity indicators.
  - Established client-safe module boundary `src/lib/geo/territoryUtils.ts` separating pure temporal predicates from server database drivers.
  - Mounted live `AtlasExplorer` on `src/app/page.tsx`.
  - Added unit test suite `tests/unit/timeline.test.ts` (13 total passing unit tests).
- **Files changed:**
  - `package.json`, `package-lock.json`
  - `next.config.mjs`
  - `src/app/globals.css`, `src/app/page.tsx`
  - `src/components/map/HistoricalMap.tsx`
  - `src/components/timeline/YearSlider.tsx`
  - `src/components/atlas/AtlasExplorer.tsx`
  - `src/components/atlas/TerritoryDetailPanel.tsx`
  - `src/lib/geo/territoryUtils.ts`
  - `src/lib/db/queries.ts`, `src/lib/data/historicalSeed.ts`
  - `tests/unit/timeline.test.ts`
  - `docs/PROGRESS.md`
- **Commands/tests actually run and results:**
  - `npm.cmd test` -> Exit code 0 (13 passed in 26ms)
  - `npm.cmd run type-check` -> Exit code 0 (zero errors)
  - `npm.cmd run lint` -> Exit code 0 (No ESLint warnings or errors)
  - `npm.cmd run build` -> Exit code 0 (Compiled successfully, static routes generated)
- **Decisions made:**
  - Completed MVP interactive map prototype using Leaflet and GeoJSON.
- **Known issues/blockers:**
  - None.
- **Next step:**
  - Merge `feature/map-prototype` into `develop`.
  - Push branch to GitHub.
  - Implement full database migrations, API routes (`GET /api/territories?year=...`), and Playwright E2E browser tests.

### Milestone Log: 2026-11-08 (Milestone 4: API Route Handlers & Zod Validation)
- **Date:** 2026-11-08
- **What changed:**
  - Implemented input validation schemas using Zod in `src/lib/api/validators.ts` (`territoriesQuerySchema`, `politiesQuerySchema`, `eventsQuerySchema`).
  - Implemented RESTful Next.js App Router API endpoints:
    - `GET /api/territories?year=...`: Validates year bounds (500–2000 CE), returns active territory polygons and polities with fallback to verified seed fixtures.
    - `GET /api/polities`: Supports `activeYear` and `entityType` filters.
    - `GET /api/polities/[id]`: Returns single polity details, associated territory periods, and source citations.
    - `GET /api/events`: Supports `year` and `eventType` filters.
  - Created unit test suite `tests/unit/api.test.ts` covering validation edge cases (bounds, type conversion, missing params). Total 20/20 tests passing.
- **Files changed:**
  - `src/lib/api/validators.ts`
  - `src/app/api/territories/route.ts`
  - `src/app/api/polities/route.ts`
  - `src/app/api/polities/[id]/route.ts`
  - `src/app/api/events/route.ts`
  - `tests/unit/api.test.ts`
  - `docs/PROGRESS.md`
- **Commands/tests actually run and results:**
  - `npm.cmd test` -> Exit code 0 (20 passed in 77ms across 4 test suites)
  - `npm.cmd run type-check` -> Exit code 0 (zero errors)
  - `npm.cmd run lint` -> Exit code 0 (No ESLint warnings or errors)
  - `npm.cmd run build` -> Exit code 0 (All 7 static and dynamic API routes compiled successfully)
- **Decisions made:**
  - Validated API contracts using Zod with consistent JSON error responses (`{ error: string, details?: any }`).
- **Known issues/blockers:**
  - None.
- **Next step:**
  - Merge `feature/api-routes` into `develop`.
  - Push branch to GitHub.

### Milestone Log: 2026-11-08 (Milestone 5: Polity Directory, Detail Pages & Sources Register)
- **Date:** 2026-11-08
- **What changed:**
  - Implemented dedicated Polity Directory page ([`src/app/polities/page.tsx`](file:///c:/Users/usman/Documents/Islamic-history-atlas/src/app/polities/page.tsx)):
    - Responsive card grid displaying each dynasty's canonical name, entity type, lifespan, capital city, overview excerpt, and territory claim count.
    - Quick navigation to explore each polity directly on the timeline map.
  - Implemented dynamic Polity Detail pages ([`src/app/polities/[id]/page.tsx`](file:///c:/Users/usman/Documents/Islamic-history-atlas/src/app/polities/[id]/page.tsx)):
    - Pre-rendered via `generateStaticParams` for all 5 MVP polities (Rashidun, Umayyad, Abbasid, Cordoba, Fatimid).
    - Detailed breakdown of historical overview, seat of power, dated territorial control records with confidence ratings, and cited literature.
  - Implemented Sources & Citation Register ([`src/app/sources/page.tsx`](file:///c:/Users/usman/Documents/Islamic-history-atlas/src/app/sources/page.tsx)):
    - Evidence hierarchy principles (peer-reviewed scholarship, scholarly encyclopedias, explicit uncertainty).
    - Full bibliographic citations with external links to publisher catalogs and verified status.
  - Updated global navigation in [`src/components/layout/Header.tsx`](file:///c:/Users/usman/Documents/Islamic-history-atlas/src/components/layout/Header.tsx) to link between `/`, `/polities`, and `/sources`.
  - Added unit test suite `tests/unit/pages.test.ts` verifying static param generation and fixture integrity.
- **Files changed:**
  - `src/app/polities/page.tsx`
  - `src/app/polities/[id]/page.tsx`
  - `src/app/sources/page.tsx`
  - `src/components/layout/Header.tsx`
  - `tests/unit/pages.test.ts`
  - `docs/PROGRESS.md`
- **Commands/tests actually run and results:**
  - `npm.cmd test` -> Exit code 0 (23 passed in 141ms across 5 test suites)
  - `npm.cmd run type-check` -> Exit code 0 (zero errors)
  - `npm.cmd run lint` -> Exit code 0 (No ESLint warnings or errors)
  - `npm.cmd run build` -> Exit code 0 (All 14 static and dynamic routes compiled successfully)
- **Decisions made:**
  - Used Next.js App Router SSG (`generateStaticParams`) for instant loading of historical polity records with zero client-side fetch latency.
- **Known issues/blockers:**
  - None.
- **Next step:**
  - Merge `feature/polity-pages` into `develop`.
  - Push branch to GitHub remote.

### Completed Milestones
- **Milestone 0:** Foundation, Documentation, and Git Setup.
- **Milestone 1:** Project Scaffolding, Agent Skills (`digital-accessibility`, `gravitas`), Accessible Shell.
- **Milestone 2:** Database Foundation with Drizzle ORM, PostgreSQL Schemas, Pure Predicates, Seed Data.
- **Milestone 3:** Interactive Leaflet Map Prototype, Accessible YearSlider, TerritoryDetailPanel with cited sources, and AtlasExplorer.
- **Milestone 4:** RESTful API Route Handlers (`/api/territories`, `/api/polities`, `/api/events`) and Zod input validation.
- **Milestone 5:** Polity Directory, Dynamic Detail Pages, and Sources Register with SSG.

### Next step
Merge `feature/polity-pages` into `develop` and push to GitHub remote.

### Update format
For each milestone, record:
- Date
- What changed
- Files changed
- Commands/tests actually run and their results
- Decisions made
- Known issues/blockers
- Next step
