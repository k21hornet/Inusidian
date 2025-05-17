package com.inupro.inusidian.service;

import com.inupro.inusidian.entity.DeckAttribute;
import com.inupro.inusidian.entity.dto.DeckAttributeDTO;
import com.inupro.inusidian.repository.DeckAttributeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DeckAttributeService {
    private final DeckAttributeRepository deckAttributeRepository;

    public DeckAttributeService(DeckAttributeRepository deckAttributeRepository) {
        this.deckAttributeRepository = deckAttributeRepository;
    }

    public List<DeckAttributeDTO> findAllByDeckId(int deckId) {
        return deckAttributeRepository.findAllByDeckId(deckId);
    }
}
