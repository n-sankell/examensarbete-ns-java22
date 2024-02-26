package com.example.midimanager.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.web.client.HttpClientErrorException;

public class ValidationException extends HttpClientErrorException {

    public ValidationException() {
        super(HttpStatus.BAD_REQUEST, "Value is not allowed");
    }

    public ValidationException(String statusText) {
        super(HttpStatus.BAD_REQUEST, statusText);
    }
}
