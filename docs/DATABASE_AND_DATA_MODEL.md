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

## 6. Schema status

This document describes a conceptual model only. Do not generate migrations until the ORM, date strategy, geometry storage strategy, and initial content scope are approved.
