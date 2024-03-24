package com.midio.userservice.controller;

import com.midio.userservice.converter.UserConverter;
import com.midio.userservice.secirity.CurrentUser;
import com.midio.userservice.secirity.CurrentUserSupplier;
import com.midio.userservice.service.UserService;
import com.midio.userservice.util.RequestValidator;
import generatedapi.UserApi;
import generatedapi.model.DeleteUserRequestDto;
import generatedapi.model.EditPasswordRequestDto;
import generatedapi.model.EditUserRequestDto;
import generatedapi.model.UserCreateRequestDto;
import generatedapi.model.UserDto;
import generatedapi.model.UserLoginRequestDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.http.ResponseEntity.ok;

@RestController
public class UserController implements UserApi {

    private final UserService userService;
    private final CurrentUserSupplier currentUserSupplier;
    private final RequestValidator validator;

    @Autowired
    public UserController(
        UserService userService,
        CurrentUserSupplier currentUserSupplier,
        RequestValidator validator
    ) {
        this.userService = userService;
        this.currentUserSupplier = currentUserSupplier;
        this.validator = validator;
    }

    @Override
    public ResponseEntity<UserDto> createUser(UserCreateRequestDto userCreateRequestDto) {
        validator.validateRequest(userCreateRequestDto);
        var userData = UserConverter.buildCreateData(userCreateRequestDto);
        var userInfo = userService.createUser(userData);
        return ok(UserConverter.convert(userInfo));
    }

    @Override
    public ResponseEntity<Object> deleteUser(DeleteUserRequestDto deleteUserRequestDto) {
        return ok(null);
    }

    @Override
    public ResponseEntity<UserDto> editUserDetails(EditUserRequestDto editUserRequestDto) {
        return ok(null);
    }

    @Override
    public ResponseEntity<Object> editUserPassword(EditPasswordRequestDto editPasswordRequestDto) {
        return ok(null);
    }

    @Override
    public ResponseEntity<UserDto> getUserDetails() {
        var userInfo = userService.getUserInfo(getCurrentUser());
        return ok(UserConverter.convert(userInfo));
    }

    @Override
    public ResponseEntity<UserDto> login(UserLoginRequestDto userLoginRequestDto) {
        return ok(null);
    }

    private CurrentUser getCurrentUser() {
        return currentUserSupplier.getCurrentUser();
    }

}
