package com.example.midimanager.testdata;

import com.example.midimanager.converter.MidiConverter;
import org.jetbrains.annotations.NotNull;

import javax.sound.midi.InvalidMidiDataException;
import javax.sound.midi.MidiSystem;
import javax.sound.midi.Sequence;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

public class MidiGenerator {

    public static String generateEmptyMidi() throws InvalidMidiDataException {
        var sequence = new Sequence(Sequence.PPQ, 24);
        sequence.createTrack();

        byte[] midiBytes = sequenceToByteArray(sequence);

        return MidiConverter.convert(midiBytes);
    }

    public static byte @NotNull [] sequenceToByteArray(Sequence sequence) {
        try {
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            MidiSystem.write(sequence, 1, byteArrayOutputStream);

            return byteArrayOutputStream.toByteArray();
        } catch (IOException e) {
            return new byte[0];
        }
    }

}
