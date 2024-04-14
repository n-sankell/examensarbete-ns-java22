package com.midio.userservice.model;

import java.time.ZonedDateTime;

public record Password(PassId passId, String password, ZonedDateTime lastEdited) {
}
