package com.midio.midimanager.model;

import java.time.ZonedDateTime;

public record Midi(
    MidiId midiId,
    BlobId blobRef,
    UserId userRef,
    boolean isPrivate,
    String filename,
    String artist,
    String title,
    ZonedDateTime dateCreated,
    ZonedDateTime dateEdited
) {
}
