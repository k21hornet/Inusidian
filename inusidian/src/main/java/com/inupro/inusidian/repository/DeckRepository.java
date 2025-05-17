package com.inupro.inusidian.repository;

import com.inupro.inusidian.entity.Deck;
import com.inupro.inusidian.entity.dto.DeckDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DeckRepository extends JpaRepository<Deck, Integer> {
    @Query("""
            SELECT new com.inupro.inusidian.entity.dto.DeckDTO(
                d.id,
                d.userId,
                d.deckName,
                d.deckDescription,
                d.createdAt,
                d.updatedAt
            )
            FROM Deck d
            WHERE d.userId = :userId
            """)
    List<DeckDTO> findAllByUserId(int userId);
}

