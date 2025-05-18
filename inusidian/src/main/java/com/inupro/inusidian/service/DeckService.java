package com.inupro.inusidian.service;

import com.inupro.inusidian.entity.Deck;
import com.inupro.inusidian.entity.User;
import com.inupro.inusidian.entity.dto.DeckDTO;
import com.inupro.inusidian.input.DeckInput;
import com.inupro.inusidian.repository.DeckRepository;
import com.inupro.inusidian.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DeckService {
    private final CardService cardService;
    private final DeckRepository deckRepository;
    private final UserRepository userRepository;

    public List<DeckDTO> findAllByUserId(int userId) {
        List<Deck> decks = deckRepository.findAllByUserId(userId);

        List<DeckDTO> DTOs = new ArrayList<>();
        for (Deck deck : decks) {
            DTOs.add(createDTO(deck));
        }
        return DTOs;
    }

    public DeckDTO findById(int id) {
        Optional<Deck> deckOptional = deckRepository.findById(id);
        if (deckOptional.isEmpty()) throw new RuntimeException();

        return createDTO(deckOptional.get());
    }

    public void createDeck(DeckInput deckInput) {
        Optional<User> userOptional = userRepository.findById(deckInput.getUserId());
        if (userOptional.isEmpty()) throw new RuntimeException();

        Deck deck = new Deck();
        deck.setUserId(userOptional.get().getId());
        deck.setDeckName(deckInput.getDeckName());
        deck.setDeckDescription(deckInput.getDeckDescription());
        deckRepository.save(deck);
    }

    public void updateDeck(DeckInput deckInput) {
        Optional<Deck> deckOptional = deckRepository.findById(deckInput.getId());
        if (deckOptional.isEmpty()) throw new RuntimeException();

        Deck deck = deckOptional.get();
        deck.setDeckName(deckInput.getDeckName());
        deck.setDeckDescription(deckInput.getDeckDescription());
        deckRepository.save(deck);
    }


    public DeckDTO createDTO(Deck deck) {
        DeckDTO dto = new DeckDTO();
        dto.setId(deck.getId());
        dto.setUserId(deck.getUserId());
        dto.setDeckName(deck.getDeckName());
        dto.setDeckDescription(deck.getDeckDescription());
        dto.setCards(cardService.findAllByDeckId(deck.getId()));
        dto.setCreatedAt(deck.getCreatedAt());
        dto.setUpdatedAt(deck.getUpdatedAt());

        return dto;
    }
}
