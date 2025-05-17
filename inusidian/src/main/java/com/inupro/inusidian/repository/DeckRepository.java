package com.inupro.inusidian.repository;

import com.inupro.inusidian.entity.Deck;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DeckRepository extends JpaRepository<Deck, Integer> {
    List<Deck> findAllByUserId(int userId);
}

