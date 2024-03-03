package com.example.midimanager.model;

import java.util.UUID;

public record BlobId(UUID id) implements Identity {

    @Override
    public UUID id() {
        return id;
    }

    public static BlobId newBlobId() {
        return new BlobId(UUID.randomUUID());
    }

}
