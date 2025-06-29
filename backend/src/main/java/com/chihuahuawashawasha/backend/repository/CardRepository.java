package com.chihuahuawashawasha.backend.repository;

import com.chihuahuawashawasha.backend.entity.Card;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CardRepository extends JpaRepository<Card, Integer> {
    @Query("SELECT c FROM Card c WHERE c.deck.id = :id ORDER BY c.id DESC")
    List<Card> findAllByDeckId(int id);
}

