package ua.in.kp.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@Slf4j
public class SpaWebFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI().toLowerCase();
        log.info("SpaWebFilter path: " + path);

        if (!path.equals("/")
                && !path.startsWith("/api")
                && !path.startsWith("/swagger-ui")
                && !path.startsWith("/v3/api-docs")
                && !path.startsWith("/static")
                && !path.startsWith("/manifest.json")
                && !path.startsWith("/favicon.ico")
                && !path.startsWith("/robots.txt")
                && !path.endsWith("xml")
                && !path.endsWith("json")
                && !path.endsWith("jpg")
                && !path.endsWith("jpeg")
                && !path.endsWith("gif")
                && !path.endsWith("png")) {
            log.info("SpaWebFilter forwarding to /index.html from path: " + path);
            request.getRequestDispatcher("/index.html").forward(request, response);
            return;
        }

        log.info("SpaWebFilter sent along its way path: " + path);
        filterChain.doFilter(request, response);
    }

}
