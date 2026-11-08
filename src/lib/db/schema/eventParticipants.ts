import { pgTable, text } from "drizzle-orm/pg-core";
import { historicalEvents } from "./historicalEvents";
import { polities } from "./polities";
import { rulers } from "./rulers";

export const eventParticipants = pgTable("event_participants", {
  id: text("id").primaryKey(),
  eventId: text("event_id")
    .notNull()
    .references(() => historicalEvents.id, { onDelete: "cascade" }),
  polityId: text("polity_id").references(() => polities.id, {
    onDelete: "set null",
  }),
  rulerId: text("ruler_id").references(() => rulers.id, {
    onDelete: "set null",
  }),
  role: text("role").notNull(), // initiator, belligerent, signatory, defender, commander
});

export type EventParticipantRecord = typeof eventParticipants.$inferSelect;
export type NewEventParticipantRecord = typeof eventParticipants.$inferInsert;

