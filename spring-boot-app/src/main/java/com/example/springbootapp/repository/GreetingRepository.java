package com.example.springbootapp.repository;

import com.example.springbootapp.model.Greeting;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public class GreetingRepository {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public GreetingRepository(NamedParameterJdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Greeting> getAll() {
        var sql =
            """
            SELECT greeting_id, greeting_value FROM greeting
            """;
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            var id = UUID.fromString(rs.getString("greeting_id"));
            var value = rs.getString("greeting_value");
            return new Greeting(id, value);
        });
    }

}
