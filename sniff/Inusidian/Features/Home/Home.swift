//
//  Inusidian
//  HomeView.swift
//

import SwiftUI

struct HomeView: View {
    @ObservedObject var authService: AuthenticationService
    
    @State private var decks: [DeckSummary] = []
    @State private var isLoading = false
    @State private var errorMessage: String?
    
    var body: some View {
        ZStack {
            Image("background")
                .resizable()
                .ignoresSafeArea()
            
            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    HStack {
                        Image("inusidian")
                            .resizable()
                            .scaledToFit()
                            .frame(width: 160)
                        Spacer()
                        Button{
                            Task {
                                await authService.logout()
                            }
                        } label: {
                            Image("logout")
                                .resizable()
                                .scaledToFit()
                                .frame(width: 24)
                        }
                    }
                    .padding(.bottom)
                    
                    Text("デッキ一覧")
                        .font(.title2)
                        .fontWeight(.bold)
                    
                    if isLoading {
                        ProgressView("デッキを読み込み中...")
                            .frame(maxWidth: .infinity, alignment: .center)
                            .padding()
                    } else if let errorMessage = errorMessage {
                        Text(errorMessage)
                            .foregroundColor(.red)
                            .padding()
                    } else if decks.isEmpty {
                        Text("デッキがありません")
                            .foregroundColor(.secondary)
                            .padding()
                    } else {
                        VStack(alignment: .leading, spacing: 8) {
                            ForEach(decks) { deck in
                                HStack {
                                    Text(deck.deckName)
                                        .font(.headline)
                                    Spacer()
                                }
                                .padding()
                                .background(Color.white.opacity(0.8))
                                .cornerRadius(8)
                            }
                        }
                    }
                    
                    Spacer()
                }
                .padding()
            }
        }
        .task {
            await fetchDecks()
        }
    }
    
    private func fetchDecks() async {
        isLoading = true
        errorMessage = nil
        defer { isLoading = false }
        
        do {
            let apiClient = APIClient(authService: authService)
            let homeAPI = HomeAPI(apiClient: apiClient)
            decks = try await homeAPI.getAllDecks()
        } catch {
            if error is AuthenticationError {
                // 認証切れ時は RootView 側でログイン画面に戻す
                return
            }
            errorMessage = "デッキ一覧の取得に失敗しました。時間をおいて再試行してください。"
        }
    }
}

#Preview {
    HomeView(authService: AuthenticationService())
}
