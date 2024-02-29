package ua.in.kp.security;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import ua.in.kp.exception.ApplicationException;
import ua.in.kp.locale.Translator;
import ua.in.kp.repository.UserRepository;

@Component
@RequiredArgsConstructor
@Slf4j
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;
    private final Translator translator;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        log.info("loadUserByUsername {}", email);
        userRepository.findBannedUserByEmail(email)
                .ifPresent(user -> {
                    log.warn("User by email {} is banned", email);
                    throw new ApplicationException(HttpStatus.NOT_FOUND, translator.getLocaleMessage(
                            "exception.user.banned", "email", email));
                });
        return userRepository.findByEmailFetchRoles(email)
                .orElseThrow(() -> {
                    log.warn("Authentication Failed. User {} not found", email);
                    return new ApplicationException(HttpStatus.NOT_FOUND, translator.getLocaleMessage(
                            "exception.user.not-found", "email", email));
                });
    }
}
