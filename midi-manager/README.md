## Midi Manager

### About

The midi manager handles midi-files and lets an authenticated user get, create, update 
and delete midi files and metadata. 

This system is build with two **Postgres** databases, one for _metadata_ and one for _binary_ data.
The user will only get the binary data when requesting a file specifically by id. The metadata holds the reference to the binary data.

**JDBC** templates is used for the communication with the databases.
**Java Sound** is used for validation of midi-files.

### Generating sources

This project uses **OpenApi**(Swagger) to generate sources shared by both the front and back end. 

This includes request/response DTOs and an interface for the APIs. Controllers needs to implement the generated API and override the methods. 

**To generate sources, run:** `./gradlew clean openApiGenerate`

### Liquibase

This project uses **Liquibase** to keep track of database changes.
To make database changes, add SQL-scripts to the _changeset_ folder and include the script file in the _changelog_ file belonging to 
the related database.

### Testing

To run tests without mocking out databases this project uses **Testcontainers** that runs temporary Postgres containers
with the tests, that way SQL code will also be tested. 

To use test containers, annotate your test class with: `@MidiManagerTestEnvironment`.
Helper methods and classes for tests is found under _/testdata_.

When using MockApi: If an error message is expected, use the MockApi methods for expecting errors.

Helper tools include
* MockApi - wraps standard mockMvc and object mapper and returns a typed ResponseEntity with status and body
* MockTokenGenerator - contains methods for generating valid, invalid and expired jwt tokens.
* TokenType - Enums for generating different jwt-tokens for parameterized tests
* MockUser - Just a wrapper for a simple user with id and username.
* MidiGenerator - Methods for generating test midi sequences.
* Base64Midi - Constants with base64 encoded midi files

### Reference Documentation

For further reference, please consider the following sections:

* [Official Gradle documentation](https://docs.gradle.org)
* [Spring Boot Gradle Plugin Reference Guide](https://docs.spring.io/spring-boot/docs/3.2.1/gradle-plugin/reference/html/)
* [Create an OCI image](https://docs.spring.io/spring-boot/docs/3.2.1/gradle-plugin/reference/html/#build-image)
* [Spring Web](https://docs.spring.io/spring-boot/docs/3.2.1/reference/htmlsingle/index.html#web)
* [Spring Data JDBC](https://docs.spring.io/spring-boot/docs/3.2.1/reference/htmlsingle/index.html#data.sql.jdbc)

### Guides

The following guides illustrate how to use some features concretely:

* [Building a RESTful Web Service](https://spring.io/guides/gs/rest-service/)
* [Serving Web Content with Spring MVC](https://spring.io/guides/gs/serving-web-content/)
* [Building REST services with Spring](https://spring.io/guides/tutorials/rest/)
* [Using Spring Data JDBC](https://github.com/spring-projects/spring-data-examples/tree/master/jdbc/basics)

### Additional Links

These additional references should also help you:

* [Gradle Build Scans – insights for your project's build](https://scans.gradle.com#gradle)

.
