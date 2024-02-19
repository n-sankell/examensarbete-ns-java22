package com.example.midimanager.util;

import org.springframework.web.multipart.MultipartFile;

import javax.sound.midi.InvalidMidiDataException;
import javax.sound.midi.MidiSystem;
import javax.sound.midi.Sequence;
import java.io.IOException;
import java.util.Arrays;

public class MidiUtil {

    public static byte[] getByteData(MultipartFile file) {
        try {
            var seq = MidiSystem.getSequence(file.getInputStream());

            if (hasLength(seq) && containsTracks(seq) && containsEvents(seq)) {
                return file.getBytes();
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
