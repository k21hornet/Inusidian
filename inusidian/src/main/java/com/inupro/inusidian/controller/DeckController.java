package com.inupro.inusidian.controller;

import com.inupro.inusidian.entity.dto.DeckDTO;
import com.inupro.inusidian.input.DeckInput;
import com.inupro.inusidian.service.DeckService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deck")
public class DeckController {
    private final DeckService deckService;

    public DeckController(DeckService deckService) {
        this.deckService = deckService;
    }

    @GetMapping("/decks/{userId}")
    public List<DeckDTO> decks(@PathVariable int userId) {
        return deckService.findAllByUserId(userId);
    }

    @GetMapping("/{id}")
    public DeckDTO getDeck(@PathVariable int id) {
        return deckService.findById(id);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createDeck(
            @Validated @RequestBody DeckInput deckInput,
            BindingResult result
    ) {
        if (result.hasErrors()) return ResponseEntity.badRequest().body(result.getAllErrors());

        deckService.createDeck(deckInput);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/update")
    public ResponseEntity<?> updateDeck(
            @Validated @RequestBody DeckInput deckInput,
            BindingResult result
    ) {
        if (result.hasErrors()) return ResponseEntity.badRequest().body(result.getAllErrors());

        deckService.updateDeck(deckInput);
        return ResponseEntity.ok().build();
    }
}
