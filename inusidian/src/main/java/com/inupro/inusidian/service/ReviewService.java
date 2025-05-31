package com.inupro.inusidian.service;

import com.inupro.inusidian.entity.ReviewInterval;
import com.inupro.inusidian.entity.dto.ReviewIntervalDTO;
import com.inupro.inusidian.repository.ReviewIntervalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewIntervalRepository reviewIntervalRepository;
    private final CardService cardService;

    public List<ReviewIntervalDTO> findDueCards(int deckId) {
        List<ReviewInterval> reviewIntervals = reviewIntervalRepository.findDueCards(deckId, LocalDate.now());

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
        int count = reviewInterval.getSuccessCount() + 1;
        reviewInterval.setNextReviewDate(calcNextReviewDate(count));
        reviewInterval.setSuccessCount(count);

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
        reviewInterval.setNextReviewDate(LocalDate.now());

        reviewIntervalRepository.save(reviewInterval);
    }

    public ReviewIntervalDTO createDTO(ReviewInterval reviewInterval) {
        return new ReviewIntervalDTO(
                reviewInterval.getId(),
                cardService.createDTO(reviewInterval.getCard()),
                reviewInterval.getSuccessCount(),
                reviewInterval.getNextReviewDate(),
                calcNextDateDiff(reviewInterval.getSuccessCount()),
                reviewInterval.getCreatedAt(),
                reviewInterval.getUpdatedAt()
        );
    }

    /**
     * 成功回数に応じて次の出題日を設定
     * @param count
     * @return
     */
    private LocalDate calcNextReviewDate(int count) {
        switch (count) {
            case 1: return LocalDate.now().plusDays(1);
            case 2: return LocalDate.now().plusDays(2);
            case 3: return LocalDate.now().plusDays(3);
            case 4: return LocalDate.now().plusDays(5);
            case 5: return LocalDate.now().plusDays(8);
            case 6: return LocalDate.now().plusDays(13);
            case 7: return LocalDate.now().plusDays(21);
            default: return LocalDate.now().plusDays(34);
        }
    }

    /**
     * 問題に正解した場合、次に出題されるまで何日か
     * @param count
     * @return
     */
    private int calcNextDateDiff(int count) {
        switch (count) {
            case 0: return 1;
            case 1: return 2;
            case 2: return 3;
            case 3: return 5;
            case 4: return 8;
            case 5: return 13;
            case 6: return 21;
            default: return 34;
        }
    }
}
