package com.example.springbootapp.model;

import java.util.UUID;

public record Blob(UUID blobId, byte[] midiData) {

}
