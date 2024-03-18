package com.midio.midimanager.exception;

public record ValidationError(
    String field,
    String constraint,
    String invalidValue
) {
}
