package com.midio.midimanager.util;

import com.midio.midimanager.exception.ValidationError;
import com.midio.midimanager.exception.ValidationException;

import javax.sound.midi.InvalidMidiDataException;
import javax.sound.midi.MidiSystem;
import javax.sound.midi.Sequence;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

public class MidiValidator {

    public static void validate(byte[] data) throws ValidationException {
        try (var inputStream = new ByteArrayInputStream(data)) {
            var seq = MidiSystem.getSequence(inputStream);

            if (hasLength(seq) && containsTracks(seq) && containsEvents(seq)) {
                return;
            }

        } catch (InvalidMidiDataException | IOException | NullPointerException e) {
            throw new ValidationException("Invalid midi-file",
                List.of(new ValidationError(
                    "midiFile",
                    "Invalid midi-file",
                    "binary data"
                )));
        }
        throw new ValidationException("Midi contains no events or tracks",
            List.of(new ValidationError(
                "midiFile",
                "Midi contains no events or tracks",
                "binary data"
            )));
    }

    private static boolean hasLength(Sequence seq) {
        return seq.getMicrosecondLength() > 0;
    }

    private static boolean containsTracks(Sequence seq) {
        return seq.getTracks().length > 0;
    }

    private static boolean containsEvents(Sequence seq) {
        return Arrays.stream(seq.getTracks()).anyMatch(track -> track.size() != 0);
    }

}
