package com.midio.userservice.model;

import java.util.UUID;

public record DetailsId(UUID id) implements Identity {

    @Override
    public UUID id() {
        return id;
    }

    public static DetailsId newDetailsId() {
        return new DetailsId(UUID.randomUUID());
    }
}
