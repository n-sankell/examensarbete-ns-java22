package com.example.midimanager.controller;

import com.example.midimanager.config.MidiConstants;
import com.example.midimanager.config.MidiManagerTestEnvironment;
import com.example.midimanager.constants.Constants;
import generatedapi.model.MidiCreateRequestDto;
import generatedapi.model.MidiEditBinaryRequestDto;
import generatedapi.model.MidiEditMetaRequestDto;
import generatedapi.model.MidiEditRequestDto;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.UUID;
import java.util.function.Supplier;

import static java.util.Objects.requireNonNull;
import static org.junit.jupiter.api.Assertions.assertEquals;

@MidiManagerTestEnvironment
public class MidiControllerTest {

    @Autowired
    private MidiController midiController;

    @Test
    void createMidi() {
        // Create a midi with an artist name
        var artist = "Ymer Klipulver";
        var createRequestDto = tetrisCreateRequest
            .get()
            .artist(artist);

        var response = midiController.createMidi(createRequestDto);
        var body = requireNonNull(response.getBody());
        var blobId = body.getMeta().getBlobRef();

        // Check if the artist value is correct
        assertEquals(body.getMeta().getArtist(), artist);
        assertEquals(body.getBinary().getBinaryId(), blobId);
    }

    @Test
    void getPublicMidis() {
        // First response will be empty
        var firstResponse = midiController.getPublicMidis();
        var firstBody = requireNonNull(firstResponse.getBody());
        assertEquals(0, firstBody.getMidis().size());

        // Create two public midi entries
        midiController.createMidi(tetrisCreateRequest.get());
        midiController.createMidi(anotherCreateRequest.get());
        // Create one private entry
        midiController.createMidi(tetrisCreatePrivateRequest.get());

        // Second response will contain two entries
        var secondResponse = midiController.getPublicMidis();
        var secondBody = requireNonNull(secondResponse.getBody());
        assertEquals(2, secondBody.getMidis().size());
    }

    @Test
    void getPublicMidiById() {
        // Create a midi and retrieve the id and id of the blob
        var createdMidi = midiController.createMidi(tetrisCreateRequest.get());
        var midiId = requireNonNull(createdMidi.getBody()).getMeta().getMidiId();
        var blobId = requireNonNull(createdMidi.getBody()).getBinary().getBinaryId();

        // Get the midi by id
        var getResponse = midiController.getMidi(midiId);
        var responseBody = requireNonNull(getResponse.getBody());

        // Check if metadata and binary data is correct
        var responseBinaryId = responseBody.getBinary().getBinaryId();
        var responseMetaId = responseBody.getMeta().getMidiId();
        var responseBlobRef = responseBody.getMeta().getBlobRef();
        var responseBlob = responseBody.getBinary().getMidiFile();

        assertEquals(blobId, responseBinaryId);
        assertEquals(midiId, responseMetaId);
        assertEquals(responseBlobRef, responseBinaryId);
        assertEquals(responseBlob, MidiConstants.tetrisBase64);
    }

    @Test
    void getMidiByUserId() {
        // Create two midis, one with a specific user id.
        var ownerId = UUID.randomUUID();
        var createRequest = tetrisCreatePrivateRequest
            .get()
            .userId(ownerId);
        midiController.createMidi(createRequest);
        midiController.createMidi(anotherCreateRequest.get());

        // Get the midi by userId and check size
        var getResponse = midiController.getUserMidis(ownerId);
        var responseBody = requireNonNull(getResponse.getBody());
        assertEquals(1, responseBody.getMidis().size());

        // Check that the file has the correct user id
        // TODO: alter this test when auth gets implemented
        var theMidi = responseBody.getMidis().getFirst();
        assertEquals(ownerId, theMidi.getUserRef());
    }

    @Test
    void editMidiMetaAndBinary() {
        // Create a midi with a specific user id and get the midiId.
        var ownerId = UUID.randomUUID();
        var createRequest = tetrisCreatePrivateRequest
            .get()
            .userId(ownerId);
        var responseBody = requireNonNull(midiController.createMidi(createRequest).getBody());
        var midiId = responseBody.getMeta().getMidiId();

        // Edit the midi by midiId
        var editRequest = new MidiEditRequestDto()
            .binaryData(new MidiEditBinaryRequestDto().midiFile(Constants.GymnopedieNo1))
            .metadata(new MidiEditMetaRequestDto()
                .artist("Satie")
                .title("Gymnopedie No 1")
                .filename("gymnopedieno1.mid")
                .isPrivate(false));
        var editResponse = midiController.editMidi(midiId, editRequest);
        System.out.println(editResponse);
    }

    @Test
    void editMidiBinary() {
        // Create a midi with a specific user id and get the midiId.
        var ownerId = UUID.randomUUID();
        var createRequest = tetrisCreatePrivateRequest
            .get()
            .userId(ownerId);
        var responseBody = requireNonNull(midiController.createMidi(createRequest).getBody());
        var midiId = responseBody.getMeta().getMidiId();

        // Edit the midi binary by midiId
        var editRequest = new MidiEditBinaryRequestDto().midiFile(Constants.GymnopedieNo1);
        var editResponse = midiController.editMidiBinary(midiId, editRequest);
        System.out.println(editResponse);
    }

    @Test
    void editMidiMeta() {
        // Create a midi with a specific user id and get the midiId.
        var ownerId = UUID.randomUUID();
        var createRequest = tetrisCreatePrivateRequest
            .get()
            .userId(ownerId);
        var responseBody = requireNonNull(midiController.createMidi(createRequest).getBody());
        var midiId = responseBody.getMeta().getMidiId();

        // Edit the midi metadata by midiId
        var editRequest = new MidiEditMetaRequestDto()
            .artist("Satie")
            .title("Gymnopedie No 1")
            .filename("gymnopedieno1.mid")
            .isPrivate(false);
        var editResponse = midiController.editMidiMeta(midiId, editRequest);
        System.out.println(editResponse);
    }

    @Test
    void deleteMidi() {
        // Create two midi entries and retrieve one of the ids
        midiController.createMidi(tetrisCreateRequest.get());
        var toBeDeleted = midiController.createMidi(anotherCreateRequest.get());
        var deletedId = requireNonNull(toBeDeleted.getBody()).getMeta().getMidiId();

        // Check that there is two entries in the database
        var firstGetResponse = midiController.getPublicMidis();
        var firstGetBody = requireNonNull(firstGetResponse.getBody());
        assertEquals(2, firstGetBody.getMidis().size());

        // Delete the file and check that there is only one entry left
        midiController.deleteMidi(deletedId);
        var secondGetResponse = midiController.getPublicMidis();
        var secondGetBody = requireNonNull(secondGetResponse.getBody());
        assertEquals(1, secondGetBody.getMidis().size());
    }

    private final Supplier<MidiCreateRequestDto> tetrisCreateRequest = () ->
        new MidiCreateRequestDto()
            .userId(UUID.randomUUID())
            .isPrivate(false)
            .filename("tetris-type-a.mid")
            .artist("Hirokazu Tanaka")
            .title("Type A")
            .midiFile(MidiConstants.tetrisBase64);

    private final Supplier<MidiCreateRequestDto> tetrisCreatePrivateRequest = () ->
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
            .isPrivate(false)
            .filename("moog-madness.mid")
            .artist("Gnesta Stefan")
            .title("Ylande Katt")
            .midiFile(MidiConstants.tetrisBase64);

}
