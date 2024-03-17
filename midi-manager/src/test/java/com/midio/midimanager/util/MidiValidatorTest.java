package com.midio.midimanager.util;

import com.midio.midimanager.converter.MidiConverter;
import com.midio.midimanager.exception.ValidationException;
import com.midio.midimanager.testdata.Base64Midi;
import com.midio.midimanager.testdata.MidiGenerator;
import org.junit.jupiter.api.Assertions;
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
        assertEquals(HttpStatus.UNPROCESSABLE_ENTITY, exception.getStatusCode());
        assertEquals("Invalid midi-file", exception.getStatusText());
    }

    @Test
    void testEmptyMidi() {
        var bytes = Assertions.assertDoesNotThrow(MidiGenerator::generateEmptyMidi);
        var encoded = MidiConverter.convert(bytes);

        var exception = assertThrows((ValidationException.class), () -> MidiValidator.validate(encoded));

        assertEquals(HttpStatus.UNPROCESSABLE_ENTITY, exception.getStatusCode());
        assertEquals("Midi contains no events or tracks", exception.getStatusText());
    }

}
