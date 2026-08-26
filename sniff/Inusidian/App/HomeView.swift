//
//  Inusidian
//  HomeView.swift
//

import SwiftUI

struct HomeView: View {
    @ObservedObject var authService: AuthenticationService
    
    var body: some View {
        ZStack {
            Image("background")
                .resizable()
                .ignoresSafeArea()
            
            ScrollView {
                if authService.isLoading {
                    ProgressView("ローディング中")
                } else if authService.isAuthenticated {
                    VStack {
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
                        
                        Text("チワワわしゃわしゃ")
                        Spacer()
                    }
                    .padding()
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
}

#Preview {
    HomeView(authService: AuthenticationService())
}
