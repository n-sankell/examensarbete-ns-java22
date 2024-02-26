package com.example.midimanager.secirity;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class CurrentUserSupplier {

    public CurrentUser getCurrentUser() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        var userId = authentication.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList().getFirst();

        return new CurrentUser(UUID.fromString(userId));
    }

}
