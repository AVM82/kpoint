package ua.in.kp.security;

import ua.in.kp.dto.OAuthRequestDto;
import ua.in.kp.dto.user.UserLoginResponseDto;

import javax.naming.AuthenticationException;

public interface OAuth2Service {

    UserLoginResponseDto handleRequest(OAuthRequestDto dto) throws AuthenticationException;
}
