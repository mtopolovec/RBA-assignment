package com.RBA_assignment.RBA_assignment.handlers;

import com.RBA_assignment.RBA_assignment.utils.ApiResponseMsg;
import jakarta.persistence.EntityExistsException;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.FetchNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    // Custom fetch not found
    @ExceptionHandler(FetchNotFoundException.class)
    public ResponseEntity<ApiResponseMsg> handleNotFound(FetchNotFoundException ex) {
        log.warn("Not found: {}", ex.getMessage());
        ApiResponseMsg error = new ApiResponseMsg(
                HttpStatus.NOT_FOUND.value(),
                "Not Found - " + ex.getEntityName()
        );
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    // Validation (e.g., @Valid on DTOs)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponseMsg> handleValidationErrors(MethodArgumentNotValidException ex) {
        List<String> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(err -> err.getField() + ": " + err.getDefaultMessage())
                .toList();
        ApiResponseMsg error = new ApiResponseMsg(
                HttpStatus.BAD_REQUEST.value(),
                "Validation Failed - " + "One or more fields failed validation." + errors
        );
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    // Catch constraint violations (e.g. @RequestParam validation)
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiResponseMsg> handleConstraintViolation(ConstraintViolationException ex) {
        List<String> violations = ex.getConstraintViolations()
                .stream()
                .map(v -> v.getPropertyPath() + ": " + v.getMessage())
                .toList();

        ApiResponseMsg error = new ApiResponseMsg(
                HttpStatus.BAD_REQUEST.value(),
                "Invalid Request Parameters - " + "Validation failed for request parameters." + violations
        );
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(EntityExistsException.class)
    public ResponseEntity<ApiResponseMsg> handleEntityExistsException(EntityExistsException ex) {
        ApiResponseMsg error = new ApiResponseMsg(
                HttpStatus.CONFLICT.value(),
                "Entity already exists - " + ex.getMessage()
        );
        return new ResponseEntity<>(error, HttpStatus.CONFLICT);
    }

    // Catch-all fallback
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponseMsg> handleGeneralError(Exception ex) {
        log.error("Unhandled error", ex);
        ApiResponseMsg error = new ApiResponseMsg(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Internal Server Error - " + "Something went wrong. Please try again later."
        );
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
