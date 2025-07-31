package com.RBA_assignment.RBA_assignment.validator;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = OIBValidator.class)
@Target({ ElementType.FIELD, ElementType.PARAMETER })
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidOIB {
    String message() default "Invalid OIB. Must be a valid Croatian OIB.";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
