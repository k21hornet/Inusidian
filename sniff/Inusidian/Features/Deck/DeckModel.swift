//
//  Inusidian
//  DeckModel.swift
//

import Foundation

struct Deck: Decodable, Identifiable, Hashable {
    let id: String
    let deckName: String
    let deckDescription: String
    let createdAt: Date
    let updatedAt: Date
    let cards: [Card]
    let cardFields: [CardField]
}
