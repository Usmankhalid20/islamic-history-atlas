import { db } from "./index";
import { sources } from "./schema/sources";
import { polities } from "./schema/polities";
import { territoryPeriods } from "./schema/territoryPeriods";
import { historicalEvents } from "./schema/historicalEvents";
import { rulers } from "./schema/rulers";
import { reigns } from "./schema/reigns";
import { tradeRoutes } from "./schema/tradeRoutes";
import {
  initialSources,
  initialPolities,
  initialTerritoryPeriods,
  initialHistoricalEvents,
  initialRulers,
  initialReigns,
  initialTradeRoutes,
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
    await db.insert(territoryPeriods).values(ter).onConflictDoNothing();
  }
  console.log(`✓ Seeded ${initialTerritoryPeriods.length} territory periods`);

  // Seed historical events
  for (const evt of initialHistoricalEvents) {
    await db.insert(historicalEvents).values(evt).onConflictDoNothing();
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
    await db.insert(tradeRoutes).values(tr as any).onConflictDoNothing();
  }
  console.log(`✓ Seeded ${initialTradeRoutes.length} trade & pilgrimage routes`);

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

