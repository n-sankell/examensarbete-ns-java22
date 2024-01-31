package com.example.springbootapp.controller;

import generatedapi.model.FoodDto;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.testcontainers.containers.MySQLContainer;

import java.math.BigDecimal;

@SpringBootTest
public class FoodControllerTest {

    private final FoodController foodController;

    @Autowired
    public FoodControllerTest(FoodController foodController) {
        this.foodController = foodController;
    }

    private static final MySQLContainer<?> testContainer = new MySQLContainer<>("mysql:8.2")
        .withDatabaseName("mysql")
        .withUsername("user")
        .withPassword("password");

    @Test
    void addFood() {
        var dto = new FoodDto()
            .name("Korv")
            .rating(BigDecimal.valueOf(4.5));
        var result = foodController.addFood(dto);
        System.out.println(result);
    }

}
