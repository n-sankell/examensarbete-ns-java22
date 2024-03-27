package com.midio.userservice.service;

import com.midio.userservice.exception.ForbiddenException;
import com.midio.userservice.exception.NotFoundException;
import com.midio.userservice.model.DetailsId;
import com.midio.userservice.model.PassId;
import com.midio.userservice.model.Password;
import com.midio.userservice.model.User;
import com.midio.userservice.model.UserAndDetails;
import com.midio.userservice.model.UserBundle;
import com.midio.userservice.model.UserDetails;
import com.midio.userservice.model.UserId;
import com.midio.userservice.model.UserInfo;
import com.midio.userservice.model.UserInfoAndToken;
import com.midio.userservice.repository.UserRepository;
import com.midio.userservice.secirity.CurrentUser;
import com.midio.userservice.secirity.JwtTokenGenerator;
import com.midio.userservice.secirity.SCryptPasswordEncoder;
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
            new UserAndDetails(userInfo.user(), userInfo.userDetails()));

        logger.info("User created with id: " + userInfo.user().userId());
        return new UserInfoAndToken(getUserInfoById(userInfo.user().userId()), token);
    }

    public UserInfoAndToken login(String identifier, String password) {
        var optionalUser = findUserByIdentifier(identifier);
        if (optionalUser.isPresent()) {
            var user = optionalUser.get();
            var savedPassword = getPasswordById(user.passId());

            if (passwordEncoder.matches(password, savedPassword.password())) {
                var userDetails = getUserDetailsById(user.detailsId());
                var token = tokenGenerator.generateTokenForUser(
                    new UserAndDetails(user, userDetails));
                userRepository.updateUserLoginDate(user.userId(), ZonedDateTime.now());

                return new UserInfoAndToken(getUserInfoById(user.userId()), token);
            }
        }
        logger.warn("Failed login attempt for user with identifier " + identifier);
        throw new ForbiddenException("Login unsuccessful", identifier);
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

    private UserAndDetails getUserAndDetailsByIdentifier(String identifier) {

        return null;
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
