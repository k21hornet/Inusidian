package com.chihuahuawashawasha.backend.input;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginInput {
    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String password;
}
