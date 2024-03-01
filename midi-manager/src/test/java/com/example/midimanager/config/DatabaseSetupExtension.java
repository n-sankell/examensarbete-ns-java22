package com.example.midimanager.config;

import liquibase.Liquibase;
import liquibase.database.DatabaseFactory;
import liquibase.database.jvm.JdbcConnection;
import liquibase.resource.ClassLoaderResourceAccessor;
import org.junit.jupiter.api.extension.AfterEachCallback;
import org.junit.jupiter.api.extension.BeforeEachCallback;
import org.junit.jupiter.api.extension.Extension;
import org.junit.jupiter.api.extension.ExtensionContext;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;

@Component
public class DatabaseSetupExtension implements Extension, BeforeEachCallback, AfterEachCallback {

    @Override
    public void beforeEach(ExtensionContext context) {
        //TODO: perhaps find a better solution instead of static DataSourceRegistry
        try {
            applyLiquibaseMigrations(
                DataSourceRegistry.blobDataSource, "db/changelog-blob.yaml");

            applyLiquibaseMigrations(
                DataSourceRegistry.metaDataSource, "db/changelog-meta.yaml");
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private void applyLiquibaseMigrations(DataSource dataSource, String changelogFile) throws Exception {
        try (var connection = dataSource.getConnection()) {

            var database = DatabaseFactory.getInstance()
                .findCorrectDatabaseImplementation(
                    new JdbcConnection(connection));

            database.setDefaultSchemaName("public");
            var liquibase = new Liquibase(changelogFile, new ClassLoaderResourceAccessor(), database);
            liquibase.update("");
            //TODO: find solution for this deprecated method, providing a Writer prevented liquibase from
            //  writing to the database
        }
    }

    @Override
    public void afterEach(ExtensionContext context) {
        try {
            clearLiquibaseMigrations(
                DataSourceRegistry.blobDataSource, "db/changelog-blob.yaml");

            clearLiquibaseMigrations(
                DataSourceRegistry.metaDataSource, "db/changelog-meta.yaml");
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private void clearLiquibaseMigrations(DataSource dataSource, String changelogFile) throws Exception {
        try (var connection = dataSource.getConnection()) {

            var database = DatabaseFactory.getInstance()
                .findCorrectDatabaseImplementation(
                    new JdbcConnection(connection));

            database.setDefaultSchemaName("public");
            var liquibase = new Liquibase(changelogFile, new ClassLoaderResourceAccessor(), database);
            liquibase.dropAll();
        }
    }

}
