//
//  Inusidian
//  AuthenticationService.swift
//

import Foundation
import Auth0
import Combine

enum AuthenticationError: LocalizedError {
    case sessionExpired

    var errorDescription: String? {
        switch self {
        case .sessionExpired:
            return "ログイン情報の有効期限が切れました。再ログインしてください。"
        }
    }
}

@MainActor
class AuthenticationService: ObservableObject {
    @Published var isAuthenticated = false
    @Published var user: UserProfile?
    @Published var isLoading = false
    @Published var errorMessage: String?
    
    private let credentialsManager = CredentialsManager(authentication: Auth0.authentication())
    
    init() {
        Task {
            await checkAuthenticationStatus()
        }
    }
    
    private func checkAuthenticationStatus() async {
        isLoading = true
        defer { isLoading = false }
        
        guard let credentials = try? await credentialsManager.credentials() else {
            clearSession()
            return
        }
        
        isAuthenticated = true
        // Get the user profile from the stored ID token
        user = try? credentialsManager.userProfile()
    }

    func getAccessToken() async throws -> String {
        do {
            let credentials = try await credentialsManager.credentials()
            return credentials.accessToken
        } catch {
            clearSession()
            throw AuthenticationError.sessionExpired
        }
    }
    
    func login() async {
        isLoading = true
        errorMessage = nil
        defer { isLoading = false }
        
        do {
            // offline_access is included in the default scope as of v3, shown here for clarity
            _ = try await Auth0
                .webAuth()
                .scope("openid profile email offline_access")
                .audience("https://api.inusidian.com")
                .useCredentialsManager(credentialsManager)
                .start()
            
            isAuthenticated = true
            // Get the user profile from the stored ID token
            user = try? credentialsManager.userProfile()
        } catch {
            errorMessage = "Login failed: \(error.localizedDescription)"
        }
    }
    
    func logout() async {
        isLoading = true
        defer { isLoading = false }

        do {
            try await Auth0
              .webAuth()
              .useCredentialsManager(credentialsManager)
              .logout()
            clearSession()
        } catch {
            errorMessage = "Logout failed: \(error.localizedDescription)"
        }
    }

    private func clearSession() {
        do {
            try credentialsManager.clear()
        } catch {
            // Ignore keychain cleanup failures and keep the app in a signed-out state.
        }
        isAuthenticated = false
        user = nil
    }

    func reportError(_ message: String, _ error: Error) {
        errorMessage = "\(message): \(error.localizedDescription)"
    }
}
