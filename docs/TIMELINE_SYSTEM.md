# Historical Timeline System (500 AD – 1980 AD)

## 1. Scope & Objective
The timeline engine enables continuous, animated navigation through the history of Islamic civilization from pre-Islamic Arabia (**500 AD**) to the late twentieth century (**1980 AD**).

---

## 2. Temporal Navigation Controls (`YearSlider.tsx`)
- **Direct Year Input**: Number field allowing direct numeric jump with live clamping between 500 and 1980 CE.
- **Continuous Scrubber**: Smooth range track with tick markers for benchmark historical eras.
- **Historical Era Context**: Dynamic era banner reflecting 10 distinct epochs (`HISTORICAL_ERAS`):
  1. *Late Antiquity & Pre-Islamic Arabia* (500–621 CE)
  2. *Prophetic Era & Rashidun Caliphate* (622–661 CE)
  3. *High Umayyad Caliphate* (662–749 CE)
  4. *Early Abbasid Caliphate & Golden Age* (750–944 CE)
  5. *Regional Dynasties & Caliphal Fragmentation* (945–1054 CE)
  6. *Age of Great Seljuks, Crusades & Ayyubids* (1055–1257 CE)
  7. *Ilkhanate, Mamluk Sultanate & Timurid Renaissance* (1258–1499 CE)
  8. *The Three Gunpowder Empires* (1500–1799 CE)
  9. *Modern Transition & Late Ottoman Tanzimat* (1800–1922 CE)
  10. *Post-Caliphate 20th Century Era* (1923–1980 CE)
- **Granular Steppers**:
  - `-50y` / `+50y`: Major half-century jump.
  - `-10y` / `+10y`: Decade jump.
  - `-1y` / `+1y`: Single year precision.
  - Reset to benchmark: Returns to 632 CE (Founding of the Caliphate).
- **Automated Playback Engine**:
  - Play/Pause toggle with seamless timer lifecycle cleanup.
  - Speed selector: `1x` (1 yr / 800ms), `2x` (5 yrs / 600ms), `5x` (10 yrs / 500ms), `10x` (25 yrs / 400ms).
  - Loop handling: automatically cycles back to 500 CE upon reaching 1980 CE.
- **Civilizational Turning Point Chips (`HISTORICAL_MILESTONES`)**:
  - 16 curated milestones (632, 661, 750, 756, 929, 969, 1071, 1187, 1258, 1260, 1453, 1526, 1550, 1683, 1857, 1922 CE) with one-click direct jump.

---

## 3. Dynamic Temporal Filtering
When `selectedYear` updates:
1. **Territory Filtering**: Only polygons where `validFromYear <= selectedYear <= validToYear` are rendered.
2. **Event Filtering**:
   - In *Era Events* mode (default): Events where `abs(eventYear - selectedYear) <= 25` are surfaced.
   - In *All Events* mode: All events in the database are displayed with era badges.
3. **Trade Routes**: Routes where `activeFromYear <= selectedYear <= (activeToYear ?? 9999)` are displayed.
4. **Campaigns**: Military expeditions active during the specified year window are displayed.
5. **Polity Active Status**: Concurrently existing sovereign dynasties for that specific year are computed and displayed as colored badges in Tier 1 of the cartographic toolbar.


