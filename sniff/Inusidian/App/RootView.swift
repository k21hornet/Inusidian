//
//  Inusidian
//  RootView.swift
//

import SwiftUI

struct RootView: View {
    @ObservedObject var authService: AuthenticationService
    
    var body: some View {
        ZStack {
            Image("background")
                .resizable()
                .ignoresSafeArea()
            
            if authService.isLoading {
                ProgressView("ローディング中")
            } else if authService.isAuthenticated {
                HomeView(authService: authService)
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
}

#Preview {
    RootView(authService: AuthenticationService())
}
