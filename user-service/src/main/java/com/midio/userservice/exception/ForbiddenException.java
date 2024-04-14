package com.midio.userservice.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.client.HttpClientErrorException;

public class ForbiddenException extends HttpClientErrorException {

    private final String currentUserId;

    public ForbiddenException(String statusText, String currentUserId) {
        super(HttpStatus.FORBIDDEN, statusText);
        this.currentUserId = currentUserId;
    }

    public String getCurrentUserId() {
        return currentUserId;
    }
}
