package ua.in.kp.validator;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Retention(RUNTIME)
@Target({ElementType.TYPE})
@Constraint(validatedBy = {FieldMatchValidator.class})
public @interface FieldMatch {
    String message() default "{validation.constraint.fields-dont-mach.message}";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

    String field();

    String fieldMatch();
}
