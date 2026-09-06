//
//  Inusidian
//  CardApi.swift
//

import Foundation

struct CardAPI {
    let apiClient: APIClient

    func getCard(deckId: String, id: String) async throws -> Card {
        try await apiClient.get("/api/decks/\(deckId)/cards/\(id)")
    }

    // 次/前のカードIDを取得。存在しない場合は空文字が返る
    func getNextCardId(deckId: String, cardId: String) async throws -> String {
        let response: AdjacentCardResponse = try await apiClient.get("/api/decks/\(deckId)/cards/\(cardId)/next")
        return response.cardId ?? ""
    }

    func getPrevCardId(deckId: String, cardId: String) async throws -> String {
        let response: AdjacentCardResponse = try await apiClient.get("/api/decks/\(deckId)/cards/\(cardId)/prev")
        return response.cardId ?? ""
    }

    func getDueCards(deckId: String) async throws -> [Card] {
        try await apiClient.get("/api/decks/\(deckId)/cards/due")
    }

    func reviewSuccess(deckId: String, id: String, answerTime: Double) async throws {
        try await apiClient.post("/api/decks/\(deckId)/cards/\(id)/review/success", body: CardSuccessRequest(answerTime: answerTime))
    }

    func reviewFailure(deckId: String, id: String, answerTime: Double) async throws {
        try await apiClient.post("/api/decks/\(deckId)/cards/\(id)/review/failure", body: CardSuccessRequest(answerTime: answerTime))
    }
}

private struct AdjacentCardResponse: Decodable {
    let cardId: String?
}

private struct CardSuccessRequest: Encodable {
    let answerTime: Double
}
