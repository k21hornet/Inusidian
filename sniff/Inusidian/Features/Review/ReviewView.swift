//
//  Inusidian
//  ReviewView.swift
//

import SwiftUI

struct ReviewView: View {
    let deckId: String
    @ObservedObject var authService: AuthenticationService

    @State private var dueCards: [Card] = []
    @State private var currentCard: Card?
    @State private var isBackRevealed = false
    @State private var startTime: Date?
    @State private var isLoading = false
    @State private var errorMessage: String?
    @State private var isSubmitting = false

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            if isLoading {
                ProgressView("読み込み中...")
                    .frame(maxWidth: .infinity, alignment: .center)
                    .padding()
            } else if let errorMessage = errorMessage {
                Text(errorMessage)
                    .foregroundColor(.red)
                    .padding()
            } else if let card = currentCard {
                reviewCard(card)
            } else {
                congratulations
            }

            Spacer()
        }
        .padding()
        .background(
            Image("background")
                .resizable()
                .ignoresSafeArea()
        )
        .navigationTitle("復習")
        .navigationBarTitleDisplayMode(.inline)
        .task {
            await fetchDueCards()
        }
    }

    private var congratulations: some View {
        VStack(spacing: 8) {
            Text("Congratulations!")
                .font(.title)
                .fontWeight(.bold)
            Text("今日の課題は全て達成しました！")
                .foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity)
        .padding(.top, 64)
    }

    @ViewBuilder
    private func reviewCard(_ card: Card) -> some View {
        VStack(spacing: 12) {
            ForEach(card.values(fieldType: "primary"), id: \.self) { value in
                Text(value.content)
                    .font(.title3)
                    .fontWeight(.bold)
                    .multilineTextAlignment(.center)
            }
            ForEach(card.values(fieldType: "front"), id: \.self) { value in
                Text(value.content)
                    .multilineTextAlignment(.center)
            }

            Button {
                withAnimation { isBackRevealed.toggle() }
            } label: {
                Text(isBackRevealed ? "カード裏面を隠す" : "カード裏面を表示")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
            }
            .disabled(isSubmitting)

            if isBackRevealed {
                VStack(spacing: 16) {
                    ForEach(card.values(fieldType: "back"), id: \.self) { value in
                        Text(value.content)
                            .multilineTextAlignment(.center)
                    }

                    HStack(spacing: 24) {
                        answerButton(
                            title: "もう一度",
                            subtitle: "0 day",
                            isProminent: false
                        ) {
                            await answer(card, success: false)
                        }

                        answerButton(
                            title: "簡単",
                            subtitle: "\(card.successCount * 2 + 1) day",
                            isProminent: true
                        ) {
                            await answer(card, success: true)
                        }
                    }
                }
            }
        }
        .frame(maxWidth: .infinity)
        .padding()
        .background(Color.white.opacity(0.9))
        .cornerRadius(12)
        .id(card.id)
    }

    private func answerButton(
        title: String,
        subtitle: String,
        isProminent: Bool,
        action: @escaping () async -> Void
    ) -> some View {
        VStack(spacing: 4) {
            Text(subtitle)
                .font(.caption)
                .foregroundColor(.secondary)
            Button {
                Task { await action() }
            } label: {
                Text(title)
                    .frame(width: 100)
                    .padding(.vertical, 8)
                    .background(isProminent ? Color.accentColor : Color(.systemGray5))
                    .foregroundColor(isProminent ? .white : .primary)
                    .cornerRadius(8)
            }
            .disabled(isSubmitting)
        }
    }

    private func fetchDueCards() async {
        isLoading = true
        errorMessage = nil
        defer { isLoading = false }

        do {
            let apiClient = APIClient(authService: authService)
            let cardAPI = CardAPI(apiClient: apiClient)
            dueCards = try await cardAPI.getDueCards(deckId: deckId)
            pickNextCard()
        } catch {
            if error is AuthenticationError {
                return
            }
            print("[ReviewView] fetchDueCards failed: \(error)")
            errorMessage = "復習カードの取得に失敗しました。時間をおいて再試行してください。"
        }
    }

    private func pickNextCard() {
        currentCard = dueCards.randomElement()
        startTime = Date()
        isBackRevealed = false
    }

    private func answer(_ card: Card, success: Bool) async {
        guard let startTime, !isSubmitting else { return }
        isSubmitting = true
        defer { isSubmitting = false }

        let answerTime = Date().timeIntervalSince(startTime)

        do {
            let apiClient = APIClient(authService: authService)
            let cardAPI = CardAPI(apiClient: apiClient)
            if success {
                try await cardAPI.reviewSuccess(deckId: deckId, id: card.id, answerTime: answerTime)
                dueCards.removeAll { $0.id == card.id }
            } else {
                try await cardAPI.reviewFailure(deckId: deckId, id: card.id, answerTime: answerTime)
            }
            pickNextCard()
        } catch {
            print("[ReviewView] answer failed: \(error)")
            if error is AuthenticationError {
                return
            }
            errorMessage = "解答の送信に失敗しました。時間をおいて再試行してください。"
        }
    }
}

#Preview {
    NavigationStack {
        ReviewView(deckId: "preview", authService: AuthenticationService())
    }
}
