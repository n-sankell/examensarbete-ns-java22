package com.example.midimanager.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.client.HttpClientErrorException;

public class ForbiddenException extends HttpClientErrorException {

    public ForbiddenException() {
        super(HttpStatus.FORBIDDEN, "Forbidden");
    }

    public ForbiddenException(String statusText) {
        super(HttpStatus.FORBIDDEN, statusText);
    }

}
