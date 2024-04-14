package com.midio.userservice.secirity;

import com.midio.userservice.model.UserAndDetails;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtTokenGenerator {

    private final String jwtSecret;
    private final long jwtExpirationMs;

    public JwtTokenGenerator(
        @Value("${app.jwtSecret}") String jwtSecret,
        @Value("${app.jwtExpirationMs}") long jwtExpirationMs) {
        this.jwtSecret = jwtSecret;
        this.jwtExpirationMs = jwtExpirationMs;
    }

    public String generateTokenForUser(UserAndDetails userAndDetails) {
        var now = new Date();
        var expiryDate = new Date(now.getTime() + jwtExpirationMs);
        var key = Keys.hmacShaKeyFor(jwtSecret.getBytes());

        return Jwts.builder()
            .setSubject(userAndDetails.getEmail())
            .claim("userId", userAndDetails.getUserIdAsString())
            .setIssuedAt(now)
            .setExpiration(expiryDate)
            .signWith(key, SignatureAlgorithm.HS512)
            .compact();
    }

}
