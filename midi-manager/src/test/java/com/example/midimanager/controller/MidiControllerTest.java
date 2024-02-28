package com.example.midimanager.controller;

import com.example.midimanager.config.MidiManagerTestEnvironment;
import com.example.midimanager.testdata.MockApi;
import com.example.midimanager.testdata.MockTokenGenerator;
import com.example.midimanager.testdata.MockUser;
import com.example.midimanager.testdata.TokenType;
import generatedapi.model.MidiCreateRequestDto;
import generatedapi.model.MidiEditBinaryRequestDto;
import generatedapi.model.MidiEditMetaRequestDto;
import generatedapi.model.MidiEditRequestDto;
import generatedapi.model.MidiWithDataDto;
import generatedapi.model.MidisDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import java.util.UUID;
import java.util.function.Supplier;
import java.util.stream.Stream;

import static com.example.midimanager.testdata.Base64Midi.GYMNOPEDIE;
import static com.example.midimanager.testdata.Base64Midi.TETRIS;
import static com.example.midimanager.testdata.MockUser.randomMockUser;
import static java.util.Objects.requireNonNull;
import static org.junit.jupiter.api.Assertions.assertEquals;

@MidiManagerTestEnvironment
public class MidiControllerTest {

    @Autowired
    private MidiController midiController;
    @Autowired
    private MockApi mockApi;
    @Autowired
    private MockTokenGenerator mockTokenGenerator;
    private MockUser mockUser;
    private String validToken;

    @ParameterizedTest
    @MethodSource("tokenTypeAndStatusCodeForCreate")
    void createMidi(TokenType tokenType, HttpStatus status) throws Exception {
        var token = getTokenByType(tokenType);
        // Create a midi with an artist name
        var artist = "Ymer Klipulver";
        var createRequestDto = tetrisCreatePublicRequest.get()
            .artist(artist);

        var response = mockApi.makePostRequest("/midis/create", token, createRequestDto, MidiWithDataDto.class);
        assertEquals(status, response.status());

        if (tokenType == TokenType.VALID) {
            var body = requireNonNull(response.body());
            var blobId = body.getMeta().getBlobRef();
            var userId = body.getMeta().getUserRef();

            // Check if the artist value is correct
            assertEquals(artist, body.getMeta().getArtist());
            assertEquals(blobId, body.getBinary().getBinaryId());
            assertEquals(mockUser.userId(), userId);
        }
    }

    @Test
    void getPublicMidis() {
        // First response will be empty
        var firstResponse = midiController.getPublicMidis();
        var firstBody = requireNonNull(firstResponse.getBody());
        assertEquals(0, firstBody.getMidis().size());

        // Create two public midi entries
        midiController.createMidi(tetrisCreatePublicRequest.get());
        midiController.createMidi(anotherCreatePublicRequest.get());
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
        var createdMidi = midiController.createMidi(tetrisCreatePublicRequest.get());
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
        midiController.createMidi(anotherCreatePublicRequest.get());

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
        midiController.createMidi(tetrisCreatePublicRequest.get());
        var toBeDeleted = midiController.createMidi(anotherCreatePublicRequest.get());
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

    @ParameterizedTest
    @MethodSource("tokenTypeAndStatusCodeForPublicMidi")
    void getPublicMidiById2(TokenType tokenType, HttpStatus status) throws Exception {
        // generate tokens with different access
        var token = getTokenByType(tokenType);
        // create a public midi with a valid token and get the midiId
        var createdMidi = mockApi.makePostRequest("/midis/create", validToken, tetrisCreatePublicRequest.get(), MidiWithDataDto.class);
        var midiId = createdMidi.body().getMeta().getMidiId();
        // create a get request for the created public midi
        var response = mockApi.makeGetRequest("/midis/midi/" + midiId, token, MidiWithDataDto.class);
        var midi = response.body().getMeta();
        // assert that the request return OK and that the userRef is equal to the valid userId
        assertEquals(status, response.status());
        assertEquals(mockUser.userId(), midi.getUserRef());
    }

    @ParameterizedTest
    @MethodSource("tokenTypeAndStatusCodeForPrivateMidi")
    void getPrivateMidiById2(TokenType tokenType, HttpStatus status) throws Exception {
        // generate tokens with different access
        var token = getTokenByType(tokenType);
        // create a private midi with a valid token and get the midiId
        var createdMidi = mockApi.makePostRequest("/midis/create", validToken, tetrisCreatePrivateRequest.get(), MidiWithDataDto.class);
        var midiId = createdMidi.body().getMeta().getMidiId();
        // create a get request for the created private midi with different tokens
        var response = mockApi.makeGetRequest("/midis/midi/" + midiId, token, MidiWithDataDto.class);
        // assert status code matches the expected code
        assertEquals(status, response.status());
        // when status is OK assert that other response values matches the expected values
        if (status == HttpStatus.OK) {
            var midi = response.body().getMeta();
            assertEquals(mockUser.userId(), midi.getUserRef());
        }
    }

    @ParameterizedTest
    @MethodSource("tokenTypeAndStatusCodeForUserMidis")
    void getMidisByUserId(TokenType tokenType, HttpStatus status) throws Exception {
        // generate tokens with different access
        var token = getTokenByType(tokenType);
        // create two midis with a valid token
        mockApi.makePostRequest("/midis/create", validToken, tetrisCreatePublicRequest.get(), MidiWithDataDto.class);
        mockApi.makePostRequest("/midis/create", validToken, tetrisCreatePrivateRequest.get(), MidiWithDataDto.class);
        // create a get request for the midis from the valid user
        var response = mockApi.makeGetRequest("/midis/user/" + mockUser.userId(), token, MidisDto.class);
        // assert status code matches the expected code
        assertEquals(status, response.status());
        // when status is OK assert that other response values matches the expected values
        if (status == HttpStatus.OK) {
            var firstMidi = response.body().getMidis().getFirst();
            assertEquals(2, response.body().getMidis().size());
            assertEquals(mockUser.userId(), firstMidi.getUserRef());
        }
    }

    @BeforeEach
    void setUp() {
        mockUser = randomMockUser();
        validToken = mockTokenGenerator.generateTokenForUser(mockUser);
    }

    private static Stream<Arguments> tokenTypeAndStatusCodeForPublicMidi() {
        return Stream.of(
            Arguments.of(TokenType.VALID, HttpStatus.OK),
            Arguments.of(TokenType.EXPIRED, HttpStatus.OK),
            Arguments.of(TokenType.INVALID, HttpStatus.OK),
            Arguments.of(TokenType.OTHER_USER, HttpStatus.OK),
            Arguments.of(TokenType.NULL, HttpStatus.OK)
        );
    }

    private static Stream<Arguments> tokenTypeAndStatusCodeForPrivateMidi() {
        return Stream.of(
            Arguments.of(TokenType.VALID, HttpStatus.OK),
            Arguments.of(TokenType.EXPIRED, HttpStatus.FORBIDDEN),
            Arguments.of(TokenType.INVALID, HttpStatus.FORBIDDEN),
            Arguments.of(TokenType.OTHER_USER, HttpStatus.FORBIDDEN),
            Arguments.of(TokenType.NULL, HttpStatus.FORBIDDEN)
        );
    }

    private static Stream<Arguments> tokenTypeAndStatusCodeForUserMidis() {
        return Stream.of(
            Arguments.of(TokenType.VALID, HttpStatus.OK),
            Arguments.of(TokenType.EXPIRED, HttpStatus.UNAUTHORIZED),
            Arguments.of(TokenType.INVALID, HttpStatus.UNAUTHORIZED),
            Arguments.of(TokenType.OTHER_USER, HttpStatus.FORBIDDEN),
            Arguments.of(TokenType.NULL, HttpStatus.UNAUTHORIZED)
        );
    }

    private static Stream<Arguments> tokenTypeAndStatusCodeForCreate() {
        return Stream.of(
            Arguments.of(TokenType.VALID, HttpStatus.OK),
            Arguments.of(TokenType.EXPIRED, HttpStatus.UNAUTHORIZED),
            Arguments.of(TokenType.INVALID, HttpStatus.UNAUTHORIZED),
            Arguments.of(TokenType.NULL, HttpStatus.UNAUTHORIZED)
        );
    }

    private String getTokenByType(TokenType tokenType) {
        return switch (tokenType) {
            case VALID -> validToken;
            case EXPIRED -> mockTokenGenerator.generateExpiredToken(mockUser);
            case INVALID -> mockTokenGenerator.generateInvalidToken(mockUser);
            case OTHER_USER -> mockTokenGenerator.generateTokenForUser(randomMockUser());
            case NULL -> null;
        };
    }

    private final Supplier<MidiCreateRequestDto> tetrisCreatePublicRequest = () ->
        new MidiCreateRequestDto()
            .isPrivate(false)
            .filename("tetris-type-a.mid")
            .artist("Hirokazu Tanaka")
            .title("Type A")
            .midiFile(TETRIS);

    private final Supplier<MidiCreateRequestDto> tetrisCreatePrivateRequest = () ->
        new MidiCreateRequestDto()
            .isPrivate(true)
            .filename("tetris-type-a.mid")
            .artist("Hirokazu Tanaka")
            .title("Type A")
            .midiFile(TETRIS);

    private final Supplier<MidiCreateRequestDto> anotherCreatePublicRequest = () ->
        new MidiCreateRequestDto()
            .isPrivate(false)
            .filename("moog-madness.mid")
            .artist("Gnesta Stefan")
            .title("Ylande Katt")
            .midiFile(TETRIS);

}
