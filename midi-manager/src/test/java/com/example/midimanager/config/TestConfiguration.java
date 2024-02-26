package com.example.midimanager.config;

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
    @Qualifier("blobPostgreSQLContainer")
    public PostgreSQLContainer<?> blobPostgreSQLContainer() {
        try (PostgreSQLContainer<?> container = new PostgreSQLContainer<>("postgres:16.1")) {
            container
                .withDatabaseName("blob_test_db")
                .withUsername("blob_test_user")
                .withPassword("blob_test_password");
            return container;
        }
    }

    @Bean
    @Qualifier("metaPostgreSQLContainer")
    public PostgreSQLContainer<?> metaPostgreSQLContainer() {
        try (PostgreSQLContainer<?> container = new PostgreSQLContainer<>("postgres:16.1")) {
            container
                .withDatabaseName("meta_test_db")
                .withUsername("meta_test_user")
                .withPassword("meta_test_password");
            return container;
        }
    }

    @Bean
    @Qualifier("blobDataSource")
    public DataSource blobDataSource(@Qualifier("blobPostgreSQLContainer")PostgreSQLContainer<?> blobPostgreSQLContainer) {
        blobPostgreSQLContainer.start();
        var dataSource = DataSourceBuilder.create()
            .driverClassName("org.postgresql.Driver")
            .url(blobPostgreSQLContainer.getJdbcUrl())
            .username(blobPostgreSQLContainer.getUsername())
            .password(blobPostgreSQLContainer.getPassword())
            .build();
        DataSourceRegistry.blobDataSource = dataSource;
        return dataSource;
    }

    @Bean
    @Qualifier("metaDataSource")
    public DataSource metaDataSource(@Qualifier("metaPostgreSQLContainer")PostgreSQLContainer<?> metaPostgreSQLContainer) {
        metaPostgreSQLContainer.start();
        var dataSource = DataSourceBuilder.create()
            .driverClassName("org.postgresql.Driver")
            .url(metaPostgreSQLContainer.getJdbcUrl())
            .username(metaPostgreSQLContainer.getUsername())
            .password(metaPostgreSQLContainer.getPassword())
            .build();
        DataSourceRegistry.metaDataSource = dataSource;
        return dataSource;
    }

    @Bean
    @Qualifier("metaNamedParameterJdbcTemplate")
    public NamedParameterJdbcTemplate metaNamedParameterJdbcTemplate(@Qualifier("metaDataSource") DataSource metaDataSource) {
        return new NamedParameterJdbcTemplate(metaDataSource);
    }

    @Bean
    @Qualifier("blobNamedParameterJdbcTemplate")
    public NamedParameterJdbcTemplate blobNamedParameterJdbcTemplate(@Qualifier("blobDataSource") DataSource blobDataSource) {
        return new NamedParameterJdbcTemplate(blobDataSource);
    }

}
