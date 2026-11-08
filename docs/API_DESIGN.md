# API Design & Contract Specification

The Islamic History Atlas API provides RESTful endpoints for accessing temporal cartography, dynastic records, chronological events, trade networks, monuments, Golden Age scholars, and military campaigns.

---

## 1. Core Endpoints

### 1.1 Temporal Cartography & Spatial Layers

#### `GET /api/territories?year=:year`
Returns territorial control polygons active for a specific historical year.
- **Query Parameters:**
  - `year` (required, integer, 500..2000): Target historical year in Common Era.
- **Caching:** `Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400`.
- **Response Shape:**
  ```json
  {
    "year": 750,
    "count": 5,
    "items": [
      {
        "id": "ter_abbasid_750",
        "polityId": "pol_abbasid_early",
        "validFromYear": 750,
        "validToYear": 800,
        "controlType": "direct",
        "confidence": "approximate",
        "regionName": "Abbasid Heartland (Mesopotamia & Persia)",
        "geometryGeojson": {
          "type": "Polygon",
          "coordinates": [[[44.0, 33.0], [48.0, 31.0], [44.0, 33.0]]]
        }
      }
    ]
  }
  ```

#### `GET /api/routes`
Returns historical trade corridors and pilgrimage highways (*darb*).
- **Query Parameters:**
  - `routeType` (optional, string): Filter by `pilgrim_road`, `caravan_route`, `maritime_lane`.
  - `activeYear` (optional, integer): Filter routes active during that year.
  - `name` (optional, string): Case-insensitive search on route name.
- **Caching:** `Cache-Control: public, s-maxage=86400, stale-while-revalidate=604800`.

#### `GET /api/routes/:id`
Returns a single trade or pilgrimage route record with primary historiographical source citations.

#### `GET /api/campaigns`
Returns early Islamic military expedition vectors and troop movement corridors.
- **Query Parameters:**
  - `polityId` (optional, string): Filter by commanding dynasty (e.g. `pol_rashidun`).
  - `commander` (optional, string): Filter by general/commander name.
  - `activeYear` (optional, integer): Filter campaigns active in that year.
- **Caching:** `Cache-Control: public, s-maxage=86400, stale-while-revalidate=604800`.

#### `GET /api/campaigns/:id`
Returns single campaign details with key locations, strategic outcome, commanding polity, ruler, and primary sources.

---

### 1.2 Historical Entities & Directories

#### `GET /api/polities`
Returns dynasties, caliphates, and sultanates. Supports filtering by `activeYear` and `entityType`. Supports offset pagination.

#### `GET /api/polities/:id`
Returns full polity profile, including name variants, reigns, active territory periods, and source citations.

#### `GET /api/rulers`
Returns historical rulers. Supports filtering by `polityId`, `reignYear`, and `name`.

#### `GET /api/rulers/:id`
Returns ruler biographical details, reign periods, associated battles, and sources.

#### `GET /api/events`
Returns historical battles, treaties, conquests, and foundations. Supports keyset pagination and filtering by `year` or `eventType`.

#### `GET /api/events/:id`
Returns single historical event details, participants, location GeoJSON point, and sources.

#### `GET /api/monuments`
Returns monumental architecture, mosques, and academies. Supports filtering by `monumentType`, `polityId`, `foundingYear`, `cityName`.

#### `GET /api/monuments/:id`
Returns monument record with architectural innovations, patron dynasty, and citations.

#### `GET /api/scholars`
Returns Islamic Golden Age polymaths and scientists. Supports filtering by `fieldsOfStudy`, `patronizedByPolityId`, `activeYear`, `primaryCity`.

#### `GET /api/scholars/:id`
Returns scholar record with major treatises, patron dynasty, and citations.

#### `GET /api/sources`
Returns primary and secondary historiographical source bibliography and references. Supports offset pagination (`page`, `pageSize`) and entity queries.
- **Caching:** `Cache-Control: public, s-maxage=86400, stale-while-revalidate=604800`.
- **Response Shape:**
  ```json
  {
    "items": [
      {
        "id": "src_tabari",
        "shortCitation": "Al-Tabari, Tarikh",
        "fullTitle": "Tarikh al-Rusul wa al-Muluk (History of the Prophets and Kings)",
        "author": "Muhammad ibn Jarir al-Tabari",
        "originYear": 915,
        "sourceType": "primary_text"
      }
    ],
    "pagination": {
      "total": 5,
      "page": 1,
      "pageSize": 20,
      "totalPages": 1
    }
  }
  ```

---

### 1.3 AI Scholar & Operational Health

#### `POST /api/ai/inquire`
Submits a historiographical query to the grounded AI Scholar model via OpenRouter API.
- **Rate Limit:** 10 requests / minute per IP.
- **Caching:** `no-store`, with server-side in-memory hash caching for identical query strings.
- **Payload Shape:**
  ```json
  {
    "query": "What was the significance of the Battle of Yarmouk?",
    "year": 636,
    "polities": ["pol_rashidun"]
  }
  ```

#### `GET /api/health`
Observability probe returning service health, database connection status, and runtime metrics.
- **Caching:** `no-cache, no-store`.

---

## 2. Pagination Strategy & Specification

Pagination prevents unbounded dataset serialization, reduces memory footprints, and ensures deterministic response times.

### 2.1 Strategy Evaluation: Keyset (Cursor) vs. Offset

| Dimension | Keyset / Cursor Pagination | Limit / Offset Pagination |
|---|---|---|
| **Mechanism** | `WHERE id > :cursor ORDER BY id ASC LIMIT :limit` | `OFFSET :offset LIMIT :limit` |
| **PostgreSQL Complexity** | $O(1)$ index seek | $O(N)$ scanning and discarding rows |
| **Performance at Deep Pages** | Constant sub-millisecond response | Severely degrades as page number increases |
| **Data Drift Resistance** | Immune to row insertions/deletions between pages | Prone to skipped or duplicated records |
| **Page Navigation Support** | Forward / Backward tokens only | Direct arbitrary page jumping ("Go to Page 5") |
| **Adoption in Atlas** | **Used for events, sources, and audit logs** | **Used for polities, rulers, scholars, monuments** |

### 2.2 Cursor-Based Pagination Contract (For Large Collections)
- **Request Parameters:**
  - `limit` (optional, integer, default: 20, min: 1, max: 100)
  - `cursor` (optional, string): Base64-encoded opaque token containing the sort key and unique ID of the last item in the previous page.
- **Response Format:**
  ```json
  {
    "items": [...],
    "pagination": {
      "limit": 20,
      "hasMore": true,
      "nextCursor": "ZXlKaWFXUWlPaUpj..."
    }
  }
  ```

### 2.3 Offset-Based Pagination Contract (For Curated Directories)
- **Request Parameters:**
  - `limit` (optional, integer, default: 20, min: 1, max: 100)
  - `page` (optional, integer, default: 1, min: 1)
- **Response Format:**
  ```json
  {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "totalItems": 32,
      "totalPages": 2,
      "hasMore": true
    }
  }
  ```

---

## 3. Caching Architecture & HTTP Headers

Because 99.5%+ of atlas traffic is read-only, aggressive multi-tier caching is employed to maximize throughput and minimize database connections.

### 3.1 HTTP Cache Headers Contract

| Endpoint Type | `Cache-Control` Header | Rationale |
|---|---|---|
| **Static Reference Catalog** (`/api/polities`, `/api/routes`, `/api/monuments`, `/api/scholars`, `/api/campaigns`) | `public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800` | Curated editorial data changes only during code releases. Edge caches can serve responses for 24h. |
| **Temporal Map Queries** (`/api/territories?year=...`, `/api/events?year=...`) | `public, max-age=1800, s-maxage=3600, stale-while-revalidate=86400` | Frequently explored year slider positions benefit from browser and CDN caching. |
| **AI Inquiries** (`/api/ai/inquire`) | `no-store, no-cache, must-revalidate` | Model responses are synthesized on-demand; prevents browser caching of dynamic queries. |
| **Operational Health** (`/api/health`) | `no-cache, no-store, must-revalidate` | Readiness must reflect real-time live database health. |

### 3.2 Conditional Requests (`ETag` / `If-None-Match`)
- Read endpoints generate an `ETag` computed from record update timestamps or hash digests.
- Clients sending `If-None-Match: "..."` receive `304 Not Modified` with zero response body when unchanged, eliminating data transfer bandwidth.

---

## 4. API Rate Limiting Specification

To protect endpoints from automated scraping, query loops, and token exhaustion on upstream LLM APIs, rate limiting is enforced at the route boundary without requiring external infrastructure.

### 4.1 Tier Thresholds
- **Public Data Read Tier:** `60 requests per minute` per client IP. Applied to all `/api/territories`, `/api/events`, `/api/polities`, `/api/rulers`, `/api/routes`, `/api/monuments`, `/api/scholars`, and `/api/campaigns` routes.
- **AI Scholar Inquiry Tier:** `10 requests per minute` per client IP. Applied strictly to `/api/ai/inquire`.

### 4.2 Standard Rate Limiting Headers
Every API response returns standard rate-limiting metadata headers:
- `X-RateLimit-Limit`: Maximum requests permitted in the sliding window.
- `X-RateLimit-Remaining`: Number of requests remaining in the current window.
- `X-RateLimit-Reset`: Unix timestamp (in seconds) when the current rate limit window resets.

When a client breaches their limit, the API immediately responds with `429 Too Many Requests`:
```json
{
  "error": "Rate limit exceeded",
  "message": "Too many requests. Please wait before submitting additional inquiries.",
  "status": 429,
  "retryAfterSeconds": 45
}
```
Along with the standard `Retry-After: 45` HTTP header.

---

## 5. API Response Optimization & Performance Rules

1. **Payload Compression:** Gzip and Brotli compression are negotiated via `Accept-Encoding: gzip, br` through Next.js server configuration.
2. **Coordinate Precision Truncation:** All GeoJSON coordinates returned by APIs are rounded to 4 decimal places (approximately $\pm 11$ meters precision on earth surface), reducing GeoJSON JSON payload byte sizes by 40–55% without perceptual loss in map resolution.
3. **Payload Projection / Field Masking:** Listing endpoints return summary fields only; high-volume text fields (e.g., long historiographical essays, detailed architectural surveys) are retrieved on single-item detail lookups (`/:id`).
4. **Consistent Error Envelope (RFC 7807 inspired):**
   ```json
   {
     "error": "Invalid query parameters",
     "status": 400,
     "details": {
       "year": ["Year must be an integer between 500 and 2000"]
     },
     "requestId": "req_01j7xyz89"
   }
   ```

---

## 6. Authentication Policy

> [!IMPORTANT]
> **Authentication is explicitly out of scope and postponed.**
> In accordance with project governance (ADR-009), all current API endpoints are public read-only educational resources. User authentication, login sessions, and token-based editorial authorization will be introduced in a separate, dedicated future Admin & Editorial milestone.
