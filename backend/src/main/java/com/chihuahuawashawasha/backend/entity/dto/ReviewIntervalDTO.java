package com.chihuahuawashawasha.backend.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ReviewIntervalDTO {

    private Integer id;

    private CardDTO card;

    private Integer successCount;

    private LocalDate nextReviewDate;

    private Integer nextDateDiff;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}
