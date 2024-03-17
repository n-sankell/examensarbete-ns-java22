package com.midio.midimanager.util;

import com.midio.midimanager.exception.ValidationError;
import com.midio.midimanager.exception.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.validation.ConstraintViolation;
import javax.validation.Validator;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Component
public class RequestValidator {

    private final Validator validator;

    @Autowired
    public RequestValidator(Validator validator) {
        this.validator = validator;
    }

    public <T> void validateRequest(T editRequest) {
        Set<ConstraintViolation<T>> violations = validator.validate(editRequest);

        if (!violations.isEmpty()) {
            List<ValidationError> errorList = new ArrayList<>();
            for (ConstraintViolation<T> violation : violations) {
                errorList.add(
                    new ValidationError(
                        violation.getPropertyPath().toString(),
                        getCustomErrorMessage(violation),
                        violation.getInvalidValue() != null ? violation.getInvalidValue().toString() : "null"
                    )
                );
            }
            throw new ValidationException("Validation error in create request", errorList);
        }
    }

    private <T> String getCustomErrorMessage(ConstraintViolation<T> violation) {
        if (violation == null) {
            return null;
        }

        if (violation.getConstraintDescriptor().getAnnotation() instanceof Pattern) {
            return "Invalid format of input";
        } else if (violation.getConstraintDescriptor().getAnnotation() instanceof Size) {
            var min = (int) violation.getConstraintDescriptor().getAttributes().get("min");
            var max = (int) violation.getConstraintDescriptor().getAttributes().get("max");
            var valueLength = violation.getInvalidValue().toString().length();
            return valueLength < min ? "Length must be greater than " + min : "Length must be shorter than " + max;
        }
        return violation.getMessage();
    }

}
