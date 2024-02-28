package com.example.midimanager.testdata;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static com.example.midimanager.secirity.Constants.TOKEN_PREFIX;

@Component
public class MockApi {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;

    public <T> TestResponse<T> makeGetRequest(String endpoint, String token, Class<T> clazz) throws Exception {
        var result = mockMvc.perform(
                MockMvcRequestBuilders
                    .get(endpoint)
                    .header(HttpHeaders.AUTHORIZATION, TOKEN_PREFIX + token)
            )
            .andReturn();

        var status = HttpStatus.valueOf(result.getResponse().getStatus());
        var content = status == HttpStatus.OK ?
            objectMapper.readValue(result.getResponse().getContentAsString(), clazz) :
            null;
        return new TestResponse<T>(status, content);
    }

    public <T, R> TestResponse<T> makePostRequest(String endpoint, String token, R request, Class<T> response) throws Exception {
        var result = mockMvc.perform(
                MockMvcRequestBuilders
                    .post(endpoint)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request))
                        .accept(MediaType.APPLICATION_JSON)
                    .header(HttpHeaders.AUTHORIZATION, TOKEN_PREFIX + token)
            )
            .andReturn();

        var status = HttpStatus.valueOf(result.getResponse().getStatus());
        var content = status == HttpStatus.OK ?
            objectMapper.readValue(result.getResponse().getContentAsString(), response) :
            null;
        return new TestResponse<T>(status, content);
    }

}
