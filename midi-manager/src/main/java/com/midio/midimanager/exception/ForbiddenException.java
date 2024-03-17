package com.midio.midimanager.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.client.HttpClientErrorException;

public class ForbiddenException extends HttpClientErrorException {

    public String currentUserId;

    public ForbiddenException(String statusText, String currentUserId) {
        super(HttpStatus.FORBIDDEN, statusText);
        this.currentUserId = currentUserId;
    }

    public String getCurrentUserId() {
        return currentUserId;
    }
}
