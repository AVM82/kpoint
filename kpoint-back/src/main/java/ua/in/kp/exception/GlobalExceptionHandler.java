package ua.in.kp.exception;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import ua.in.kp.locale.Translator;

import java.net.URI;
import java.sql.SQLException;
import java.util.List;

@ControllerAdvice
@RequiredArgsConstructor
@Slf4j
public class GlobalExceptionHandler {

    private final Translator translator;

    @ExceptionHandler({ MethodArgumentNotValidException.class })
    protected ResponseEntity<Object> handleMethodArgumentNotValidException(
            final MethodArgumentNotValidException ex) {
        log.error("handleApplicationException", ex);
        List<String> errors = ex.getBindingResult().getFieldErrors()
                .stream().map(FieldError::getDefaultMessage).toList();
        return createApiError(HttpStatus.BAD_REQUEST, errors.get(0));
    }

    @ExceptionHandler({ ApplicationException.class })
    protected ResponseEntity<Object> handleApplicationException(final ApplicationException ex) {
        log.error("handleApplicationException", ex);
        return createApiError(ex.getStatus(), ex.getLocalizedMessage());
    }

    @ExceptionHandler(value = {RuntimeException.class})
    protected ResponseEntity<Object> handleDataProcessingException(RuntimeException ex) {
        log.error("handleDataProcessingException", ex);
        return createApiError(HttpStatus.BAD_REQUEST, ex.getLocalizedMessage());
    }

    @ExceptionHandler(value = {AccessDeniedException.class})
    protected ResponseEntity<Object> handleAuthorizationException(RuntimeException ex) {
        log.warn("handleAuthorizationException", ex);
        return createApiError(HttpStatus.FORBIDDEN, ex.getLocalizedMessage());
    }

    @ExceptionHandler(value = {BadCredentialsException.class})
    protected ResponseEntity<Object> handleBadCredentialsException(BadCredentialsException ex) {
        log.warn("handleBadCredentialsException", ex);
        return createApiError(HttpStatus.UNAUTHORIZED, translator.getLocaleMessage("exception.user.bad-credentials"));
    }

    @ExceptionHandler(value = {AuthenticationException.class})
    protected ResponseEntity<Object> handleAuthenticationException(RuntimeException ex) {
        log.warn("handleAuthenticationException", ex);
        return createApiError(HttpStatus.FORBIDDEN, ex.getLocalizedMessage());
    }

    @ExceptionHandler(SQLException.class)
    protected ResponseEntity<Object> handleSqlException(SQLException ex) {
        log.warn("handleSqlException", ex);
        ProblemDetail problemDetail =
                ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, ex.getMessage());
        problemDetail.setType(
                URI.create(
                        "https://docs.intersystems.com/latest/csp/docbook/DocBook.UI.Page.cls?KEY=RERR_sql"));
        problemDetail.setProperty("SQL error code", ex.getErrorCode());
        return ResponseEntity.of(problemDetail).build();
    }

    private ResponseEntity<Object> createApiError(HttpStatus status, String details) {
        final ApiError apiError = new ApiError(details, details, status);
        return new ResponseEntity<>(apiError, new HttpHeaders(), apiError.getStatus());
    }
}
