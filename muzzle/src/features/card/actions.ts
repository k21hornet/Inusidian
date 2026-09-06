"use server";

import { PostCardFormData } from "./types";
import { fetcher } from "@/util/fetcher";

// カードを作成
export async function postCard(deckId: number, data: PostCardFormData) {
  return await fetcher.post(`/decks/${deckId}/cards`, data);
}

// カードを更新
export async function updateCard(
  deckId: number,
  cardId: number,
  data: PostCardFormData,
) {
  return await fetcher.put(`/decks/${deckId}/cards/${cardId}`, data);
}

// カードを削除
export async function deleteCard(deckId: number, id: number) {
  return await fetcher.delete(`/decks/${deckId}/cards/${id}`);
}
