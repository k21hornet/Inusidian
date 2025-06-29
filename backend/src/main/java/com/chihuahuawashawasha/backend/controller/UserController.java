package com.chihuahuawashawasha.backend.controller;

import com.chihuahuawashawasha.backend.input.PasswordInput;
import com.chihuahuawashawasha.backend.input.UserUpdateInput;
import com.chihuahuawashawasha.backend.service.AuthService;
import com.chihuahuawashawasha.backend.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final AuthService authService;

    @PostMapping("/update")
    public ResponseEntity<?> updateUser(
            HttpServletResponse response,
            @Validated @RequestBody UserUpdateInput input,
            BindingResult result
    ) {
        if (result.hasErrors()) return ResponseEntity.badRequest().body(result.getAllErrors());
        userService.update(input);
        return authService.logout(response);
    }

    @PostMapping("/pass")
    public ResponseEntity<?> updatePassword(
            @Validated @RequestBody PasswordInput input,
            BindingResult result
    ) {
        if (result.hasErrors()) return ResponseEntity.badRequest().body(result.getAllErrors());

        userService.updatePassword(input);
        return ResponseEntity.ok().build();
    }

}
