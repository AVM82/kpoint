package ua.in.kp.dto.project;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import ua.in.kp.validator.CollectionLength;

import java.util.Map;
import java.util.Set;

public record ProjectChangeDto(
        @NotBlank
        @Size(max = 30)
        String title,

        @NotBlank(message = "{project.description.not.null}")
        @Size(max = 3000, message = "{project.description.max}")
        String description,

        @NotEmpty(message = "{project.tag.not.null}")
        @CollectionLength(min = 1, max = 5, message = "{project.tag.not.null}")
        Set<String> tags,

        @NotNull
        Map<String, String> networksLinks
) {
}
