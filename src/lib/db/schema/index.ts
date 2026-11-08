import { relations } from "drizzle-orm";
import { polities } from "./polities";
import { nameVariants } from "./nameVariants";
import { rulers } from "./rulers";
import { reigns } from "./reigns";
import { territoryPeriods } from "./territoryPeriods";
import { historicalEvents } from "./historicalEvents";
import { eventParticipants } from "./eventParticipants";
import { sources } from "./sources";
import { claimSources } from "./claimSources";

export * from "./polities";
export * from "./nameVariants";
export * from "./rulers";
export * from "./reigns";
export * from "./territoryPeriods";
export * from "./historicalEvents";
export * from "./eventParticipants";
export * from "./sources";
export * from "./claimSources";

export const politiesRelations = relations(polities, ({ many }) => ({
  nameVariants: many(nameVariants),
  reigns: many(reigns),
  territoryPeriods: many(territoryPeriods),
  eventParticipants: many(eventParticipants),
}));

export const nameVariantsRelations = relations(nameVariants, ({ one }) => ({
  polity: one(polities, {
    fields: [nameVariants.polityId],
    references: [polities.id],
  }),
}));

export const rulersRelations = relations(rulers, ({ many }) => ({
  reigns: many(reigns),
  eventParticipants: many(eventParticipants),
}));

export const reignsRelations = relations(reigns, ({ one }) => ({
  ruler: one(rulers, {
    fields: [reigns.rulerId],
    references: [rulers.id],
  }),
  polity: one(polities, {
    fields: [reigns.polityId],
    references: [polities.id],
  }),
}));

export const territoryPeriodsRelations = relations(
  territoryPeriods,
  ({ one }) => ({
    polity: one(polities, {
      fields: [territoryPeriods.polityId],
      references: [polities.id],
    }),
  })
);

export const historicalEventsRelations = relations(
  historicalEvents,
  ({ many }) => ({
    participants: many(eventParticipants),
  })
);

export const eventParticipantsRelations = relations(
  eventParticipants,
  ({ one }) => ({
    event: one(historicalEvents, {
      fields: [eventParticipants.eventId],
      references: [historicalEvents.id],
    }),
    polity: one(polities, {
      fields: [eventParticipants.polityId],
      references: [polities.id],
    }),
    ruler: one(rulers, {
      fields: [eventParticipants.rulerId],
      references: [rulers.id],
    }),
  })
);

export const sourcesRelations = relations(sources, ({ many }) => ({
  claims: many(claimSources),
}));

export const claimSourcesRelations = relations(claimSources, ({ one }) => ({
  source: one(sources, {
    fields: [claimSources.sourceId],
    references: [sources.id],
  }),
}));

