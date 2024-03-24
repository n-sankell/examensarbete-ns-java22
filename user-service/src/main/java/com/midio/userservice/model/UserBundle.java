package com.midio.userservice.model;

public record UserBundle(User user, UserDetails userDetails, Password password) {
}
