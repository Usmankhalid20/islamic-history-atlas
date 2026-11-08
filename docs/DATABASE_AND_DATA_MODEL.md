# Database and Historical Data Model

## 1. Important modeling rule

A dynasty's lifespan and its territorial control are different facts.

For example, an entity may exist from year A to year B, while a particular region is controlled only from year C to year D. The territory record therefore needs its own dates and sources.

## 2. Proposed entities

### Polity
Represents a dynasty, caliphate, sultanate, emirate, kingdom, or other political entity. Avoid assuming every entity is a dynasty.

Candidate fields:
- id
- canonical_name
- entity_type
- start_date / start_year (with precision metadata)
- end_date / end_year (with precision metadata)
- overview
- status or review state

### NameVariant
Stores alternate spellings, transliterations, historical names, and language variants.

Candidate fields:
- id
- polity_id
- name
- language
- variant_type
- source_id (where applicable)

### Ruler
Candidate fields:
- id
- preferred_name
- birth/death date expressions where known
- biography
- source/review metadata

### Reign
Join record linking a ruler to a polity with reign start/end date expressions. This supports co-rulers, disputed successions, and rulers associated with more than one political entity.

### TerritoryPeriod
A time-bounded claim of territorial control:
- id
- polity_id
- valid_from / valid_to (or structured date expressions)
- geometry reference or GeoJSON
- control_type (direct, claimed, tributary, vassal, contested, influence, etc.)
- confidence
- explanatory_note
- review_status

### HistoricalEvent
Candidate fields:
- id
- title
- date expression
- summary
- location or geometry reference
- event type
- review status

### EventParticipant
Links events to polities and/or rulers with a role.

### Source
Candidate fields:
- id
- title
- author_or_organization
- publication
- publication_date
- url
- accessed_at
- citation_text
- license_or_rights_note

### ClaimSource
Links a source to a specific historical claim/record. This is preferable to attaching one generic bibliography to an entire page.

### TradeRoute
Represents an overland caravan artery, pilgrim road (*darb*), or maritime sea lane.
- `id`: primary key
- `name`: canonical historical name
- `route_type`: `caravan_route` | `pilgrim_road` | `maritime_lane`
- `active_from_year` / `active_to_year`: temporal validity bounds
- `path_geojson`: GeoJSON LineString representing the historical vector
- `primary_commodities`: freight freight and traveler traffic notes
- `description`: historical narrative and geographer citations

### Monument
Represents monumental architecture, congregational mosques, libraries, and observatories.
- `id`: primary key
- `name`: canonical Arabic name and transliteration
- `monument_type`: `mosque` | `academy_library` | `palace` | `observatory`
- `polity_id`: foreign key to `polities`
- `founding_year`: year founded/consecrated
- `city_name`: historical city location
- `location_geojson`: GeoJSON Point coordinates `[lng, lat]`
- `architectural_features`: structural innovations (hypostyle arches, domes, epigraphy)

### Scholar
Represents polymaths, theologians, philosophers, and scientists of the Islamic Golden Age.
- `id`: primary key
- `name`: canonical name and Latinized appellation
- `birth_year` / `death_year`: lifespan bounds
- `fields_of_study`: disciplines (algebra, optics, medicine, logic, astronomy)
- `primary_city`: main intellectual center of activity
- `patronized_by_polity_id`: caliphate or court providing patronage
- `major_works`: canonical treatises and manuscripts
- `biography`: historical and scientific significance

### Campaign
Represents strategic military expeditions and territorial conquest vectors.
- `id`: primary key
- `name`: campaign title
- `start_year` / `end_year`: operational date bounds
- `polity_id`: foreign key to commanding caliphate
- `commander_name`: field general / commander
- `ruler_id`: sovereign commissioning the expedition
- `route_geojson`: GeoJSON LineString tracking the march vector
- `key_locations`: staging cities and battlefield waypoints
- `strategic_outcome`: territorial and political consequence

## 3. Date representation

Historical dates may be:
- Exact year
- Approximate year
- Before/after a year
- A range
- Disputed between sources
- Unknown

Do not store every date as a plain integer without a precision/status field. The final schema should support uncertainty explicitly.

For a first simple query, a territory is active in selected year Y when:

```sql
valid_from_year <= Y
AND valid_to_year >= Y
```

This predicate is only valid when both bounds are known and inclusive. The final implementation must define behavior for open-ended, approximate, disputed, and unknown dates.

## 4. Geometry and territory semantics

- Prefer simplified geometry for the interactive overview map.
- Preserve source/attribution and original geometry provenance.
- Use separate records for meaningful changes over time.
- Do not portray influence, claims, tributary status, and direct administration as identical.
- Contested regions should be represented distinctly or explained in the UI.
- Never imply modern international borders are equivalent to historical borders.

## 5. Data quality workflow

1. Research a claim.
2. Record the source and exact supporting passage/page where possible.
3. Enter the claim with date precision and confidence.
4. Add or link geometry and explain its interpretation.
5. Review against another reliable source for high-impact disputed claims.
6. Mark the record reviewed before publishing.
7. Revisit records when better evidence is found.

## 6. Implementation Status

The schema has been formally authored and implemented in PostgreSQL via Drizzle ORM across modular domain schema definitions under `src/lib/db/schema/` (`polities`, `nameVariants`, `rulers`, `reigns`, `territoryPeriods`, `historicalEvents`, `eventParticipants`, `sources`, `claimSources`, `tradeRoutes`, `monuments`, `scholars`, `campaigns`).

## 7. PostgreSQL Indexing Strategy & Query Optimization

To guarantee sub-10ms query latency across historical cartographic layers and timeline sliders, indexes are designed to prevent sequential table scans:

### 7.1 Temporal Range Indexes (B-Tree)
The dominant atlas query pattern filters records by an active historical year $Y$. B-Tree indexes are established on all temporal boundaries:
- `territory_periods(valid_from_year, valid_to_year)`
- `polities(start_year, end_year)`
- `historical_events(event_year)`
- `trade_routes(active_from_year, active_to_year)`
- `campaigns(start_year, end_year)`
- `monuments(founding_year)`
- `scholars(birth_year, death_year)`

**Composite Temporal Index:**
```sql
CREATE INDEX idx_territory_periods_temporal
ON territory_periods (valid_from_year, valid_to_year);
```
Query execution with `EXPLAIN (ANALYZE, BUFFERS)` verifies that temporal year queries perform an **Index Scan** rather than a sequential table scan.

### 7.2 Relational & Foreign Key Indexes (B-Tree)
PostgreSQL does not automatically index foreign key columns. All relational joins are explicitly indexed to prevent full-table scans during nested joins:
- `territory_periods(polity_id)`
- `reigns(ruler_id, polity_id)`
- `event_participants(event_id, polity_id, ruler_id)`
- `monuments(polity_id)`
- `scholars(patronized_by_polity_id)`
- `campaigns(polity_id, ruler_id)`

### 7.3 Text Search & Fuzzy Matching Indexes (GIN / `pg_trgm`)
For search queries on scholar names, treatise titles, monument cities, and ruler appellations:
```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX idx_scholars_trgm_name ON scholars USING gin (name gin_trgm_ops);
CREATE INDEX idx_monuments_trgm_city ON monuments USING gin (city_name gin_trgm_ops);
```

### 7.4 Spatial Indexes (GiST)
When geometries are queried by bounding-box or viewport intersection:
```sql
-- PostGIS GiST index for viewport filtering
CREATE INDEX idx_territory_periods_geom ON territory_periods USING gist (geometry);
```

---

## 8. Database Pagination Architecture

### 8.1 Keyset (Cursor) Pagination Execution
For large historical event timelines and source bibliographies, keyset pagination uses a composite comparison on the sort column and unique primary key:
```sql
-- Fetch page of 20 historical events after cursor
SELECT id, title, event_year, location_name
FROM historical_events
WHERE event_year >= 632
  AND (event_year, id) > ($cursor_year, $cursor_id)
ORDER BY event_year ASC, id ASC
LIMIT 21;
```
- Fetching `LIMIT + 1` rows determines `hasMore` without executing a separate expensive `COUNT(*)` query.
- The `nextCursor` is generated by encoding the tuple `($event_year, $id)` of the 20th record as URL-safe base64.
- **Index Seek Guarantee:** Because `(event_year, id)` is indexed, PostgreSQL jumps directly to the matching index node ($O(1)$) without reading preceding discarded records.

### 8.2 Offset Pagination Execution
For small, discrete catalogs (e.g. `/api/polities`, `/api/scholars`):
```sql
SELECT * FROM scholars
ORDER BY birth_year ASC NULLS LAST, id ASC
LIMIT $limit OFFSET $offset;
```
Total records in these curated catalogs are bounded ($N < 100$), so $O(N)$ scanning cost is negligible (<1ms) while affording standard page-number navigation.

---

## 9. Cache Invalidation & Data Mutations

1. **Tag-Based Invalidation:** Caches in the Next.js Data Cache are tagged by domain (`tags: ['polities', 'territories', 'events', 'routes', 'monuments', 'scholars', 'campaigns']`).
2. **Editorial Revalidation:** When an administrative database migration or batch seed script runs, `revalidateTag(domain)` or `revalidatePath('/api/...')` is triggered.
3. **Immutable History Invariant:** Because historical events (e.g., Battle of Yarmouk 636 CE) are past facts that do not mutate dynamically at runtime, cache lifetimes default to long durations (`s-maxage=86400` / 24 hours).

