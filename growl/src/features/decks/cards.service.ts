import { and, desc, eq, inArray, lte } from "drizzle-orm";
import { db } from "../../db/client.js";
import { cardFields, cardLogs, cards, cardValues } from "../../db/schema.js";
import { addDays, nowDateTime, toIsoLocal, today } from "../../lib/dates.js";
import { ValidationError } from "../../lib/errors.js";
import { generateCardId } from "../../lib/short-id.js";
import type { Card } from "../../types.js";
import type { CreateCardInput, UpdateCardInput } from "./schema.js";

type CardValueDto = {
  content: string;
  field: {
    id: number;
    fieldName: string;
    fieldType: string;
    createdAt: string;
    updatedAt: string;
  };
};

export type CardDto = {
  id: string;
  deckId: string;
  successCount: number;
  reviewInterval: number;
  nextReviewDate: string;
  createdAt: string;
  updatedAt: string;
  cardValues: CardValueDto[];
};

function toCardDto(
  card: Card,
  values: { content: string; field: CardValueDto["field"] }[],
): CardDto {
  return {
    id: card.id,
    deckId: card.deckId,
    successCount: card.successCount,
    reviewInterval: card.reviewInterval,
    nextReviewDate: card.nextReviewDate,
    createdAt: toIsoLocal(card.createdAt),
    updatedAt: toIsoLocal(card.updatedAt),
    cardValues: values,
  };
}

async function loadValuesForCard(cardId: string) {
  const rows = await db
    .select({
      content: cardValues.content,
      fieldId: cardFields.id,
      fieldName: cardFields.fieldName,
      fieldType: cardFields.fieldType,
      fieldCreatedAt: cardFields.createdAt,
      fieldUpdatedAt: cardFields.updatedAt,
    })
    .from(cardValues)
    .innerJoin(cardFields, eq(cardValues.cardFieldId, cardFields.id))
    .where(eq(cardValues.cardId, cardId));

  return rows.map((row) => ({
    content: row.content,
    field: {
      id: row.fieldId,
      fieldName: row.fieldName,
      fieldType: row.fieldType,
      createdAt: toIsoLocal(row.fieldCreatedAt),
      updatedAt: toIsoLocal(row.fieldUpdatedAt),
    },
  }));
}

async function loadCardsWithValues(cardRows: Card[]): Promise<CardDto[]> {
  if (cardRows.length === 0) return [];

  const cardIds = cardRows.map((c) => c.id);
  const rows = await db
    .select({
      cardId: cardValues.cardId,
      content: cardValues.content,
      fieldId: cardFields.id,
      fieldName: cardFields.fieldName,
      fieldType: cardFields.fieldType,
      fieldCreatedAt: cardFields.createdAt,
      fieldUpdatedAt: cardFields.updatedAt,
    })
    .from(cardValues)
    .innerJoin(cardFields, eq(cardValues.cardFieldId, cardFields.id))
    .where(inArray(cardValues.cardId, cardIds));

  const valuesByCardId = new Map<string, CardValueDto[]>();
  for (const row of rows) {
    const list = valuesByCardId.get(row.cardId) ?? [];
    list.push({
      content: row.content,
      field: {
        id: row.fieldId,
        fieldName: row.fieldName,
        fieldType: row.fieldType,
        createdAt: toIsoLocal(row.fieldCreatedAt),
        updatedAt: toIsoLocal(row.fieldUpdatedAt),
      },
    });
    valuesByCardId.set(row.cardId, list);
  }

  return cardRows.map((card) =>
    toCardDto(card, valuesByCardId.get(card.id) ?? []),
  );
}

export async function listCardsByDeck(deckId: string): Promise<CardDto[]> {
  const cardRows = await db
    .select()
    .from(cards)
    .where(eq(cards.deckId, deckId))
    .orderBy(desc(cards.createdAt));

  return loadCardsWithValues(cardRows);
}

export async function findDueCards(deckId: string): Promise<CardDto[]> {
  const cardRows = await db
    .select()
    .from(cards)
    .where(and(eq(cards.deckId, deckId), lte(cards.nextReviewDate, today())));

  return loadCardsWithValues(cardRows);
}

export async function getCardDto(card: Card): Promise<CardDto> {
  const values = await loadValuesForCard(card.id);
  return toCardDto(card, values);
}

async function assertFieldsBelongToDeck(deckId: string, fieldIds: number[]) {
  if (fieldIds.length === 0) return;

  const owned = await db
    .select({ id: cardFields.id })
    .from(cardFields)
    .where(
      and(eq(cardFields.deckId, deckId), inArray(cardFields.id, fieldIds)),
    );

  const ownedIds = new Set(owned.map((f) => f.id));
  const unknown = fieldIds.filter((id) => !ownedIds.has(id));
  if (unknown.length > 0) {
    throw new ValidationError(
      `Card fields do not belong to this deck: ${unknown.join(", ")}`,
    );
  }
}

export async function createCard(
  deckId: string,
  input: CreateCardInput,
): Promise<CardDto> {
  if (!input.values.some((v) => v.content.trim().length > 0)) {
    throw new ValidationError("At least one field must be filled");
  }

  await assertFieldsBelongToDeck(
    deckId,
    input.values.map((v) => v.cardFieldId),
  );

  const id = generateCardId();
  const timestamp = nowDateTime();

  await db.transaction(async (tx) => {
    await tx.insert(cards).values({
      id,
      deckId,
      successCount: 0,
      reviewInterval: 0,
      nextReviewDate: today(),
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    if (input.values.length > 0) {
      await tx.insert(cardValues).values(
        input.values.map((v) => ({
          cardId: id,
          cardFieldId: v.cardFieldId,
          content: v.content,
          createdAt: timestamp,
          updatedAt: timestamp,
        })),
      );
    }
  });

  const [card] = await db.select().from(cards).where(eq(cards.id, id));
  return getCardDto(card!);
}

export async function updateCard(
  card: Card,
  input: UpdateCardInput,
): Promise<CardDto> {
  const timestamp = nowDateTime();

  if (input.values.length > 0) {
    await db.transaction(async (tx) => {
      for (const value of input.values) {
        await tx
          .update(cardValues)
          .set({ content: value.content, updatedAt: timestamp })
          .where(
            and(
              eq(cardValues.cardId, card.id),
              eq(cardValues.cardFieldId, value.cardFieldId),
            ),
          );
      }
      await tx
        .update(cards)
        .set({ updatedAt: timestamp })
        .where(eq(cards.id, card.id));
    });
  }

  const [updated] = await db.select().from(cards).where(eq(cards.id, card.id));
  return getCardDto(updated!);
}

export async function deleteCard(cardId: string): Promise<void> {
  await db.delete(cards).where(eq(cards.id, cardId));
}

function calcDifficulty(answerTime: number): number {
  if (answerTime < 5) return 1.0;
  if (answerTime < 10) return 0.9;
  if (answerTime < 15) return 0.8;
  return 0.7;
}

function calcNextReviewInterval(
  successCount: number,
  reviewInterval: number,
  answerTime: number,
): number {
  const difficulty = calcDifficulty(answerTime);
  return Math.round((2 * successCount - 1 + reviewInterval) * difficulty);
}

export async function reviewSuccess(
  card: Card,
  answerTime: number,
): Promise<void> {
  const successCount = card.successCount + 1;
  const nextReviewInterval = calcNextReviewInterval(
    successCount,
    card.reviewInterval,
    answerTime,
  );
  const timestamp = nowDateTime();

  await db.transaction(async (tx) => {
    await tx
      .update(cards)
      .set({
        successCount,
        reviewInterval: nextReviewInterval,
        nextReviewDate: addDays(today(), nextReviewInterval),
        updatedAt: timestamp,
      })
      .where(eq(cards.id, card.id));

    await tx.insert(cardLogs).values({
      cardId: card.id,
      answerTime,
      nextReviewInterval,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  });
}

export async function reviewFailure(
  card: Card,
  answerTime: number,
): Promise<void> {
  const timestamp = nowDateTime();

  await db.transaction(async (tx) => {
    await tx
      .update(cards)
      .set({
        successCount: 0,
        reviewInterval: 0,
        nextReviewDate: today(),
        updatedAt: timestamp,
      })
      .where(eq(cards.id, card.id));

    await tx.insert(cardLogs).values({
      cardId: card.id,
      answerTime,
      nextReviewInterval: 0,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  });
}

async function idsByDeckDesc(deckId: string): Promise<string[]> {
  const rows = await db
    .select({ id: cards.id })
    .from(cards)
    .where(eq(cards.deckId, deckId))
    .orderBy(desc(cards.createdAt));
  return rows.map((r) => r.id);
}

export async function findNextCardId(
  deckId: string,
  currentId: string,
): Promise<string | null> {
  const ids = await idsByDeckDesc(deckId);
  const index = ids.indexOf(currentId);
  if (index <= 0) return null;
  return ids[index - 1]!;
}

export async function findPrevCardId(
  deckId: string,
  currentId: string,
): Promise<string | null> {
  const ids = await idsByDeckDesc(deckId);
  const index = ids.indexOf(currentId);
  if (index === -1 || index >= ids.length - 1) return null;
  return ids[index + 1]!;
}
