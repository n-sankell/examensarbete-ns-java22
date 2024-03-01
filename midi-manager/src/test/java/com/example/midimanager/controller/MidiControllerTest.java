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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

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

        var response = mockApi.createMidi(token, createRequestDto);
        assertEquals(status, response.getStatusCode());

        if (tokenType == TokenType.VALID) {
            var body = requireNonNull(response.getBody());
            var blobId = body.getMeta().getBlobRef();
            var userId = body.getMeta().getUserRef();

            // Check if the artist value is correct
            assertEquals(artist, body.getMeta().getArtist());
            assertEquals(blobId, body.getBinary().getBinaryId());
            assertEquals(mockUser.userId(), userId);
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
            .binaryData(new MidiEditBinaryRequestDto().midiFile(GYMNOPEDIE))
            .metadata(new MidiEditMetaRequestDto()
                .artist("Satie")
                .title("Gymnopedie No 1")
                .filename("gymnopedieno1.mid")
                .isPrivate(false));
        var editResponse = mockApi.editMidi(midiId, token, editRequest);

        // When status is OK assert that changes hav been made otherwise the midi should be unchanged
        assertEquals(status, editResponse.getStatusCode());

        if (status == HttpStatus.OK) {
            assertEquals("Satie", requireNonNull(editResponse.getBody()).getMeta().getArtist());
            assertEquals(GYMNOPEDIE, editResponse.getBody().getBinary().getMidiFile());
        } else {
            var secondResponse = mockApi.getMidiBiId(midiId, validToken);
            assertEquals(createResponse.getBody().getMeta(), requireNonNull(secondResponse.getBody()).getMeta());
            assertEquals(TETRIS, secondResponse.getBody().getBinary().getMidiFile());
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
        var editRequest = new MidiEditBinaryRequestDto().midiFile(GYMNOPEDIE);
        var editResponse = mockApi.editMidiBinary(midiId, token, editRequest);

        // When status is OK assert that changes hav been made otherwise the midi should be unchanged
        assertEquals(status, editResponse.getStatusCode());

        if (status == HttpStatus.OK) {
            assertEquals("Hirokazu Tanaka", requireNonNull(editResponse.getBody()).getMeta().getArtist());
            assertEquals(GYMNOPEDIE, editResponse.getBody().getBinary().getMidiFile());
        } else {
            var secondResponse = mockApi.getMidiBiId(midiId, validToken);
            assertEquals(createResponse.getBody().getMeta(), requireNonNull(secondResponse.getBody()).getMeta());
            assertEquals(TETRIS, requireNonNull(secondResponse.getBody()).getBinary().getMidiFile());
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
            .filename("gymnopedieno1.mid")
            .isPrivate(false);
        var editResponse = mockApi.editMidiMeta(midiId, token, editRequest);

        // When status is OK assert that changes hav been made otherwise the midi should be unchanged
        assertEquals(status, editResponse.getStatusCode());

        if (status == HttpStatus.OK) {
            assertEquals("Satie", requireNonNull(editResponse.getBody()).getMeta().getArtist());
            assertEquals(TETRIS, editResponse.getBody().getBinary().getMidiFile());
        } else {
            var secondResponse = mockApi.getMidiBiId(midiId, validToken);
            assertEquals(createResponse.getBody().getMeta(), requireNonNull(secondResponse.getBody()).getMeta());
            assertEquals(TETRIS, secondResponse.getBody().getBinary().getMidiFile());
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
        var firstResponse = mockApi.getUserMidis(mockUser.userId(), validToken);
        assertEquals(2, requireNonNull(firstResponse.getBody()).getMidis().size());

        // Try to delete the file and check status code
        var deleteResponse = mockApi.deleteMidi(deletedId, token);
        var secondResponse = mockApi.getUserMidis(mockUser.userId(), validToken);

        // When status is OK assert that other second response size has decreased else as before
        assertEquals(status, deleteResponse.getStatusCode());
        if (status == HttpStatus.OK) {
            assertEquals(1, requireNonNull(secondResponse.getBody()).getMidis().size());
            assertEquals("Deleted", deleteResponse.getBody());
        } else {
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
        var createResponseBlobId = createdMidi.getBody().getBinary().getBinaryId();

        // create a get request for the created public midi
        var response = mockApi.getMidiBiId(createResponseMidiId, token);

        // extract midi and blob from the response
        var midi = requireNonNull(response.getBody()).getMeta();
        var blob = response.getBody().getBinary();

        // assert that the request return OK and that the userRef is equal to the valid userId
        assertEquals(status, response.getStatusCode());
        assertEquals(mockUser.userId(), midi.getUserRef());
        assertEquals(createResponseMidiId, midi.getMidiId());
        assertEquals(createResponseBlobId, midi.getBlobRef());
        assertEquals(createResponseBlobId, blob.getBinaryId());
        assertEquals(TETRIS, blob.getMidiFile());
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
        var response = mockApi.getMidiBiId(midiId, token);

        // assert status code matches the expected code
        assertEquals(status, response.getStatusCode());

        // when status is OK assert that other response values matches the expected values
        if (status == HttpStatus.OK) {
            var midi = requireNonNull(response.getBody()).getMeta();
            assertEquals(mockUser.userId(), midi.getUserRef());
        }
    }

    @ParameterizedTest
    @MethodSource("tokenTypeAndStatusCodeForUserMidis")
    void getMidisByUserId(TokenType tokenType, HttpStatus status) throws Exception {
        // generate tokens with different access
        var token = getTokenByType(tokenType);
        // create two midis with a valid token
        mockApi.createMidi(validToken, tetrisCreatePublicRequest.get());
        mockApi.createMidi(validToken, tetrisCreatePrivateRequest.get());
        // create a get request for the midis from the valid user
        var response = mockApi.getUserMidis(mockUser.userId(), token);
        // assert status code matches the expected code
        assertEquals(status, response.getStatusCode());
        // when status is OK assert that other response values matches the expected values
        if (status == HttpStatus.OK) {
            var firstMidi = requireNonNull(response.getBody()).getMidis().getFirst();
            assertEquals(2, response.getBody().getMidis().size());
            assertEquals(mockUser.userId(), firstMidi.getUserRef());
        }
    }

    @BeforeEach
    void setUp() {
        mockUser = randomMockUser();
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
