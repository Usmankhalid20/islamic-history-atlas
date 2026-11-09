import * as dotenv from "dotenv";
dotenv.config();
dotenv.config({ path: ".env.local", override: true });

import { db } from "./index";
import { sources } from "./schema/sources";
import { polities } from "./schema/polities";
import { territoryPeriods } from "./schema/territoryPeriods";
import { historicalEvents } from "./schema/historicalEvents";
import { rulers } from "./schema/rulers";
import { reigns } from "./schema/reigns";
import { tradeRoutes } from "./schema/tradeRoutes";
import { monuments } from "./schema/monuments";
import { scholars } from "./schema/scholars";
import { campaigns } from "./schema/campaigns";
import {
  initialSources,
  initialPolities,
  initialTerritoryPeriods,
  initialHistoricalEvents,
  initialRulers,
  initialReigns,
  initialTradeRoutes,
  initialMonuments,
  initialScholars,
  initialCampaigns,
} from "../data/historicalSeed";

export async function seedDatabase() {
  if (!db) {
    console.error("DATABASE_URL is not set. Please set DATABASE_URL to run migrations and seeds.");
    return;
  }

  console.log("Seeding Islamic History Atlas database...");

  // Seed sources
  for (const src of initialSources) {
    await db.insert(sources).values(src).onConflictDoNothing();
  }
  console.log(`✓ Seeded ${initialSources.length} sources`);

  // Seed polities
  for (const pol of initialPolities) {
    await db.insert(polities).values(pol).onConflictDoNothing();
  }
  console.log(`✓ Seeded ${initialPolities.length} polities`);

  // Seed territory periods
  for (const ter of initialTerritoryPeriods) {
    await db
      .insert(territoryPeriods)
      .values(ter)
      .onConflictDoUpdate({
        target: territoryPeriods.id,
        set: {
          regionName: ter.regionName,
          geometryGeojson: ter.geometryGeojson,
          explanatoryNote: ter.explanatoryNote,
          validFromYear: ter.validFromYear,
          validToYear: ter.validToYear,
        },
      });
  }
  console.log(`✓ Seeded ${initialTerritoryPeriods.length} territory periods`);

  // Seed historical events
  for (const evt of initialHistoricalEvents) {
    await db
      .insert(historicalEvents)
      .values(evt)
      .onConflictDoUpdate({
        target: historicalEvents.id,
        set: {
          title: evt.title,
          summary: evt.summary,
          locationGeojson: evt.locationGeojson,
          locationName: evt.locationName,
          eventYear: evt.eventYear,
        },
      });
  }
  console.log(`✓ Seeded ${initialHistoricalEvents.length} historical events`);

  // Seed rulers
  for (const rul of initialRulers) {
    await db.insert(rulers).values(rul).onConflictDoNothing();
  }
  console.log(`✓ Seeded ${initialRulers.length} rulers`);

  // Seed reigns
  for (const rgn of initialReigns) {
    await db.insert(reigns).values(rgn).onConflictDoNothing();
  }
  console.log(`✓ Seeded ${initialReigns.length} reigns`);

  // Seed trade & pilgrimage routes
  for (const tr of initialTradeRoutes) {
    await db
      .insert(tradeRoutes)
      .values(tr as any)
      .onConflictDoUpdate({
        target: tradeRoutes.id,
        set: {
          name: tr.name,
          pathGeojson: tr.pathGeojson,
          description: tr.description,
          primaryCommodities: tr.primaryCommodities,
        },
      });
  }
  console.log(`✓ Seeded ${initialTradeRoutes.length} trade & pilgrimage routes`);

  // Seed monuments
  for (const mon of initialMonuments) {
    await db.insert(monuments).values(mon as any).onConflictDoNothing();
  }
  console.log(`✓ Seeded ${initialMonuments.length} monuments`);

  // Seed scholars
  for (const sch of initialScholars) {
    await db.insert(scholars).values(sch as any).onConflictDoNothing();
  }
  console.log(`✓ Seeded ${initialScholars.length} scholars`);

  // Seed military campaigns
  for (const camp of initialCampaigns) {
    await db.insert(campaigns).values(camp as any).onConflictDoNothing();
  }
  console.log(`✓ Seeded ${initialCampaigns.length} military campaigns`);

  console.log("Database seeding completed successfully!");
}

if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Error during database seed:", err);
      process.exit(1);
    });
}

