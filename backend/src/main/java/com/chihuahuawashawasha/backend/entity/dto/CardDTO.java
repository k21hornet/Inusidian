package com.chihuahuawashawasha.backend.entity.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class CardDTO {

    private Integer id;

    private Integer deckId;

    private String sentence;

    private String word;

    private String pronounce;

    private String meaning;

    private String translate;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
