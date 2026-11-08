# System Architecture

## 1. Architecture approach

Use a **modular monolith**: one Next.js application, one relational database, and clearly separated feature modules. This is easier to build, test, deploy, and maintain as a solo project than multiple services.

## 2. Proposed stack (not yet installed)

| Area | Candidate | Decision status |
|---|---|---|
| Application | Next.js + TypeScript | Proposed |
| Styling | Tailwind CSS | Proposed |
| UI primitives | shadcn/ui, selectively | Proposed |
| Database | PostgreSQL | Proposed |
| ORM | Prisma or Drizzle | Evaluate before choosing |
| Map | Leaflet or MapLibre | Prototype before choosing |
| Geometry | GeoJSON initially | Proposed |
| Validation | Zod | Proposed |
| Unit/integration tests | Vitest | Proposed |
| Browser tests | Playwright | Proposed |
| Hosting | Evaluate current free-tier limits before launch | Not decided |

Do not install both alternatives in a category without a concrete need.

## 3. Logical modules

- **Dynasties/Polities:** identity, names, dates, descriptions, capitals.
- **Rulers:** people, reigns, relationships to polities.
- **Territories:** time-bounded geographic control records and geometries.
- **Events:** dated events, locations, involved entities.
- **Sources:** bibliographic and web references.
- **Map/Timeline:** queries and visual presentation for a selected year.
- **Admin/Editorial:** controlled creation and review of historical records; scope to be finalized.

## 4. Request/data flow

1. User selects a year.
2. The Explore feature requests territory records valid for that year.
3. The server validates the year and queries the database.
4. The response includes geometry references, entity metadata, and source summaries.
5. The map renders the features.
6. User selects a feature and opens the associated entity detail.

The exact rendering and API strategy will be decided after a small map prototype.

## 5. Proposed repository layout

```text
islamic-history-atlas/
├── docs/
├── prisma/                 # only if Prisma is selected
├── public/
│   ├── images/
│   └── maps/
├── src/
│   ├── app/
│   ├── components/
│   │   ├── layout/
│   │   ├── map/
│   │   ├── timeline/
│   │   └── ui/
│   ├── features/
│   │   ├── dynasties/
│   │   ├── rulers/
│   │   ├── territories/
│   │   ├── events/
│   │   └── sources/
│   ├── lib/
│   ├── services/
│   ├── types/
│   └── utils/
├── tests/
├── .env.example
├── .gitignore
└── README.md
```

This is a target structure, not a requirement to create every folder immediately. Add a folder when its first real responsibility appears.

## 6. Security and reliability

- Keep database credentials and API secrets server-side.
- Validate and authorize all admin mutations on the server.
- Use least-privilege database credentials.
- Do not expose private admin endpoints.
- Add rate limiting if public endpoints become abuse targets.
- Back up the database before migrations or bulk data imports.
- Log operational errors without logging secrets or sensitive user data.

## 7. Scaling principles

Start with indexed PostgreSQL queries and measured map performance. Add caching, vector tiles, spatial database extensions, or background jobs only after profiling shows they are needed.
