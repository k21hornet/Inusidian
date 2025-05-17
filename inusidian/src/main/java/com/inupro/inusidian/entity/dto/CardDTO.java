package com.inupro.inusidian.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CardDTO {

    private Integer id;

    private Integer deckId;

    private Integer isFront;

    private Integer isPrimary;

    private String attributeName;

    private String attributeValue;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
