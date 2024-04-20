package com.midio.userservice.service;

import com.midio.userservice.exception.FailedLoginException;
import com.midio.userservice.exception.ForbiddenException;
import com.midio.userservice.exception.NotFoundException;
import com.midio.userservice.model.DetailsId;
import com.midio.userservice.model.PassId;
import com.midio.userservice.model.Password;
import com.midio.userservice.model.UpdateDetails;
import com.midio.userservice.model.UpdatePassword;
import com.midio.userservice.model.User;
import com.midio.userservice.model.UserAndDetails;
import com.midio.userservice.model.UserBundle;
import com.midio.userservice.model.UserDetails;
import com.midio.userservice.model.UserId;
import com.midio.userservice.model.UserInfo;
import com.midio.userservice.model.UserInfoAndToken;
import com.midio.userservice.repository.UserRepository;
import com.midio.userservice.security.CurrentUser;
import com.midio.userservice.security.JwtTokenGenerator;
import com.midio.userservice.security.SCryptPasswordEncoder;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final JwtTokenGenerator tokenGenerator;
    private final SCryptPasswordEncoder passwordEncoder;
    private final Logger logger;

    @Autowired
    public UserService(UserRepository userRepository, JwtTokenGenerator tokenGenerator,
        SCryptPasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.tokenGenerator = tokenGenerator;
        this.passwordEncoder = passwordEncoder;
        this.logger = getLogger();
    }

    public UserInfo getUserInfo(CurrentUser currentUser) {
        var userId = currentUser.userId();
        return getUserInfoById(userId);
    }

    @Transactional
    public UserInfoAndToken createUser(UserBundle userInfo) {
        userRepository.saveUserDetails(userInfo.userDetails());
        userRepository.savePassword(userInfo.password());
        userRepository.saveUser(userInfo.user());
        var token = tokenGenerator.generateTokenForUser(
            UserAndDetails.of(userInfo.user(), userInfo.userDetails()));

        logger.info("User created with id: " + userInfo.user().userId());
        return new UserInfoAndToken(getUserInfoById(userInfo.user().userId()), token);
    }

    @Transactional
    public UserInfoAndToken login(String identifier, String password) {
        return findUserByIdentifier(identifier)
            .filter(user -> passwordMatches(user, password))
            .map(user -> {
                updateUserLoginDate(user);
                var userDetails = getUserDetailsById(user.detailsId());
                var token = tokenGenerator.generateTokenForUser(new UserAndDetails(user, userDetails));
                var userInfo = getUserInfoById(user.userId());
                return new UserInfoAndToken(userInfo, token);
            })
            .orElseThrow(() -> new FailedLoginException("Login unsuccessful", identifier));
    }

    @Transactional
    public void updatePassword(UpdatePassword updatePassword, CurrentUser currentUser) {
        var user = getUserById(currentUser.userId());
        if (!passwordMatches(user, updatePassword.currentPassword())) {
            logger.warn("Failed attempt to change password for user: " + currentUser.userId());
            throw new ForbiddenException("Password incorrect", currentUser.idToString());
        }
        var newPassword = passwordEncoder.encode(updatePassword.newPassword());
        userRepository.updatePassword(user.passId(), newPassword, ZonedDateTime.now());
        userRepository.updateLastEdited(currentUser.userId(), ZonedDateTime.now());
    }

    @Transactional
    public void deleteUser(String password, CurrentUser currentUser) {
        var user = getUserById(currentUser.userId());
        if (!passwordMatches(user, password)) {
            logger.warn("Failed attempt to delete user: " + currentUser.userId());
            throw new ForbiddenException("Password incorrect", currentUser.idToString());
        }
        userRepository.deleteUserById(user.userId());
        userRepository.deleteDetailsById(user.detailsId());
        userRepository.deletePasswordById(user.passId());
        logger.info("User: " + currentUser.userId() + " was deleted from the database");
    }

    @Transactional
    public UserInfoAndToken updateUserDetails(UpdateDetails updateDetails, CurrentUser currentUser) {
        var user = getUserById(currentUser.userId());
        var details = getUserDetailsById(user.detailsId());
        var date = ZonedDateTime.now();

        userRepository.updateDetails(details.detailsId(), updateDetails, date);
        userRepository.updateLastEdited(user.userId(), date);

        var token = tokenGenerator.generateTokenForUser(
            UserAndDetails.of(user, getUserDetailsById(details.detailsId()))
        );

        logger.info("User with id: " + user.userId() + " was updated with new info");
        return new UserInfoAndToken(getUserInfoById(user.userId()), token);
    }

    private boolean passwordMatches(User user, String password) {
        var savedPassword = getPasswordById(user.passId());
        return passwordEncoder.matches(password, savedPassword.password());
    }

    private void updateUserLoginDate(User user) {
        userRepository.updateUserLoginDate(user.userId(), ZonedDateTime.now());
    }

    private Optional<User> findUserByIdentifier(String identifier) {
        return userRepository.getUserDetailsByEmail(identifier)
            .or(() -> userRepository.getUserDetailsByUsername(identifier))
            .flatMap(o -> userRepository.getUsersByDetailsId(o.detailsId()));
    }

    private UserDetails getUserDetailsById(DetailsId detailsId) {
        return userRepository.getUserDetails(detailsId)
            .orElseThrow(NotFoundException::new);
    }

    private User getUserById(UserId userId) {
        return userRepository.getUser(userId)
            .orElseThrow(NotFoundException::new);
    }

    private Password getPasswordById(PassId passId) {
        return userRepository.getPassword(passId)
            .orElseThrow(NotFoundException::new);
    }

    private Logger getLogger() {
        return LogManager.getLogger(this.getClass());
    }

    private UserInfo getUserInfoById(UserId userId) {
        var user = getUserById(userId);
        var details = getUserDetailsById(user.detailsId());
        var password = getPasswordById(user.passId());

        return buildUserInfo(user, details, password);
    }

    private UserInfo buildUserInfo(User user, UserDetails userDetails, Password password) {
        return new UserInfo(
            userDetails.username(),
            userDetails.email(),
            user.lastLogin(),
            user.lastEdited(),
            user.dateCreated(),
            password.lastEdited()
        );
    }

}
