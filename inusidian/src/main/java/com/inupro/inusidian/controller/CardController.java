package com.inupro.inusidian.controller;

import com.inupro.inusidian.entity.Card;
import com.inupro.inusidian.entity.dto.CardDTO;
import com.inupro.inusidian.service.CardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/card")
@RequiredArgsConstructor
public class CardController {
    private final CardService cardService;

    @GetMapping("/cards/{deckId}")
    public List<CardDTO> cards(@PathVariable int deckId) {
        return cardService.findAllByDeckId(deckId);
    }
}
