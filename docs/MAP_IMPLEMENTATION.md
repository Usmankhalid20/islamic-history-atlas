# Map Implementation & Cartographic Architecture

## Overview
The **Islamic Historical Atlas** uses an enterprise-grade Leaflet cartographic engine embedded within Next.js 14 (React 18). The implementation emphasizes historical fidelity, crisp vector graphics, responsive canvas real estate, and accessible interaction across desktop, tablet, and mobile devices.

---

## 1. Cartographic Foundation (Phase 1)

### Viewport & Screen Real Estate
- **Standard Split View**:
  - Desktop: `h-[700px] xl:h-[740px]`, occupying the left 2 columns of a 3-column layout alongside the cartographic inspector.
  - Tablet: `h-[620px]`.
  - Mobile: `h-[560px]`.
- **Theater / Full-Canvas Mode**:
  - Expands the map canvas to **100% width** and **76vh** (`min-h-[580px] max-h-[820px]`).
  - Docks the Cartographic Inspector and Era Events into an accessible side-by-side lower section.
  - Provides a full-canvas, panoramic historical atlas experience with a single click.

### Custom Archival Controls (`MapControls.tsx`)
- **Custom Zoom Controls**: Replaced raw browser zoom buttons with archival parchment-styled buttons (+ and -).
- **Reset Heartland**: Immediately resets view to the Arabian and Levantine core (`[28.0, 38.0]`, zoom 4).
- **Historical Theater Fast-Jumper (`flyTo`)**:
  - 🕌 **Islamic Heartland**: Mecca, Medina, Damascus, Jerusalem (`[28.0, 38.0]`, zoom 4)
  - 🏰 **Al-Andalus & Maghreb**: Córdoba, Fez, Kairouan (`[35.5, -2.5]`, zoom 5)
  - 🏛️ **Mesopotamia & Persia**: Baghdad, Ctesiphon, Isfahan, Rayy (`[33.0, 48.0]`, zoom 5)
  - 🐪 **Central Asia & Khorasan**: Samarkand, Bukhara, Merv (`[39.0, 64.0]`, zoom 5)
  - 🏺 **Egypt & Levant**: Fustat, Alexandria, Cairo (`[30.0, 33.0]`, zoom 5)
  - ⚔️ **Anatolia & Rome Frontier**: Tarsus, Antioch, Cilician Gates (`[38.5, 34.0]`, zoom 5)
- **Basemap Style Switcher**:
  1. *Archival Light Gray* (Esri Light Gray Base) — high contrast, clean vector overlay.
  2. *Topographic Relief* (Esri World Physical Relief) — visualizes mountains, rivers, and deserts governing historical boundaries.
  3. *Antique Parchment* (Esri World Shaded Relief) — vintage historical cartography.
- **Scale Control**: Metric scale bar placed at `bottomright`.

---

## 2. Layer Architecture & Z-Index Panes
To prevent SVG layer collisions, line clipping, and click hijacking between polylines, polygons, and markers, Leaflet custom panes are created during map initialization with strict z-indices:

| Pane Name | Z-Index | Contents | Interaction |
| :--- | :--- | :--- | :--- |
| `territoriesPane` | `410` | Empire territorial polygons (GeoJSON) | Click to inspect, hover highlight |
| `discrepanciesPane` | `420` | Historiographical disputed zones | Click to inspect conflicting perspectives |
| `routesPane` | `430` | Trade, caravan, and maritime corridors | Click to inspect commodities & waypoints |
| `campaignsPane` | `440` | Military expedition marches (dashed vectors) | Click to inspect commanders & outcomes |
| `monumentsPane` | `450` | Academies, great mosques, palaces | Click to inspect architecture & date |
| `eventsPane` | `460` | Battles, conquests, foundations (SVG icons) | Click to inspect primary evidence |

---

## 3. High-Precision Vector Markers (SVG `divIcon`)
Markers are rendered using inline SVG icons styled with archival colors:
- **Battles & Sieges**: Crimson circular cartouche with crossed scimitars and an animated pulse halo on selection.
- **Monuments & Academies**: Royal purple circular cartouche with classical pillared library/academy icon.
- **Great Mosques**: Emerald circular cartouche with arched minaret silhouette.
- **Tooltips & Popups**: Rich archival HTML formatting containing entity title, dates, commanders, cited locations, and primary literature references.

---

## 4. Interactive Cartographic Legend (`MapLegend.tsx`)
- Floating at `bottom-3 left-3`.
- Collapsible into an unobtrusive pill.
- When expanded, displays clear visual swatches:
  - Solid orange: Directly administered territories.
  - Dashed amber: Disputed frontiers and buffer zones.
  - Crimson circle: Battles and major political shifts.
  - Dashed ochre line: Trade corridors and pilgrim roads.
  - Purple circle: Intellectual academies, libraries, and universities.
  - Red dashed line: Campaign marches and military expeditions.
- Includes quick-toggle eye buttons to hide/show layers directly from the legend.

---

## 5. In-Map Layer & Opacity Control (`MapLayerControl.tsx`)
- Located at `top-3 left-3`.
- Displays real-time counts for active features in the selected year.
- Features an interactive **Territory Opacity Slider** (10% to 90%), allowing scholars to peer through political boundaries to observe the underlying topography and river systems.

---

## 6. Mobile & Tablet Responsiveness
- Touch-friendly controls with min 40x40px touch targets.
- Responsive layout switching between standard grid and full-width theater mode.
- Tested across mobile (<640px), tablet (640px–1024px), and desktop (1024px+).
