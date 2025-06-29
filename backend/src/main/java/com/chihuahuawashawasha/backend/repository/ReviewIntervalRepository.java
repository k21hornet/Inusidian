package com.chihuahuawashawasha.backend.repository;

import com.chihuahuawashawasha.backend.entity.ReviewInterval;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface ReviewIntervalRepository extends JpaRepository<ReviewInterval, Integer> {
    @Query("""
            SELECT r FROM ReviewInterval r
            WHERE r.card.deck.id = :deckId
            AND r.nextReviewDate <= :now
            """)
    List<ReviewInterval> findDueCards(int deckId, LocalDate now);
}

