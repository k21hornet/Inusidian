package com.chihuahuawashawasha.backend.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DeckDTO {

    private Integer id;

    private Integer userId;

    private String deckName;

    private String deckDescription;

    private List<CardDTO> cards;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}
