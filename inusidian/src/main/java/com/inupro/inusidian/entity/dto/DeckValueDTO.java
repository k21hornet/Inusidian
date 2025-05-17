package com.inupro.inusidian.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DeckValueDTO {

    private DeckDTO deckDTO;

    private List<DeckAttributeDTO> deckAttributeDTOs;

}
