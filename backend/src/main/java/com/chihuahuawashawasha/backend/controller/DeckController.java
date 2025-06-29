package com.chihuahuawashawasha.backend.controller;

import com.chihuahuawashawasha.backend.entity.dto.DeckDTO;
import com.chihuahuawashawasha.backend.input.DeckInput;
import com.chihuahuawashawasha.backend.service.DeckService;
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

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteDeck(@PathVariable int id) {
        deckService.deleteDeck(id);
        return ResponseEntity.ok().build();
    }
}
