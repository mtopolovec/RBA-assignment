package com.RBA_assignment.RBA_assignment.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class OIBValidator implements ConstraintValidator<ValidOIB, String> {
    @Override
    public boolean isValid(String oib, ConstraintValidatorContext context) {
        if (oib == null) return false;
        if (oib.length() != 11) return false;
        int checksum = 10;
        for (int i = 0; i < 10; i++) {
            char digit = oib.charAt(i);
            if (digit < '0' || digit > '9') return false;
            checksum = checksum + (digit - '0');
            checksum = checksum % 10;
            if (checksum == 0) checksum = 10;
            checksum *= 2;
            checksum = checksum % 11;
        }
        int controlNumber = 11 - checksum;
        controlNumber = controlNumber % 10;
        return controlNumber == (oib.charAt(10) - '0');
    }
}
