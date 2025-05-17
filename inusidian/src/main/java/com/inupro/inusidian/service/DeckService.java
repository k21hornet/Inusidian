package com.inupro.inusidian.service;

import com.inupro.inusidian.entity.Deck;
import com.inupro.inusidian.entity.DeckAttribute;
import com.inupro.inusidian.entity.User;
import com.inupro.inusidian.entity.dto.DeckAttributeDTO;
import com.inupro.inusidian.entity.dto.DeckDTO;
import com.inupro.inusidian.entity.dto.DeckValueDTO;
import com.inupro.inusidian.input.DeckInput;
import com.inupro.inusidian.repository.DeckAttributeRepository;
import com.inupro.inusidian.repository.DeckRepository;
import com.inupro.inusidian.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
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
        List<Deck> decks = deckRepository.findAllByUserId(userId);

        List<DeckDTO> deckDTOs = new ArrayList<>();
        for (Deck deck : decks) {
            deckDTOs.add(createDeckDTO(deck));
        }
        return deckDTOs;
    }

    public DeckValueDTO findById(int id) {
        Optional<Deck> deckOptional = deckRepository.findById(id);
        if (deckOptional.isEmpty()) throw new RuntimeException();
        Deck deck = deckOptional.get();

        // 循環参照を防ぐために一生懸命DTO作ったが、もっといい方法ないんかな
        // エンティティにリレーション書かなければ圧倒的に楽になるけど教科書的ではないし
        DeckValueDTO deckValueDTO = new DeckValueDTO();
        deckValueDTO.setDeckDTO(createDeckDTO(deck));
        return deckValueDTO;
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

    public DeckDTO createDeckDTO(Deck deck) {
        DeckDTO dto = new DeckDTO();
        dto.setId(deck.getId());
        dto.setUserId(deck.getUserId());
        dto.setDeckName(deck.getDeckName());
        dto.setDeckDescription(deck.getDeckDescription());
        dto.setCreatedAt(deck.getCreatedAt());
        dto.setUpdatedAt(deck.getUpdatedAt());
        return dto;
    }
}
