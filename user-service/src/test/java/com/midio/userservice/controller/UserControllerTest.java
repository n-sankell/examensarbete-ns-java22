package com.midio.userservice.controller;

import com.midio.userservice.config.UserServiceTestEnvironment;
import com.midio.userservice.exception.ValidationException;
import com.midio.userservice.secirity.JwtTokenProvider;
import com.midio.userservice.testdata.Identifier;
import com.midio.userservice.testdata.MockApi;
import com.midio.userservice.testdata.MockTokenGenerator;
import com.midio.userservice.testdata.MockUser;
import com.midio.userservice.testdata.TokenType;
import generatedapi.model.DeleteUserRequestDto;
import generatedapi.model.EditPasswordRequestDto;
import generatedapi.model.UserCreateRequestDto;
import generatedapi.model.UserLoginRequestDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.client.HttpClientErrorException;

import java.util.UUID;
import java.util.function.Supplier;
import java.util.stream.Stream;

import static com.midio.userservice.secirity.JwtTokenInterceptor.extractStringIdFromClaims;
import static com.midio.userservice.secirity.JwtTokenInterceptor.extractTokenFromHeaders;
import static java.util.Objects.requireNonNull;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.http.HttpHeaders.AUTHORIZATION;
import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.HttpStatus.UNPROCESSABLE_ENTITY;

@UserServiceTestEnvironment
public class UserControllerTest {

    @Autowired
    private MockApi mockApi;
    @Autowired
    private MockTokenGenerator mockTokenGenerator;
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    private MockUser mockUser;
    private String validToken;

    @Test
    void createUserWithInvalidData() {
        var createRequestDto = userCreateRequest.get()
            .email("hhh");

        var response =
            assertThrows(
                ValidationException.class,
                () -> mockApi.createUser(createRequestDto)
            );

        assertEquals(UNPROCESSABLE_ENTITY, response.getStatusCode());
    }

    @Test
    void createUser() {
        var email = "unique.email@unique.tk";

        // Create a user with specified email
        var createRequestDto = userCreateRequest.get()
            .email(email);

        var okResponse = assertDoesNotThrow(
            () -> mockApi.createUser(createRequestDto)
        );
        assertEquals(OK, okResponse.getStatusCode());
        var body = requireNonNull(okResponse.getBody());
        var headers = requireNonNull(okResponse.getHeaders());
        var token = extractTokenFromHeaders(requireNonNull(headers.get(AUTHORIZATION)).getFirst());

        var claims = jwtTokenProvider.extractClaims(token);
        var emailFromToken = claims.getSubject();
        var idFromToken = extractStringIdFromClaims(claims);

        // Check if the username is correct and that the id is a valid UUID
        assertDoesNotThrow(() -> UUID.fromString(idFromToken));
        assertEquals(email, emailFromToken);
        assertEquals(email, body.getEmail());
    }

    @Test
    void loginWithWrongPassword() {
        var password = "super-duper-secret";
        var wrongPassword = "super-duper-wrong";
        var email = "email@example.com";

        // Create a user with username and password
        var createRequest = new UserCreateRequestDto()
            .username("username")
            .email(email)
            .password(password);

        assertDoesNotThrow(() -> mockApi.createUser(createRequest));

        var loginResponse = assertThrows(
            HttpClientErrorException.class,
            () -> mockApi.login(
                new UserLoginRequestDto()
                    .userIdentifier(email)
                    .password(wrongPassword)
            )
        );
        assertEquals(FORBIDDEN, loginResponse.getStatusCode());
    }

    @ParameterizedTest
    @MethodSource("loginIdentifier")
    void loginWithWrongIdentifier(Identifier identifierType) {
        var password = "super-duper-secret";
        var email = "email@example.com";
        var username = "username";
        var wrongEmail = "wrongemail@example.com";
        var wrongUsername = "usernames";
        var wrongIdentifier = identifierType == Identifier.EMAIL ? wrongEmail : wrongUsername;

        // Create a user with username and password
        var createRequest = new UserCreateRequestDto()
            .username(username)
            .email(email)
            .password(password);

        assertDoesNotThrow(() -> mockApi.createUser(createRequest));

        var loginResponse = assertThrows(
            HttpClientErrorException.class,
            () -> mockApi.login(
                new UserLoginRequestDto()
                    .userIdentifier(wrongIdentifier)
                    .password(password)
            )
        );
        assertEquals(FORBIDDEN, loginResponse.getStatusCode());
    }

    @ParameterizedTest
    @MethodSource("loginIdentifier")
    void loginWithIdentifier(Identifier identifierType) {
        var username = "nameToFind";
        var password = "super-duper-secret";
        var email = "email@example.com";
        var identifier = identifierType == Identifier.EMAIL ? email : username;

        // Create a user with username and password
        var createRequest = new UserCreateRequestDto()
            .username(username)
            .email(email)
            .password(password);

        var createResponse = assertDoesNotThrow(() -> mockApi.createUser(createRequest));

        var loginResponse = assertDoesNotThrow(
            () -> mockApi.login(
                new UserLoginRequestDto()
                    .userIdentifier(identifier)
                    .password(password)
            ));

        var headers = requireNonNull(loginResponse.getHeaders());
        var token = extractTokenFromHeaders(requireNonNull(headers.get(AUTHORIZATION)).getFirst());

        var claims = jwtTokenProvider.extractClaims(token);
        var emailFromToken = claims.getSubject();
        var idFromToken = extractStringIdFromClaims(claims);

        // Check if the username is correct and that the id is a valid UUID
        assertDoesNotThrow(() -> UUID.fromString(idFromToken));
        assertEquals(email, emailFromToken);
        var createMillis = requireNonNull(createResponse.getBody()).getLastActive().toInstant().toEpochMilli();
        var loginMillis = requireNonNull(loginResponse.getBody()).getLastActive().toInstant().toEpochMilli();
        assertTrue(loginMillis > createMillis);
    }

    @ParameterizedTest
    @MethodSource("tokenTypeAndStatusCodeForAuthorizedUserOperations")
    void getUserInfo(TokenType tokenType, HttpStatus status) throws Exception {
        var email = "pontus@telia.se";

        // Create a user
        var createResponse = mockApi.createUser(userCreateRequest.get().email(email));
        var headers = requireNonNull(createResponse.getHeaders());

        // Set received token as valid token
        validToken = extractTokenFromHeaders(requireNonNull(headers.get(AUTHORIZATION)).getFirst());
        var token = getTokenByType(tokenType);

        if (status == HttpStatus.OK) {
            var claims = jwtTokenProvider.extractClaims(token);
            var emailFromToken = claims.getSubject();
            var idFromToken = extractStringIdFromClaims(claims);

            var response = assertDoesNotThrow(
                () -> mockApi.getUserDetails(token)
            );

            assertEquals(status, response.getStatusCode());
            assertEquals(email, requireNonNull(response.getBody()).getEmail());
            assertDoesNotThrow(() -> UUID.fromString(idFromToken));
            assertEquals(email, emailFromToken);
        } else {
            var editResponse = assertThrows(
                HttpClientErrorException.class,
                () -> mockApi.getUserDetails(token)
            );
            assertEquals(status, editResponse.getStatusCode());
        }
    }
/*
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
            var secondResponse = mockApi.getMidiBiId(midiId, validToken);
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
            var secondResponse = mockApi.getMidiBiId(midiId, validToken);
            assertEquals(createResponse.getBody().getMeta(), requireNonNull(secondResponse.getBody()).getMeta());
            assertEquals(Base64Midi.TETRIS, secondResponse.getBody().getBinary().getMidiFile());
        }
    }
*/
    @ParameterizedTest
    @MethodSource("tokenTypeAndStatusCodeForAuthorizedUserOperations")
    void deleteUser(TokenType tokenType, HttpStatus status) throws Exception {
        var password = "wordForPassing";
        var username = "Arnold";

        // Create a user
        var createResponse = mockApi.createUser(userCreateRequest.get().password(password).username(username));
        var headers = requireNonNull(createResponse.getHeaders());

        // Set received token as valid token
        validToken = extractTokenFromHeaders(requireNonNull(headers.get(AUTHORIZATION)).getFirst());
        var token = getTokenByType(tokenType);

        // Create two midis with a valid token, get the id of the one to delete
        var deleteRequest = new DeleteUserRequestDto()
            .password(password);

        // Try to delete the user and check status code
        if (status == HttpStatus.OK) {
            var deleteResponse = assertDoesNotThrow(
                () -> mockApi.deleteUser(deleteRequest, token)
            );
            // When status is OK assert that second response is not found
            var secondResponse = assertThrows(
                HttpClientErrorException.class,
                () -> mockApi.getUserDetails(validToken)
            );
            assertEquals(status, deleteResponse.getStatusCode());
            assertEquals(NOT_FOUND, requireNonNull(secondResponse.getStatusCode()));
            assertEquals("User deleted.", deleteResponse.getBody());
        } else {
            var deleteResponse = assertThrows(
                HttpClientErrorException.class,
                () -> mockApi.deleteUser(deleteRequest, token)
            );
            var secondResponse = mockApi.getUserDetails(validToken);
            assertEquals(status, deleteResponse.getStatusCode());
            assertEquals(username, requireNonNull(secondResponse.getBody()).getUsername());
        }
    }

    @ParameterizedTest
    @MethodSource("tokenTypeAndStatusCodeForAuthorizedUserOperations")
    void updatePassword(TokenType tokenType, HttpStatus status) throws Exception {
        var password = "oldPassword";
        var newPassword = "newPassword";
        var email = "pontus@telia.se";

        // Create a user with email and password
        var createResponse = mockApi.createUser(userCreateRequest.get().password(password).email(email));
        var headers = requireNonNull(createResponse.getHeaders());

        // Set received token as valid token
        validToken = extractTokenFromHeaders(requireNonNull(headers.get(AUTHORIZATION)).getFirst());
        var token = getTokenByType(tokenType);

        var changeRequest = new EditPasswordRequestDto()
            .currentPassword(password)
            .newPassword(newPassword);

        // Try to change password and check status code
        if (status == HttpStatus.OK) {
            var editResponse = assertDoesNotThrow(
                () -> mockApi.editPassword(changeRequest, token)
            );
            assertEquals(status, editResponse.getStatusCode());
            // If status is OK login with new password should be successful
            var newLoginResponse = mockApi.login(new UserLoginRequestDto().userIdentifier(email).password(newPassword));
            assertEquals(OK, newLoginResponse.getStatusCode());
        } else {
            var editResponse = assertThrows(
                HttpClientErrorException.class,
                () -> mockApi.editPassword(changeRequest, token)
            );
            assertEquals(status, editResponse.getStatusCode());
            // Login with old password should be successful
            var newLoginResponse = mockApi.login(new UserLoginRequestDto().userIdentifier(email).password(password));
            assertEquals(OK, newLoginResponse.getStatusCode());
        }
    }
/*
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
                () -> mockApi.getMidiBiId(midiId, token)
            );
            // when status is OK assert that response values matches the expected values
            assertEquals(status, response.getStatusCode());
            var midi = requireNonNull(response.getBody()).getMeta();
            assertEquals(mockUser.userId(), midi.getUserRef());
        } else {
            var response = assertThrows(
                HttpClientErrorException.class,
                () -> mockApi.getMidiBiId(midiId, token)
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

            if (tokenType == TokenType.VALID) {
                assertEquals(mockUser.userId(), midis.getFirst().getUserRef());
            }
        } else {
            var response = assertThrows(
                HttpClientErrorException.class,
                () -> mockApi.getUserMidis(token)
            );
            assertEquals(status, response.getStatusCode());
        }
    }
*/
    @BeforeEach
    void setUp() {
        mockUser = MockUser.randomMockUser();
        validToken = mockTokenGenerator.generateTokenForUser(mockUser);
    }

    private static Stream<Arguments> loginIdentifier() {
        return Stream.of(
            Arguments.of(Identifier.EMAIL),
            Arguments.of(Identifier.USERNAME)
        );
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

    private static Stream<Arguments> tokenTypeAndStatusCodeForAuthorizedUserOperations() {
        return Stream.of(
            Arguments.of(TokenType.VALID, HttpStatus.OK),
            Arguments.of(TokenType.EXPIRED, HttpStatus.UNAUTHORIZED),
            Arguments.of(TokenType.INVALID, HttpStatus.UNAUTHORIZED),
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
            Arguments.of(TokenType.EXPIRED, HttpStatus.OK),
            Arguments.of(TokenType.INVALID, HttpStatus.OK),
            Arguments.of(TokenType.NULL, HttpStatus.OK)
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

    private final Supplier<UserCreateRequestDto> userCreateRequest = () ->
        new UserCreateRequestDto()
            .username("user")
            .email("email@example.com")
            .password("super-duper-secret");

}
