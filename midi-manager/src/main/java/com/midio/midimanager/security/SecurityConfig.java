package com.midio.midimanager.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
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
        // TODO: Consider adding a guest token with a guest role for public midi files
        return http
            .formLogin(AbstractHttpConfigurer::disable)
            .csrf(AbstractHttpConfigurer::disable)

            .authorizeHttpRequests(authorizeHttpRequests -> authorizeHttpRequests

                .requestMatchers(HttpMethod.GET, "/midis/public").permitAll()
                .requestMatchers(HttpMethod.GET, "/midis/file/{id}").permitAll()

                .requestMatchers(HttpMethod.GET, "/midis/user").authenticated()
                .requestMatchers(HttpMethod.POST, "/midis/create").authenticated()

                .requestMatchers(HttpMethod.POST, "/midis/file/{id}").authenticated()

                .requestMatchers(HttpMethod.DELETE, "/midis/file/{id}").authenticated()

                .anyRequest().authenticated())

            .httpBasic(Customizer.withDefaults())
            .addFilterBefore(jwtTokenInterceptor, UsernamePasswordAuthenticationFilter.class)
            .headers(headersConfig -> headersConfig.frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin))

            .build();
    }

    @Bean
    UserDetailsService emptyDetailsService() {
        return username -> { throw new UsernameNotFoundException("no local users, only JWT tokens allowed"); };
    }

}
