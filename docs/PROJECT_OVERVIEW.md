# Project Overview: Islamic Historical Atlas

## 1. Purpose
Build an interactive, scholarly, and professional digital historical atlas that visualizes the political geography, dynastic succession, military campaigns, trade routes, and intellectual achievements of Islamic civilization from **500 AD to 1980 AD**.

The application directly answers:
- Which Islamic empires and concurrent polities existed in any chosen year?
- Which territorial regions did each empire directly control or influence?
- How did boundaries expand, contract, and transition over time?
- Which rulers governed each empire, from which capital cities?
- What decisive battles, treaties, and foundations triggered territorial shifts?
- What academic primary sources and peer-reviewed literature corroborate each claim?

---

## 2. Product Experience & Design Language
The atlas feels like a digital archival museum atlas:
- **Visual Style**: Archival parchment (`bg-archival-bg`), warm stone surfaces (`bg-archival-surface`), deep iron-gall ink (`text-archival-ink`), and refined gold cartouche accents (`text-archival-gold`).
- **Cartographic Primacy**: The interactive map occupies the central focus of the viewport, with support for standard split-view and a panoramic **Theater Canvas Mode**.
- **Evidence Traceability**: Every polygon, ruler reign, trade route, and battle marker links to academic citations with an explicit uncertainty policy.

---

## 3. Scope & Phased Implementation (500 AD – 1980 AD)
The atlas expands systematically through 9 controlled, incremental development phases:
1. **Phase 1: Historical Map Foundation** (*Completed*): Responsive Leaflet engine, 6 z-index panes, custom archival zoom, regional fast-jumper with `flyTo`, basemap switcher, in-map layer & opacity controls, custom SVG markers, and theater canvas mode.
2. **Phase 2: Empire Territories & Boundaries**: GeoJSON territorial polygons for major caliphates and sultanates with dynastic color system.
3. **Phase 3: Historical Timeline**: Continuous scrubbing, playback, and temporal synchronization from 500 AD to 1980 AD.
4. **Phase 4: Historical Data Architecture**: Scalable schema separating historical datasets from frontend components.
5. **Phase 5: Empire Information Panel**: Rich temporal context panels updating according to selected years.
6. **Phase 6: Battles & Military Campaigns**: Decisive engagement markers and dashed campaign march vectors.
7. **Phase 7: Historical Territory Changes**: Visualization of conquests, territorial losses, and dynamic expansion.
8. **Phase 8: Search & Filters**: Multi-faceted filtering by dynasty, ruler, city, battle, and period.
9. **Phase 9: Final UI/UX & Performance**: Polished typography, asset lazy-loading, and mobile optimization.
