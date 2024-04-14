package com.midio.userservice.model;

import java.util.UUID;

public record UserId(UUID id) implements Identity {

    @Override
    public UUID id() {
        return id;
    }

    public static UserId newUserId() {
        return new UserId(UUID.randomUUID());
    }

}
