import Foundation

struct APIError: Error, LocalizedError {
    let statusCode: Int
    let message: String

    var errorDescription: String? { message }
}

private struct ErrorResponse: Decodable {
    let status: Int
    let error: String
    let message: String
}

// バックエンドは LocalDateTime をタイムゾーンなし・可変桁の小数秒付きで返す
// (例: "2026-09-01T09:22:31.123456") ため、Z 付き ISO8601 前提の
// ISO8601DateFormatter ではデコードできない。手動でパースする。
// LocalDate (例: nextReviewDate) は時刻部分を持たない "yyyy-MM-dd" 形式で
// 返るため、そちらもフォールバックとしてパースする。
private let backendDateTimeFormatter: DateFormatter = {
    let formatter = DateFormatter()
    formatter.locale = Locale(identifier: "en_US_POSIX")
    formatter.timeZone = TimeZone(secondsFromGMT: 0)
    formatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss"
    return formatter
}()

private let backendDateOnlyFormatter: DateFormatter = {
    let formatter = DateFormatter()
    formatter.locale = Locale(identifier: "en_US_POSIX")
    formatter.timeZone = TimeZone(secondsFromGMT: 0)
    formatter.dateFormat = "yyyy-MM-dd"
    return formatter
}()

private func decodeBackendDate(_ decoder: Decoder) throws -> Date {
    let container = try decoder.singleValueContainer()
    let dateString = try container.decode(String.self)

    let parts = dateString.split(separator: ".", maxSplits: 1)
    guard let date = backendDateTimeFormatter.date(from: String(parts[0])) else {
        guard let dateOnly = backendDateOnlyFormatter.date(from: dateString) else {
            throw DecodingError.dataCorruptedError(
                in: container,
                debugDescription: "Cannot decode date: \(dateString)"
            )
        }
        return dateOnly
    }

    guard parts.count > 1, let fraction = Double("0.\(parts[1])") else {
        return date
    }
    return date.addingTimeInterval(fraction)
}

struct APIClient {
    private let authService: AuthenticationService

    init(authService: AuthenticationService) {
        self.authService = authService
    }

    private func makeRequest(_ path: String, method: String) async throws -> URLRequest {
        guard let url = URL(string: AppConfig.apiBaseURL + path) else {
            throw URLError(.badURL)
        }
        let token = try await authService.getAccessToken()
        var request = URLRequest(url: url)
        request.httpMethod = method
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        return request
    }

    private func validate(_ data: Data, _ response: URLResponse) throws {
        guard let http = response as? HTTPURLResponse else { return }
        guard !(200..<300).contains(http.statusCode) else { return }
        if let decoded = try? JSONDecoder().decode(ErrorResponse.self, from: data) {
            throw APIError(statusCode: http.statusCode, message: decoded.message)
        }
        throw APIError(statusCode: http.statusCode, message: "リクエストに失敗しました (\(http.statusCode))")
    }

    func get(_ path: String) async throws -> Data {
        let request = try await makeRequest(path, method: "GET")
        let (data, response) = try await URLSession.shared.data(for: request)
        try validate(data, response)
        return data
    }

    func get<T: Decodable>(_ path: String) async throws -> T {
        let data = try await get(path)
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .custom { try decodeBackendDate($0) }
        return try decoder.decode(T.self, from: data)
    }

    func send<Body: Encodable>(_ path: String, method: String, body: Body) async throws -> Data {
        var request = try await makeRequest(path, method: method)
        request.httpBody = try JSONEncoder().encode(body)
        let (data, response) = try await URLSession.shared.data(for: request)
        try validate(data, response)
        return data
    }

    func send(_ path: String, method: String) async throws -> Data {
        let request = try await makeRequest(path, method: method)
        let (data, response) = try await URLSession.shared.data(for: request)
        try validate(data, response)
        return data
    }

    func post<Body: Encodable>(_ path: String, body: Body) async throws {
        _ = try await send(path, method: "POST", body: body)
    }

    func put<Body: Encodable>(_ path: String, body: Body) async throws {
        _ = try await send(path, method: "PUT", body: body)
    }

    func patch<Body: Encodable>(_ path: String, body: Body) async throws {
        _ = try await send(path, method: "PATCH", body: body)
    }

    func delete(_ path: String) async throws {
        _ = try await send(path, method: "DELETE")
    }
}
