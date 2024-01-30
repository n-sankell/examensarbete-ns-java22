package com.example.springbootapp.service;

import com.example.springbootapp.model.Greeting;
import com.example.springbootapp.repository.GreetingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class GreetingsService {

    private final GreetingRepository greetingRepository;

    @Autowired
    public GreetingsService(
        GreetingRepository greetingRepository
    ) {
        this.greetingRepository = greetingRepository;
    }

    @Transactional
    public List<Greeting> getGreetings() {
        return greetingRepository.getAll();
    }

}
