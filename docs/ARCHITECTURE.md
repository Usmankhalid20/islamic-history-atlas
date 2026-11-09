# System Architecture & Technical Specifications

## 1. High-Level Architecture
The **Islamic Historical Atlas** is architected as an evidence-grounded full-stack GIS web application utilizing Next.js 14 App Router, React 18, Leaflet, Tailwind CSS, and Neon PostgreSQL.

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js App Router                       │
│      HomePage (`/`)  •  Polities  •  Rulers  •  Sources     │
└──────────────────────────────┬──────────────────────────────┘
                               │
       ┌───────────────────────┴───────────────────────┐
       ▼                                               ▼
┌──────────────────────────────┐       ┌──────────────────────────────┐
│     AtlasExplorer (UI)       │       │    REST API Endpoints        │
│ • Two-Tier Control Bar       │       │ • /api/territories           │
│ • Year Slider (500–1980 AD)  │       │ • /api/events                │
│ • Cartographic Inspector     │       │ • /api/routes                │
│ • Theater Canvas Toggle      │       │ • /api/monuments             │
└──────────────┬───────────────┘       │ • /api/campaigns             │
               │                       │ • /api/ai/inquire            │
       ┌───────┴───────┐               └──────────────┬───────────────┘
       ▼               ▼                              │
┌──────────────┐ ┌─────────────┐                      ▼
│HistoricalMap │ │ Detail      │       ┌──────────────────────────────┐
│ • Leaflet    │ │ Panels      │       │ Neon Serverless PostgreSQL   │
│ • 6 Panes    │ │ • Territory │       │ • Drizzle ORM Schema         │
│ • SVG Icons  │ │ • Event     │       │ • GeoJSON Coordinate Rings   │
│ • Basemaps   │ │ • Route     │       │ • Peer-Reviewed Citations    │
│ • Scale Bar  │ │ • Campaign  │       └──────────────────────────────┘
└──────────────┘ └─────────────┘
```

---

## 2. Component Structure

### `src/components/map/`
- **`HistoricalMap.tsx`**: Primary Leaflet map orchestrator. Manages initialization, tileLayer basemaps, custom panes, GeoJSON layers, SVG marker rendering, and tooltips.
- **`MapControls.tsx`**: Custom archival zoom controls, reset heartland, regional fast-jumper with `flyTo` animation, basemap switcher, and theater canvas mode toggle.
- **`MapLegend.tsx`**: Collapsible cartographic legend detailing visual styling for territories, contested frontiers, battles, trade corridors, and monuments.
- **`MapLayerControl.tsx`**: In-map floating layer toggle panel with active feature counts and territory polygon opacity slider.

### `src/components/atlas/`
- **`AtlasExplorer.tsx`**: Core coordinator managing selected year, layer visibility, inspected entities, deep linking URL synchronization, and theater vs. standard view modes.
- **Detail Panels**:
  - `TerritoryDetailPanel.tsx`: Displays political status, effective dates, confidence rating, and cited literature.
  - `EventDetailPanel.tsx`: Displays battle participants, commanders, outcomes, and primary accounts.
  - `RouteDetailPanel.tsx`: Displays route typology, active years, and primary trade commodities.
  - `MonumentDetailPanel.tsx`: Displays founding year, patron, architectural traits, and coordinates.
  - `CampaignDetailPanel.tsx`: Displays military expedition marches, commander names, and strategic outcomes.
- **Modals**:
  - `DiscrepancyInspectorModal.tsx`: Compares competing scholarly hypotheses and historiographical perspectives.
  - `ExportModal.tsx`: Generates GeoJSON snapshots and academic citation references.

---

## 3. Data Flow & State Management
- **Temporal Synchronization**: When the timeline slider or year selector changes, `AtlasExplorer` computes active entities matching the year via `filterActiveTerritories`, `activeEvents`, `activeRoutes`, `activeMonuments`, and `activeCampaigns`.
- **Zero Heavy Reloads**: Changing layers or years dynamically updates Leaflet `LayerGroup`s without re-mounting the underlying Leaflet map instance.
- **URL Deep Linking**: State changes (`year`, `territories`, `routes`, `campaigns`, `monuments`, `events`, `theater`, `entity`, `id`) are continuously serialized to query parameters using `window.history.replaceState`.
