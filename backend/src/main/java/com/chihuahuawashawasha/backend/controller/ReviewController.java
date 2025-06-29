package com.chihuahuawashawasha.backend.controller;

import com.chihuahuawashawasha.backend.entity.dto.ReviewIntervalDTO;
import com.chihuahuawashawasha.backend.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/review")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;

    @GetMapping("/due/{deckId}")
    public List<ReviewIntervalDTO> getReviewInterval(@PathVariable int deckId) {
        return reviewService.findDueCards(deckId);
    }

    @PostMapping("/{id}/success")
    public ResponseEntity<?> reviewSuccess(@PathVariable int id) {
        reviewService.success(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/failure")
    public ResponseEntity<?> reviewFailure(@PathVariable int id) {
        reviewService.failure(id);
        return ResponseEntity.ok().build();
    }
}
