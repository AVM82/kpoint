package ua.in.kp.dto.project;

import java.util.Map;
import java.util.Set;

public record ProjectChangeDto(
        String title,

        String description,

        Set<String> tags,

        Map<String, String> networksLinks
) {
}
