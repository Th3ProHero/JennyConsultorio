package com.jennydentista.exception;

/**
 * Exception thrown when document upload validation fails.
 * Handled by GlobalExceptionHandler to return HTTP 400 Bad Request.
 */
public class DocumentValidationException extends RuntimeException {
    public DocumentValidationException(String message) {
        super(message);
    }
}
