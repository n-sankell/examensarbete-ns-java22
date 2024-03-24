package com.midio.userservice.service;

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
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final JwtTokenGenerator tokenGenerator;
    private final Logger logger;

    @Autowired
    public UserService(UserRepository userRepository, JwtTokenGenerator tokenGenerator) {
        this.userRepository = userRepository;
        this.tokenGenerator = tokenGenerator;
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

        return new UserInfoAndToken(getUserInfoById(userInfo.user().userId()), token);
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
