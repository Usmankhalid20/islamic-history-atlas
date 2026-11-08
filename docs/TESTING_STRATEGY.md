# Testing Strategy

## Test layers

### Unit tests
Test pure functions such as:
- Whether a territory period is active in a selected year.
- Date precision and uncertain-date handling.
- Mapping API records into map feature properties.
- Formatting historical dates and source labels.

### Integration tests
Test:
- Database queries for a selected year.
- Polity/ruler/event relationships.
- Source associations.
- Validation and pagination.
- Admin authorization when admin features are introduced.

### End-to-end tests
Use Playwright for critical user journeys:
1. Open Explore.
2. Select a year.
3. Verify multiple applicable territories render.
4. Select a territory.
5. Verify its information and source links appear.
6. Navigate to a polity or ruler detail.

## Required quality gates

Before merging a feature:
- Lint passes.
- TypeScript type-check passes.
- Relevant unit/integration tests pass.
- Production build passes.
- Manual review confirms responsive layout and keyboard interaction for UI changes.
- No secrets or unrelated generated files are included.

## Historical correctness tests

Automated tests can validate date filtering and required source fields, but they cannot prove historical truth. Human source review remains mandatory.
