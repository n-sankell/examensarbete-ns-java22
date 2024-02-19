package com.example.midimanager.config;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ContextConfiguration;

import java.lang.annotation.ElementType;
import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT;

@Inherited
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@TestDatabase()
@ContextConfiguration(classes = TestConfiguration.class)
@SpringBootTest(webEnvironment = RANDOM_PORT)
public @interface MidiManagerTestEnvironment {

    String[] value() default {};

}
