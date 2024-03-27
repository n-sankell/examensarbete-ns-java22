package com.midio.userservice.repository;

import com.midio.userservice.model.DetailsId;
import com.midio.userservice.model.PassId;
import com.midio.userservice.model.Password;
import com.midio.userservice.model.User;
import com.midio.userservice.model.UserDetails;
import com.midio.userservice.model.UserId;
import com.midio.userservice.util.DbUtil;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.ZonedDateTime;
import java.util.Optional;
import java.util.UUID;

import static com.midio.userservice.util.DbUtil.convertDate;

@Repository
public class UserRepository {

    private final NamedParameterJdbcTemplate userJdbcTemplate;

    public UserRepository(@Qualifier("userNamedParameterJdbcTemplate") NamedParameterJdbcTemplate userJdbcTemplate) {
        this.userJdbcTemplate = userJdbcTemplate;
    }

    public Optional<UserDetails> getUserDetails(DetailsId detailsId) {
        var parameters = new MapSqlParameterSource()
            .addValue("detailsId", detailsId.id());

        var sql =
            """
            SELECT details_id, username, email, date_edited
            FROM user_details
            WHERE details_id = :detailsId
            """;

        var result = userJdbcTemplate.query(sql, parameters, (rs, rowNum) -> toUserDetails(rs));

        return result.isEmpty() ?
            Optional.empty() :
            Optional.ofNullable(result.getFirst());
    }

    public Optional<User> getUser(UserId userId) {
        var parameters = new MapSqlParameterSource()
            .addValue("userId", userId.id());

        var sql =
            """
            SELECT user_id, details_ref, pass_ref,
                   last_login, last_edited, date_created
            FROM midi_user
            WHERE user_id = :userId
            """;

        var result = userJdbcTemplate.query(sql, parameters, (rs, rowNum) -> toUser(rs));

        return result.isEmpty() ?
            Optional.empty() :
            Optional.ofNullable(result.getFirst());
    }

    public Optional<Password> getPassword(PassId passId) {
        var parameters = new MapSqlParameterSource()
            .addValue("passId", passId.id());

        var sql =
            """
            SELECT pass_id, password, date_edited
            FROM pass_details
            WHERE pass_id = :passId
            """;

        var result = userJdbcTemplate.query(sql, parameters, (rs, rowNum) -> toPassword(rs));

        return result.isEmpty() ?
            Optional.empty() :
            Optional.ofNullable(result.getFirst());
    }

    public Optional<DetailsId> getDetailsId(UserId userId) {
        var parameters = new MapSqlParameterSource()
            .addValue("userId", userId.id());

        var sql =
            """
            SELECT details_ref
            FROM midi_user
            WHERE user_id = :userId
            """;

        var result = userJdbcTemplate.query(sql, parameters, (rs, rowNum) -> toDetailsId(rs));

        return result.isEmpty() ?
            Optional.empty() :
            Optional.ofNullable(result.getFirst());
    }

    public Optional<UserDetails> getUserDetailsByEmail(String email) {
        var parameters = new MapSqlParameterSource()
            .addValue("email", email);

        var sql =
            """
            SELECT details_id, username, email, date_edited
            FROM user_details
            WHERE email = :email
            """;

        var result = userJdbcTemplate.query(sql, parameters, (rs, rowNum) -> toUserDetails(rs));

        return result.isEmpty() ?
            Optional.empty() :
            Optional.ofNullable(result.getFirst());
    }

    public Optional<UserDetails> getUserDetailsByUsername(String username) {
        var parameters = new MapSqlParameterSource()
            .addValue("username", username);

        var sql =
            """
            SELECT details_id, username, email, date_edited
            FROM user_details
            WHERE username = :username
            """;

        var result = userJdbcTemplate.query(sql, parameters, (rs, rowNum) -> toUserDetails(rs));

        return result.isEmpty() ?
            Optional.empty() :
            Optional.ofNullable(result.getFirst());
    }

    public Optional<User> getUsersByDetailsId(DetailsId detailsId) {
        var parameters = new MapSqlParameterSource()
            .addValue("detailsId", detailsId.id());

        var sql =
            """
            SELECT user_id, details_ref, pass_ref,
                   last_login, last_edited, date_created
            FROM midi_user
            WHERE details_ref = :detailsId
            """;

        var result = userJdbcTemplate.query(sql, parameters, (rs, rowNum) -> toUser(rs));

        return result.isEmpty() ?
            Optional.empty() :
            Optional.ofNullable(result.getFirst());
    }

    public void saveUserDetails(UserDetails userDetails) {
        var parameters = new MapSqlParameterSource()
            .addValue("detailsId", userDetails.detailsId().id())
            .addValue("username", userDetails.username())
            .addValue("email", userDetails.email())
            .addValue("edited", convertDate(userDetails.dateEdited()));

        var sql =
            """
            INSERT INTO user_details (
                details_id, username, email, date_edited
                )
            VALUES (
                :detailsId, :username, :email, :edited
                )
            """;

        var result = userJdbcTemplate.update(sql, parameters);

        if (result == 0) {
            throw new RuntimeException("Error when saving user details");
        }
    }

    public void savePassword(Password password) {
        var parameters = new MapSqlParameterSource()
            .addValue("passId", password.passId().id())
            .addValue("password", password.password())
            .addValue("edited", convertDate(password.lastEdited()));

        var sql =
            """
            INSERT INTO pass_details (
                pass_id, password, date_edited
                )
            VALUES (
                :passId, :password, :edited
                )
            """;

        var result = userJdbcTemplate.update(sql, parameters);

        if (result == 0) {
            throw new RuntimeException("Error when saving password");
        }
    }

    public void saveUser(User user) {
        var parameters = new MapSqlParameterSource()
            .addValue("userId", user.userId().id())
            .addValue("detailsId", user.detailsId().id())
            .addValue("passId", user.passId().id())
            .addValue("lastLogin", convertDate(user.lastLogin()))
            .addValue("lastEdited", convertDate(user.lastEdited()))
            .addValue("dateCreated", convertDate(user.dateCreated()));

        var sql =
            """
            INSERT INTO midi_user (
                user_id, details_ref, pass_ref,
                last_login, last_edited, date_created
                )
            VALUES (
                :userId, :detailsId, :passId,
                :lastLogin, :lastEdited, :dateCreated
                )
            """;

        var result = userJdbcTemplate.update(sql, parameters);

        if (result == 0) {
            throw new RuntimeException("Error when saving user");
        }
    }

    public void updateUserLoginDate(UserId userId, ZonedDateTime lastLogin) {
        var parameters = new MapSqlParameterSource()
            .addValue("id", userId.id())
            .addValue("lastLogin", convertDate(lastLogin));

        var sql =
            """
            UPDATE midi_user
            SET last_login = :lastLogin
            WHERE user_id = :id
            """;
        var result = userJdbcTemplate.update(sql, parameters);

        if (result == 0) {
            throw new RuntimeException("Error, could not update");
        }
    }

    private UserDetails toUserDetails(ResultSet rs) throws SQLException {
        var id = UUID.fromString(rs.getString("details_id"));
        var filename = rs.getString("username");
        var artist = rs.getString("email");
        var dateEdited = rs.getTimestamp("date_edited");

        return new UserDetails(new DetailsId(id), filename, artist, DbUtil.convertDate(dateEdited));
    }

    private User toUser(ResultSet rs) throws SQLException {
        var id = UUID.fromString(rs.getString("user_id"));
        var detailsId = UUID.fromString(rs.getString("details_ref"));
        var passId = UUID.fromString(rs.getString("pass_ref"));
        var lastLogin = rs.getTimestamp("last_login");
        var dateEdited = rs.getTimestamp("last_edited");
        var dateCreated = rs.getTimestamp("date_created");

        return new User(new UserId(id), new DetailsId(detailsId), new PassId(passId),
            DbUtil.convertDate(lastLogin), DbUtil.convertDate(dateEdited), DbUtil.convertDate(dateCreated));
    }

    private Password toPassword(ResultSet rs) throws SQLException {
        var id = UUID.fromString(rs.getString("pass_id"));
        var password = rs.getString("password");
        var dateEdited = rs.getTimestamp("date_edited");

        return new Password(new PassId(id), password, DbUtil.convertDate(dateEdited));
    }

    private DetailsId toDetailsId(ResultSet rs) throws SQLException {
        var id = UUID.fromString(rs.getString("details_ref"));
        return new DetailsId(id);
    }

}
