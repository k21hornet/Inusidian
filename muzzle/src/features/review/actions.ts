"use server";

import { fetcher } from "@/util/fetcher";

// 正解
export async function reviewSuccess(
  deckId: number,
  cardId: number,
  answerTime: number,
) {
  return await fetcher.post(`/decks/${deckId}/cards/${cardId}/review/success`, {
    answerTime,
  });
}

// 不正解
export async function reviewFailure(
  deckId: number,
  cardId: number,
  answerTime: number,
) {
  return await fetcher.post(`/decks/${deckId}/cards/${cardId}/review/failure`, {
    answerTime,
  });
}
