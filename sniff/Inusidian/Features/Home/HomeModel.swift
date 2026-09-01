//
//  Inusidian
//  HomeModel.swift
//

import Foundation

struct DeckSummary: Decodable, Identifiable {
    let id: String
    let deckName: String
    let deckDescription: String
    let cardCount: Int
    let dueCardCount: Int
    let createdAt: Date
}
