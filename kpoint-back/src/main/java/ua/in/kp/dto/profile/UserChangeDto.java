package ua.in.kp.dto.profile;

public record UserChangeDto(
        String username,
        String email,
        String firstName,
        String lastName
) {
}
