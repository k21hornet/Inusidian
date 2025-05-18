package com.inupro.inusidian.repository;

import com.inupro.inusidian.entity.Card;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CardRepository extends JpaRepository<Card, Integer> {
    List<Card> findAllByDeckId(int id);
}

