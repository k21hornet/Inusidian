package com.chihuahuawashawasha.backend.service;

import com.chihuahuawashawasha.backend.entity.Deck;
import com.chihuahuawashawasha.backend.entity.User;
import com.chihuahuawashawasha.backend.entity.dto.DeckDTO;
import com.chihuahuawashawasha.backend.input.DeckInput;
import com.chihuahuawashawasha.backend.repository.DeckRepository;
import com.chihuahuawashawasha.backend.repository.UserRepository;
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

    public void deleteDeck(int id) {
        deckRepository.deleteById(id);
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
