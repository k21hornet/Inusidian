//
//  Inusidian
//  CardApi.swift
//

import Foundation

struct CardAPI {
    let apiClient: APIClient

    func getCard(id: String) async throws -> Card {
        try await apiClient.get("/api/cards/\(id)")
    }

    // 次/前のカードIDを取得。存在しない場合は空文字が返る
    func getNextCardId(deckId: String, cardId: String) async throws -> String {
        try await apiClient.getText("/api/cards/next/\(deckId)/\(cardId)")
    }

    func getPrevCardId(deckId: String, cardId: String) async throws -> String {
        try await apiClient.getText("/api/cards/prev/\(deckId)/\(cardId)")
    }

    func getDueCards(deckId: String) async throws -> [Card] {
        try await apiClient.get("/api/cards/review/\(deckId)")
    }

    func reviewSuccess(id: String, answerTime: Double) async throws {
        try await apiClient.post("/api/cards/review/\(id)/success", body: CardSuccessRequest(answerTime: answerTime))
    }

    func reviewFailure(id: String, answerTime: Double) async throws {
        try await apiClient.post("/api/cards/review/\(id)/failure", body: CardSuccessRequest(answerTime: answerTime))
    }
}

private struct CardSuccessRequest: Encodable {
    let answerTime: Double
}
