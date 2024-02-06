package ua.in.kp.dto.suggestion;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SuggestionCreateRequestDto(@NotBlank @Size(max = 200) String suggestion) {
}
