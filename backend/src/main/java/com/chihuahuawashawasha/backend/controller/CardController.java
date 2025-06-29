package com.chihuahuawashawasha.backend.controller;

import com.chihuahuawashawasha.backend.entity.dto.CardDTO;
import com.chihuahuawashawasha.backend.input.CardInput;
import com.chihuahuawashawasha.backend.service.CardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

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
