package ua.in.kp.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import ua.in.kp.exception.ApplicationException;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

@Component
@Slf4j
@RequiredArgsConstructor
public class JwtUtil {
    private static final String TOKEN_PREFIX = "Bearer ";
    private static final String HEADER_NAME = "Authorization";
    private final Encryptor encryptor;
    private  SecretKey secretKey;
    @Value("${jwt.token.expiration.time}")
    private Long expirationTime;
    @Value("${jwt.token.secret}")
    private String secret;

    @PostConstruct
    private void init() {
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(String subject) {
        LocalDateTime currentDateTime = LocalDateTime.now();
        return Jwts.builder()
                .subject(encryptor.encrypt(subject))
                .issuedAt(mapToDate(currentDateTime))
                .expiration(mapToDate(currentDateTime.plusMinutes(expirationTime)))
                .signWith(secretKey)
                .compact();
    }

    public String getTokenFromRequest(HttpServletRequest request) {
        String header = request.getHeader(HEADER_NAME);
        if (StringUtils.hasText(header) && header.startsWith(TOKEN_PREFIX)) {
            return header.substring(TOKEN_PREFIX.length()).trim();
        }
        return null;
    }

    public boolean validate(String token) {
        return getClaims(token).getExpiration().after(new Date());
    }

    public Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String getSubjectFromToken(String token) {
        try {
            return encryptor.decrypt(getClaims(token).getSubject());
        } catch (Exception e) {
            log.warn("Can't decrypt subject from token", e);
            throw new ApplicationException(HttpStatus.UNAUTHORIZED, "Can't decrypt subject from token");
        }
    }

    private Date mapToDate(LocalDateTime currentDateTime) {
        return Date.from(currentDateTime.atZone(ZoneId.systemDefault()).toInstant());
    }
}
