//
//  Inusidian
//  Route.swift
//

import Foundation

enum Route: Hashable {
    case deckDetail(deckId: String)
    case cardDetail(deckId: String, cardId: String)
    case review(deckId: String)
}
