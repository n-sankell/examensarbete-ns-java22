package com.midio.midimanager.config;

import org.apache.bval.jsr.ApacheValidationProvider;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;

import javax.sql.DataSource;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;

@org.springframework.context.annotation.Configuration
public class Configuration {

    @Bean
    @Primary
    @Qualifier("metaDataSource")
    DataSource metaDataSource(@Qualifier("metaDataSourceProperties") DataSourceProperties dataSourceProperties) {
        return DataSourceBuilder.create()
            .driverClassName(dataSourceProperties.getDriverClassName())
            .url(dataSourceProperties.getUrl())
            .username(dataSourceProperties.getUsername())
            .password(dataSourceProperties.getPassword())
            .build();
    }

    @Bean
    @Qualifier("blobDataSource")
    DataSource blobDataSource(@Qualifier("blobDataSourceProperties") DataSourceProperties dataSourceProperties) {
        return DataSourceBuilder.create()
            .driverClassName(dataSourceProperties.getDriverClassName())
            .url(dataSourceProperties.getUrl())
            .username(dataSourceProperties.getUsername())
            .password(dataSourceProperties.getPassword())
            .build();
    }

    @Bean
    @Primary
    @Qualifier("metaNamedParameterJdbcTemplate")
    NamedParameterJdbcTemplate metaNamedParameterJdbcTemplate() {
        return new NamedParameterJdbcTemplate(metaDataSource(metaDataSourceProperties()));
    }

    @Bean
    @Qualifier("blobNamedParameterJdbcTemplate")
    NamedParameterJdbcTemplate blobNamedParameterJdbcTemplate() {
        return new NamedParameterJdbcTemplate(blobDataSource(blobDataSourceProperties()));
    }

    @Bean
    @Qualifier("metaDataSourceProperties")
    @ConfigurationProperties("spring.datasource.meta")
    DataSourceProperties metaDataSourceProperties() {
        return new DataSourceProperties();
    }

    @Bean
    @Qualifier("blobDataSourceProperties")
    @ConfigurationProperties("spring.datasource.blob")
    DataSourceProperties blobDataSourceProperties() {
        return new DataSourceProperties();
    }

    @Bean
    public Validator validator() {
        try (
            ValidatorFactory validatorFactory = Validation
                .byProvider(ApacheValidationProvider.class)
                .configure()
                .buildValidatorFactory()
        ) {
            return validatorFactory.getValidator();
        }
    }

}
