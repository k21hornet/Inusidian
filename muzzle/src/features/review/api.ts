import { fetcher } from "@/util/fetcher";

// レビュー対象カード一覧を取得
export async function getReviewCards(deckId: number) {
  return await fetcher.get(`/decks/${deckId}/cards/due`);
}
