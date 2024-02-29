package com.example.midimanager.secirity;

import java.util.UUID;

public record CurrentUser(UUID userId, String username, UserAuthentication userAuthentication) {

    public boolean isAuthenticated() {
        return userAuthentication == UserAuthentication.AUTHENTICATED;
    }

}
