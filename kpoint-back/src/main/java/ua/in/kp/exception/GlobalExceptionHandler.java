package ua.in.kp.exception;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import ua.in.kp.locale.Translator;

import java.net.URI;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@ControllerAdvice
@RequiredArgsConstructor
@Slf4j
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {
    private static final String TIMESTAMP_PROPERTY_NAME = "timestamp";
    private static final String REJECTED_VALUE_MSG_CODE =
            "validation.constraint.rejected-value.message";
    private final Translator translator;

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex,
            HttpHeaders headers,
            HttpStatusCode status,
            WebRequest request) {
        log.warn("handleMethodArgumentNotValid", ex);
        ProblemDetail problemDetail = ProblemDetail.forStatus(status);
        ex.getBindingResult().getAllErrors().forEach(error -> setError(problemDetail, error));
        return ResponseEntity.of(problemDetail).build();
    }

    @Override
    protected ResponseEntity<Object> handleExceptionInternal(
            Exception ex,
            Object body,
            HttpHeaders headers,
            HttpStatusCode statusCode,
            WebRequest request) {
        log.warn("handleExceptionInternal", ex);
        return createResponseEntity(statusCode, ex.getLocalizedMessage());
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

    @ExceptionHandler(value = {AuthenticationException.class})
    protected ResponseEntity<Object> handleAuthenticationException(RuntimeException ex) {
        log.warn("handleAuthenticationException", ex);
        return createApiError(HttpStatus.UNAUTHORIZED, ex.getLocalizedMessage());
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

    private ResponseEntity<Object> createResponseEntity(HttpStatusCode statusCode, String details) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(statusCode, details);
        problemDetail.setProperty(TIMESTAMP_PROPERTY_NAME,
                LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        return ResponseEntity.of(problemDetail).build();
    }

    private void setError(ProblemDetail problemDetail, ObjectError error) {
        if (error instanceof FieldError fieldError) {
            String fieldName = fieldError.getField();
            List<String> errorMessages = addMessageToErrorList(problemDetail, fieldError);
            problemDetail.setProperty(fieldName, errorMessages);
        } else {
            problemDetail.setProperty(error.getObjectName(), error.getDefaultMessage());
        }
    }

    @SuppressWarnings("unchecked")
    private List<String> addMessageToErrorList(ProblemDetail problemDetail, FieldError error) {
        List<String> errorMessages;
        Map<String, Object> detailProperties = problemDetail.getProperties();
        if (detailProperties != null && detailProperties.containsKey(error.getField())) {
            errorMessages = (List<String>) detailProperties.get(error.getField());
            errorMessages.add(errorMessages.size() - 2, error.getDefaultMessage());
        } else {
            errorMessages = new ArrayList<>();
            errorMessages.add(error.getDefaultMessage());
            errorMessages.add(translator.getLocaleMessage(REJECTED_VALUE_MSG_CODE)
                    + " = " + error.getRejectedValue());
        }
        return errorMessages;
    }
}
