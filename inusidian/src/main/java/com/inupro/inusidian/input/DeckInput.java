package com.inupro.inusidian.input;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DeckInput {

    private Integer id;

    private Integer userId;

    @NotBlank
    private String deckName;

    @NotBlank
    private String deckDescription;
}
