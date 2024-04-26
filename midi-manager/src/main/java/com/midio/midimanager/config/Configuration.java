package com.midio.midimanager.config;

import liquibase.integration.spring.SpringLiquibase;
import org.apache.bval.jsr.ApacheValidationProvider;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.autoconfigure.liquibase.LiquibaseProperties;
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
    @Qualifier("metaLiquibaseProperties")
    @ConfigurationProperties(prefix = "spring.datasource.meta.liquibase")
    public LiquibaseProperties metaLiquibaseProperties() {
        return new LiquibaseProperties();
    }

    @Bean
    @Qualifier("blobLiquibaseProperties")
    @ConfigurationProperties(prefix = "spring.datasource.blob.liquibase")
    public LiquibaseProperties blobLiquibaseProperties() {
        return new LiquibaseProperties();
    }

    @Bean
    public SpringLiquibase metaLiquibase() {
        return springLiquibase(metaDataSource(metaDataSourceProperties()), metaLiquibaseProperties());
    }

    @Bean
    public SpringLiquibase blobLiquibase() {
        return springLiquibase(blobDataSource(blobDataSourceProperties()), blobLiquibaseProperties());
    }

    private static SpringLiquibase springLiquibase(DataSource dataSource, LiquibaseProperties properties) {
        SpringLiquibase liquibase = new SpringLiquibase();
        liquibase.setDataSource(dataSource);
        liquibase.setChangeLog(properties.getChangeLog());
        liquibase.setContexts(properties.getContexts());
        liquibase.setDefaultSchema(properties.getDefaultSchema());
        liquibase.setDropFirst(properties.isDropFirst());
        liquibase.setShouldRun(properties.isEnabled());
        liquibase.setLabelFilter(properties.getLabelFilter());
        liquibase.setChangeLogParameters(properties.getParameters());
        liquibase.setRollbackFile(properties.getRollbackFile());
        return liquibase;
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
