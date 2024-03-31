package com.midio.userservice.testdata;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.midio.userservice.exception.ForbiddenException;
import com.midio.userservice.exception.NotFoundException;
import com.midio.userservice.exception.ValidationError;
import com.midio.userservice.exception.ValidationException;
import com.midio.userservice.secirity.JwtConstants;
import generatedapi.model.DeleteUserRequestDto;
import generatedapi.model.EditPasswordRequestDto;
import generatedapi.model.EditUserRequestDto;
import generatedapi.model.UserCreateRequestDto;
import generatedapi.model.UserDto;
import generatedapi.model.UserLoginRequestDto;
import generatedapi.model.ValidationExceptionDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.web.client.HttpClientErrorException;

import java.io.UnsupportedEncodingException;
import java.util.Objects;

import static org.springframework.http.HttpHeaders.AUTHORIZATION;

@Component
public class MockApi {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;

    public ResponseEntity<UserDto> login(UserLoginRequestDto requestBody) throws Exception {
        var result = mockMvc.perform(
                MockMvcRequestBuilders
                    .post("/user/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(requestBody))
                    .accept(MediaType.APPLICATION_JSON)
            )
            .andReturn();

        throwIfError(result.getResponse());

        var authHeader = Objects.requireNonNull(result.getResponse().getHeader(AUTHORIZATION));
        var status = HttpStatus.valueOf(result.getResponse().getStatus());
        var content = status == HttpStatus.OK ?
            objectMapper.readValue(result.getResponse().getContentAsString(), UserDto.class) :
            null;
        return ResponseEntity.status(status).header(AUTHORIZATION, authHeader).body(content);
    }

    public ResponseEntity<UserDto> createUser(UserCreateRequestDto requestBody) throws Exception {
        var result = mockMvc.perform(
                MockMvcRequestBuilders
                    .post("/user")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(requestBody))
                    .accept(MediaType.APPLICATION_JSON)
            )
            .andReturn();

        throwIfError(result.getResponse());

        var authHeader = Objects.requireNonNull(result.getResponse().getHeader(AUTHORIZATION));
        var status = HttpStatus.valueOf(result.getResponse().getStatus());
        var content = status == HttpStatus.OK ?
            objectMapper.readValue(result.getResponse().getContentAsString(), UserDto.class) :
            null;
        return ResponseEntity.status(status).header(AUTHORIZATION, authHeader).body(content);
    }

    public ResponseEntity<UserDto> getUserDetails(String token) throws Exception {
        var result = mockMvc.perform(
                MockMvcRequestBuilders
                    .get("/user")
                    .header(AUTHORIZATION, JwtConstants.TOKEN_PREFIX + token)
            )
            .andReturn();

        throwIfError(result.getResponse());

        var status = HttpStatus.valueOf(result.getResponse().getStatus());
        var content = status == HttpStatus.OK ?
            objectMapper.readValue(result.getResponse().getContentAsString(), UserDto.class) :
            null;
        return ResponseEntity.status(status).body(content);
    }

    public ResponseEntity<String> deleteUser(DeleteUserRequestDto requestBody, String token) throws Exception {
        var result = mockMvc.perform(
                MockMvcRequestBuilders
                    .delete("/user")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(requestBody))
                    .accept(MediaType.APPLICATION_JSON)
                    .header(AUTHORIZATION, JwtConstants.TOKEN_PREFIX + token)
            )
            .andReturn();

        throwIfError(result.getResponse());

        var status = HttpStatus.valueOf(result.getResponse().getStatus());
        var content = status == HttpStatus.OK ?
            result.getResponse().getContentAsString() :
            null;
        return ResponseEntity.status(status).body(content);
    }

    public ResponseEntity<UserDto> editUser(EditUserRequestDto requestBody, String token) throws Exception {
        var result = mockMvc.perform(
                MockMvcRequestBuilders
                    .post("/user/edit")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(requestBody))
                    .accept(MediaType.APPLICATION_JSON)
                    .header(AUTHORIZATION, JwtConstants.TOKEN_PREFIX + token)
            )
            .andReturn();

        throwIfError(result.getResponse());

        var status = HttpStatus.valueOf(result.getResponse().getStatus());
        var content = status == HttpStatus.OK ?
            objectMapper.readValue(result.getResponse().getContentAsString(), UserDto.class) :
            null;
        return ResponseEntity.status(status).body(content);
    }

    public ResponseEntity<String> editPassword(EditPasswordRequestDto requestBody, String token) throws Exception {
        var result = mockMvc.perform(
                MockMvcRequestBuilders
                    .post("/user/edit/pass")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(requestBody))
                    .accept(MediaType.APPLICATION_JSON)
                    .header(AUTHORIZATION, JwtConstants.TOKEN_PREFIX + token)
            )
            .andReturn();

        throwIfError(result.getResponse());

        var status = HttpStatus.valueOf(result.getResponse().getStatus());
        var content = status == HttpStatus.OK ?
            result.getResponse().getContentAsString() :
            null;
        return ResponseEntity.status(status).body(content);
    }

    private void throwIfError(MockHttpServletResponse response)
        throws UnsupportedEncodingException, JsonProcessingException {
        switch (HttpStatus.valueOf(response.getStatus())) {
            case NOT_FOUND -> throw new NotFoundException();
            case FORBIDDEN -> throw new ForbiddenException("message", null);
            case UNAUTHORIZED -> throw new HttpClientErrorException(HttpStatus.UNAUTHORIZED);
            case BAD_REQUEST -> throw new HttpClientErrorException(HttpStatus.BAD_REQUEST);
            case INTERNAL_SERVER_ERROR -> throw new HttpClientErrorException(HttpStatus.INTERNAL_SERVER_ERROR);
            case UNPROCESSABLE_ENTITY -> {
                var content = objectMapper.readValue(response.getContentAsString(), ValidationExceptionDto.class);
                throw new ValidationException(
                    content.getMessage(),
                    content.getErrors().stream()
                        .map(e ->
                            new ValidationError(
                                e.getField(),
                                e.getError(),
                                e.getInvalidValue()
                            )
                        ).toList()
                );
            }
        }
    }

}
