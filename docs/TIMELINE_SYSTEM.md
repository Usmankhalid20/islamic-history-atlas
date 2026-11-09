# Historical Timeline System (500 AD – 1980 AD)

## 1. Scope & Objective
The timeline engine enables continuous, animated navigation through the history of Islamic civilization from pre-Islamic Arabia (**500 AD**) to the late twentieth century (**1980 AD**).

---

## 2. Temporal Navigation Controls (`YearSlider.tsx`)
- **Direct Year Input**: Number field allowing direct jumps to any historical year.
- **Continuous Slider**: Scrubber with major milestone ticks:
  - `632 CE`: Accession of Abu Bakr / Ridda Campaigns
  - `661 CE`: Establishment of the Umayyad Dynasty in Damascus
  - `750 CE`: Battle of the Zab & Abbasid Revolution
  - `756 CE`: Founding of the Independent Umayyad Emirate of Córdoba
  - `762 CE`: Foundation of the Round City of Baghdad
  - `909 CE`: Emergence of the Fatimid Caliphate in North Africa
  - `969 CE`: Fatimid conquest of Egypt & foundation of Cairo
- **Step Controls**:
  - `«` / `»`: Step by 25 years.
  - `‹` / `›`: Step by 1 year.
- **Playback Engine**:
  - Play/Pause button with configurable playback intervals (750ms per step).
  - Loop boundary handling (wraps from maxYear back to minYear).

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

