package ua.in.kp.security;

import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeTokenRequest;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;
import ua.in.kp.dto.OAuthRequestDto;
import ua.in.kp.dto.user.UserLoginResponseDto;
import ua.in.kp.entity.ApplicantEntity;
import ua.in.kp.enumeration.UserRole;
import ua.in.kp.exception.ApplicationException;
import ua.in.kp.locale.Translator;
import ua.in.kp.service.AuthService;

import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class OAuth2GoogleServiceImpl implements OAuth2Service {

    private final AuthService authService;
    private final Translator translator;

    @Value("${oauth2.google.client-id}")
    private String clientId;
    @Value("${oauth2.google.client-secret}")
    private String clientSecret;
    @Value("${oauth2.redirect-uri}")
    private String redirectUri;

    @Override
    public UserLoginResponseDto handleRequest(OAuthRequestDto dto) throws AuthenticationException {
        GoogleIdToken idToken = getGoogleIdToken(dto.code());
        GoogleIdToken.Payload tokenPayload = idToken.getPayload();
        String userEmail = tokenPayload.getEmail();
        log.info("Verify user email {}", userEmail);
        if (!idToken.getPayload().getEmailVerified()) {
            log.warn("Email {} not verified", userEmail);
            throw new ApplicationException(HttpStatus.UNAUTHORIZED, translator.getLocaleMessage(
                    "exception.oauth2.email-not-verified", userEmail));
        }
        return authService.oauth2Login(buildApplicant(idToken));
    }

    private GoogleIdToken getGoogleIdToken(String code) throws AuthenticationException {
        log.info("Get token by given code: {} and redirect uri: {}", code, redirectUri);
        try {
            return new GoogleAuthorizationCodeTokenRequest(
                    new NetHttpTransport(),
                    new GsonFactory(),
                    clientId,
                    clientSecret,
                    code,
                    redirectUri
            ).execute().parseIdToken();
        } catch (Exception e) {
            log.warn("Authentication failed!", e);
            throw new ApplicationException(HttpStatus.UNAUTHORIZED, translator.getLocaleMessage(
                    "exception.oauth2.authentication-failed", e.getMessage()));
        }
    }

    private ApplicantEntity buildApplicant(GoogleIdToken idToken) {
        return ApplicantEntity.builder()
                .email(idToken.getPayload().getEmail())
                .avatarImgUrl((String) idToken.getPayload().get("picture"))
                .username((String) idToken.getPayload().get("given_name"))
                .roles(Set.of(UserRole.GUEST))
                .build();
    }
}
