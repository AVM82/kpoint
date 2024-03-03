package ua.in.kp.dto.profile;

import java.util.Set;

public record UserChangeDto(
        String username,

        String email,

        String firstName,

        String lastName,

        Set<String> tags
) {
}
