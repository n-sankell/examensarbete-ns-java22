package com.midio.userservice.config;

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
    @Qualifier("userDataSource")
    DataSource userDataSource(@Qualifier("userDataSourceProperties") DataSourceProperties dataSourceProperties) {
        return DataSourceBuilder.create()
            .driverClassName(dataSourceProperties.getDriverClassName())
            .url(dataSourceProperties.getUrl())
            .username(dataSourceProperties.getUsername())
            .password(dataSourceProperties.getPassword())
            .build();
    }

    @Bean
    @Primary
    @Qualifier("userNamedParameterJdbcTemplate")
    NamedParameterJdbcTemplate userNamedParameterJdbcTemplate() {
        return new NamedParameterJdbcTemplate(userDataSource(userDataSourceProperties()));
    }

    @Bean
    @Qualifier("userDataSourceProperties")
    @ConfigurationProperties("spring.datasource.user")
    DataSourceProperties userDataSourceProperties() {
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
