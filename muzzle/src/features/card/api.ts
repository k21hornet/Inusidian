import { fetcher } from "@/util/fetcher";

// カードを取得
export async function getCard(deckId: number, id: number) {
  return await fetcher.get(`/decks/${deckId}/cards/${id}`);
}

// 次のカードIDを取得
export async function getNextCardId(deckId: number, cardId: number) {
  return await fetcher.get(`/decks/${deckId}/cards/${cardId}/next`);
}

// 前のカードIDを取得
export async function getPrevCardId(deckId: number, cardId: number) {
  return await fetcher.get(`/decks/${deckId}/cards/${cardId}/prev`);
}
