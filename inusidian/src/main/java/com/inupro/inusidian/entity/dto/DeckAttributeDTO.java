package com.inupro.inusidian.entity.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class DeckAttributeDTO {

    private Integer id;

    private Integer deckId;

    private String attributeName;

    private Integer isFront;

    private Integer isPrimary;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
