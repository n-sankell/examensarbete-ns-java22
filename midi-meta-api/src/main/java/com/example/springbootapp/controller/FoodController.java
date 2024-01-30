package com.example.springbootapp.controller;

import com.example.springbootapp.service.FoodService;
import generatedapi.FoodsApi;
import generatedapi.model.FoodDto;
import generatedapi.model.FoodsDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

import static com.example.springbootapp.converter.FoodConverter.convert;
import static org.springframework.http.ResponseEntity.ok;

@RestController
public class FoodController implements FoodsApi {

    private final FoodService foodService;

    @Autowired
    public FoodController(FoodService foodService) {
        this.foodService = foodService;
    }

    @Override
    public ResponseEntity<FoodDto> addFood(FoodDto foodDto) {
        return ok(convert(foodService.addFood(foodDto)));
    }

    @Override
    public ResponseEntity<String> deleteFood(UUID id) {
        return ok(foodService.deleteFood(id));
    }

    @Override
    public ResponseEntity<FoodDto> editFood(UUID id, FoodDto foodDto) {
        return ok(convert(foodService.editFood(id, foodDto)));
    }

    @Override
    public ResponseEntity<FoodDto> getFood(UUID id) {
        return ok(convert(foodService.getFoodById(id)));
    }

    @Override
    public ResponseEntity<FoodsDto> getFoods() {
        return ok(convert(foodService.getAllFoods()));
    }
}
