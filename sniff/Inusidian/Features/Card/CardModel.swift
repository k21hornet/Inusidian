//
//  Inusidian
//  CardModel.swift
//

import Foundation

struct CardField: Decodable, Identifiable, Hashable {
    let id: Int
    let fieldName: String
    let fieldType: String
    let createdAt: Date
    let updatedAt: Date
}

struct CardValue: Decodable, Hashable {
    let field: CardField
    let content: String
}

struct Card: Decodable, Identifiable, Hashable {
    let id: String
    let deckId: String
    let successCount: Int
    let reviewInterval: Int
    let nextReviewDate: Date
    let createdAt: Date
    let updatedAt: Date
    let cardValues: [CardValue]

    // primary: カード表面の見出し, front: カード表面の本文, back: カード裏面
    func values(fieldType: String) -> [CardValue] {
        cardValues.filter { $0.field.fieldType == fieldType }
    }
}
