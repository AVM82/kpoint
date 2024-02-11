package ua.in.kp.dto.suggestion;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class SuggestionResponseDto {
    private String id;
    private SuggestionUserDto user;
    private String suggestion;
    private int likeCount;
    private LocalDateTime createdAt;
    private boolean liked;
}
