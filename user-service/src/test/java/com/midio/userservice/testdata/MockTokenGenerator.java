package com.midio.userservice.testdata;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

@Component
public class MockTokenGenerator {
    private final String jwtSecret;
    private final long jwtExpirationMs;

    public MockTokenGenerator(
        @Value("${app.jwtSecret}") String jwtSecret,
        @Value("${app.jwtExpirationMs}") long jwtExpirationMs) {
        this.jwtSecret = jwtSecret;
        this.jwtExpirationMs = jwtExpirationMs;
    }

    public String generateTokenForUser(MockUser mockUser) {
        var now = new Date();
        var expiryDate = new Date(now.getTime() + jwtExpirationMs);

        var key = Keys.hmacShaKeyFor(jwtSecret.getBytes());

        return Jwts.builder()
            .setSubject(mockUser.username())
            .claim("userId", String.valueOf(mockUser.userId()))
            .setIssuedAt(now)
            .setExpiration(expiryDate)
            .signWith(key, SignatureAlgorithm.HS512)
            .compact();
    }

    public String generateInvalidToken(MockUser mockUser) {
        var now = new Date();
        var expiryDate = new Date(now.getTime() + jwtExpirationMs);

        var invalidSecret = jwtSecret.replaceAll("a", "b");
        var key = Keys.hmacShaKeyFor(invalidSecret.getBytes());

        return Jwts.builder()
            .setSubject(mockUser.username())
            .claim("userId", String.valueOf(mockUser.userId()))
            .setIssuedAt(now)
            .setExpiration(expiryDate)
            .signWith(key, SignatureAlgorithm.HS512)
            .compact();
    }

    public String generateExpiredToken(MockUser mockUser) {
        var then = Date.from(Instant.now().minus(5, ChronoUnit.DAYS));
        var expiryDate = new Date(then.getTime() + jwtExpirationMs);

        var key = Keys.hmacShaKeyFor(jwtSecret.getBytes());

        return Jwts.builder()
            .setSubject(mockUser.username())
            .claim("userId", String.valueOf(mockUser.userId()))
            .setIssuedAt(then)
            .setExpiration(expiryDate)
            .signWith(key, SignatureAlgorithm.HS512)
            .compact();
    }

}
