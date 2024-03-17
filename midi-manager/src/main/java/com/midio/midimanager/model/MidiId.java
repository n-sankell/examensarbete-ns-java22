package com.midio.midimanager.model;

import java.util.UUID;

public record MidiId(UUID id) implements Identity {

    @Override
    public UUID id() {
        return id;
    }

    public static MidiId newMidiId() {
        return new MidiId(UUID.randomUUID());
    }

}
