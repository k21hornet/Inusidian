package com.inupro.inusidian.input;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserUpdateInput {

    private Integer id;

    @NotBlank
    private String username;

    @NotBlank
    @Email
    private String email;
}

