package com.example.midimanager.secirity;

import com.example.midimanager.model.UserId;

public record CurrentUser(UserId userId, String username, UserAuthentication userAuthentication) {

    public boolean isAuthenticated() {
        return userAuthentication == UserAuthentication.AUTHENTICATED;
    }

    public String idToString() {
        return String.valueOf(userId.id());
    }

}
