package com.example.springbootapp.service;

import com.example.springbootapp.model.Food;
import com.example.springbootapp.repository.FoodRepository;
import generatedapi.model.FoodDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class FoodService {

    private final FoodRepository foodRepository;

    @Autowired
    public FoodService(FoodRepository foodRepository) {
        this.foodRepository = foodRepository;
    }

    @Transactional
    public Food addFood(FoodDto foodDto) {
        var food = new Food(
            UUID.randomUUID(),
            foodDto.getName(),
            foodDto.getRating());
        return foodRepository.addFood(food);
    }

    @Transactional
    public Food editFood(UUID id, FoodDto foodDto) {
        var food = new Food(
            id,
            foodDto.getName(),
            foodDto.getRating());
        return foodRepository.editFood(food);
    }

    @Transactional
    public String deleteFood(UUID id) {
        return foodRepository.deleteFood(id);
    }

    @Transactional
    public List<Food> getAllFoods() {
        return foodRepository.getFoods();
    }

    @Transactional
    public Food getFoodById(UUID id) {
        return foodRepository.getFoodById(id);
    }

}
