package ua.in.kp.security;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthFilter extends OncePerRequestFilter {
    private final UserDetailsService customUserDetailsService;
    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        try {
            if (authHeader != null && !authHeader.isBlank() && authHeader.startsWith("Bearer")) {
                String jwt = jwtUtil.getTokenFromRequest(request);
                if (jwt != null && !jwt.isBlank() && !jwt.equals("null")) {
                    if (!jwtUtil.validate(jwt)) {
                        log.warn("Invalid JWT Token");
                        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    } else {
                        String subject = jwtUtil.getSubjectFromToken(jwt);
                        Authentication authentication = getAuthentication(subject);
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                    }
                }
            }
            filterChain.doFilter(request, response);
        } catch (JwtException ex) {
            log.warn("Invalid JWT Token", ex);
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        } catch (RuntimeException ex) {
            log.error("RuntimeException", ex);
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Runtime Exception");
        }

    }

    private Authentication getAuthentication(String subject) {
        UserDetails userDetails = customUserDetailsService.loadUserByUsername(subject);
        return new UsernamePasswordAuthenticationToken(
                subject, userDetails.getPassword(), userDetails.getAuthorities());
    }
}
