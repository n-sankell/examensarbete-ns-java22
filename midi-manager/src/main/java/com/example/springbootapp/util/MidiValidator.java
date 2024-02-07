package com.example.springbootapp.util;

import javax.sound.midi.InvalidMidiDataException;
import javax.sound.midi.MidiSystem;
import javax.sound.midi.Sequence;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Arrays;

public class MidiValidator {

    public static void validate(byte[] data) {
        try {
            var inputStream = new ByteArrayInputStream(data);
            var seq = MidiSystem.getSequence(inputStream);

            if (hasLength(seq) && containsTracks(seq) && containsEvents(seq)) {
                return;
            }

        } catch (InvalidMidiDataException | IOException | NullPointerException e) {
            throw new RuntimeException(e);
        }
        throw new RuntimeException("Error, file does not contain any events or tracks");
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
