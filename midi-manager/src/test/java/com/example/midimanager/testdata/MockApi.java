package com.example.midimanager.testdata;

import com.fasterxml.jackson.databind.ObjectMapper;
import generatedapi.model.MidiCreateRequestDto;
import generatedapi.model.MidiEditBinaryRequestDto;
import generatedapi.model.MidiEditMetaRequestDto;
import generatedapi.model.MidiEditRequestDto;
import generatedapi.model.MidiWithDataDto;
import generatedapi.model.MidisDto;
import generatedapi.model.ValidationErrorDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.util.UUID;

import static com.example.midimanager.secirity.JwtConstants.TOKEN_PREFIX;

@Component
public class MockApi {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;

    public ResponseEntity<MidiWithDataDto> getMidiBiId(UUID midiId, String token) throws Exception {
        var result = mockMvc.perform(
                MockMvcRequestBuilders
                    .get("/midis/midi/" + midiId)
                    .header(HttpHeaders.AUTHORIZATION, TOKEN_PREFIX + token)
            )
            .andReturn();

        var status = HttpStatus.valueOf(result.getResponse().getStatus());
        var content = status == HttpStatus.OK ?
            objectMapper.readValue(result.getResponse().getContentAsString(), MidiWithDataDto.class) :
            null;
        return ResponseEntity.status(status).body(content);
    }

    public ResponseEntity<MidisDto> getUserMidis(UUID userId, String token) throws Exception {
        var result = mockMvc.perform(
                MockMvcRequestBuilders
                    .get("/midis/user/" + userId)
                    .header(HttpHeaders.AUTHORIZATION, TOKEN_PREFIX + token)
            )
            .andReturn();

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
                    .header(HttpHeaders.AUTHORIZATION, TOKEN_PREFIX + token)
            )
            .andReturn();

        var status = HttpStatus.valueOf(result.getResponse().getStatus());
        var content = status == HttpStatus.OK ?
            objectMapper.readValue(result.getResponse().getContentAsString(), MidisDto.class) :
            null;
        return ResponseEntity.status(status).body(content);
    }

    public ResponseEntity<MidiWithDataDto> editMidi(UUID midiId, String token, MidiEditRequestDto requestBody) throws Exception {
        var result = mockMvc.perform(
                MockMvcRequestBuilders
                    .post("/midis/midi/" + midiId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(requestBody))
                    .accept(MediaType.APPLICATION_JSON)
                    .header(HttpHeaders.AUTHORIZATION, TOKEN_PREFIX + token)
            )
            .andReturn();

        var status = HttpStatus.valueOf(result.getResponse().getStatus());
        var content = status == HttpStatus.OK ?
            objectMapper.readValue(result.getResponse().getContentAsString(), MidiWithDataDto.class) :
            null;
        return ResponseEntity.status(status).body(content);
    }

    public ResponseEntity<MidiWithDataDto> editMidiMeta(UUID midiId, String token, MidiEditMetaRequestDto requestBody) throws Exception {
        var result = mockMvc.perform(
                MockMvcRequestBuilders
                    .post("/midis/meta/" + midiId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(requestBody))
                    .accept(MediaType.APPLICATION_JSON)
                    .header(HttpHeaders.AUTHORIZATION, TOKEN_PREFIX + token)
            )
            .andReturn();

        var status = HttpStatus.valueOf(result.getResponse().getStatus());
        var content = status == HttpStatus.OK ?
            objectMapper.readValue(result.getResponse().getContentAsString(), MidiWithDataDto.class) :
            null;
        return ResponseEntity.status(status).body(content);
    }

    public ResponseEntity<MidiWithDataDto> editMidiBinary(UUID midiId, String token, MidiEditBinaryRequestDto requestBody) throws Exception {
        var result = mockMvc.perform(
                MockMvcRequestBuilders
                    .post("/midis/binary/" + midiId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(requestBody))
                    .accept(MediaType.APPLICATION_JSON)
                    .header(HttpHeaders.AUTHORIZATION, TOKEN_PREFIX + token)
            )
            .andReturn();

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
                    .header(HttpHeaders.AUTHORIZATION, TOKEN_PREFIX + token)
            )
            .andReturn();

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
                    .header(HttpHeaders.AUTHORIZATION, TOKEN_PREFIX + token)
            )
            .andReturn();

        var status = HttpStatus.valueOf(result.getResponse().getStatus());
        var content = status == HttpStatus.OK ?
            result.getResponse().getContentAsString() :
            null;
        return ResponseEntity.status(status).body(content);
    }

    public ResponseEntity<ValidationErrorDto> createMidiAndExpectValidationError(String token, MidiCreateRequestDto requestBody) throws Exception {
        var result = mockMvc.perform(
                MockMvcRequestBuilders
                    .post("/midis/create")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(requestBody))
                    .accept(MediaType.APPLICATION_JSON)
                    .header(HttpHeaders.AUTHORIZATION, TOKEN_PREFIX + token)
            )
            .andReturn();

        var status = HttpStatus.valueOf(result.getResponse().getStatus());
        var content = status == HttpStatus.UNPROCESSABLE_ENTITY ?
            objectMapper.readValue(result.getResponse().getContentAsString(), ValidationErrorDto.class) :
            null;
        return ResponseEntity.status(status).body(content);
    }

}
