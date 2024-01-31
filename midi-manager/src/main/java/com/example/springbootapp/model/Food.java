package com.example.springbootapp.model;

import java.math.BigDecimal;
import java.util.UUID;

public record Food(UUID id, String name, BigDecimal rating) {
}
