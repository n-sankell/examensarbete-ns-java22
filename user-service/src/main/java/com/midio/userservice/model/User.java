package com.midio.userservice.model;

import java.time.ZonedDateTime;

public record User(
    UserId userId,
    DetailsId detailsId,
    PassId passId,
    ZonedDateTime lastLogin,
    ZonedDateTime lastEdited,
    ZonedDateTime dateCreated
) {
}
