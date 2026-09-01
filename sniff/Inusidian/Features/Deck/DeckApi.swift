//
//  Inusidian
//  DeckApi.swift
//

import Foundation

struct DeckAPI {
    let apiClient: APIClient

    func getDeck(id: String) async throws -> Deck {
        try await apiClient.get("/api/decks/\(id)")
    }
}
