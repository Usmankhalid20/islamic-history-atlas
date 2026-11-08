import { db } from "./index";
import { sources } from "./schema/sources";
import { polities } from "./schema/polities";
import { territoryPeriods } from "./schema/territoryPeriods";
import { historicalEvents } from "./schema/historicalEvents";
import {
  initialSources,
  initialPolities,
  initialTerritoryPeriods,
  initialHistoricalEvents,
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

