package ua.in.kp.dto.suggestion;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SuggestionCreateRequestDto(
        @NotBlank(message = "{validation.suggestions.blank}")
        @Size(max = 200, message = "{validation.suggestions.max.size}")
        String suggestion) {
}
