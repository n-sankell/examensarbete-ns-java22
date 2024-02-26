package com.example.midimanager.controller;

import com.example.midimanager.config.MidiManagerTestEnvironment;
import com.example.midimanager.testdata.MockTokenGenerator;
import com.example.midimanager.testdata.MockUser;
import com.example.midimanager.testdata.TokenType;
import com.fasterxml.jackson.databind.ObjectMapper;
import generatedapi.model.MidiCreateRequestDto;
import generatedapi.model.MidiEditBinaryRequestDto;
import generatedapi.model.MidiEditMetaRequestDto;
import generatedapi.model.MidiEditRequestDto;
import generatedapi.model.MidisDto;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpHeaders;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultMatcher;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.util.UUID;
import java.util.function.Supplier;
import java.util.stream.Stream;

import static com.example.midimanager.secirity.Constants.TOKEN_PREFIX;
import static com.example.midimanager.testdata.Base64Midi.GYMNOPEDIE;
import static com.example.midimanager.testdata.Base64Midi.TETRIS;
import static java.util.Objects.requireNonNull;
import static org.junit.jupiter.api.Assertions.assertEquals;

@MidiManagerTestEnvironment
public class MidiControllerTest {

    @LocalServerPort
    private int port;

    @Autowired
    private MidiController midiController;
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private MockTokenGenerator mockTokenGenerator;
    @Autowired
    private ObjectMapper objectMapper;

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
        assertEquals(responseBlob, TETRIS);
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
            .binaryData(new MidiEditBinaryRequestDto().midiFile(GYMNOPEDIE))
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
        var editRequest = new MidiEditBinaryRequestDto().midiFile(GYMNOPEDIE);
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

    private static Stream<Arguments> tokenTypeAndStatusCode() {
        return Stream.of(
            Arguments.of(TokenType.VALID, MockMvcResultMatchers.status().isOk()),
            Arguments.of(TokenType.EXPIRED, MockMvcResultMatchers.status().isUnauthorized()),
            Arguments.of(TokenType.INVALID, MockMvcResultMatchers.status().isUnauthorized()),
            Arguments.of(TokenType.OTHER_USER, MockMvcResultMatchers.status().isForbidden())
        );
    }

    @ParameterizedTest
    @MethodSource("tokenTypeAndStatusCode")
    void testAutToken(TokenType tokenType, ResultMatcher status) throws Exception {
        var mockUser = new MockUser(UUID.randomUUID(), "User");
        var token = switch (tokenType) {
            case VALID -> mockTokenGenerator.generateTokenForUser(mockUser);
            case EXPIRED -> mockTokenGenerator.generateExpiredToken(mockUser);
            case INVALID -> mockTokenGenerator.generateInvalidToken(mockUser);
            case OTHER_USER -> mockTokenGenerator.generateTokenForUser(new MockUser(UUID.randomUUID(), "Other user"));
        };

        var createRequest = tetrisCreatePrivateRequest
            .get()
            .userId(mockUser.userId());
        midiController.createMidi(createRequest);

        var result = mockMvc.perform(
            MockMvcRequestBuilders
                .get("/midi/user/" + mockUser.userId())
                .header(HttpHeaders.AUTHORIZATION, TOKEN_PREFIX + token)
            )
            .andExpect(status)
            .andReturn();

        if (tokenType == TokenType.VALID) {
            var body = objectMapper.readValue(result.getResponse().getContentAsString(), MidisDto.class);
            var firstMidi = body.getMidis().getFirst();
            assertEquals(1, body.getMidis().size());
            assertEquals(mockUser.userId(), firstMidi.getUserRef());
        }
    }

    private final Supplier<MidiCreateRequestDto> tetrisCreateRequest = () ->
        new MidiCreateRequestDto()
            .userId(UUID.randomUUID())
            .isPrivate(false)
            .filename("tetris-type-a.mid")
            .artist("Hirokazu Tanaka")
            .title("Type A")
            .midiFile(TETRIS);

    private final Supplier<MidiCreateRequestDto> tetrisCreatePrivateRequest = () ->
        new MidiCreateRequestDto()
            .userId(UUID.randomUUID())
            .isPrivate(true)
            .filename("tetris-type-a.mid")
            .artist("Hirokazu Tanaka")
            .title("Type A")
            .midiFile(TETRIS);

    private final Supplier<MidiCreateRequestDto> anotherCreateRequest = () ->
        new MidiCreateRequestDto()
            .userId(UUID.randomUUID())
            .isPrivate(false)
            .filename("moog-madness.mid")
            .artist("Gnesta Stefan")
            .title("Ylande Katt")
            .midiFile(TETRIS);

}
