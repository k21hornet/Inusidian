"use client";

import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/features/card/types";
import { reviewFailure, reviewSuccess } from "@/features/review/actions";
import Congratulations from "./Congratulations";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card as CardUi } from "@/components/ui/card";

export default function ReviewPage({ data }: { data: Card[] }) {
  const [dueCards, setDueCards] = useState<Card[]>([]);
  const [dueCard, setDueCard] = useState<Card | null>();
  const [accordionValue, setAccordionValue] = useState<string>("");
  const [startTime, setStartTime] = useState<Date | null>(null);

  // ランダムで一問出題
  const setNextReviewCard = () => {
    const randomNum = Math.floor(Math.random() * dueCards.length);
    setDueCard(dueCards[randomNum]);
    setStartTime(new Date()); // 出題時タイマーをセット
  };

  useEffect(() => {
    const fetchReviewCards = async () => {
      setDueCards(data);
    };
    fetchReviewCards();
  }, []);

  useEffect(() => {
    if (dueCards.length > 0) {
      setNextReviewCard();
    } else {
      setDueCard(null);
    }
  }, [dueCards]);

  // 問題正解時
  const success = async (id: number) => {
    if (!dueCard || !startTime) return;
    const endTime = new Date();
    const answerTime = (endTime.getTime() - startTime.getTime()) / 1000;
    await reviewSuccess(dueCard.deckId, id, answerTime);
    setDueCards(dueCards.filter((rc) => rc.id !== id)); //正解した問題を除外
    setAccordionValue("");
  };

  // 問題不正解時
  const failure = async () => {
    if (!dueCard || !startTime) return;
    const endTime = new Date();
    const answerTime = (endTime.getTime() - startTime.getTime()) / 1000;
    await reviewFailure(dueCard.deckId, dueCard.id, answerTime);
    setNextReviewCard();
    setAccordionValue("");
    toast.error("残念！");
  };

  const router = useRouter();

  if (!dueCard) return <Congratulations />;

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className="mb-4 flex w-full cursor-pointer items-center gap-2 text-[#9E9E9E]"
        onClick={() => router.push(`/decks/${dueCard.deckId}`)}
      >
        <ArrowLeft className="h-5 w-5" />
        <span>デッキに戻る</span>
      </div>

      <CardUi className="flex w-full max-w-2xl flex-col items-center justify-center gap-4 p-6">
        {/* カード表面 */}
        {dueCard.cardValues
          .filter((value) => value.field.fieldType === "primary") // primaryフィールドのみ取得
          .map((value, idx) => (
            <p key={idx} className="text-center text-lg font-bold">
              {value.content}
            </p>
          ))}

        {dueCard.cardValues
          .filter((value) => value.field.fieldType === "front") // 表フィールドのみ取得
          .map((value, idx) => (
            <p key={idx} className="text-center">
              {value.content}
            </p>
          ))}

        {/* カード裏面（key でカードごとに再マウントし、次の問題ではアニメなしで閉じた状態から表示） */}
        <Accordion
          key={dueCard.id}
          type="single"
          collapsible
          value={accordionValue}
          onValueChange={setAccordionValue}
          className="w-full"
        >
          <AccordionItem value="back" className="border-none">
            <AccordionTrigger className="text-sm text-[#9E9E9E] hover:no-underline">
              カード裏面を表示
            </AccordionTrigger>
            <AccordionContent className="pt-0">
              {dueCard.cardValues
                .filter((value) => value.field.fieldType === "back") // 裏のカードのみ取得
                .map((value, idx) => (
                  <p key={idx} className="mb-4 text-center">
                    {value.content}
                  </p>
                ))}
              {/* ボタン */}
              <div className="mt-4 flex justify-center gap-4">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-muted-foreground text-sm">0 day</span>
                  <Button
                    buttonDesign="secondary"
                    onClick={failure}
                    className="w-[100px]"
                  >
                    もう一度
                  </Button>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <span className="text-muted-foreground text-sm">
                    {dueCard.successCount * 2 + 1} day
                  </span>
                  <Button
                    buttonDesign="secondary"
                    variant="outlined"
                    onClick={() => success(dueCard.id)}
                    className="w-[100px]"
                  >
                    簡単
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardUi>
    </div>
  );
}
