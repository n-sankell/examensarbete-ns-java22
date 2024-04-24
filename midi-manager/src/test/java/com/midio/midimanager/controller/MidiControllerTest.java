package com.midio.midimanager.controller;

import com.midio.midimanager.config.MidiManagerTestEnvironment;
import com.midio.midimanager.exception.ValidationException;
import com.midio.midimanager.testdata.MidiGenerator;
import com.midio.midimanager.testdata.MockApi;
import com.midio.midimanager.testdata.MockTokenGenerator;
import com.midio.midimanager.testdata.MockUser;
import com.midio.midimanager.testdata.TokenType;
import com.midio.midimanager.testdata.Base64Midi;
import generatedapi.model.MidiCreateRequestDto;
import generatedapi.model.MidiEditBinaryRequestDto;
import generatedapi.model.MidiEditMetaRequestDto;
import generatedapi.model.MidiEditRequestDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.client.HttpClientErrorException;

import java.util.function.Supplier;
import java.util.stream.Stream;

import static java.util.Objects.requireNonNull;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.http.HttpStatus.UNPROCESSABLE_ENTITY;

@MidiManagerTestEnvironment
public class MidiControllerTest {

    @Autowired
    private MockApi mockApi;
    @Autowired
    private MockTokenGenerator mockTokenGenerator;
    private MockUser mockUser;
    private String validToken;

    @Test
    void createMidiWithInvalidBinaryData() throws Exception {
        var token = getTokenByType(TokenType.VALID);

        // Create a midi with an empty midi file
        var createRequestDto = tetrisCreatePublicRequest.get()
            .midiFile(MidiGenerator.generateEmptyMidi());

        var response =
            assertThrows(
                ValidationException.class,
                () -> mockApi.createMidi(token, createRequestDto)
            );

        assertEquals(UNPROCESSABLE_ENTITY, response.getStatusCode());
    }

    @Test
    void createMidiWithInvalidMetaData() {
        var token = getTokenByType(TokenType.VALID);

        // Create a midi with a invalid meta data
        var createRequestDto = new MidiCreateRequestDto()
            .isPrivate(null)
            .filename("t")
            .artist("Gnesta Stefan")
            .title("")
            .midiFile(Base64Midi.TETRIS);

        var response =
            assertThrows(
                ValidationException.class,
                () -> mockApi.createMidi(token, createRequestDto)
            );

        assertEquals(UNPROCESSABLE_ENTITY, response.getStatusCode());
    }

    @Test
    void editMidiWithInvalidData() throws Exception {
        var token = getTokenByType(TokenType.VALID);
        var createRequestDto = tetrisCreatePublicRequest.get();
        var createResponse = mockApi.createMidi(token, createRequestDto);
        var midiId = requireNonNull(createResponse.getBody()).getMeta().getMidiId();

        var editRequest = new MidiEditRequestDto()
            .metadata(new MidiEditMetaRequestDto()
                .filename("t"))
            .binaryData(new MidiEditBinaryRequestDto()
                .midiFile(Base64Midi.INVALID));

        var response =
            assertThrows(
                ValidationException.class,
                () -> mockApi.editMidi(midiId, token, editRequest)
            );

        assertEquals(UNPROCESSABLE_ENTITY, response.getStatusCode());
    }

    @Test
    void editMidiWithInvalidMetaData() throws Exception {
        var token = getTokenByType(TokenType.VALID);
        var createRequestDto = tetrisCreatePublicRequest.get();
        var createResponse = mockApi.createMidi(token, createRequestDto);
        var midiId = requireNonNull(createResponse.getBody()).getMeta().getMidiId();

        var editRequest = new MidiEditMetaRequestDto()
            .filename("t");

        var response =
            assertThrows(
                ValidationException.class,
                () -> mockApi.editMidiMeta(midiId, token, editRequest)
            );

        assertEquals(UNPROCESSABLE_ENTITY, response.getStatusCode());
    }

    @Test
    void editMidiWithInvalidBinaryData() throws Exception {
        var token = getTokenByType(TokenType.VALID);
        var createRequestDto = tetrisCreatePublicRequest.get();
        var createResponse = mockApi.createMidi(token, createRequestDto);
        var midiId = requireNonNull(createResponse.getBody()).getMeta().getMidiId();

        var editRequest = new MidiEditBinaryRequestDto()
            .midiFile(Base64Midi.INVALID);

        var response =
            assertThrows(
                ValidationException.class,
                () -> mockApi.editMidiBinary(midiId, token, editRequest)
            );

        assertEquals(UNPROCESSABLE_ENTITY, response.getStatusCode());
    }

    @ParameterizedTest
    @MethodSource("tokenTypeAndStatusCodeForCreate")
    void createMidi(TokenType tokenType, HttpStatus status) {
        var token = getTokenByType(tokenType);

        // Create a midi with an artist name
        var artist = "Ymer Klipulver";
        var createRequestDto = tetrisCreatePublicRequest.get()
            .artist(artist);

        if (tokenType == TokenType.VALID) {
            var okResponse = assertDoesNotThrow(
                () -> mockApi.createMidi(token, createRequestDto)
            );
            var body = requireNonNull(okResponse.getBody());

            // Check if the artist value is correct
            assertEquals(status, okResponse.getStatusCode());
            assertEquals(artist, body.getMeta().getArtist());
        } else {
            var errorResponse = assertThrows(
                HttpClientErrorException.class,
                () -> mockApi.createMidi(token, createRequestDto)
            );
            assertEquals(status, errorResponse.getStatusCode());
        }
    }

    @ParameterizedTest
    @MethodSource("tokenTypeAndStatusCodeForGetPublicMidi")
    void getPublicMidis(TokenType tokenType, HttpStatus status) throws Exception {
        var token = getTokenByType(tokenType);

        // First response will be empty
        var firstResponse = mockApi.getPublicMidis(token);
        var firstBody = requireNonNull(firstResponse.getBody());

        assertEquals(status, firstResponse.getStatusCode());
        assertEquals(0, firstBody.getMidis().size());

        // Create two public midi entries and one private
        mockApi.createMidi(validToken, tetrisCreatePublicRequest.get());
        mockApi.createMidi(validToken, anotherCreatePublicRequest.get());
        mockApi.createMidi(validToken, tetrisCreatePrivateRequest.get());

        // Second response will contain two entries
        var secondResponse = mockApi.getPublicMidis(token);
        var secondBody = requireNonNull(secondResponse.getBody());

        assertEquals(status, secondResponse.getStatusCode());
        assertEquals(2, secondBody.getMidis().size());
    }

    @ParameterizedTest
    @MethodSource("tokenTypeAndStatusCodeForUserMidis")
    void editMidiMetaAndBinary(TokenType tokenType, HttpStatus status) throws Exception {
        var token = getTokenByType(tokenType);

        // Create a midi and get the midiId.
        var createResponse = mockApi.createMidi(validToken, tetrisCreatePublicRequest.get());
        var midiId = requireNonNull(createResponse.getBody()).getMeta().getMidiId();

        // Edit the midi by midiId
        var editRequest = new MidiEditRequestDto()
            .binaryData(new MidiEditBinaryRequestDto().midiFile(Base64Midi.GYMNOPEDIE))
            .metadata(new MidiEditMetaRequestDto()
                .artist("Satie")
                .title("Gymnopedie No 1")
                .filename("gymnopedie-no1.mid")
                .isPrivate(false));

        if (status == HttpStatus.OK) {
            var editResponse = assertDoesNotThrow(
                () -> mockApi.editMidi(midiId, token, editRequest)
            );

            // When status is OK assert that changes hav been made otherwise the midi should be unchanged
            assertEquals(status, editResponse.getStatusCode());
            assertEquals("Satie", requireNonNull(editResponse.getBody()).getMeta().getArtist());
            assertEquals(Base64Midi.GYMNOPEDIE, editResponse.getBody().getBinary().getMidiFile());
        } else {
            var editResponse = assertThrows(
                HttpClientErrorException.class,
                () -> mockApi.editMidi(midiId, token, editRequest)
            );
            assertEquals(status, editResponse.getStatusCode());
            var secondResponse = mockApi.getMidiById(midiId, validToken);
            assertEquals(createResponse.getBody().getMeta(), requireNonNull(secondResponse.getBody()).getMeta());
            assertEquals(Base64Midi.TETRIS, secondResponse.getBody().getBinary().getMidiFile());
        }
    }

    @ParameterizedTest
    @MethodSource("tokenTypeAndStatusCodeForUserMidis")
    void editMidiBinary(TokenType tokenType, HttpStatus status) throws Exception {
        var token = getTokenByType(tokenType);

        // Create a midi with a valid token and get the midiId.
        var createResponse = mockApi.createMidi(validToken, tetrisCreatePublicRequest.get());
        var midiId = requireNonNull(createResponse.getBody()).getMeta().getMidiId();

        // Edit the midi binary by midiId
        var editRequest = new MidiEditBinaryRequestDto().midiFile(Base64Midi.GYMNOPEDIE);

        if (status == HttpStatus.OK) {
            var editResponse = assertDoesNotThrow(
                () -> mockApi.editMidiBinary(midiId, token, editRequest)
            );

            // When status is OK assert that changes hav been made otherwise the midi should be unchanged
            assertEquals(status, editResponse.getStatusCode());
            assertEquals("Hirokazu Tanaka", requireNonNull(editResponse.getBody()).getMeta().getArtist());
            assertEquals(Base64Midi.GYMNOPEDIE, editResponse.getBody().getBinary().getMidiFile());
        } else {
            var secondResponse = mockApi.getMidiById(midiId, validToken);
            assertEquals(createResponse.getBody().getMeta(), requireNonNull(secondResponse.getBody()).getMeta());
            assertEquals(Base64Midi.TETRIS, requireNonNull(secondResponse.getBody()).getBinary().getMidiFile());
        }
    }

    @ParameterizedTest
    @MethodSource("tokenTypeAndStatusCodeForUserMidis")
    void editMidiMeta(TokenType tokenType, HttpStatus status) throws Exception {
        var token = getTokenByType(tokenType);

        // Create a midi with a valid token and get the midiId.
        var createResponse = mockApi.createMidi(validToken, tetrisCreatePublicRequest.get());
        var midiId = requireNonNull(createResponse.getBody()).getMeta().getMidiId();

        // Edit the midi metadata by midiId
        var editRequest = new MidiEditMetaRequestDto()
            .artist("Satie")
            .title("Gymnopedie No 1")
            .filename("gymnopedie-no1.mid")
            .isPrivate(false);

        if (status == HttpStatus.OK) {
            var editResponse = assertDoesNotThrow(
                () -> mockApi.editMidiMeta(midiId, token, editRequest)
            );

            // When status is OK assert that changes hav been made otherwise the midi should be unchanged
            assertEquals(status, editResponse.getStatusCode());
            var artist = requireNonNull(editResponse.getBody()).getMeta().getArtist();
            var midiFile = editResponse.getBody().getBinary().getMidiFile();
            assertEquals("Satie", artist);
            assertEquals(Base64Midi.TETRIS, midiFile);
        } else {
            var editResponse = assertThrows(
                HttpClientErrorException.class,
                () -> mockApi.editMidiMeta(midiId, token, editRequest)
            );
            assertEquals(status, editResponse.getStatusCode());
            var secondResponse = mockApi.getMidiById(midiId, validToken);
            assertEquals(createResponse.getBody().getMeta(), requireNonNull(secondResponse.getBody()).getMeta());
            assertEquals(Base64Midi.TETRIS, secondResponse.getBody().getBinary().getMidiFile());
        }
    }

    @ParameterizedTest
    @MethodSource("tokenTypeAndStatusCodeForUserMidis")
    void deleteMidi(TokenType tokenType, HttpStatus status) throws Exception {
        // Generate tokens with different access
        var token = getTokenByType(tokenType);

        // Create two midis with a valid token, get the id of the one to delete
        mockApi.createMidi(validToken, tetrisCreatePublicRequest.get());
        var toBeDeleted = mockApi.createMidi(validToken, tetrisCreatePrivateRequest.get());
        var deletedId = requireNonNull(toBeDeleted.getBody()).getMeta().getMidiId();

        // Check that there is two entries in the database
        var firstResponse = mockApi.getUserMidis(validToken);
        assertEquals(2, requireNonNull(firstResponse.getBody()).getMidis().size());

        // Try to delete the file and check status code
        if (status == HttpStatus.OK) {
            var deleteResponse = assertDoesNotThrow(
                () -> mockApi.deleteMidi(deletedId, token)
            );
            // When status is OK assert that second response size has decreased else as before
            var secondResponse = mockApi.getUserMidis(validToken);
            assertEquals(status, deleteResponse.getStatusCode());
            assertEquals(1, requireNonNull(secondResponse.getBody()).getMidis().size());
        } else {
            var deleteResponse = assertThrows(
                HttpClientErrorException.class,
                () -> mockApi.deleteMidi(deletedId, token)
            );
            var secondResponse = mockApi.getUserMidis(validToken);
            assertEquals(status, deleteResponse.getStatusCode());
            assertEquals(2, requireNonNull(secondResponse.getBody()).getMidis().size());
        }
    }

    @ParameterizedTest
    @MethodSource("tokenTypeAndStatusCodeForGetPublicMidi")
    void getPublicMidiById(TokenType tokenType, HttpStatus status) throws Exception {
        // generate tokens with different access
        var token = getTokenByType(tokenType);

        // create a public midi with a valid token and get the midiId
        var createdMidi = mockApi.createMidi(validToken, tetrisCreatePublicRequest.get());
        var createResponseMidiId = requireNonNull(createdMidi.getBody()).getMeta().getMidiId();

        // create a get request for the created public midi
        var response = mockApi.getMidiById(createResponseMidiId, token);

        // extract midi and blob from the response
        var midi = requireNonNull(response.getBody()).getMeta();
        var blob = response.getBody().getBinary();

        // assert that the request return OK and that the midiId is correct
        assertEquals(status, response.getStatusCode());
        assertEquals(createResponseMidiId, midi.getMidiId());
        assertEquals(Base64Midi.TETRIS, blob.getMidiFile());
    }

    @ParameterizedTest
    @MethodSource("tokenTypeAndStatusCodeForGetPrivateMidi")
    void getPrivateMidiById(TokenType tokenType, HttpStatus status) throws Exception {
        // generate tokens with different access
        var token = getTokenByType(tokenType);

        // create a private midi with a valid token and get the midiId
        var createdMidi = mockApi.createMidi(validToken, tetrisCreatePrivateRequest.get());
        var midiId = requireNonNull(createdMidi.getBody()).getMeta().getMidiId();

        // create a get request for the created private midi with different tokens
        if (status == HttpStatus.OK) {
            var response = assertDoesNotThrow(
                () -> mockApi.getMidiById(midiId, token)
            );
            // when status is OK assert that response values matches the expected values
            assertEquals(status, response.getStatusCode());
            var midi = requireNonNull(response.getBody()).getMeta();
            assertEquals(midiId, midi.getMidiId());
        } else {
            var response = assertThrows(
                HttpClientErrorException.class,
                () -> mockApi.getMidiById(midiId, token)
            );
            assertEquals(status, response.getStatusCode());
        }
    }

    @ParameterizedTest
    @MethodSource("tokenTypeAndStatusCodeForGetUserMidis")
    void getMidisByUserId(TokenType tokenType, HttpStatus status) throws Exception {
        // generate tokens with different access
        var token = getTokenByType(tokenType);
        // create two midis with a valid token
        mockApi.createMidi(validToken, tetrisCreatePublicRequest.get());
        mockApi.createMidi(validToken, tetrisCreatePrivateRequest.get());

        if (status == HttpStatus.OK) {
            // when status is OK assert that response values matches the expected values
            var expectedSize = tokenType == TokenType.VALID ? 2 : 0;
            var response = assertDoesNotThrow(() -> mockApi.getUserMidis(token));
            var midis = requireNonNull(response.getBody()).getMidis();

            assertEquals(status, response.getStatusCode());
            assertEquals(expectedSize, midis.size());

        } else {
            var response = assertThrows(
                HttpClientErrorException.class,
                () -> mockApi.getUserMidis(token)
            );
            assertEquals(status, response.getStatusCode());
        }
    }

    @BeforeEach
    void setUp() {
        mockUser = MockUser.randomMockUser();
        validToken = mockTokenGenerator.generateTokenForUser(mockUser);
    }

    private static Stream<Arguments> tokenTypeAndStatusCodeForGetPublicMidi() {
        return Stream.of(
            Arguments.of(TokenType.VALID, HttpStatus.OK),
            Arguments.of(TokenType.EXPIRED, HttpStatus.OK),
            Arguments.of(TokenType.INVALID, HttpStatus.OK),
            Arguments.of(TokenType.OTHER_USER, HttpStatus.OK),
            Arguments.of(TokenType.NULL, HttpStatus.OK)
        );
    }

    private static Stream<Arguments> tokenTypeAndStatusCodeForGetPrivateMidi() {
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

    private static Stream<Arguments> tokenTypeAndStatusCodeForGetUserMidis() {
        return Stream.of(
            Arguments.of(TokenType.VALID, HttpStatus.OK),
            Arguments.of(TokenType.EXPIRED, HttpStatus.UNAUTHORIZED),
            Arguments.of(TokenType.INVALID, HttpStatus.UNAUTHORIZED),
            Arguments.of(TokenType.OTHER_USER, HttpStatus.OK),
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
            case OTHER_USER -> mockTokenGenerator.generateTokenForUser(MockUser.randomMockUser());
            case NULL -> null;
        };
    }

    private final Supplier<MidiCreateRequestDto> tetrisCreatePublicRequest = () ->
        new MidiCreateRequestDto()
            .isPrivate(false)
            .filename("tetris-type-a.mid")
            .artist("Hirokazu Tanaka")
            .title("Type A")
            .midiFile(Base64Midi.TETRIS);

    private final Supplier<MidiCreateRequestDto> tetrisCreatePrivateRequest = () ->
        new MidiCreateRequestDto()
            .isPrivate(true)
            .filename("tetris-type-a.mid")
            .artist("Hirokazu Tanaka")
            .title("Type A")
            .midiFile(Base64Midi.TETRIS);

    private final Supplier<MidiCreateRequestDto> anotherCreatePublicRequest = () ->
        new MidiCreateRequestDto()
            .isPrivate(false)
            .filename("moog-madness.mid")
            .artist("Gnesta Stefan")
            .title("Ylande Katt")
            .midiFile(Base64Midi.TETRIS);

}
