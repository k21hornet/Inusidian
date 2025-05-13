package com.inupro.inusidian.controller;

import com.inupro.inusidian.input.LoginInput;
import com.inupro.inusidian.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

}
