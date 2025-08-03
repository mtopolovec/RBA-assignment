package com.RBA_assignment.RBA_assignment.utils;

import java.security.SecureRandom;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

public class CardNumberGenerator {
    private static final SecureRandom random = new SecureRandom();

    // Method to generate a random card number with 16 digits
    // The first digit is between 1 and 9, and the rest are between 0 and 9
    // This simulates a valid card number format
    public static String generate() {
        String firstDigit = String.valueOf(random.nextInt(9) + 1);
        String otherDigits = IntStream.range(1, 16)
                .mapToObj(i -> String.valueOf(random.nextInt(10)))
                .collect(Collectors.joining());
        return firstDigit + otherDigits;
    }
}
