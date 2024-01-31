package com.example.springbootapp.converter;

import com.example.springbootapp.model.Food;
import generatedapi.model.FoodDto;
import generatedapi.model.FoodsDto;

import java.util.List;

public class FoodConverter {

    public static FoodDto convert(Food food) {
        return new FoodDto().id(food.id()).name(food.name()).rating(food.rating());
    }

    public static FoodsDto convert(List<Food> foods) {
        return new FoodsDto().foods(foods.stream().map(FoodConverter::convert).toList());
    }

}
