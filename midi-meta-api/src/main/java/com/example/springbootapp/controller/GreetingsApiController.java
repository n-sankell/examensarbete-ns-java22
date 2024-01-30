package com.example.springbootapp.controller;

import com.example.springbootapp.service.GreetingsService;
import generatedapi.GreetingsApi;
import generatedapi.model.GreetingsDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import static com.example.springbootapp.converter.GreetingConverter.convert;
import static org.springframework.http.ResponseEntity.ok;

@RestController
public class GreetingsApiController implements GreetingsApi {

    private final GreetingsService greetingsService;

    @Autowired
    public GreetingsApiController(GreetingsService greetingsService) {
        this.greetingsService = greetingsService;
    }

    @Override
    public ResponseEntity<GreetingsDto> getGreetings() {
        return ok(convert(greetingsService.getGreetings()));
    }

}
