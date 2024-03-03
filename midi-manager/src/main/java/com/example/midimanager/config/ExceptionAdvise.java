package com.example.midimanager.config;

import com.example.midimanager.exception.ForbiddenException;
import com.example.midimanager.exception.NotFoundException;
import com.example.midimanager.exception.ValidationException;
import generatedapi.model.ValidationErrorDto;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@Order(Ordered.HIGHEST_PRECEDENCE)
@ControllerAdvice
public class ExceptionAdvise {

    private final Logger logger = getLogger();

    @ExceptionHandler(ForbiddenException.class)
    protected ResponseEntity<Error> unauthorizedException(ForbiddenException ue) {
        logger.info("ForbiddenException: " + ue.getCurrentUserId() + " - " + ue.getStatusText(), ue);
        return ResponseEntity.status(ue.getStatusCode()).body(new Error(ue.getStatusText()));
    }

    @ExceptionHandler(ValidationException.class)
    protected ResponseEntity<ValidationErrorDto> validationException(ValidationException ve) {
        logger.info("ValidationException", ve);
        return ResponseEntity.status(ve.getStatusCode()).body(new ValidationErrorDto().message(ve.getStatusText()));
    }

    @ExceptionHandler(NotFoundException.class)
    protected ResponseEntity<Error> notFoundException(NotFoundException nfe) {
        logger.info("NotFoundException", nfe);
        return ResponseEntity.status(nfe.getStatusCode()).body(new Error(nfe.getStatusText()));
    }

    private Logger getLogger() {
        return LogManager.getLogger(this.getClass());
    }

}
