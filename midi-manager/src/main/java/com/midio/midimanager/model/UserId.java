package com.midio.midimanager.model;

import java.util.UUID;

public record UserId(UUID id) implements Identity {

    @Override
    public UUID id() {
        return id;
    }

}
