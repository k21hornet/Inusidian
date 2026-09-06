import { and, eq, gte, sql } from "drizzle-orm";
import { db } from "../../db/client.js";
import { cardLogs, cards, decks } from "../../db/schema.js";
import { addDays, startOfJstDay, today } from "../../lib/dates.js";

export type LearningHistoryEntry = {
  date: string;
  newCards: number;
  reviewedCards: number;
};

export type CardSuccessDistributionEntry = {
  successCount: number;
  cardsCount: number;
};

export type StudiedDays = { studiedDays: number[] };

const DAY_FORMAT = "%Y-%m-%d";

export async function getLearningHistory(
  userId: string,
): Promise<LearningHistoryEntry[]> {
  const since = startOfJstDay(addDays(today(), -6));

  const newCardRows = await db
    .select({
      date: sql<string>`date_format(${cards.createdAt}, ${DAY_FORMAT})`,
      count: sql<string>`count(*)`,
    })
    .from(cards)
    .innerJoin(decks, eq(cards.deckId, decks.id))
    .where(and(eq(decks.userId, userId), gte(cards.createdAt, since)))
    .groupBy(sql`date_format(${cards.createdAt}, ${DAY_FORMAT})`);

  const reviewRows = await db
    .select({
      date: sql<string>`date_format(${cardLogs.createdAt}, ${DAY_FORMAT})`,
      count: sql<string>`count(*)`,
    })
    .from(cardLogs)
    .innerJoin(cards, eq(cardLogs.cardId, cards.id))
    .innerJoin(decks, eq(cards.deckId, decks.id))
    .where(and(eq(decks.userId, userId), gte(cardLogs.createdAt, since)))
    .groupBy(sql`date_format(${cardLogs.createdAt}, ${DAY_FORMAT})`);

  const newCardsByDate = new Map(
    newCardRows.map((r) => [r.date, Number(r.count)]),
  );
  const reviewsByDate = new Map(
    reviewRows.map((r) => [r.date, Number(r.count)]),
  );

  const result: LearningHistoryEntry[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = addDays(today(), -i);
    result.push({
      date,
      newCards: newCardsByDate.get(date) ?? 0,
      reviewedCards: reviewsByDate.get(date) ?? 0,
    });
  }
  return result;
}

export async function getCardSuccessDistribution(
  userId: string,
): Promise<CardSuccessDistributionEntry[]> {
  const rows = await db
    .select({
      successCount: cards.successCount,
      cardsCount: sql<string>`count(*)`,
    })
    .from(cards)
    .innerJoin(decks, eq(cards.deckId, decks.id))
    .where(eq(decks.userId, userId))
    .groupBy(cards.successCount);

  const buckets = new Map<number, number>();
  for (let i = 1; i <= 5; i++) buckets.set(i, 0);

  for (const row of rows) {
    const bucket = Math.min(row.successCount, 5);
    if (bucket >= 1) {
      buckets.set(bucket, (buckets.get(bucket) ?? 0) + Number(row.cardsCount));
    }
  }

  return [...buckets.entries()].map(([successCount, cardsCount]) => ({
    successCount,
    cardsCount,
  }));
}

export async function getStudiedDays(
  userId: string,
  year: number,
  month: number,
): Promise<StudiedDays> {
  const logDays = await db
    .select({ day: sql<number>`day(${cardLogs.createdAt})` })
    .from(cardLogs)
    .innerJoin(cards, eq(cardLogs.cardId, cards.id))
    .innerJoin(decks, eq(cards.deckId, decks.id))
    .where(
      and(
        eq(decks.userId, userId),
        sql`year(${cardLogs.createdAt}) = ${year}`,
        sql`month(${cardLogs.createdAt}) = ${month}`,
      ),
    )
    .groupBy(sql`day(${cardLogs.createdAt})`);

  const cardDays = await db
    .select({ day: sql<number>`day(${cards.createdAt})` })
    .from(cards)
    .innerJoin(decks, eq(cards.deckId, decks.id))
    .where(
      and(
        eq(decks.userId, userId),
        sql`year(${cards.createdAt}) = ${year}`,
        sql`month(${cards.createdAt}) = ${month}`,
      ),
    )
    .groupBy(sql`day(${cards.createdAt})`);

  const studiedDays = new Set<number>();
  for (const row of logDays) studiedDays.add(Number(row.day));
  for (const row of cardDays) studiedDays.add(Number(row.day));

  return { studiedDays: [...studiedDays].sort((a, b) => a - b) };
}
