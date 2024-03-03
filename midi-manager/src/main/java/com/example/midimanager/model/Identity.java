package com.example.midimanager.model;

import java.util.UUID;

public sealed interface Identity permits BlobId, MidiId, UserId {

    UUID id();

}
