package com.midio.userservice.model;

import java.util.UUID;

public sealed interface Identity permits DetailsId, PassId, UserId {

    UUID id();

}
