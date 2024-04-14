package com.midio.userservice.model;

public record UserAndDetails(User user, UserDetails userDetails) {

    public UserId getUserId() {
        return user.userId();
    }

    public String getUserIdAsString() {
        return String.valueOf(user.userId().id());
    }

    public String getUsername() {
        return userDetails.username();
    }

    public String getEmail() {
        return userDetails.email();
    }

    public static UserAndDetails of(User user, UserDetails details) {
        return new UserAndDetails(user, details);
    }

}
