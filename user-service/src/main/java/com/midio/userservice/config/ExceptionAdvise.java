package com.midio.userservice.config;

import com.midio.userservice.exception.ForbiddenException;
import com.midio.userservice.exception.NotFoundException;
import com.midio.userservice.exception.ValidationError;
import com.midio.userservice.exception.ValidationException;
import generatedapi.model.ValidationErrorDto;
import generatedapi.model.ValidationExceptionDto;
import org.apache.coyote.BadRequestException;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.postgresql.util.PSQLException;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.List;

import static org.springframework.http.HttpStatus.*;

@Order(Ordered.HIGHEST_PRECEDENCE)
@ControllerAdvice
public class ExceptionAdvise {

    private final Logger logger = getLogger();

    @ExceptionHandler(ForbiddenException.class)
    protected ResponseEntity<Error> forbiddenException(ForbiddenException fe) {
        logger.info("ForbiddenException: " + fe.getCurrentUserId() + " - " + fe.getStatusText(), fe);
        return ResponseEntity.status(fe.getStatusCode()).body(new Error(fe.getStatusText()));
    }

    @ExceptionHandler(ValidationException.class)
    protected ResponseEntity<ValidationExceptionDto> validationException(ValidationException ve) {
        logger.info("ValidationException", ve);
        return ResponseEntity.status(ve.getStatusCode()).body(
            new ValidationExceptionDto()
                .message(ve.getStatusText())
                .errors(convertErrors(ve.getErrors())));
    }

    @ExceptionHandler(NotFoundException.class)
    protected ResponseEntity<Error> notFoundException(NotFoundException nfe) {
        logger.info("NotFoundException", nfe);
        return ResponseEntity.status(nfe.getStatusCode()).body(new Error(nfe.getStatusText()));
    }

    @ExceptionHandler(BadRequestException.class)
    protected ResponseEntity<Error> badRequestException(BadRequestException bre) {
        logger.info("BadRequestException", bre);
        return ResponseEntity.status(BAD_REQUEST).body(new Error(bre.getMessage()));
    }

    @ExceptionHandler(PSQLException.class)
    protected ResponseEntity<ValidationExceptionDto> psqlException(PSQLException nfe) {
        logger.info("PSQLException", nfe);
        return ResponseEntity.status(UNPROCESSABLE_ENTITY).body(new ValidationExceptionDto(nfe.getMessage(), List.of()));
    }

    @ExceptionHandler(Exception.class)
    protected ResponseEntity<?> exception(Exception ex) {
        logger.info("Exception", ex);
        if (ex instanceof DataIntegrityViolationException dive) {
            return ResponseEntity.status(UNPROCESSABLE_ENTITY).body(new ValidationExceptionDto(dive.getMessage(), List.of()));
        }
        return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new Error(ex.getMessage()));
    }

    private Logger getLogger() {
        return LogManager.getLogger(this.getClass());
    }

    private List<ValidationErrorDto> convertErrors(List<ValidationError> errors) {
        return errors.stream().map(e -> new ValidationErrorDto()
            .field(e.field())
            .error(e.constraint())
            .invalidValue(e.invalidValue())
        ).toList();
    }

}
