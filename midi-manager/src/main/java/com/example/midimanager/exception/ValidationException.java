package com.example.midimanager.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.client.HttpClientErrorException;

public class ValidationException extends HttpClientErrorException {

    public ValidationException(String statusText) {
        super(HttpStatus.UNPROCESSABLE_ENTITY, statusText);
    }

}
