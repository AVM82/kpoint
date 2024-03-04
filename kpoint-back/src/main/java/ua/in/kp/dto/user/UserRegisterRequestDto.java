package ua.in.kp.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import ua.in.kp.enumeration.SocialNetworkName;
import ua.in.kp.validator.CollectionLength;

import java.util.Map;
import java.util.Set;

public record UserRegisterRequestDto(
        @Size(min = 2, message = "username should have at least 2 characters")
        @NotEmpty
        String username,
        @NotEmpty
        String password,
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
