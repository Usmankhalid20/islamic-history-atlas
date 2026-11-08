# API Design (Initial Proposal)

The API contract is provisional. Final routes and response schemas should be recorded after the database model is approved.

## Read endpoints

### `GET /api/territories?year=950`
Returns territory records active for the requested year.

Expected response shape (illustrative):

```json
{
  "year": 950,
  "items": [
    {
      "id": "territory-record-id",
      "polity": {
        "id": "polity-id",
        "name": "Example polity",
        "type": "dynasty"
      },
      "controlType": "direct",
      "confidence": "approximate",
      "geometry": {},
      "sources": []
    }
  ]
}
```

The example is a shape illustration, not a historical record.

### `GET /api/polities`
Supports pagination and optional filters such as region, entity type, and active year.

### `GET /api/polities/:id`
Returns one polity with dates, overview, rulers, territory periods, and sources.

### `GET /api/rulers/:id`
Returns ruler details, reigns, events, and sources.

### `GET /api/events`
Supports year/range and polity filters.

### `GET /api/events/:id`
Returns event details, participants, location, and sources.

## Admin endpoints

Admin write endpoints are not part of the public MVP until authentication, authorization, validation, audit history, and editorial review rules are designed.

## API rules

- Validate query parameters and path identifiers.
- Return consistent error formats.
- Use pagination for potentially large collections.
- Avoid returning full-resolution geometry when the current map zoom does not need it.
- Do not expose draft/unreviewed historical records publicly unless explicitly intended.
- Add integration tests for date filtering, pagination, validation, and access control.
