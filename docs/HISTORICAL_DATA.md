# Historical Data Guidelines & Methodological Policy

## 1. Core Principles

1. **Evidence-Grounded Boundaries**: No territory polygon is drawn without citing peer-reviewed historical atlases (e.g., Kennedy's *Historical Atlas of Islam*, Bresc's *Atlas de l'Islam*, Westermann, Pitcher's *Historical Geography of the Ottoman Empire*).
2. **Dynamic Time-Bounded Control**: Imperial lifespans are never projected as static borders across centuries. Territories have distinct effective date ranges (`validFromYear` to `validToYear`).
3. **Explicit Historiographical Uncertainty**: Disputed frontiers, approximate borders, and conflicting primary accounts are flagged with confidence ratings (`high`, `medium`, `approximate`) and examined via the Discrepancy Inspector.
4. **GeoJSON Geographic Order**: All geographic coordinates stored in database GeoJSON strictly adhere to standard GeoJSON `[longitude, latitude]` order, with closed polygon rings (first coordinate matches last coordinate).

---

## 2. Dynastic Color System
Each major empire has a consistent, accessible color scheme utilized across polygon fills, borders, badges, and timeline indicators:

| Dynasty | Fill Color | Stroke Color | Accent / Meaning |
| :--- | :--- | :--- | :--- |
| **Rashidun Caliphate** | `#9A3412` (Terracotta) | `#7C2D12` | Early conquest & desert marches |
| **Umayyad Caliphate** | `#D97706` (Amber / Gold) | `#B45309` | Damascus court & gold coinage |
| **Abbasid Caliphate** | `#1C1917` (Imperial Black) | `#000000` | Black banners of the Abbasid Revolution |
| **Emirate of Córdoba** | `#059669` (Emerald) | `#047857` | Andalusian verdant gardens & architecture |
| **Fatimid Caliphate** | `#2563EB` (Lapis / Royal Blue) | `#1D4ED8` | Mediterranean naval power & Cairo palaces |
| **Seljuk Empire** | `#0284C7` (Sky Blue) | `#0369A1` | Turco-Persian imperial authority |
| **Ayyubid Sultanate** | `#0D9488` (Teal) | `#0F766E` | Saladin's Levant & Egyptian unification |
| **Mamluk Sultanate** | `#B91C1C` (Crimson) | `#7F1D1D` | Military chivalry & Cairo citadel |
| **Ottoman Empire** | `#881337` (Dark Red / Rose) | `#4C0519` | Mediterranean & Balkan imperial expanse |
| **Mughal Empire** | `#EA580C` (Rich Orange) | `#9A3412` | Subcontinental artistic & military zenith |

---

## 3. Typology of Entities

### A. Territorial Control
- **Direct Administration**: Centrally governed tax-paying provinces garrisoned by imperial armies.
- **Vassal / Tributary**: Autonomous principalities recognizing suzerainty and paying tribute.
- **Contested Frontier / Discrepancy**: Borderlands subject to conflicting claims or historiographical disputes.

### B. Historical Events
- **Battles**: Decisive engagements with documented locations, commanders, and recorded outcomes.
- **Conquests & Sieges**: City captures resulting in territorial re-allocation.
- **Foundations**: Creation of new administrative capitals (Baghdad, Cairo, Kairouan, Fez).

### C. Trade & Pilgrimage Corridors
- **Pilgrim Roads**: Darb Zubaydah, Syrian Hajj Road, North African Coastal Road.
- **Caravan Highways**: Trans-Saharan trade routes, Silk Road northern and southern branches.
- **Maritime Corridors**: Red Sea spice route, Persian Gulf trade, Indian Ocean dhow routes.
