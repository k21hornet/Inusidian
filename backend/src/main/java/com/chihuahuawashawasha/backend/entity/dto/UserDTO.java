package com.chihuahuawashawasha.backend.entity.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserDTO {

    private Integer id;

    private String username;

    private String email;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
