package com.example.midimanager.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.client.HttpClientErrorException;

public class NotFoundException extends HttpClientErrorException {

    public NotFoundException() {
        super(HttpStatus.NOT_FOUND, "Not found");
    }

    public NotFoundException(String statusText) {
        super(HttpStatus.NOT_FOUND, statusText);
    }

}
