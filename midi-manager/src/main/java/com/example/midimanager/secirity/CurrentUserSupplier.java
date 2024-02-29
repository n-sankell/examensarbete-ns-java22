package com.example.midimanager.secirity;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class CurrentUserSupplier {

    public CurrentUser getCurrentUser() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return new CurrentUser(null, null, UserAuthentication.UNAUTHENTICATED);
        }
        var userId = authentication.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList().getFirst();
        var username = authentication.getPrincipal().toString();

        if (userId.equals("ROLE_ANONYMOUS")) {
            return new CurrentUser(null, null, UserAuthentication.UNAUTHENTICATED);
        }

        return new CurrentUser(UUID.fromString(userId), username, UserAuthentication.AUTHENTICATED);
    }

}
