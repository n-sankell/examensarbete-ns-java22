package com.midio.userservice.config;

import com.midio.userservice.exception.FailedLoginException;
import com.midio.userservice.exception.ForbiddenException;
import com.midio.userservice.exception.NotFoundException;
import com.midio.userservice.exception.ValidationError;
import com.midio.userservice.exception.ValidationException;
import generatedapi.model.ErrorResponseDto;
import generatedapi.model.ValidationErrorDto;
import generatedapi.model.ValidationExceptionDto;
import org.apache.coyote.BadRequestException;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.postgresql.util.PSQLException;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.NoHandlerFoundException;

import java.util.List;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.CONFLICT;
import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.UNPROCESSABLE_ENTITY;

@Order(Ordered.HIGHEST_PRECEDENCE)
@ControllerAdvice
public class ExceptionAdvise {

    private final Logger logger = getLogger();

    @ExceptionHandler(ForbiddenException.class)
    protected ResponseEntity<ErrorResponseDto> forbiddenException(ForbiddenException fe) {
        logger.warn("ForbiddenException: " + fe.getCurrentUserId() + " - " + fe.getStatusText(), fe);
        return ResponseEntity.status(fe.getStatusCode())
            .body(new ErrorResponseDto()
                .errorType(FORBIDDEN.getReasonPhrase())
                .statusCode(FORBIDDEN.value())
                .errorMessage("Access to resource forbidden"));
    }

    @ExceptionHandler(FailedLoginException.class)
    protected ResponseEntity<ErrorResponseDto> failedLogin(FailedLoginException fle) {
        logger.warn("FailedLoginException: " + fle.getIdentifier() + " - " + fle.getStatusText(), fle);
        return ResponseEntity.status(fle.getStatusCode())
            .body(new ErrorResponseDto()
                .errorType(FORBIDDEN.getReasonPhrase())
                .statusCode(FORBIDDEN.value())
                .errorMessage("Login attempt failed"));
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
    protected ResponseEntity<ErrorResponseDto> notFoundException(NotFoundException nfe) {
        logger.info("NotFoundException", nfe);
        return ResponseEntity.status(nfe.getStatusCode())
            .body(new ErrorResponseDto()
                .errorType(NOT_FOUND.getReasonPhrase())
                .statusCode(NOT_FOUND.value())
                .errorMessage("Requested resource could not be found"));
    }

    @ExceptionHandler(BadRequestException.class)
    protected ResponseEntity<ErrorResponseDto> badRequestException(BadRequestException bre) {
        logger.info("BadRequestException", bre);
        return ResponseEntity.status(BAD_REQUEST)
            .body(new ErrorResponseDto()
                .errorType(BAD_REQUEST.getReasonPhrase())
                .statusCode(BAD_REQUEST.value())
                .errorMessage("Request could not be processed"));
    }

    @ExceptionHandler(PSQLException.class)
    protected ResponseEntity<ValidationExceptionDto> psqlException(PSQLException nfe) {
        logger.info("PSQLException", nfe);
        return ResponseEntity.status(UNPROCESSABLE_ENTITY)
            .body(new ValidationExceptionDto(nfe.getMessage(), List.of()));
    }

    @ExceptionHandler(NoHandlerFoundException.class)
    protected ResponseEntity<ErrorResponseDto> noHandlerFound(NoHandlerFoundException nhf) {
        logger.info("NoHandlerFoundException", nhf);
        return ResponseEntity.status(NOT_FOUND)
            .body(new ErrorResponseDto()
                .errorType(NOT_FOUND.getReasonPhrase())
                .statusCode(NOT_FOUND.value())
                .errorMessage("Address or method was not found"));
    }

    @ExceptionHandler(Exception.class)
    protected ResponseEntity<?> exception(Exception ex) {
        logger.info("Exception", ex);
        if (ex instanceof DuplicateKeyException) {
            return ResponseEntity.status(CONFLICT)
                .body(new ErrorResponseDto()
                    .errorType(CONFLICT.getReasonPhrase())
                    .statusCode(CONFLICT.value())
                    .errorMessage("Username or Email already exists"));
        }
        return ResponseEntity.status(INTERNAL_SERVER_ERROR)
            .body(new ErrorResponseDto()
                .errorType(INTERNAL_SERVER_ERROR.getReasonPhrase())
                .statusCode(INTERNAL_SERVER_ERROR.value())
                .errorMessage("Internal server error"));
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
