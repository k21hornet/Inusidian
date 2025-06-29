package com.chihuahuawashawasha.backend.repository;

import com.chihuahuawashawasha.backend.entity.Deck;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DeckRepository extends JpaRepository<Deck, Integer> {
    List<Deck> findAllByUserId(int userId);
}

