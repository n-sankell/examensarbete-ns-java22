package com.midio.midimanager.secirity;

import com.midio.midimanager.model.UserId;

public record CurrentUser(UserId userId, String username, UserAuthentication userAuthentication) {

    public boolean isAuthenticated() {
        return userAuthentication == UserAuthentication.AUTHENTICATED;
    }

    public String idToString() {
        return userId == null ? null : userId.id() == null ? null : String.valueOf(userId.id());
    }

}
