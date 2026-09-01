//
//  Inusidian
//  HomeAPI.swift
//

import Foundation

struct HomeAPI {
    let apiClient: APIClient
    
    func getAllDecks() async throws -> [DeckSummary] {
        try await apiClient.get("/api/decks")
    }
}
