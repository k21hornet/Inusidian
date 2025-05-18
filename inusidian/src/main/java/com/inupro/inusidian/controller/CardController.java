package com.inupro.inusidian.controller;

import com.inupro.inusidian.entity.Card;
import com.inupro.inusidian.entity.dto.CardDTO;
import com.inupro.inusidian.input.CardInput;
import com.inupro.inusidian.service.CardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/card")
@RequiredArgsConstructor
public class CardController {
    private final CardService cardService;

    @PostMapping("/create")
    public ResponseEntity<?> createCard(
            @Validated @RequestBody CardInput cardInput,
            BindingResult result
            ) {
        if (result.hasErrors()) return ResponseEntity.badRequest().body(result.getAllErrors());

        cardService.create(cardInput);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public CardDTO getCard(@PathVariable int id) {
        return cardService.findById(id);
    }

    @PostMapping("/update")
    public ResponseEntity<?> updateCard(
            @Validated @RequestBody CardInput cardInput,
            BindingResult result
    ) {
        if (result.hasErrors()) return ResponseEntity.badRequest().body(result.getAllErrors());

        cardService.update(cardInput);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteCard(@PathVariable int id) {
        cardService.deleteCard(id);
        return ResponseEntity.ok().build();
    }
}
