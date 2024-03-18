package com.midio.midimanager.testdata;

import java.util.UUID;

public record MockUser(UUID userId, String username) {

    public static MockUser randomMockUser() {
        return new MockUser(UUID.randomUUID(), "Random user");
    }

}
