package com.example.midimanager.model;

import java.util.UUID;

public record Blob(UUID blobId, byte[] midiData) {

}
