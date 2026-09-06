import { and, desc, eq, inArray, sql } from "drizzle-orm";
import type { MySqlRawQueryResult } from "drizzle-orm/mysql2";
import { db } from "../../db/client.js";
import {
  cardFields,
  cardLogs,
  cards,
  cardValues,
  decks,
} from "../../db/schema.js";
import {
  fromIsoLocal,
  nowDateTime,
  toIsoLocal,
  today,
} from "../../lib/dates.js";
import { NotFoundError, ValidationError } from "../../lib/errors.js";
import { generateCardId, generateDeckId } from "../../lib/short-id.js";
import type { Deck } from "../../types.js";
import * as cardsService from "./cards.service.js";
import type {
  CreateDeckInput,
  DeckIoInput,
  UpdateDeckInput,
} from "./schema.js";

export async function getOwnedDeck(
  userId: string,
  deckId: string,
): Promise<Deck> {
  const [deck] = await db
    .select()
    .from(decks)
    .where(and(eq(decks.id, deckId), eq(decks.userId, userId)))
    .limit(1);

  if (!deck) {
    throw new NotFoundError("Deck not found");
  }

  return deck;
}

type CardFieldDto = {
  id: number;
  fieldName: string;
  fieldType: string;
  createdAt: string;
  updatedAt: string;
};

export type DeckDto = {
  id: string;
  deckName: string;
  deckDescription: string;
  createdAt: string;
  updatedAt: string;
  cardFields: CardFieldDto[];
};

export type DeckSummaryDto = {
  id: string;
  deckName: string;
  deckDescription: string;
  cardCount: number;
  dueCardCount: number;
  createdAt: string;
};

function toDeckDto(deck: Deck, fields: CardFieldDto[]): DeckDto {
  return {
    id: deck.id,
    deckName: deck.deckName,
    deckDescription: deck.deckDescription,
    createdAt: toIsoLocal(deck.createdAt),
    updatedAt: toIsoLocal(deck.updatedAt),
    cardFields: fields,
  };
}

async function getCardFieldDtos(deckId: string): Promise<CardFieldDto[]> {
  const rows = await db
    .select({
      id: cardFields.id,
      fieldName: cardFields.fieldName,
      fieldType: cardFields.fieldType,
      createdAt: cardFields.createdAt,
      updatedAt: cardFields.updatedAt,
    })
    .from(cardFields)
    .where(eq(cardFields.deckId, deckId));

  return rows.map((row) => ({
    ...row,
    createdAt: toIsoLocal(row.createdAt),
    updatedAt: toIsoLocal(row.updatedAt),
  }));
}

export async function listDecks(userId: string): Promise<DeckSummaryDto[]> {
  const deckRows = await db
    .select()
    .from(decks)
    .where(eq(decks.userId, userId))
    .orderBy(desc(decks.createdAt));

  const countRows = await db
    .select({
      deckId: cards.deckId,
      cardCount: sql<string>`count(*)`,
      dueCardCount: sql<string>`sum(case when ${cards.nextReviewDate} <= ${today()} then 1 else 0 end)`,
    })
    .from(cards)
    .innerJoin(decks, eq(cards.deckId, decks.id))
    .where(eq(decks.userId, userId))
    .groupBy(cards.deckId);

  const countsByDeckId = new Map(
    countRows.map((row) => [
      row.deckId,
      {
        cardCount: Number(row.cardCount),
        dueCardCount: Number(row.dueCardCount),
      },
    ]),
  );

  return deckRows.map((deck) => {
    const counts = countsByDeckId.get(deck.id) ?? {
      cardCount: 0,
      dueCardCount: 0,
    };
    return {
      id: deck.id,
      deckName: deck.deckName,
      deckDescription: deck.deckDescription,
      cardCount: counts.cardCount,
      dueCardCount: counts.dueCardCount,
      createdAt: toIsoLocal(deck.createdAt),
    };
  });
}

export async function getDeckDetail(deck: Deck) {
  const fields = await getCardFieldDtos(deck.id);
  const cardDtos = await cardsService.listCardsByDeck(deck.id);
  return { ...toDeckDto(deck, fields), cards: cardDtos };
}

export async function createDeck(
  userId: string,
  input: CreateDeckInput,
): Promise<DeckDto> {
  const id = generateDeckId();
  const timestamp = nowDateTime();

  await db.transaction(async (tx) => {
    await tx.insert(decks).values({
      id,
      userId,
      deckName: input.deckName,
      deckDescription: input.deckDescription,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    if (input.cardFields.length > 0) {
      await tx.insert(cardFields).values(
        input.cardFields.map((f) => ({
          deckId: id,
          fieldName: f.fieldName,
          fieldType: f.fieldType,
          createdAt: timestamp,
          updatedAt: timestamp,
        })),
      );
    }
  });

  const [deck] = await db.select().from(decks).where(eq(decks.id, id));
  const fields = await getCardFieldDtos(id);
  return toDeckDto(deck!, fields);
}

async function reconcileCardFields(
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
  deckId: string,
  requestedFields: UpdateDeckInput["cardFields"],
  timestamp: string,
) {
  const existing = await tx
    .select({ id: cardFields.id })
    .from(cardFields)
    .where(eq(cardFields.deckId, deckId));
  const existingIds = new Set(existing.map((f) => f.id));

  const toUpdate = requestedFields.filter(
    (f) => f.fieldId !== undefined && existingIds.has(f.fieldId),
  );
  const toInsert = requestedFields.filter(
    (f) => f.fieldId === undefined || !existingIds.has(f.fieldId),
  );
  const keptIds = new Set(toUpdate.map((f) => f.fieldId!));
  const idsToDelete = [...existingIds].filter((id) => !keptIds.has(id));

  for (const field of toUpdate) {
    await tx
      .update(cardFields)
      .set({
        fieldName: field.fieldName,
        fieldType: field.fieldType,
        updatedAt: timestamp,
      })
      .where(eq(cardFields.id, field.fieldId!));
  }

  if (toInsert.length > 0) {
    await tx.insert(cardFields).values(
      toInsert.map((f) => ({
        deckId,
        fieldName: f.fieldName,
        fieldType: f.fieldType,
        createdAt: timestamp,
        updatedAt: timestamp,
      })),
    );
  }

  if (idsToDelete.length > 0) {
    await tx.delete(cardFields).where(inArray(cardFields.id, idsToDelete));
  }
}

export async function updateDeck(
  deck: Deck,
  input: UpdateDeckInput,
): Promise<DeckDto> {
  const timestamp = nowDateTime();

  await db.transaction(async (tx) => {
    await reconcileCardFields(tx, deck.id, input.cardFields, timestamp);
    await tx
      .update(decks)
      .set({
        deckName: input.deckName,
        deckDescription: input.deckDescription,
        updatedAt: timestamp,
      })
      .where(eq(decks.id, deck.id));
  });

  const [updated] = await db.select().from(decks).where(eq(decks.id, deck.id));
  const fields = await getCardFieldDtos(deck.id);
  return toDeckDto(updated!, fields);
}

export async function deleteDeck(deckId: string): Promise<void> {
  await db.delete(decks).where(eq(decks.id, deckId));
}

export async function exportDeck(deck: Deck): Promise<DeckIoInput> {
  const fields = await getCardFieldDtos(deck.id);
  const cardDtos = await cardsService.listCardsByDeck(deck.id);

  const cardIds = cardDtos.map((c) => c.id);
  const logs =
    cardIds.length > 0
      ? await db
          .select()
          .from(cardLogs)
          .where(inArray(cardLogs.cardId, cardIds))
      : [];
  const logsByCardId = new Map<string, typeof logs>();
  for (const log of logs) {
    const list = logsByCardId.get(log.cardId) ?? [];
    list.push(log);
    logsByCardId.set(log.cardId, list);
  }

  return {
    deckInfo: {
      deckName: deck.deckName,
      deckDescription: deck.deckDescription,
      createdAt: toIsoLocal(deck.createdAt),
      updatedAt: toIsoLocal(deck.updatedAt),
      cardFields: fields.map((f) => ({
        fieldName: f.fieldName,
        fieldType: f.fieldType,
      })),
    },
    cards: cardDtos.map((card) => ({
      successCount: card.successCount,
      reviewInterval: card.reviewInterval,
      nextReviewDate: card.nextReviewDate,
      cardCreatedAt: toIsoLocal(card.createdAt),
      cardUpdatedAt: toIsoLocal(card.updatedAt),
      fieldValues: card.cardValues.map((v) => ({
        fieldName: v.field.fieldName,
        content: v.content,
      })),
      cardLogs: (logsByCardId.get(card.id) ?? []).map((log) => ({
        answerTime: log.answerTime,
        nextReviewInterval: log.nextReviewInterval,
        createdAt: toIsoLocal(log.createdAt),
      })),
    })),
  };
}

export async function importDeck(
  userId: string,
  input: DeckIoInput,
): Promise<DeckDto> {
  const deckId = generateDeckId();
  const deckCreatedAt = fromIsoLocal(input.deckInfo.createdAt);
  const deckUpdatedAt = fromIsoLocal(input.deckInfo.updatedAt);
  const timestamp = nowDateTime();

  await db.transaction(async (tx) => {
    await tx.insert(decks).values({
      id: deckId,
      userId,
      deckName: input.deckInfo.deckName,
      deckDescription: input.deckInfo.deckDescription,
      createdAt: deckCreatedAt,
      updatedAt: deckUpdatedAt,
    });

    const fieldNameToId = new Map<string, number>();
    for (const field of input.deckInfo.cardFields) {
      const [result] = (await tx.insert(cardFields).values({
        deckId,
        fieldName: field.fieldName,
        fieldType: field.fieldType,
        createdAt: timestamp,
        updatedAt: timestamp,
      })) as MySqlRawQueryResult;
      fieldNameToId.set(field.fieldName, result.insertId);
    }

    for (const cardData of input.cards) {
      const cardId = generateCardId();
      const cardCreatedAt = fromIsoLocal(cardData.cardCreatedAt);
      const cardUpdatedAt = fromIsoLocal(cardData.cardUpdatedAt);

      await tx.insert(cards).values({
        id: cardId,
        deckId,
        successCount: cardData.successCount,
        reviewInterval: cardData.reviewInterval,
        nextReviewDate: cardData.nextReviewDate,
        createdAt: cardCreatedAt,
        updatedAt: cardUpdatedAt,
      });

      if (cardData.fieldValues.length > 0) {
        const values = cardData.fieldValues.map((fv) => {
          const fieldId = fieldNameToId.get(fv.fieldName);
          if (fieldId === undefined) {
            throw new ValidationError(
              `Unknown field name in import data: ${fv.fieldName}`,
            );
          }
          return {
            cardId,
            cardFieldId: fieldId,
            content: fv.content,
            createdAt: timestamp,
            updatedAt: timestamp,
          };
        });
        await tx.insert(cardValues).values(values);
      }

      if (cardData.cardLogs.length > 0) {
        await tx.insert(cardLogs).values(
          cardData.cardLogs.map((log) => {
            const logCreatedAt = fromIsoLocal(log.createdAt);
            return {
              cardId,
              answerTime: log.answerTime,
              nextReviewInterval: log.nextReviewInterval,
              createdAt: logCreatedAt,
              updatedAt: logCreatedAt,
            };
          }),
        );
      }
    }
  });

  const [deck] = await db.select().from(decks).where(eq(decks.id, deckId));
  const fields = await getCardFieldDtos(deckId);
  return toDeckDto(deck!, fields);
}
