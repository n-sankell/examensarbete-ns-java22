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
import generatedapi.model.EditUserRequestDto;
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

    @ParameterizedTest
    @MethodSource("tokenTypeAndStatusCodeForAuthorizedUserOperations")
    void editMidiMeta(TokenType tokenType, HttpStatus status) throws Exception {
        var oldUsername = "Arnold";
        var oldEmail = "old.mail@google.com";
        var newUsername = "Leopold";
        var newEmail = "new.email@yahoo.com";

        // Create a user
        var createResponse = mockApi.createUser(userCreateRequest.get().username(oldUsername).email(oldEmail));
        var headers = requireNonNull(createResponse.getHeaders());

        // Set received token as valid token
        validToken = extractTokenFromHeaders(requireNonNull(headers.get(AUTHORIZATION)).getFirst());
        var token = getTokenByType(tokenType);

        // Create edit request with new username and email
        var editRequest = new EditUserRequestDto()
            .username(newUsername)
            .email(newEmail);

        if (status == HttpStatus.OK) {
            var editResponse = assertDoesNotThrow(
                () -> mockApi.editUser(editRequest, token)
            );

            // When status is OK assert that changes have been made
            assertEquals(status, editResponse.getStatusCode());
            var responseBody = requireNonNull(editResponse.getBody());
            assertEquals(newEmail, responseBody.getEmail());
            assertEquals(newUsername, responseBody.getUsername());

            var newHeaders = requireNonNull(editResponse.getHeaders());
            var newToken = extractTokenFromHeaders(requireNonNull(newHeaders.get(AUTHORIZATION)).getFirst());
            var claims = jwtTokenProvider.extractClaims(newToken);
            var emailFromToken = claims.getSubject();
            assertEquals(newEmail, emailFromToken);
        } else {
            var editResponse = assertThrows(
                HttpClientErrorException.class,
                () -> mockApi.editUser(editRequest, token)
            );
            assertEquals(status, editResponse.getStatusCode());
            var secondResponse = mockApi.getUserDetails(validToken);
            var secondResponseBody = requireNonNull(secondResponse.getBody());
            assertEquals(oldEmail, secondResponseBody.getEmail());
            assertEquals(oldUsername, secondResponseBody.getUsername());
        }
    }

    @ParameterizedTest
    @MethodSource("tokenTypeAndStatusCodeForPasswordProtectedUserOperations")
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
            if (status == FORBIDDEN) {
                deleteRequest.password("WRONG_PASSWORD");
            }
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
    @MethodSource("tokenTypeAndStatusCodeForPasswordProtectedUserOperations")
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
            if (status == FORBIDDEN) {
                changeRequest.currentPassword("WRONG_PASSWORD");
            }
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

    private static Stream<Arguments> tokenTypeAndStatusCodeForAuthorizedUserOperations() {
        return Stream.of(
            Arguments.of(TokenType.VALID, HttpStatus.OK),
            Arguments.of(TokenType.EXPIRED, HttpStatus.UNAUTHORIZED),
            Arguments.of(TokenType.INVALID, HttpStatus.UNAUTHORIZED),
            Arguments.of(TokenType.NULL, HttpStatus.UNAUTHORIZED)
        );
    }

    private static Stream<Arguments> tokenTypeAndStatusCodeForPasswordProtectedUserOperations() {
        return Stream.of(
            Arguments.of(TokenType.VALID, HttpStatus.OK),
            Arguments.of(TokenType.EXPIRED, HttpStatus.UNAUTHORIZED),
            Arguments.of(TokenType.INVALID, HttpStatus.UNAUTHORIZED),
            Arguments.of(TokenType.NULL, HttpStatus.UNAUTHORIZED),
            Arguments.of(TokenType.VALID, FORBIDDEN)
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
