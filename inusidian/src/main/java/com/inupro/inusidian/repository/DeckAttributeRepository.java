package com.inupro.inusidian.repository;

import com.inupro.inusidian.entity.DeckAttribute;
import com.inupro.inusidian.entity.dto.DeckAttributeDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DeckAttributeRepository extends JpaRepository<DeckAttribute, Integer> {
    @Query("""
            SELECT new com.inupro.inusidian.entity.dto.DeckAttributeDTO(
                da.id,
                da.deck.id,
                da.attributeName,
                da.isFront,
                da.isPrimary,
                da.createdAt,
                da.updatedAt
            )
            FROM DeckAttribute da
            WHERE da.deck.id = :deckId
            """)
    List<DeckAttributeDTO> findAllByDeckId(int deckId);
}

