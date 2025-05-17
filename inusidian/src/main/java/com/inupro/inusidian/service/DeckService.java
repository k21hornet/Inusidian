package com.inupro.inusidian.service;

import com.inupro.inusidian.entity.Deck;
import com.inupro.inusidian.entity.DeckAttribute;
import com.inupro.inusidian.entity.User;
import com.inupro.inusidian.entity.dto.DeckDTO;
import com.inupro.inusidian.entity.dto.DeckDetailsDTO;
import com.inupro.inusidian.input.DeckInput;
import com.inupro.inusidian.repository.DeckAttributeRepository;
import com.inupro.inusidian.repository.DeckRepository;
import com.inupro.inusidian.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class DeckService {
    private final DeckRepository deckRepository;
    private final DeckAttributeRepository deckAttributeRepository;
    private final UserRepository userRepository;
    private final DeckAttributeService deckAttributeService;

    public DeckService(DeckRepository deckRepository, DeckAttributeRepository deckAttributeRepository, UserRepository userRepository, DeckAttributeService deckAttributeService) {
        this.deckRepository = deckRepository;
        this.deckAttributeRepository = deckAttributeRepository;
        this.userRepository = userRepository;
        this.deckAttributeService = deckAttributeService;
    }

    public List<DeckDTO> findAllByUserId(int userId) {
        return deckRepository.findAllByUserId(userId);
    }

    public DeckDetailsDTO findById(int id) {
        Optional<Deck> deckOptional = deckRepository.findById(id);
        if (deckOptional.isEmpty()) throw new RuntimeException();

        Deck deck = deckOptional.get();
        DeckDetailsDTO dto = new DeckDetailsDTO();
        dto.setId(deck.getId());
        dto.setUserId(deck.getUserId());
        dto.setDeckName(deck.getDeckName());
        dto.setDeckDescription(deck.getDeckDescription());
        dto.setDeckAttributeDTOs(deckAttributeService.findAllByDeckId(id));
        dto.setCreatedAt(deck.getCreatedAt());
        dto.setUpdatedAt(deck.getUpdatedAt());

        return dto;
    }

    @Transactional
    public void createDeck(DeckInput deckInput) {
        Optional<User> userOptional = userRepository.findById(deckInput.getUserId());
        if (userOptional.isEmpty()) throw new RuntimeException();

        // デッキ新規作成
        Deck deck = new Deck();
        deck.setUserId(userOptional.get().getId());
        deck.setDeckName(deckInput.getDeckName());
        deck.setDeckDescription(deckInput.getDeckDescription());
        deck = deckRepository.save(deck);

        // デッキのデフォルト属性を作成
        DeckAttribute frontDeckAttribute = new DeckAttribute();
        frontDeckAttribute.setDeck(deck);
        frontDeckAttribute.setAttributeName("Front");
        frontDeckAttribute.setIsFront(1);
        frontDeckAttribute.setIsPrimary(1);
        deckAttributeRepository.save(frontDeckAttribute);

        DeckAttribute backDeckAttribute = new DeckAttribute();
        backDeckAttribute.setDeck(deck);
        backDeckAttribute.setAttributeName("Back");
        backDeckAttribute.setIsFront(0);
        backDeckAttribute.setIsPrimary(1);
        deckAttributeRepository.save(backDeckAttribute);
    }
}
