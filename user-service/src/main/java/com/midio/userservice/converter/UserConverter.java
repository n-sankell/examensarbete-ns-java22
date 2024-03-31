package com.midio.userservice.converter;

import com.midio.userservice.model.DetailsId;
import com.midio.userservice.model.PassId;
import com.midio.userservice.model.Password;
import com.midio.userservice.model.UpdateDetails;
import com.midio.userservice.model.UpdatePassword;
import com.midio.userservice.model.User;
import com.midio.userservice.model.UserBundle;
import com.midio.userservice.model.UserDetails;
import com.midio.userservice.model.UserId;
import com.midio.userservice.model.UserInfo;
import generatedapi.model.EditPasswordRequestDto;
import generatedapi.model.EditUserRequestDto;
import generatedapi.model.UserCreateRequestDto;
import generatedapi.model.UserDto;

import java.time.ZonedDateTime;

public class UserConverter {

    public static UserDto convert(UserInfo userInfo) {
        return new UserDto()
            .username(userInfo.username())
            .email(userInfo.email())
            .lastActive(userInfo.lastLogin().toOffsetDateTime())
            .dateCreated(userInfo.dateCreated().toOffsetDateTime())
            .dateEdited(userInfo.lastEdited().toOffsetDateTime());
    }

    public static UserBundle buildCreateData(UserCreateRequestDto createData) {
        var userId = UserId.newUserId();
        var detailsId = DetailsId.newDetailsId();
        var passId = PassId.newPassId();
        var date = ZonedDateTime.now();

        return new UserBundle(
            new User(
                userId,
                detailsId,
                passId,
                date,
                date,
                date
            ),
            new UserDetails(
                detailsId,
                createData.getUsername(),
                createData.getEmail(),
                date
            ),
            new Password(
                passId,
                createData.getPassword(),
                date
            )
        );
    }

    public static UpdateDetails buildDetailsUpdate(EditUserRequestDto request) {
        return new UpdateDetails(
            request.getUsername(),
            request.getEmail()
        );
    }

    public static UpdatePassword buildUpdatePassword(EditPasswordRequestDto request) {
        return new UpdatePassword(
            request.getCurrentPassword(),
            request.getNewPassword()
        );
    }

}
