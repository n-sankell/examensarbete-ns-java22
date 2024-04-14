package com.midio.userservice.model;

import java.util.UUID;

public record PassId(UUID id) implements Identity {

    @Override
    public UUID id() {
        return id;
    }

    public static PassId newPassId() {
        return new PassId(UUID.randomUUID());
    }

}
