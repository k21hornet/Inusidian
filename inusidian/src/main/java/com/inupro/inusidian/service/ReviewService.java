package com.inupro.inusidian.service;

import com.inupro.inusidian.entity.ReviewInterval;
import com.inupro.inusidian.entity.dto.ReviewIntervalDTO;
import com.inupro.inusidian.repository.ReviewIntervalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewIntervalRepository reviewIntervalRepository;
    private final CardService cardService;

    public List<ReviewIntervalDTO> findDueCards(int deckId) {
        List<ReviewInterval> reviewIntervals = reviewIntervalRepository.findDueCards(deckId, LocalDateTime.now());

        List<ReviewIntervalDTO> DTOs = new ArrayList<>();
        for (ReviewInterval interval : reviewIntervals) {
            DTOs.add(createDTO(interval));
        }
        return DTOs;
    }

    /**
     * 問題に正解した時の処理
     * 成功カウントを一つ増やし、次の出題日を決める
     * @param id
     */
    public void success(int id) {
        ReviewInterval reviewInterval = reviewIntervalRepository.findById(id)
                .orElseThrow(RuntimeException::new);
        int count = reviewInterval.getSuccessCount();
        reviewInterval.setNextReviewDate(calcNextReviewDate(count));
        reviewInterval.setSuccessCount(count+1);

        reviewIntervalRepository.save(reviewInterval);
    }

    /**
     * 不正解の場合、正解記録をリセット
     * @param id
     */
    public void failure(int id) {
        ReviewInterval reviewInterval = reviewIntervalRepository.findById(id)
                .orElseThrow(RuntimeException::new);
        reviewInterval.setSuccessCount(0);
        reviewInterval.setNextReviewDate(LocalDateTime.now());

        reviewIntervalRepository.save(reviewInterval);
    }

    public ReviewIntervalDTO createDTO(ReviewInterval reviewInterval) {
        return new ReviewIntervalDTO(
                reviewInterval.getId(),
                cardService.createDTO(reviewInterval.getCard()),
                reviewInterval.getSuccessCount(),
                reviewInterval.getNextReviewDate(),
                reviewInterval.getCreatedAt(),
                reviewInterval.getUpdatedAt()
        );
    }

    /**
     * 成功回数に応じて次の出題日を設定
     * @param count
     * @return
     */
    private LocalDateTime calcNextReviewDate(int count) {
        switch (count) {
            case 0: return LocalDateTime.now();
            case 1: return LocalDateTime.now().plusDays(1);
            case 2: return LocalDateTime.now().plusDays(3);
            case 3: return LocalDateTime.now().plusDays(6);
            case 4: return LocalDateTime.now().plusDays(10);
            case 5: return LocalDateTime.now().plusDays(15);
            case 6: return LocalDateTime.now().plusDays(21);
            case 7: return LocalDateTime.now().plusDays(28);
            default: return LocalDateTime.now().plusDays(36);
        }
    }
}
