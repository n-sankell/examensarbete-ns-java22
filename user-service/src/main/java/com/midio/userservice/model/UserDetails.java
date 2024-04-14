package com.midio.userservice.model;

import java.time.ZonedDateTime;

public record UserDetails(
    DetailsId detailsId,
    String username,
    String email,
    ZonedDateTime dateEdited
) {
}
