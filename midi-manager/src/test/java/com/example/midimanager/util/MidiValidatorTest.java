package com.example.midimanager.util;

import com.example.midimanager.converter.MidiConverter;
import com.example.midimanager.exception.ValidationException;
import com.example.midimanager.testdata.Base64Midi;
import com.example.midimanager.testdata.MidiGenerator;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;

import static org.junit.jupiter.api.Assertions.*;

@SpringJUnitConfig
public class MidiValidatorTest {

    @Test
    void testValidMidi() {
        var midi = Base64Midi.TETRIS;
        var bytes = MidiConverter.convert(midi);
        var reEncodedMidi = MidiConverter.convert(bytes);

        assertDoesNotThrow(() -> MidiValidator.validate(bytes));
        assertEquals(midi, reEncodedMidi);
    }

    @Test
    void testInvalidMidi() {
        var midi = Base64Midi.INVALID;
        var encoded = MidiConverter.convert(midi);

        var exception = assertThrows((ValidationException.class), () -> MidiValidator.validate(encoded));
        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
        assertEquals("Invalid midi-file", exception.getStatusText());
    }

    @Test
    void testEmptyMidi() {
        var bytes = assertDoesNotThrow(MidiGenerator::generateEmptyMidi);
        var encoded = MidiConverter.convert(bytes);

        var exception = assertThrows((ValidationException.class), () -> MidiValidator.validate(encoded));

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
        assertEquals("Midi contains no events or tracks", exception.getStatusText());
    }

}
