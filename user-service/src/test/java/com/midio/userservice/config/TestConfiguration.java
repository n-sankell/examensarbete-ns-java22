package com.midio.userservice.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.testcontainers.containers.PostgreSQLContainer;

import javax.sql.DataSource;

@org.springframework.boot.test.context.TestConfiguration
public class TestConfiguration {

    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        return objectMapper;
    }

    @Bean
    @Qualifier("userPostgreSQLContainer")
    public PostgreSQLContainer<?> userPostgreSQLContainer() {
        try (PostgreSQLContainer<?> container = new PostgreSQLContainer<>("postgres:16.1")) {
            container
                .withDatabaseName("user_test_db")
                .withUsername("user_test_user")
                .withPassword("user_test_password");
            return container;
        }
    }

    @Bean
    @Qualifier("userDataSource")
    public DataSource userDataSource(@Qualifier("userPostgreSQLContainer")PostgreSQLContainer<?> userPostgreSQLContainer) {
        userPostgreSQLContainer.start();
        var dataSource = DataSourceBuilder.create()
            .driverClassName("org.postgresql.Driver")
            .url(userPostgreSQLContainer.getJdbcUrl())
            .username(userPostgreSQLContainer.getUsername())
            .password(userPostgreSQLContainer.getPassword())
            .build();
        DataSourceRegistry.userDataSource = dataSource;
        return dataSource;
    }

    @Bean
    @Qualifier("userNamedParameterJdbcTemplate")
    public NamedParameterJdbcTemplate userNamedParameterJdbcTemplate(@Qualifier("userDataSource") DataSource userDataSource) {
        return new NamedParameterJdbcTemplate(userDataSource);
    }

}
