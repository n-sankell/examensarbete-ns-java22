package com.example.midimanager.config;

import com.example.midimanager.exception.NotFoundException;
import com.example.midimanager.exception.ForbiddenException;
import com.example.midimanager.exception.ValidationException;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@Order(Ordered.HIGHEST_PRECEDENCE)
@ControllerAdvice
public class ExceptionAdvise {

    @ExceptionHandler(ForbiddenException.class)
    protected ResponseEntity<Error> unauthorizedException(ForbiddenException ue) {
        return ResponseEntity.status(ue.getStatusCode()).body(new Error(ue.getMessage()));
    }

    @ExceptionHandler(ValidationException.class)
    protected ResponseEntity<Error> validationException(ValidationException ve) {
        return ResponseEntity.status(ve.getStatusCode()).body(new Error(ve.getMessage()));
    }

    @ExceptionHandler(NotFoundException.class)
    protected ResponseEntity<Error> notFoundException(NotFoundException nfe) {
        return ResponseEntity.status(nfe.getStatusCode()).body(new Error(nfe.getMessage()));
    }

}
