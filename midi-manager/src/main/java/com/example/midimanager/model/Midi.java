package com.example.midimanager.model;

import java.time.ZonedDateTime;
import java.util.UUID;

public record Midi(
    UUID midiId,
    UUID blobRef,
    UUID userRef,
    boolean isPrivate,
    String filename,
    String artist,
    String title,
    ZonedDateTime dateCreated,
    ZonedDateTime dateEdited
) {
}
