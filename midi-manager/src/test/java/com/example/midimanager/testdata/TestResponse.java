package com.example.midimanager.testdata;

import org.springframework.http.HttpStatus;

public record TestResponse<T>(HttpStatus status, T body) {
}
