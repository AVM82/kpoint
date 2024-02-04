package ua.in.kp.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
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
public class JwtAuthFilter extends OncePerRequestFilter {
    private final UserDetailsService customUserDetailsService;
    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        String token = jwtUtil.getTokenFromRequest(request);
        if (token != null && !token.equals("null") && jwtUtil.validate(token)) {
            String subject = jwtUtil.getSubjectFromToken(token);
            Authentication authentication = getAuthentication(subject);
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
        filterChain.doFilter(request, response);
    }

    private Authentication getAuthentication(String subject) {
        UserDetails userDetails = customUserDetailsService.loadUserByUsername(subject);
        return new UsernamePasswordAuthenticationToken(
                subject, userDetails.getPassword(), userDetails.getAuthorities());
    }
}
