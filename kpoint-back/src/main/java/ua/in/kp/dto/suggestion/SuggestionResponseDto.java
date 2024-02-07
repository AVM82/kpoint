package ua.in.kp.dto.suggestion;

import java.time.LocalDateTime;

public record SuggestionResponseDto(String id, SuggestionUserDto user, String suggestion, int likeCount,
        LocalDateTime createdAt) {
}
