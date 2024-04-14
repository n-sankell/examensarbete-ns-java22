package com.midio.userservice.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.client.HttpClientErrorException;

public class FailedLoginException extends HttpClientErrorException {

    private final String identifier;

    public FailedLoginException(String statusText, String identifier) {
        super(HttpStatus.FORBIDDEN, statusText);
        this.identifier = identifier;
    }

    public String getIdentifier() {
        return identifier;
    }
}
