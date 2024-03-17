package com.midio.midimanager.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.client.HttpClientErrorException;

import java.util.List;

public class ValidationException extends HttpClientErrorException {

    private final List<ValidationError> errors;

    public ValidationException(String statusText, List<ValidationError> errors) {
        super(HttpStatus.UNPROCESSABLE_ENTITY, statusText);
        this.errors = errors;
    }

    public List<ValidationError> getErrors() {
        return errors;
    }

}
