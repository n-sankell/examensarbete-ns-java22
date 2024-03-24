package com.midio.userservice.secirity;

import com.midio.userservice.model.UserId;

public record CurrentUser(UserId userId, String email, UserAuthentication userAuthentication) {

    public boolean isAuthenticated() {
        return userAuthentication == UserAuthentication.AUTHENTICATED;
    }

    public String idToString() {
        return userId == null ? null : userId.id() == null ? null : String.valueOf(userId.id());
    }

}
