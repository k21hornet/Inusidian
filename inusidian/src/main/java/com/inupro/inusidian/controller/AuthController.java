package com.inupro.inusidian.controller;

import com.inupro.inusidian.input.LoginInput;
import com.inupro.inusidian.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> register(@Validated @RequestBody LoginInput userInput) {
        return authService.authenticateAndSetCookie(userInput.getEmail(), userInput.getPassword());
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {
        return authService.getCurrentUser(request);
    }

}
