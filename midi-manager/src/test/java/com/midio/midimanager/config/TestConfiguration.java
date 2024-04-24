package com.midio.midimanager.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
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
    @Qualifier("blobPostgresContainer")
    public PostgreSQLContainer<?> blobPostgresContainer() {
        try (PostgreSQLContainer<?> container = new PostgreSQLContainer<>("postgres:16.1")) {
            container
                .withDatabaseName("blob_test_db")
                .withUsername("blob_test_user")
                .withPassword("blob_test_password");
            return container;
        }
    }

    @Bean
    @Qualifier("metaPostgresContainer")
    public PostgreSQLContainer<?> metaPostgresContainer() {
        try (PostgreSQLContainer<?> container = new PostgreSQLContainer<>("postgres:16.1")) {
            container
                .withDatabaseName("meta_test_db")
                .withUsername("meta_test_user")
                .withPassword("meta_test_password");
            return container;
        }
    }

    @Bean
    @Qualifier("blobSQLDataSource")
    public DataSource blobSQLDataSource(@Qualifier("blobPostgresContainer")PostgreSQLContainer<?> blobPostgreSQLContainer) {
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
    @Qualifier("metaSQLDataSource")
    public DataSource metaSQLDataSource(@Qualifier("metaPostgresContainer")PostgreSQLContainer<?> metaPostgreSQLContainer) {
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
    @Primary
    @Qualifier("metaNamedParameterJdbcTemplate")
    public NamedParameterJdbcTemplate metaNamedParameterJdbcTemplate(@Qualifier("metaSQLDataSource") DataSource metaSQLDataSource) {
        return new NamedParameterJdbcTemplate(metaSQLDataSource);
    }

    @Bean
    @Qualifier("blobNamedParameterJdbcTemplate")
    public NamedParameterJdbcTemplate blobNamedParameterJdbcTemplate(@Qualifier("blobSQLDataSource") DataSource blobSQLDataSource) {
        return new NamedParameterJdbcTemplate(blobSQLDataSource);
    }

}
