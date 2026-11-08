# Product Requirements

## 1. Functional requirements

### FR-01: Explore by year
Users can select a year using a timeline control and/or numeric year input.

### FR-02: Show concurrent polities
The map can display multiple dynasties or political entities at the same time. The application must not assume one dynasty per century.

### FR-03: Show dated territorial control
Territory records have their own effective date ranges. A dynasty's overall start and end dates must not be used as a shortcut for its territorial extent.

### FR-04: Inspect a territory
Selecting a map feature opens an information panel with the polity name, date range, relevant context, and source references.

### FR-05: Browse dynasties
A dynasty detail view shows its overview, dates, founder where known, capital(s), rulers, associated regions, and references.

### FR-06: Browse rulers
A ruler detail view shows their name, reign dates, associated dynasty/polity, and notable events where supported by sources.

### FR-07: Browse events
An event detail view shows its date or date range, location where known, summary, involved entities, and sources.

### FR-08: Display uncertainty
The UI distinguishes exact, approximate, disputed, and unknown dates or boundaries. It must not silently turn uncertain historical evidence into false precision.

### FR-09: Source every historical claim
Historical records must link to one or more references. Source metadata should include title, author/organization, publication details where available, URL or bibliographic citation, and access date for web sources.

### FR-10: Responsive and accessible UI
Core navigation, timeline, map controls, and information panels must work with keyboard navigation and at common mobile/tablet/desktop widths.

## 2. Non-functional requirements

- TypeScript strict mode should be enabled.
- Keep the application as a modular monolith initially.
- Validate all external/user input at system boundaries.
- Keep secrets in environment variables; never commit `.env`.
- Use database constraints and indexes for common date-range queries.
- Provide loading, empty, and error states.
- Avoid unnecessary client-side JavaScript.
- Respect `prefers-reduced-motion`.
- Use semantic HTML and accessible labels.
- Keep map rendering performant by loading only relevant features where practical.
- Record architectural decisions rather than adding libraries by habit.

## 3. Historical-data requirements

Every territorial feature should be traceable to:
- A polity/dynasty or political entity
- A valid time interval or best-supported date expression
- A geometry or geographic reference
- At least one source
- A confidence/precision note
- A note explaining disputed or approximate interpretation, if relevant

Do not merge a dynasty's entire lifespan into one static polygon. A polity may have multiple territories, discontinuous control, vassals, contested zones, or changing borders.

## 4. MVP acceptance criteria

The MVP is not accepted until:
- The year selector updates the map from stored date-aware data.
- Multiple concurrent entities can be represented.
- Selecting a feature opens the correct detail.
- Every published territory and event has a source reference.
- Uncertain dates and boundaries have visible caveats.
- Automated tests cover date filtering and key interactions.
- A production build completes without errors.
- The deployment and data-attribution instructions are documented.
