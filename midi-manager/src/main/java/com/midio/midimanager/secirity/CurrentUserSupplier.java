package com.midio.midimanager.secirity;

import com.midio.midimanager.model.UserId;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.UUID;

import static com.midio.midimanager.secirity.UserAuthentication.AUTHENTICATED;
import static com.midio.midimanager.secirity.UserAuthentication.UNAUTHENTICATED;

@Component
public class CurrentUserSupplier {

    public CurrentUser getCurrentUser() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return new CurrentUser(null, null, UNAUTHENTICATED);
        }
        var userId = authentication.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList().getFirst();
        var username = authentication.getPrincipal().toString();

        if (userId.equals(JwtConstants.DEFAULT_CLAIM)) {
            return new CurrentUser(null, null, UNAUTHENTICATED);
        }

        return new CurrentUser(new UserId(UUID.fromString(userId)), username, AUTHENTICATED);
    }

}
