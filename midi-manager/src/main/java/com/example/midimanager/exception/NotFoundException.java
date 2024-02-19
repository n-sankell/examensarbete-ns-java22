package com.example.midimanager.exception;

import org.springframework.http.HttpStatusCode;
import org.springframework.web.client.HttpClientErrorException;

public class NotFoundException extends HttpClientErrorException {

    public NotFoundException() {
        super(HttpStatusCode.valueOf(404), "Not found");
    }

    public NotFoundException(String statusText) {
        super(HttpStatusCode.valueOf(404), statusText);
    }

}
