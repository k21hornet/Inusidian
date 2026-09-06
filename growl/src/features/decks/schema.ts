import { z } from "zod";

export const cardFieldSchema = z.object({
  fieldId: z.number().int().optional(),
  fieldName: z.string().min(1).max(50),
  fieldType: z.string().min(1).max(20),
});

export const createDeckSchema = z.object({
  deckName: z.string().min(1).max(50),
  deckDescription: z.string().min(1).max(100),
  cardFields: z.array(cardFieldSchema.omit({ fieldId: true })),
});

export const updateDeckSchema = z.object({
  deckId: z.string().min(1),
  deckName: z.string().min(1).max(50),
  deckDescription: z.string().min(1).max(100),
  cardFields: z.array(cardFieldSchema),
});

export const cardValueSchema = z.object({
  cardFieldId: z.number().int(),
  content: z.string().max(255),
});

export const createCardSchema = z.object({
  values: z.array(cardValueSchema),
});

export const updateCardSchema = z.object({
  values: z.array(cardValueSchema),
});

export const reviewAnswerSchema = z.object({
  answerTime: z.number(),
});

export const deckIoSchema = z.object({
  deckInfo: z.object({
    deckName: z.string().min(1).max(50),
    deckDescription: z.string().min(1).max(100),
    createdAt: z.iso.datetime({ local: true }),
    updatedAt: z.iso.datetime({ local: true }),
    cardFields: z.array(
      z.object({
        fieldName: z.string().min(1).max(50),
        fieldType: z.string().min(1).max(20),
      }),
    ),
  }),
  cards: z.array(
    z.object({
      successCount: z.number().int(),
      reviewInterval: z.number().int(),
      nextReviewDate: z.string(),
      cardCreatedAt: z.iso.datetime({ local: true }),
      cardUpdatedAt: z.iso.datetime({ local: true }),
      fieldValues: z.array(
        z.object({
          fieldName: z.string().min(1),
          content: z.string().max(255),
        }),
      ),
      cardLogs: z.array(
        z.object({
          answerTime: z.number(),
          nextReviewInterval: z.number().int(),
          createdAt: z.iso.datetime({ local: true }),
        }),
      ),
    }),
  ),
});

export type CreateDeckInput = z.infer<typeof createDeckSchema>;
export type UpdateDeckInput = z.infer<typeof updateDeckSchema>;
export type CreateCardInput = z.infer<typeof createCardSchema>;
export type UpdateCardInput = z.infer<typeof updateCardSchema>;
export type DeckIoInput = z.infer<typeof deckIoSchema>;
