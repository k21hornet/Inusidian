package com.inupro.inusidian.entity.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class DeckDTO {

    private Integer id;

    private UserDTO user;

    private String deckName;

    private String deckDescription;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}
