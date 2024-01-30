package com.example.springbootapp.converter;

import com.example.springbootapp.model.Greeting;
import generatedapi.model.GreetingDto;
import generatedapi.model.GreetingsDto;

import java.util.List;

public class GreetingConverter {

    public static GreetingDto convert(Greeting greeting) {
        return new GreetingDto()
            .message(greeting.greetingValue());
    }

    public static GreetingsDto convert(List<Greeting> greetings) {
        return new GreetingsDto()
            .greetings(greetings.stream().map(GreetingConverter::convert).toList());
    }

}
