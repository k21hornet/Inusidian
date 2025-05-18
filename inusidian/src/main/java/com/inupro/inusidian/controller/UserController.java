package com.inupro.inusidian.controller;

import com.inupro.inusidian.input.UserUpdateInput;
import com.inupro.inusidian.service.UserService;
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

    @PostMapping("/update")
    public ResponseEntity<?> updateUser(
            @Validated @RequestBody UserUpdateInput input,
            BindingResult result
    ) {
        if (result.hasErrors()) return ResponseEntity.badRequest().body(result.getAllErrors());
        userService.update(input);
        return ResponseEntity.ok().build();
    }

}
