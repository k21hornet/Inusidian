import type { Card } from "./Card"

export type Deck = {
    id: number
    userId: number
    deckName: string
    deckDescription: string
    createdAt: string
    updatedAt: string
    cards: Card[]
}
