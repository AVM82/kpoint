package ua.in.kp.exception;

import org.springframework.security.core.AuthenticationException;

public class SubjectEncryptionException extends AuthenticationException {
    public SubjectEncryptionException(String msg, Throwable cause) {
        super(msg, cause);
    }
}
