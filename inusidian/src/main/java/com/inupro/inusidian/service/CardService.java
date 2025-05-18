package com.inupro.inusidian.service;

import com.inupro.inusidian.entity.Card;
import com.inupro.inusidian.entity.Deck;
import com.inupro.inusidian.entity.dto.CardDTO;
import com.inupro.inusidian.input.CardInput;
import com.inupro.inusidian.repository.CardRepository;
import com.inupro.inusidian.repository.DeckRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CardService {
    private final CardRepository cardRepository;
    private final DeckRepository deckRepository;

    public List<CardDTO> findAllByDeckId(int id) {
        List<Card> cards = cardRepository.findAllByDeckId(id);

        List<CardDTO> DTOs = new ArrayList<>();
        for (Card card : cards) {
            DTOs.add(createDTO(card));
        }
        return DTOs;
    }

    public CardDTO findById(int id) {
        Optional<Card> cardOptional = cardRepository.findById(id);
        if (cardOptional.isEmpty()) throw new RuntimeException();

        return createDTO(cardOptional.get());
    }

    public void create(CardInput input) {
        Optional<Deck> deckOptional = deckRepository.findById(input.getDeckId());
        if (deckOptional.isEmpty()) throw new RuntimeException();

        Deck deck = deckOptional.get();
        Card card = new Card();
        card.setId(input.getId());
        card.setDeck(deck);
        card.setSentence(input.getSentence());
        card.setWord(input.getWord());
        card.setPronounce(input.getPronounce());
        card.setMeaning(input.getMeaning());
        card.setTranslate(input.getTranslate());
        card.setCreatedAt(input.getCreatedAt());
        card.setUpdatedAt(input.getUpdatedAt());

        cardRepository.save(card);
    }

    public void update(CardInput input) {
        Optional<Card> cardOptional = cardRepository.findById(input.getId());
        if (cardOptional.isEmpty()) throw new RuntimeException();

        Card card = cardOptional.get();
        card.setSentence(input.getSentence());
        card.setWord(input.getWord());
        card.setPronounce(input.getPronounce());
        card.setMeaning(input.getMeaning());
        card.setTranslate(input.getTranslate());

        cardRepository.save(card);
    }


    public CardDTO createDTO(Card card) {
        CardDTO dto = new CardDTO();
        dto.setId(card.getId());
        dto.setDeckId(card.getDeck().getId());
        dto.setSentence(card.getSentence());
        dto.setWord(card.getWord());
        dto.setPronounce(card.getPronounce());
        dto.setMeaning(card.getMeaning());
        dto.setTranslate(card.getTranslate());
        dto.setCreatedAt(card.getCreatedAt());
        dto.setUpdatedAt(card.getUpdatedAt());

        return dto;
    }
}
