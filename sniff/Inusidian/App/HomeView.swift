//
//  Inusidian
//  HomeView.swift
//

import SwiftUI

struct HomeView: View {
    @ObservedObject var authService: AuthenticationService

    var body: some View {
        if authService.isLoading {
            ProgressView("ローディング中")
        } else if authService.isAuthenticated {
            VStack {
                Text("チワワわしゃわしゃ")
                Button{
                    Task {
                        await authService.logout()
                    }
                } label: {
                    Text("ログアウト")
                }
            }
        } else {
            VStack {
                Button{
                    Task {
                        await authService.login()
                    }
                } label: {
                    Text("わしゃわしゃする")
                }
            }
        }
    }
}

#Preview {
    HomeView(authService: AuthenticationService())
}
