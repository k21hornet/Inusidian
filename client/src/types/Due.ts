import type { Card } from "./Card"

export type Due = {
    id: number
    card: Card
    nextDateDiff: number
    successCount: number
    nextReviewDate: string
    createdAt: string
    updatedAt: string
}