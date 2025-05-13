package com.inupro.inusidian.controller;

import com.inupro.inusidian.input.LoginInput;
import com.inupro.inusidian.input.NewUserInput;
import com.inupro.inusidian.service.AuthService;
import com.inupro.inusidian.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;
    private final UserService userService;

    public AuthController(AuthService authService, UserService userService) {
        this.authService = authService;
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Validated @RequestBody NewUserInput userInput) {
        // 既存のメールか
        if (userService.findByEmail(userInput.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Emailは使われています");
        }

        // パスワードチェック
        if (!userInput.getPassword().equals(userInput.getPasswordConfirm())) {
            return ResponseEntity.badRequest().body(("パスワードが一致しません"));
        }

        userService.createUser(userInput);
        // 登録後、ログイン処理
        return authService.authenticateAndSetCookie(userInput.getEmail(), userInput.getPassword());
    }

    @PostMapping("/login")
    public ResponseEntity<?> register(@Validated @RequestBody LoginInput userInput) {
        return authService.authenticateAndSetCookie(userInput.getEmail(), userInput.getPassword());
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {
        return authService.getCurrentUser(request);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        return authService.logout(response);
    }

}
