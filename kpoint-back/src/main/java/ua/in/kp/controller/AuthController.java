package ua.in.kp.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ua.in.kp.dto.OAuthRequestDto;
import ua.in.kp.dto.user.UserLoginRequestDto;
import ua.in.kp.dto.user.UserLoginResponseDto;
import ua.in.kp.dto.user.UserRegisterRequestDto;
import ua.in.kp.dto.user.UserResponseDto;
import ua.in.kp.security.OAuth2Service;
import ua.in.kp.service.AuthService;

import javax.naming.AuthenticationException;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {
    private final AuthService authService;
    private final OAuth2Service oauth2Service;

    @PostMapping("/register")
    public ResponseEntity<UserResponseDto> register(
            @RequestBody @Valid UserRegisterRequestDto userRegisterRequestDto) {
        return new ResponseEntity<>(authService.register(userRegisterRequestDto),
                HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<UserLoginResponseDto> login(@RequestBody UserLoginRequestDto dto) {
        return ResponseEntity.ok(authService.login(dto));
    }

    @PostMapping("/oauth2")
    public ResponseEntity<UserLoginResponseDto> handleOAuth2Request(@RequestBody OAuthRequestDto dto)
            throws AuthenticationException {
        return ResponseEntity.ok(oauth2Service.handleRequest(dto));
    }
}
