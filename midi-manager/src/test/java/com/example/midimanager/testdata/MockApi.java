package com.example.midimanager.testdata;

import com.fasterxml.jackson.databind.ObjectMapper;
import generatedapi.model.MidiCreateRequestDto;
import generatedapi.model.MidiEditBinaryRequestDto;
import generatedapi.model.MidiEditMetaRequestDto;
import generatedapi.model.MidiEditRequestDto;
import generatedapi.model.MidiWithDataDto;
import generatedapi.model.MidisDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.util.UUID;

import static com.example.midimanager.secirity.Constants.TOKEN_PREFIX;

@Component
public class MockApi {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;

    public TestResponse<MidiWithDataDto> getMidiBiId(UUID midiId, String token) throws Exception {
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
        return new TestResponse<>(status, content);
    }

    public TestResponse<MidisDto> getUserMidis(UUID userId, String token) throws Exception {
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
        return new TestResponse<>(status, content);
    }

    public TestResponse<MidisDto> getPublicMidis(String token) throws Exception {
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
        return new TestResponse<>(status, content);
    }

    public TestResponse<MidiWithDataDto> editMidi(UUID midiId, String token, MidiEditRequestDto requestBody) throws Exception {
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
        return new TestResponse<>(status, content);
    }

    public TestResponse<MidiWithDataDto> editMidiMeta(UUID midiId, String token, MidiEditMetaRequestDto requestBody) throws Exception {
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
        return new TestResponse<>(status, content);
    }

    public TestResponse<MidiWithDataDto> editMidiBinary(UUID midiId, String token, MidiEditBinaryRequestDto requestBody) throws Exception {
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
        return new TestResponse<>(status, content);
    }

    public TestResponse<MidiWithDataDto> createMidi(String token, MidiCreateRequestDto requestBody) throws Exception {
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
        return new TestResponse<>(status, content);
    }

    public TestResponse<String> deleteMidi(UUID midiId, String token) throws Exception {
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
        return new TestResponse<>(status, content);
    }

}
