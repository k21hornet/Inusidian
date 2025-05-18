package com.inupro.inusidian.input;


import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CardInput {

    private Integer id;

    private Integer deckId;

    @NotBlank
    private String sentence;

    @NotBlank
    private String word;

    private String pronounce;

    private String meaning;

    private String translate;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
