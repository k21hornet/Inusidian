//
//  Inusidian
//  InusidianApp.swift
//

import SwiftUI

@main
struct InusidianApp: App {
    @StateObject private var authService = AuthenticationService()
    var body: some Scene {
        WindowGroup {
            HomeView(authService: authService)
        }
    }
}
