//
//  Inusidian
//  DeckDetailView.swift
//

import SwiftUI

struct DeckDetailView: View {
    let deckId: String
    @ObservedObject var authService: AuthenticationService

    @State private var deck: Deck?
    @State private var isLoading = false
    @State private var errorMessage: String?

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                if isLoading {
                    ProgressView("デッキを読み込み中...")
                        .frame(maxWidth: .infinity, alignment: .center)
                        .padding()
                } else if let errorMessage = errorMessage {
                    Text(errorMessage)
                        .foregroundColor(.red)
                        .padding()
                } else if let deck = deck {
                    deckHeader(deck)
                    reviewButton(deck)
                    cardListSection(deck)
                }

                Spacer()
            }
            .padding()
        }
        .background(
            Image("background")
                .resizable()
                .ignoresSafeArea()
        )
        .navigationTitle(deck?.deckName ?? "デッキ")
        .navigationBarTitleDisplayMode(.inline)
        .task {
            await fetchDeck()
        }
    }

    @ViewBuilder
    private func deckHeader(_ deck: Deck) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(deck.deckName)
                .font(.title2)
                .fontWeight(.bold)
            Text(deck.deckDescription)
                .foregroundColor(.secondary)
            Text("\(deck.cards.count)枚のカードを作成済み")
                .font(.subheadline)
                .foregroundColor(.secondary)
        }
    }

    @ViewBuilder
    private func reviewButton(_ deck: Deck) -> some View {
        NavigationLink(value: Route.review(deckId: deck.id)) {
            Text("復習する")
                .fontWeight(.bold)
                .frame(maxWidth: .infinity)
                .padding()
                .background(Color.accentColor)
                .foregroundColor(.white)
                .cornerRadius(8)
        }
    }

    @ViewBuilder
    private func cardListSection(_ deck: Deck) -> some View {
        Text("カード一覧")
            .font(.title2)
            .fontWeight(.bold)
            .padding(.top)

        if deck.cards.isEmpty {
            Text("カードがありません")
                .foregroundColor(.secondary)
                .padding()
        } else {
            VStack(alignment: .leading, spacing: 8) {
                ForEach(deck.cards) { card in
                    NavigationLink(value: Route.cardDetail(deckId: deck.id, cardId: card.id)) {
                        cardRow(card)
                    }
                    .buttonStyle(.plain)
                }
            }
        }
    }

    private func cardRow(_ card: Card) -> some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                Text(card.cardValues.first?.content ?? "")
                    .font(.headline)
                    .lineLimit(1)
                Text("連続正解 \(card.successCount)回・復習間隔 \(card.reviewInterval)日")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            Spacer()
            Image(systemName: "chevron.right")
                .foregroundColor(.secondary)
        }
        .padding()
        .background(Color.white.opacity(0.8))
        .cornerRadius(8)
    }

    private func fetchDeck() async {
        isLoading = true
        errorMessage = nil
        defer { isLoading = false }

        do {
            let apiClient = APIClient(authService: authService)
            let deckAPI = DeckAPI(apiClient: apiClient)
            deck = try await deckAPI.getDeck(id: deckId)
        } catch {
            print("[DeckDetailView] fetchDeck failed: \(error)")
            if error is AuthenticationError {
                return
            }
            errorMessage = "デッキ情報の取得に失敗しました。時間をおいて再試行してください。"
        }
    }
}

#Preview {
    NavigationStack {
        DeckDetailView(deckId: "preview", authService: AuthenticationService())
    }
}
