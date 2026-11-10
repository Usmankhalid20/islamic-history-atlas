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
| **Rashidun Caliphate** | `#16A34A` (Green) | `#15803D` | Prophet's standard & early pious era |
| **Umayyad Caliphate** | `#14532D` (Deep Green) | `#052E16` | Syrian Damascus imperial courts |
| **Abbasid Caliphate** | `#D97706` (Imperial Gold) | `#B45309` | Baghdad Round City & Golden Age scholarship |
| **Emirate of Córdoba** | `#059669` (Emerald) | `#047857` | Andalusian verdant gardens & architecture |
| **Caliphate of Córdoba** | `#047857` (Caliphal Emerald) | `#064E3B` | Madinat al-Zahra & western caliphal zenith |
| **Fatimid Caliphate** | `#9333EA` (Royal Purple) | `#7E22CE` | Isma'ili caliphal courts at Mahdia & Cairo |
| **Samanid Dynasty** | `#0284C7` (Cobalt Blue) | `#0369A1` | Transoxian & Khorasan Persian renaissance |
| **Buyid Dynasty** | `#701A75` (Plum Amethyst) | `#4A044E` | Daylamite regency over Baghdad & Fars |
| **Ghaznavid Empire** | `#78350F` (Earth Brown) | `#451A03` | Afghan mountain passes & Punjab expansion |
| **Great Seljuk Empire** | `#2563EB` (Royal Blue) | `#1D4ED8` | Turco-Persian Sunnite revival & Isfahan courts |
| **Almoravid Dynasty** | `#854D0E` (Saharan Ochre) | `#713F12` | Veiled Sanhaja reformists of Marrakech |
| **Almohad Caliphate** | `#C2410C` (Terracotta) | `#9A3412` | Masmuda unitarian pan-Maghreb caliphate |
| **Ayyubid Sultanate** | `#0D9488` (Teal) | `#0F766E` | Saladin's Levant & Egyptian unification |
| **Mamluk Sultanate** | `#DC2626` (Crimson Red) | `#991B1B` | Military chivalry, Ain Jalut & Cairo citadel |
| **Delhi Sultanate** | `#E11D48` (Rose Crimson) | `#BE123C` | Indo-Gangetic sultanic court & Qutb Minar |
| **Timurid Empire** | `#7C3AED` (Imperial Violet) | `#6D28D9` | Central Asian monumental arts & Samarkand |
| **Ottoman Empire** | `#991B1B` (Imperial Dark Red) | `#7F1D1D` | Balkan, Anatolian & universal caliphal reach |
| **Safavid Empire** | `#4338CA` (Persian Indigo) | `#3730A3` | Twelver court & Isfahan tile architecture |
| **Mughal Empire** | `#EA580C` (Saffron Orange) | `#C2410C` | Subcontinental artistic & military zenith |

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

