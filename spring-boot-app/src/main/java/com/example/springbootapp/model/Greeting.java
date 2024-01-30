package com.example.springbootapp.model;

import java.util.UUID;

public record Greeting(UUID greetingId, String greetingValue) {

    @Override
    public String toString() {
        return "Greeting: " +
            "\n id: " + greetingId +
            "\n value: " + greetingValue;
    }

}
