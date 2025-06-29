package com.chihuahuawashawasha.backend.service;

import com.chihuahuawashawasha.backend.config.JwtUtil;
import com.chihuahuawashawasha.backend.entity.User;
import com.chihuahuawashawasha.backend.entity.dto.UserDTO;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserService userService;

    public AuthService(AuthenticationManager authenticationManager, JwtUtil jwtUtil, UserService userService) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userService = userService;
    }

    public ResponseEntity<?> authenticateAndSetCookie(String email, String password) {
        try {
            // emailとpasswordでログイン認証を行う
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password));

            // ユーザー情報を取得しjwtトークンを作成
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String token = jwtUtil.generateToken(userDetails);

            // tokenをHttpOnlyCookieに設定
            ResponseCookie cookie = ResponseCookie.from("jwt", token)
                    .httpOnly(true)
                    .path("/")
                    .maxAge(24 * 60 * 60 * 7)
                    .build();
            return ResponseEntity.ok()
                    .header("Set-Cookie", cookie.toString())
                    .body("ログインしました");
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {
        String token = null;
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("jwt")) {
                    token = cookie.getValue();
                }
            }
        }

        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String email = jwtUtil.extractEmail(token);
        Optional<User> user = userService.findByEmail(email);

        if(user.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("不正なtokenです");
        }

        UserDTO responseUser = new UserDTO();
        responseUser.setId(user.get().getId());
        responseUser.setUsername(user.get().getUsername());
        responseUser.setEmail(user.get().getEmail());
        responseUser.setCreatedAt(user.get().getCreatedAt());
        responseUser.setUpdatedAt(user.get().getUpdatedAt());
        return ResponseEntity.ok().body(responseUser);
    }

    public ResponseEntity<?> logout(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from("jwt", "")
                .httpOnly(true)
                .path("/")
                .maxAge(0) // 即時削除
                .build();
        return ResponseEntity.ok()
                .header("Set-Cookie", cookie.toString())
                .body("ログアウトしました");
    }
}
