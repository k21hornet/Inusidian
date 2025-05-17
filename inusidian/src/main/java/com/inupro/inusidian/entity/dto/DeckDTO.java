package com.inupro.inusidian.entity.dto;

import com.inupro.inusidian.entity.DeckAttribute;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class DeckDTO {

    private Integer id;

    private Integer userId;

    private String deckName;

    private String deckDescription;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private List<DeckAttribute> deckAttributes;

}
