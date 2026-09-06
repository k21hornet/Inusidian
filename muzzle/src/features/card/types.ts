import { Deck } from "../deck/types";

export type CardField = {
  id: number;
  fieldName: string;
  fieldType: string;
  deck: Deck;
};

export type Card = {
  id: number;
  deckId: number;
  deck: Deck;
  cardValues: CardValue[];
  successCount: number;
  reviewInterval: number;
  nextReviewDate: string;
  createdAt: string;
};

export type CardValue = {
  id: number;
  card: Card;
  field: CardField;
  content: string;
};

export type PostCardFormData = {
  values: {
    cardFieldId: number;
    content: string;
  }[];
};
