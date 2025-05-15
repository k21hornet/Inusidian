package com.inupro.inusidian.repository;

import com.inupro.inusidian.entity.Deck;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DeckRepository extends JpaRepository<Deck, Integer> {
    List<Deck> findAllByUserId(@Param("userId") int userId);
}

