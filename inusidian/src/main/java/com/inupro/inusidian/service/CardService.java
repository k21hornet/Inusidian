package com.inupro.inusidian.service;

import com.inupro.inusidian.entity.Card;
import com.inupro.inusidian.entity.dto.CardDTO;
import com.inupro.inusidian.repository.CardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CardService {
    private final CardRepository cardRepository;

    public List<CardDTO> findAllByDeckId(int id) {
        return cardRepository.findAllByDeckIdWithCardValue(id);
    }
}
