package com.midio.midimanager.model;

import java.util.Optional;

public record MidiAndBlob(Optional<Midi> metaData, Optional<Blob> blob) {
}
