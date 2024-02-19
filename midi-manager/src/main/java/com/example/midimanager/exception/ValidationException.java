package com.example.midimanager.exception;

import org.springframework.http.HttpStatusCode;
import org.springframework.web.client.HttpClientErrorException;

public class ValidationException extends HttpClientErrorException {

    public ValidationException() {
        super(HttpStatusCode.valueOf(400), "Value is not allowed");
    }

    public ValidationException(String statusText) {
        super(HttpStatusCode.valueOf(400), statusText);
    }
}
