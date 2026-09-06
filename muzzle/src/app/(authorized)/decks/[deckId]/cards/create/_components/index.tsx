"use client";

import { postCard } from "@/features/card/actions";
import { Deck } from "@/features/deck/types";
import { PostCardFormData } from "@/features/card/types";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type Props = {
  deck: Deck;
};

export default function CreateCardPage({ deck }: Props) {
  // 各カード属性ごとにcardFieldIdとcontentを持つ
  const [formData, setFormData] = useState<PostCardFormData>({
    values: deck.cardFields.map((field) => ({
      cardFieldId: field.id, // 各フィールドのIDをセット
      content: "",
    })),
  });

  const handleFieldChange = (index: number, value: string) => {
    const newValues = [...formData.values]; // 現在の値をコピー
    newValues[index] = { ...newValues[index], content: value }; // 該当フィールドのみ更新
    setFormData((prev) => ({
      ...prev,
      values: newValues,
    }));
  };

  const handleSubmit = async (e: FormEvent<Element>) => {
    e.preventDefault();

    const { error } = await postCard(deck.id, formData);
    if (!error) {
      // フォームをリセット
      setFormData({
        values: deck.cardFields.map((field) => ({
          cardFieldId: field.id,
          content: "",
        })),
      });

      toast.success("カードを作成しました");
    } else {
      toast.error("カードの作成に失敗しました");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      {deck.cardFields.map((field, idx) => (
        <div key={field.id} className="flex flex-col gap-1">
          <Label htmlFor={`field-${field.id}`}>{field.fieldName}</Label>
          <Input
            id={`field-${field.id}`}
            type="text"
            value={formData.values[idx].content}
            onChange={(e) => handleFieldChange(idx, e.target.value)}
            className="w-full"
          />
        </div>
      ))}

      <div>
        <Button buttonDesign="secondary" type="submit">
          カードを作成
        </Button>
      </div>
    </form>
  );
}
