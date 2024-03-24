package com.midio.userservice.model;

import java.time.ZonedDateTime;

public record UserInfo(
    String username,
    String email,
    ZonedDateTime lastLogin,
    ZonedDateTime lastEdited,
    ZonedDateTime dateCreated,
    ZonedDateTime passwordUpdated
) {
}
