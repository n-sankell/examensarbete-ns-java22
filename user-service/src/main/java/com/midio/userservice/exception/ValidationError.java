package com.midio.userservice.exception;

public record ValidationError(
    String field,
    String constraint,
    String invalidValue
) {
}
