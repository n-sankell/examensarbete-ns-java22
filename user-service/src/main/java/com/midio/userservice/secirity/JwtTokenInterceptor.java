package com.midio.userservice.secirity;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

import static com.midio.userservice.secirity.JwtConstants.TOKEN_ID_CLAIM;
import static com.midio.userservice.secirity.JwtConstants.TOKEN_PREFIX;
import static org.springframework.http.HttpHeaders.AUTHORIZATION;

@Component
public class JwtTokenInterceptor extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;

    @Autowired
    public JwtTokenInterceptor(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    protected void doFilterInternal(
        @NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain)
        throws ServletException, IOException {

        var authorizationHeader = request.getHeader(AUTHORIZATION);
        if (authorizationHeader != null && authorizationHeader.startsWith(TOKEN_PREFIX)) {
            var token = extractTokenFromHeaders(authorizationHeader);
            if (jwtTokenProvider.validateToken(token)) {
                var claims = jwtTokenProvider.extractClaims(token);
                var subject = claims.getSubject();
                var id = extractIdFromClaims(claims);

                var authToken = new UsernamePasswordAuthenticationToken(subject, null, List.of(id));

                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        filterChain.doFilter(request, response);
     }

     public static String extractTokenFromHeaders(String authHeader) {
        return authHeader.replace(TOKEN_PREFIX, "");
     }

     public static SimpleGrantedAuthority extractIdFromClaims(Claims claims) {
        return new SimpleGrantedAuthority(claims.get(TOKEN_ID_CLAIM, String.class));
     }

    public static String extractStringIdFromClaims(Claims claims) {
        return claims.get(TOKEN_ID_CLAIM).toString();
    }

}
