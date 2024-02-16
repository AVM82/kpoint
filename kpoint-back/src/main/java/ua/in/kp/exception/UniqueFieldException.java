package ua.in.kp.exception;

public class UniqueFieldException extends RuntimeException {

    public UniqueFieldException() {
    }

    public UniqueFieldException(String message) {
        super(message);
    }
}
