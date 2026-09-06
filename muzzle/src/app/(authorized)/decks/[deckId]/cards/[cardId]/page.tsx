import { CardPage } from "@/app/(authorized)/decks/[deckId]/cards/[cardId]/_components";
import { getCard, getNextCardId, getPrevCardId } from "@/features/card/api";

type Params = {
  params: Promise<{ deckId: number; cardId: number }>;
};

export default async function Card({ params }: Params) {
  const { deckId, cardId } = await params;

  const cardResponse = await getCard(deckId, cardId);
  if (cardResponse.error) return;
  const card = cardResponse.body;

  const [nextCardResponse, prevCardResponse] = await Promise.all([
    getNextCardId(deckId, cardId),
    getPrevCardId(deckId, cardId),
  ]);
  // 新APIは { cardId: string | null } を返す（旧APIの生文字列レスポンスとは形が異なる）
  const nextCardId = nextCardResponse.body?.cardId ?? "";
  const prevCardId = prevCardResponse.body?.cardId ?? "";

  return (
    <CardPage card={card} nextCardId={nextCardId} prevCardId={prevCardId} />
  );
}
