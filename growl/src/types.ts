import type { cards, decks } from "./db/schema.js";

export type Deck = typeof decks.$inferSelect;
export type Card = typeof cards.$inferSelect;

export type AppEnv = {
  Variables: {
    userEmail: string;
    userId: string;
    deck: Deck;
    card: Card;
  };
};
