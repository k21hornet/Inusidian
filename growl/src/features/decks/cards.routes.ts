import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import {
  requireCardOwnership,
  requireDeckOwnership,
} from "../../middleware/ownership.js";
import { ValidationError } from "../../lib/errors.js";
import type { AppEnv } from "../../types.js";
import * as cardsService from "./cards.service.js";
import {
  createCardSchema,
  reviewAnswerSchema,
  updateCardSchema,
} from "./schema.js";

export const cardsRoutes = new Hono<AppEnv>();

cardsRoutes.use("*", requireDeckOwnership("deckId"));

cardsRoutes.get("/due", async (c) => {
  const deck = c.get("deck");
  const dueCards = await cardsService.findDueCards(deck.id);
  return c.json(dueCards);
});

cardsRoutes.get("/:id", requireCardOwnership, async (c) => {
  const card = c.get("card");
  const dto = await cardsService.getCardDto(card);
  return c.json(dto);
});

cardsRoutes.post(
  "/",
  zValidator("json", createCardSchema, (result) => {
    if (!result.success) {
      throw new ValidationError("Invalid request body", result.error.issues);
    }
  }),
  async (c) => {
    const deck = c.get("deck");
    const input = c.req.valid("json");
    const dto = await cardsService.createCard(deck.id, input);
    return c.json(dto);
  },
);

cardsRoutes.put(
  "/:id",
  requireCardOwnership,
  zValidator("json", updateCardSchema, (result) => {
    if (!result.success) {
      throw new ValidationError("Invalid request body", result.error.issues);
    }
  }),
  async (c) => {
    const card = c.get("card");
    const input = c.req.valid("json");
    const dto = await cardsService.updateCard(card, input);
    return c.json(dto);
  },
);

cardsRoutes.delete("/:id", requireCardOwnership, async (c) => {
  const card = c.get("card");
  await cardsService.deleteCard(card.id);
  return c.body(null, 204);
});

cardsRoutes.post(
  "/:id/review/success",
  requireCardOwnership,
  zValidator("json", reviewAnswerSchema, (result) => {
    if (!result.success) {
      throw new ValidationError("Invalid request body", result.error.issues);
    }
  }),
  async (c) => {
    const card = c.get("card");
    const { answerTime } = c.req.valid("json");
    await cardsService.reviewSuccess(card, answerTime);
    return c.body(null, 200);
  },
);

cardsRoutes.post(
  "/:id/review/failure",
  requireCardOwnership,
  zValidator("json", reviewAnswerSchema, (result) => {
    if (!result.success) {
      throw new ValidationError("Invalid request body", result.error.issues);
    }
  }),
  async (c) => {
    const card = c.get("card");
    const { answerTime } = c.req.valid("json");
    await cardsService.reviewFailure(card, answerTime);
    return c.body(null, 200);
  },
);

cardsRoutes.get("/:id/next", requireCardOwnership, async (c) => {
  const deck = c.get("deck");
  const card = c.get("card");
  const cardId = await cardsService.findNextCardId(deck.id, card.id);
  return c.json({ cardId });
});

cardsRoutes.get("/:id/prev", requireCardOwnership, async (c) => {
  const deck = c.get("deck");
  const card = c.get("card");
  const cardId = await cardsService.findPrevCardId(deck.id, card.id);
  return c.json({ cardId });
});
