package ua.in.kp.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import ua.in.kp.enumeration.SocialNetworkName;
import ua.in.kp.validator.CollectionLength;
import ua.in.kp.validator.FieldMatch;

import java.util.Map;
import java.util.Set;

@FieldMatch(
        field = "password",
        fieldMatch = "repeatedPassword",
        message = "{validation.constraint.passwords-dont-match.message}")
public record UserRegisterRequestDto(
        @Size(min = 2, message = "username should have at least 2 characters")
        @NotEmpty
        String username,
        @NotEmpty
        String password,
        String repeatedPassword,
        @Email(message = "email should be a valid email format")
        @NotEmpty(message = "email should not be null or empty")
        String email,
        @NotEmpty
        String firstName,
        @NotEmpty
        String lastName,
        String avatarImgUrl,
        @Size(max = 60)
        String description,
        @CollectionLength(min = 1, max = 10, message = "tags should be from {min} to {max}")
        Set<String> tags,
        Map<SocialNetworkName, String> socialNetworks
) {
}
