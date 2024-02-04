package ua.in.kp.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.BeanWrapper;
import org.springframework.beans.BeanWrapperImpl;

public class FieldMatchValidator implements ConstraintValidator<FieldMatch, Object> {
    private String fieldName;
    private String fieldMachName;

    @Override
    public void initialize(final FieldMatch constraintAnnotation) {
        this.fieldName = constraintAnnotation.field();
        this.fieldMachName = constraintAnnotation.fieldMatch();
    }

    @Override
    public boolean isValid(final Object value, final ConstraintValidatorContext context) {
        BeanWrapper wrapper = new BeanWrapperImpl(value);
        Object field = wrapper.getPropertyValue(fieldName);
        Object fieldMach = wrapper.getPropertyValue(fieldMachName);
        if (field == null) {
            return false;
        }
        return field.equals(fieldMach);
    }
}
