package com.midio.midimanager.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
public class JwtTokenProvider {

    @Value("${app.jwtSecret}")
    private String jwtSecret;

    public Claims extractClaims(String token) {
        var key = Keys.hmacShaKeyFor(jwtSecret.getBytes());

        return Jwts.parserBuilder()
            .setSigningKey(key)
            .build()
            .parseClaimsJws(token)
            .getBody();
    }

    public boolean validateToken(String token) {
        var key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
        try {
            var claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
            var exp = claims.getExpiration();
            return exp != null && exp.toInstant().isAfter(Instant.now());
        } catch (Exception e) {
            return false;
        }
    }
}