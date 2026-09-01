//
//  Inusidian
//  CardDetailView.swift
//

import SwiftUI

struct CardDetailView: View {
    let deckId: String
    let cardId: String
    @ObservedObject var authService: AuthenticationService

    @State private var card: Card?
    @State private var nextCardId: String = ""
    @State private var prevCardId: String = ""
    @State private var isBackRevealed = false
    @State private var isLoading = false
    @State private var errorMessage: String?

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                if isLoading {
                    ProgressView("カードを読み込み中...")
                        .frame(maxWidth: .infinity, alignment: .center)
                        .padding()
                } else if let errorMessage = errorMessage {
                    Text(errorMessage)
                        .foregroundColor(.red)
                        .padding()
                } else if let card = card {
                    cardContent(card)
                    navigationButtons(card)
                }
            }
            .padding()
        }
        .background(
            Image("background")
                .resizable()
                .ignoresSafeArea()
        )
        .navigationTitle("カード")
        .navigationBarTitleDisplayMode(.inline)
        .task(id: cardId) {
            isBackRevealed = false
            await fetchCard()
        }
    }

    @ViewBuilder
    private func cardContent(_ card: Card) -> some View {
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

            if isBackRevealed {
                VStack(spacing: 8) {
                    ForEach(card.values(fieldType: "back"), id: \.self) { value in
                        Text(value.content)
                            .multilineTextAlignment(.center)
                    }
                }
            }
        }
        .frame(maxWidth: .infinity)
        .padding()
        .background(Color.white.opacity(0.9))
        .cornerRadius(12)
    }

    @ViewBuilder
    private func navigationButtons(_ card: Card) -> some View {
        HStack {
            if !prevCardId.isEmpty {
                NavigationLink(value: Route.cardDetail(deckId: deckId, cardId: prevCardId)) {
                    Label("前のカード", systemImage: "chevron.left")
                }
            } else {
                Spacer().frame(width: 1)
            }

            Spacer()

            if !nextCardId.isEmpty {
                NavigationLink(value: Route.cardDetail(deckId: deckId, cardId: nextCardId)) {
                    Label("次のカード", systemImage: "chevron.right")
                        .labelStyle(.trailingIcon)
                }
            } else {
                Spacer().frame(width: 1)
            }
        }
        .padding(.top)
    }

    private func fetchCard() async {
        isLoading = true
        errorMessage = nil
        defer { isLoading = false }

        do {
            let apiClient = APIClient(authService: authService)
            let cardAPI = CardAPI(apiClient: apiClient)
            async let cardResult = cardAPI.getCard(id: cardId)
            async let nextResult = cardAPI.getNextCardId(deckId: deckId, cardId: cardId)
            async let prevResult = cardAPI.getPrevCardId(deckId: deckId, cardId: cardId)
            card = try await cardResult
            nextCardId = try await nextResult
            prevCardId = try await prevResult
        } catch {
            print("[CardDetailView] fetchCard failed: \(error)")
            if error is AuthenticationError {
                return
            }
            errorMessage = "カード情報の取得に失敗しました。時間をおいて再試行してください。"
        }
    }
}

private struct TrailingIconLabelStyle: LabelStyle {
    func makeBody(configuration: Configuration) -> some View {
        HStack {
            configuration.title
            configuration.icon
        }
    }
}

private extension LabelStyle where Self == TrailingIconLabelStyle {
    static var trailingIcon: TrailingIconLabelStyle { TrailingIconLabelStyle() }
}

#Preview {
    NavigationStack {
        CardDetailView(deckId: "preview", cardId: "preview", authService: AuthenticationService())
    }
}
