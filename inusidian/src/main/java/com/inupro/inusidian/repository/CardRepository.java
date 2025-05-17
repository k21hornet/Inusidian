package com.inupro.inusidian.repository;

import com.inupro.inusidian.entity.Card;
import com.inupro.inusidian.entity.dto.CardDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CardRepository extends JpaRepository<Card, Integer> {
    @Query("""
            SELECT new com.inupro.inusidian.entity.dto.CardDTO(
                c.id,
                c.deck.id,
                da.isFront,
                da.isPrimary,
                da.attributeName,
                cv.attributeValue,
                c.createdAt,
                c.updatedAt
            )
            FROM Card c
            JOIN c.cardValues cv
            JOIN cv.deckAttribute da
            WHERE c.deck.id = :id
            """)
    List<CardDTO> findAllByDeckIdWithCardValue(int id);
}

