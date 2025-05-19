package com.inupro.inusidian.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ReviewIntervalDTO {

    private Integer id;

    private CardDTO card;

    private Integer successCount;

    private LocalDateTime nextReviewDate;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}
