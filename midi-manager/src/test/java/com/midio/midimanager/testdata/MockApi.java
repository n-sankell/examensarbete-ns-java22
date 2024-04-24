package com.midio.midimanager.testdata;

import com.midio.midimanager.exception.ForbiddenException;
import com.midio.midimanager.exception.NotFoundException;
import com.midio.midimanager.exception.ValidationError;
import com.midio.midimanager.exception.ValidationException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.midio.midimanager.security.JwtConstants;
import generatedapi.model.MidiCreateRequestDto;
import generatedapi.model.MidiEditBinaryRequestDto;
import generatedapi.model.MidiEditMetaRequestDto;
import generatedapi.model.MidiEditRequestDto;
import generatedapi.model.MidiWithDataDto;
import generatedapi.model.MidisDto;
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
import java.util.UUID;

@Component
public class MockApi {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;

    public ResponseEntity<MidiWithDataDto> getMidiById(UUID midiId, String token) throws Exception {
        var result = mockMvc.perform(
                MockMvcRequestBuilders
                    .get("/midis/midi/" + midiId)
                    .header(HttpHeaders.AUTHORIZATION, JwtConstants.TOKEN_PREFIX + token)
            )
            .andReturn();

        throwIfError(result.getResponse());

        var status = HttpStatus.valueOf(result.getResponse().getStatus());
        var content = status == HttpStatus.OK ?
            objectMapper.readValue(result.getResponse().getContentAsString(), MidiWithDataDto.class) :
            null;
        return ResponseEntity.status(status).body(content);
    }

    public ResponseEntity<MidisDto> getUserMidis(String token) throws Exception {
        var result = mockMvc.perform(
                MockMvcRequestBuilders
                    .get("/midis/user")
                    .header(HttpHeaders.AUTHORIZATION, JwtConstants.TOKEN_PREFIX + token)
            )
            .andReturn();

        throwIfError(result.getResponse());

        var status = HttpStatus.valueOf(result.getResponse().getStatus());
        var content = status == HttpStatus.OK ?
            objectMapper.readValue(result.getResponse().getContentAsString(), MidisDto.class) :
            null;
        return ResponseEntity.status(status).body(content);
    }

    public ResponseEntity<MidisDto> getPublicMidis(String token) throws Exception {
        var result = mockMvc.perform(
                MockMvcRequestBuilders
                    .get("/midis/public")
                    .header(HttpHeaders.AUTHORIZATION, JwtConstants.TOKEN_PREFIX + token)
            )
            .andReturn();

        throwIfError(result.getResponse());

        var status = HttpStatus.valueOf(result.getResponse().getStatus());
        var content = status == HttpStatus.OK ?
            objectMapper.readValue(result.getResponse().getContentAsString(), MidisDto.class) :
            null;
        return ResponseEntity.status(status).body(content);
    }

    public ResponseEntity<MidiWithDataDto> editMidi(
        UUID midiId, String token, MidiEditRequestDto requestBody) throws Exception {
        var result = mockMvc.perform(
                MockMvcRequestBuilders
                    .post("/midis/midi/" + midiId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(requestBody))
                    .accept(MediaType.APPLICATION_JSON)
                    .header(HttpHeaders.AUTHORIZATION, JwtConstants.TOKEN_PREFIX + token)
            )
            .andReturn();

        throwIfError(result.getResponse());

        var status = HttpStatus.valueOf(result.getResponse().getStatus());
        var content = status == HttpStatus.OK ?
            objectMapper.readValue(result.getResponse().getContentAsString(), MidiWithDataDto.class) :
            null;
        return ResponseEntity.status(status).body(content);
    }

    public ResponseEntity<MidiWithDataDto> editMidiMeta(
        UUID midiId, String token, MidiEditMetaRequestDto requestBody) throws Exception {
        var result = mockMvc.perform(
                MockMvcRequestBuilders
                    .post("/midis/meta/" + midiId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(requestBody))
                    .accept(MediaType.APPLICATION_JSON)
                    .header(HttpHeaders.AUTHORIZATION, JwtConstants.TOKEN_PREFIX + token)
            )
            .andReturn();

        throwIfError(result.getResponse());

        var status = HttpStatus.valueOf(result.getResponse().getStatus());
        var content = status == HttpStatus.OK ?
            objectMapper.readValue(result.getResponse().getContentAsString(), MidiWithDataDto.class) :
            null;
        return ResponseEntity.status(status).body(content);
    }

    public ResponseEntity<MidiWithDataDto> editMidiBinary(
        UUID midiId, String token, MidiEditBinaryRequestDto requestBody) throws Exception {
        var result = mockMvc.perform(
                MockMvcRequestBuilders
                    .post("/midis/binary/" + midiId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(requestBody))
                    .accept(MediaType.APPLICATION_JSON)
                    .header(HttpHeaders.AUTHORIZATION, JwtConstants.TOKEN_PREFIX + token)
            )
            .andReturn();

        throwIfError(result.getResponse());

        var status = HttpStatus.valueOf(result.getResponse().getStatus());
        var content = status == HttpStatus.OK ?
            objectMapper.readValue(result.getResponse().getContentAsString(), MidiWithDataDto.class) :
            null;
        return ResponseEntity.status(status).body(content);
    }

    public ResponseEntity<MidiWithDataDto> createMidi(String token, MidiCreateRequestDto requestBody) throws Exception {
        var result = mockMvc.perform(
                MockMvcRequestBuilders
                    .post("/midis/create")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(requestBody))
                    .accept(MediaType.APPLICATION_JSON)
                    .header(HttpHeaders.AUTHORIZATION, JwtConstants.TOKEN_PREFIX + token)
            )
            .andReturn();

        throwIfError(result.getResponse());

        var status = HttpStatus.valueOf(result.getResponse().getStatus());
        var content = status == HttpStatus.OK ?
            objectMapper.readValue(result.getResponse().getContentAsString(), MidiWithDataDto.class) :
            null;
        return ResponseEntity.status(status).body(content);
    }

    public ResponseEntity<String> deleteMidi(UUID midiId, String token) throws Exception {
        var result = mockMvc.perform(
                MockMvcRequestBuilders
                    .delete("/midis/midi/" + midiId)
                    .header(HttpHeaders.AUTHORIZATION, JwtConstants.TOKEN_PREFIX + token)
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
