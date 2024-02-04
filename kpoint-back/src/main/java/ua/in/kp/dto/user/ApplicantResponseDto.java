package ua.in.kp.dto.user;

public record ApplicantResponseDto(
        String email,
        String username,
        String imgUrl,
        String[] roles
) {
}
