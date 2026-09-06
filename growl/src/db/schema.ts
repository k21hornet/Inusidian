import { relations } from "drizzle-orm";
import {
  bigint,
  char,
  date,
  datetime,
  double,
  int,
  mysqlTable,
  primaryKey,
  varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: varchar("id", { length: 50 }).primaryKey(),
  userName: varchar("user_name", { length: 50 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  avatarUrl: varchar("avatar_url", { length: 255 }),
  createdAt: datetime("created_at", { mode: "string" }).notNull(),
  updatedAt: datetime("updated_at", { mode: "string" }).notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  decks: many(decks),
}));

export const decks = mysqlTable("decks", {
  id: char("id", { length: 12 }).primaryKey(),
  userId: varchar("user_id", { length: 50 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  deckName: varchar("deck_name", { length: 50 }).notNull(),
  deckDescription: varchar("deck_description", { length: 100 }).notNull(),
  createdAt: datetime("created_at", { mode: "string" }).notNull(),
  updatedAt: datetime("updated_at", { mode: "string" }).notNull(),
});

export const decksRelations = relations(decks, ({ one, many }) => ({
  user: one(users, { fields: [decks.userId], references: [users.id] }),
  cardFields: many(cardFields),
  cards: many(cards),
}));

export const cardFields = mysqlTable("card_fields", {
  id: int("id").autoincrement().primaryKey(),
  deckId: char("deck_id", { length: 12 })
    .notNull()
    .references(() => decks.id, { onDelete: "cascade" }),
  fieldName: varchar("field_name", { length: 50 }).notNull(),
  fieldType: varchar("field_type", { length: 20 }).notNull(),
  createdAt: datetime("created_at", { mode: "string" }).notNull(),
  updatedAt: datetime("updated_at", { mode: "string" }).notNull(),
});

export const cardFieldsRelations = relations(cardFields, ({ one, many }) => ({
  deck: one(decks, { fields: [cardFields.deckId], references: [decks.id] }),
  cardValues: many(cardValues),
}));

export const cards = mysqlTable("cards", {
  id: char("id", { length: 16 }).primaryKey(),
  deckId: char("deck_id", { length: 12 })
    .notNull()
    .references(() => decks.id, { onDelete: "cascade" }),
  successCount: int("success_count").notNull(),
  reviewInterval: int("review_interval").notNull(),
  nextReviewDate: date("next_review_date", { mode: "string" }).notNull(),
  createdAt: datetime("created_at", { mode: "string" }).notNull(),
  updatedAt: datetime("updated_at", { mode: "string" }).notNull(),
});

export const cardsRelations = relations(cards, ({ one, many }) => ({
  deck: one(decks, { fields: [cards.deckId], references: [decks.id] }),
  cardValues: many(cardValues),
  cardLogs: many(cardLogs),
}));

export const cardValues = mysqlTable(
  "card_values",
  {
    cardId: char("card_id", { length: 16 })
      .notNull()
      .references(() => cards.id, { onDelete: "cascade" }),
    cardFieldId: int("card_field_id")
      .notNull()
      .references(() => cardFields.id, { onDelete: "cascade" }),
    content: varchar("content", { length: 255 }).notNull(),
    createdAt: datetime("created_at", { mode: "string" }).notNull(),
    updatedAt: datetime("updated_at", { mode: "string" }).notNull(),
  },
  (t) => [primaryKey({ columns: [t.cardId, t.cardFieldId] })],
);

export const cardValuesRelations = relations(cardValues, ({ one }) => ({
  card: one(cards, { fields: [cardValues.cardId], references: [cards.id] }),
  cardField: one(cardFields, {
    fields: [cardValues.cardFieldId],
    references: [cardFields.id],
  }),
}));

export const cardLogs = mysqlTable("card_logs", {
  id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
  cardId: char("card_id", { length: 16 })
    .notNull()
    .references(() => cards.id, { onDelete: "cascade" }),
  answerTime: double("answer_time").notNull(),
  nextReviewInterval: int("next_review_interval").notNull(),
  createdAt: datetime("created_at", { mode: "string" }).notNull(),
  updatedAt: datetime("updated_at", { mode: "string" }).notNull(),
});

export const cardLogsRelations = relations(cardLogs, ({ one }) => ({
  card: one(cards, { fields: [cardLogs.cardId], references: [cards.id] }),
}));
