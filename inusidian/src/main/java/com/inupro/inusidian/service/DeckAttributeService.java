package com.inupro.inusidian.service;

import com.inupro.inusidian.entity.DeckAttribute;
import com.inupro.inusidian.entity.dto.DeckAttributeDTO;
import org.springframework.stereotype.Service;

@Service
public class DeckAttributeService {

    public DeckAttributeDTO createDeckAttributeDTO(DeckAttribute att) {
        DeckAttributeDTO dto = new DeckAttributeDTO();
        dto.setId(att.getId());
        dto.setDeckId(att.getDeck().getId());
        dto.setAttributeName(att.getAttributeName());
        dto.setIsFront(att.getIsFront());
        dto.setIsPrimary(att.getIsPrimary());
        dto.setCreatedAt(att.getCreatedAt());
        dto.setUpdatedAt(att.getUpdatedAt());
        return dto;
    }
}
