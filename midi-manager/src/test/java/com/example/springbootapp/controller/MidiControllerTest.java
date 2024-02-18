package com.example.springbootapp.controller;

import com.example.springbootapp.config.MidiConstants;
import com.example.springbootapp.config.MidiManagerTestEnvironment;
import generatedapi.model.MidiCreateRequestDto;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.server.LocalServerPort;

import java.util.UUID;
import java.util.function.Supplier;

import static java.util.Objects.requireNonNull;
import static org.junit.jupiter.api.Assertions.assertEquals;

@MidiManagerTestEnvironment
public class MidiControllerTest {

    @LocalServerPort
    private int port;

    @Autowired
    private MidiController midiController;

    @Test
    void addMidi() {
        var artist = "Hirokazu Tanaka";
        var createRequestDto = tetrisCreateRequest
            .get()
            .artist(artist);

        var response = midiController.createMidi(createRequestDto);
        var body = requireNonNull(response.getBody());
        var blobId = body.getMeta().getBlobRef();

        assertEquals(body.getMeta().getArtist(), artist);
        assertEquals(body.getBinary().getBinaryId(), blobId);
    }

    @Test
    void getMidiById() {
        var createdMidi = midiController.createMidi(tetrisCreateRequest.get());
        var midiId = requireNonNull(createdMidi.getBody()).getMeta().getMidiId();
        var blobId = requireNonNull(createdMidi.getBody()).getBinary().getBinaryId();

        var getResponse = midiController.getMidi(midiId);
        var responseBody = requireNonNull(getResponse.getBody());

        var responseBinaryId = responseBody.getBinary().getBinaryId();
        var responseMetaId = responseBody.getMeta().getMidiId();
        var responseBlobRef = responseBody.getMeta().getBlobRef();
        var responseBlob = responseBody.getBinary().getMidiFile();

        assertEquals(blobId, responseBinaryId);
        assertEquals(midiId, responseMetaId);
        assertEquals(responseBlobRef, responseBinaryId);
        assertEquals(responseBlob, MidiConstants.tetrisBase64);

        System.out.println(responseBody);
    }

    @Test
    void getMidis() {
        var firstResponse = midiController.getMidis();
        midiController.createMidi(tetrisCreateRequest.get());
        midiController.createMidi(anotherCreateRequest.get());
        var secondResponse = midiController.getMidis();

        var firstBody = requireNonNull(firstResponse.getBody());
        assertEquals(0, firstBody.getMidis().size());

        var secondBody = requireNonNull(secondResponse.getBody());
        assertEquals(2, secondBody.getMidis().size());
        secondBody.getMidis().forEach(System.out::println);
    }

    private final Supplier<MidiCreateRequestDto> tetrisCreateRequest = () ->
        new MidiCreateRequestDto()
            .userId(UUID.randomUUID())
            .isPrivate(true)
            .filename("tetris-type-a.mid")
            .artist("Hirokazu Tanaka")
            .title("Type A")
            .midiFile(MidiConstants.tetrisBase64);

    private final Supplier<MidiCreateRequestDto> anotherCreateRequest = () ->
        new MidiCreateRequestDto()
            .userId(UUID.randomUUID())
            .isPrivate(true)
            .filename("moog-madness.mid")
            .artist("Gnesta Stefan")
            .title("Ylande Katt")
            .midiFile(MidiConstants.tetrisBase64);

}
