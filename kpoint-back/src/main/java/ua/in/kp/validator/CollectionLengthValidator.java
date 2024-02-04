package ua.in.kp.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.Collection;

public class CollectionLengthValidator implements
        ConstraintValidator<CollectionLength, Collection<?>> {
    private int minSize;
    private int maxSize;

    @Override
    public void initialize(CollectionLength constraintAnnotation) {
        this.minSize = constraintAnnotation.min();
        this.maxSize = constraintAnnotation.max();
    }

    @Override
    public boolean isValid(Collection<?> collection, ConstraintValidatorContext context) {
        if (collection == null) {
            return false;
        }

        int size = collection.size();
        return size >= minSize && size <= maxSize;
    }
}
