import { and, eq } from "drizzle-orm";
import type { MiddlewareHandler } from "hono";
import { db } from "../db/client.js";
import { cards } from "../db/schema.js";
import { NotFoundError } from "../lib/errors.js";
import { getOwnedDeck } from "../features/decks/service.js";
import type { AppEnv } from "../types.js";

// デッキおよびカードの所有権を確認するミドルウェアを定義
export const requireDeckOwnership = (
  paramName: "id" | "deckId" = "id",
): MiddlewareHandler<AppEnv> => {
  return async (c, next) => {
    const deckId = c.req.param(paramName);
    if (!deckId) throw new NotFoundError("Deck not found");
    const userId = c.get("userId");

    const deck = await getOwnedDeck(userId, deckId);

    c.set("deck", deck);
    await next();
  };
};

// カードの所有権を確認するミドルウェアを定義
export const requireCardOwnership: MiddlewareHandler<AppEnv> = async (
  c,
  next,
) => {
  const cardId = c.req.param("id");
  if (!cardId) throw new NotFoundError("Card not found");
  const deck = c.get("deck");

  const [card] = await db
    .select()
    .from(cards)
    .where(and(eq(cards.id, cardId), eq(cards.deckId, deck.id)))
    .limit(1);

  if (!card) {
    throw new NotFoundError("Card not found");
  }

  c.set("card", card);
  await next();
};
