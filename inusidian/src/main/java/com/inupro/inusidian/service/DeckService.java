package com.inupro.inusidian.service;

import com.inupro.inusidian.entity.Deck;
import com.inupro.inusidian.entity.User;
import com.inupro.inusidian.entity.dto.DeckDTO;
import com.inupro.inusidian.entity.dto.UserDTO;
import com.inupro.inusidian.input.DeckInput;
import com.inupro.inusidian.repository.DeckRepository;
import com.inupro.inusidian.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class DeckService {
    private final DeckRepository deckRepository;
    private final UserRepository userRepository;

    public DeckService(DeckRepository deckRepository, UserRepository userRepository) {
        this.deckRepository = deckRepository;
        this.userRepository = userRepository;
    }


    public List<DeckDTO> findAllByUserId(int userId) {
        List<Deck> decks = deckRepository.findAllByUserId(userId);

        List<DeckDTO> deckDTOs = new ArrayList<>();
        for (Deck deck : decks) {
            UserDTO userDTO = new UserDTO();
            userDTO.setId(deck.getUser().getId());
            userDTO.setUsername(deck.getUser().getUsername());
            userDTO.setEmail(deck.getUser().getEmail());
            userDTO.setCreatedAt(deck.getUser().getCreatedAt());
            userDTO.setUpdatedAt(deck.getUser().getUpdatedAt());

            DeckDTO deckDTO = new DeckDTO();
            deckDTO.setId(deck.getId());
            deckDTO.setUser(userDTO);
            deckDTO.setDeckName(deck.getDeckName());
            deckDTO.setDeckDescription(deck.getDeckDescription());
            deckDTO.setCreatedAt(deck.getCreatedAt());
            deckDTO.setUpdatedAt(deck.getUpdatedAt());

            deckDTOs.add(deckDTO);
        }
        return deckDTOs;
    }

    public void createDeck(DeckInput deckInput) {
        Optional<User> userOptional = userRepository.findById(deckInput.getUserId());
        if (userOptional.isEmpty()) throw new RuntimeException();

        Deck deck = new Deck();
        deck.setUser(userOptional.get());
        deck.setDeckName(deckInput.getDeckName());
        deck.setDeckDescription(deckInput.getDeckDescription());
        deck.setCreatedAt(LocalDateTime.now());
        deck.setUpdatedAt(LocalDateTime.now());
        deckRepository.save(deck);
    }
}
