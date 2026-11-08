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

### Not yet completed
- Confirm the GitHub repository URL and whether it is empty.
- Add these files to the repository and verify the initial commit.
- Create and push the `develop` branch.
- Review and approve MVP date range, regions, and initial historical entities.
- Evaluate ORM and map-renderer choices.
- Create the Next.js application scaffold.
- Configure linting, formatting, type checking, and tests.
- Build a minimal map prototype before committing to a map library.

### Next step
Confirm the repository state, then add the documentation package and push the initial documentation commit. Do not scaffold the application until the requirements and open architecture choices have been reviewed.

### Update format
For each milestone, record:
- Date
- What changed
- Files changed
- Commands/tests actually run and their results
- Decisions made
- Known issues/blockers
- Next step
