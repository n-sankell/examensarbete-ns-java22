package com.midio.userservice.controller;

import com.midio.userservice.converter.UserConverter;
import com.midio.userservice.secirity.CurrentUser;
import com.midio.userservice.secirity.CurrentUserSupplier;
import com.midio.userservice.secirity.SCryptPasswordEncoder;
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

import static com.midio.userservice.converter.UserConverter.buildCreateData;
import static com.midio.userservice.converter.UserConverter.buildUpdatePassword;
import static com.midio.userservice.converter.UserConverter.convert;
import static com.midio.userservice.secirity.JwtConstants.TOKEN_PREFIX;
import static org.springframework.http.HttpHeaders.AUTHORIZATION;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.ResponseEntity.ok;

@RestController
public class UserController implements UserApi {

    private final UserService userService;
    private final CurrentUserSupplier currentUserSupplier;
    private final RequestValidator validator;
    private final SCryptPasswordEncoder passwordEncoder;

    @Autowired
    public UserController(
        UserService userService,
        CurrentUserSupplier currentUserSupplier,
        RequestValidator validator,
        SCryptPasswordEncoder passwordEncoder
    ) {
        this.userService = userService;
        this.currentUserSupplier = currentUserSupplier;
        this.validator = validator;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public ResponseEntity<UserDto> createUser(UserCreateRequestDto userCreateRequestDto) {
        validator.validateRequest(userCreateRequestDto);

        var encryptedPassword = passwordEncoder.encode(userCreateRequestDto.getPassword());
        userCreateRequestDto.setPassword(encryptedPassword);

        var userData = buildCreateData(userCreateRequestDto);
        var userInfo = userService.createUser(userData);

        return ResponseEntity.status(OK)
            .header(AUTHORIZATION, TOKEN_PREFIX + userInfo.token())
            .body(convert(userInfo.userInfo()));
    }

    @Override
    public ResponseEntity<Object> deleteUser(DeleteUserRequestDto deleteUserRequestDto) {
        validator.validateRequest(deleteUserRequestDto);
        userService.deleteUser(deleteUserRequestDto.getPassword(), getCurrentUser());
        return ok("User deleted.");
    }

    @Override
    public ResponseEntity<UserDto> editUserDetails(EditUserRequestDto editUserRequestDto) {
        return ok(null);
    }

    @Override
    public ResponseEntity<Object> editUserPassword(EditPasswordRequestDto editPasswordRequestDto) {
        validator.validateRequest(editPasswordRequestDto);

        var passwordData = buildUpdatePassword(editPasswordRequestDto);
        userService.updatePassword(passwordData, getCurrentUser());

        return ok("Password updated.");
    }

    @Override
    public ResponseEntity<UserDto> getUserDetails() {
        var userInfo = userService.getUserInfo(getCurrentUser());
        return ok(convert(userInfo));
    }

    @Override
    public ResponseEntity<UserDto> login(UserLoginRequestDto userLoginRequestDto) {
        validator.validateRequest(userLoginRequestDto);

        var userInfo = userService.login(userLoginRequestDto.getUserIdentifier(), userLoginRequestDto.getPassword());

        return ResponseEntity.status(OK)
            .header(AUTHORIZATION, TOKEN_PREFIX + userInfo.token())
            .body(convert(userInfo.userInfo()));
    }

    private CurrentUser getCurrentUser() {
        return currentUserSupplier.getCurrentUser();
    }

}
