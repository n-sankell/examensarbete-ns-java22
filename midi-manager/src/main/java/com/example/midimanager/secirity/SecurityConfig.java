package com.example.midimanager.secirity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtTokenInterceptor jwtTokenInterceptor;

    @Autowired
    public SecurityConfig(JwtTokenInterceptor jwtTokenInterceptor) {
        this.jwtTokenInterceptor = jwtTokenInterceptor;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            .formLogin(AbstractHttpConfigurer::disable)
            .csrf(AbstractHttpConfigurer::disable)

            .authorizeHttpRequests(authorizeHttpRequests -> authorizeHttpRequests

                .requestMatchers(HttpMethod.GET, "/midis/public").permitAll()
                .requestMatchers(HttpMethod.GET, "/midis/midi/*").permitAll()

                .requestMatchers(HttpMethod.GET, "/midis/user/*").authenticated()
                .requestMatchers(HttpMethod.POST, "/midis/create").authenticated()

                .requestMatchers(HttpMethod.POST, "/midis/midi/*").authenticated()
                .requestMatchers(HttpMethod.POST, "/midis/meta/*").authenticated()
                .requestMatchers(HttpMethod.POST, "/midis/binary/*").authenticated()

                .requestMatchers(HttpMethod.DELETE, "/midis/midi/*").authenticated()

                .anyRequest().authenticated())

            .httpBasic(Customizer.withDefaults())
            .addFilterBefore(jwtTokenInterceptor, UsernamePasswordAuthenticationFilter.class)
            .headers(headersConfig -> headersConfig.frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin))

            .build();
    }

}
