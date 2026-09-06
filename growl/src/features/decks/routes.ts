import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { requireUser } from "../../middleware/auth.js";
import { requireDeckOwnership } from "../../middleware/ownership.js";
import { ValidationError } from "../../lib/errors.js";
import type { AppEnv } from "../../types.js";
import { cardsRoutes } from "./cards.routes.js";
import * as deckService from "./service.js";
import { createDeckSchema, deckIoSchema, updateDeckSchema } from "./schema.js";

export const decksRoutes = new Hono<AppEnv>();

decksRoutes.use("*", requireUser);

decksRoutes.get("/", async (c) => {
  const decks = await deckService.listDecks(c.get("userId"));
  return c.json(decks);
});

decksRoutes.get("/:id", requireDeckOwnership("id"), async (c) => {
  const detail = await deckService.getDeckDetail(c.get("deck"));
  return c.json(detail);
});

decksRoutes.post(
  "/create",
  zValidator("json", createDeckSchema, (result) => {
    if (!result.success) {
      throw new ValidationError("Invalid request body", result.error.issues);
    }
  }),
  async (c) => {
    const dto = await deckService.createDeck(c.get("userId"), c.req.valid("json"));
    return c.json(dto);
  },
);

decksRoutes.put(
  "/update",
  zValidator("json", updateDeckSchema, (result) => {
    if (!result.success) {
      throw new ValidationError("Invalid request body", result.error.issues);
    }
  }),
  async (c) => {
    const input = c.req.valid("json");
    const deck = await deckService.getOwnedDeck(c.get("userId"), input.deckId);
    const dto = await deckService.updateDeck(deck, input);
    return c.json(dto);
  },
);

decksRoutes.delete("/:id", requireDeckOwnership("id"), async (c) => {
  await deckService.deleteDeck(c.get("deck").id);
  return c.body(null, 204);
});

decksRoutes.get("/:id/export", requireDeckOwnership("id"), async (c) => {
  const exported = await deckService.exportDeck(c.get("deck"));
  return c.json(exported);
});

decksRoutes.post(
  "/import",
  zValidator("json", deckIoSchema, (result) => {
    if (!result.success) {
      throw new ValidationError("Invalid request body", result.error.issues);
    }
  }),
  async (c) => {
    const dto = await deckService.importDeck(c.get("userId"), c.req.valid("json"));
    return c.json(dto);
  },
);

decksRoutes.route("/:deckId/cards", cardsRoutes);
