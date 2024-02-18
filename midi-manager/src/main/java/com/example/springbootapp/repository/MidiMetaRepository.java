package com.example.springbootapp.repository;

import com.example.springbootapp.model.Blob;
import com.example.springbootapp.model.Midi;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static com.example.springbootapp.util.DbUtil.convertDate;

@Repository
public class MidiMetaRepository {

    private final NamedParameterJdbcTemplate metaJdbcTemplate;

    public MidiMetaRepository(@Qualifier("metaNamedParameterJdbcTemplate") NamedParameterJdbcTemplate metaJdbcTemplate) {
        this.metaJdbcTemplate = metaJdbcTemplate;
    }

    public List<Midi> getMidiMeta() {
        var sql =
            """
            SELECT midi_id, blob_ref, user_ref, 
                   private, filename, artist, 
                   title, date_created, date_edited 
            FROM midi
            """;

        return metaJdbcTemplate.query(sql, (rs, rowNum) -> toMidi(rs));
    }

    public List<Midi> getPublicMidiMeta() {
        var sql =
            """
            SELECT midi_id, blob_ref, user_ref, 
                   private, filename, artist, 
                   title, date_created, date_edited 
            FROM midi
            WHERE private = false
            """;

        return metaJdbcTemplate.query(sql, (rs, rowNum) -> toMidi(rs));
    }

    public List<Midi> getMidiMetaByUserId(UUID userId) {
        var parameters = new MapSqlParameterSource()
            .addValue("userId", userId);

        var sql =
            """
            SELECT midi_id, blob_ref, user_ref, 
                   private, filename, artist, 
                   title, date_created, date_edited 
            FROM midi
            WHERE user_ref = :userId
            """;

        return metaJdbcTemplate.query(sql, parameters, (rs, rowNum) -> toMidi(rs));
    }

    public Optional<Midi> getMidiMetaById(UUID midiId) {
        var parameters = new MapSqlParameterSource()
            .addValue("id", midiId);

        var sql =
            """
            SELECT midi_id, blob_ref, user_ref, 
                   private, filename, artist, 
                   title, date_created, date_edited 
            FROM midi
            WHERE midi_id = :id
            """;
        var result = metaJdbcTemplate.query(sql, parameters, (rs, rowNum) -> toMidi(rs));

        return Optional.ofNullable(result.getFirst());
    }

    public void saveMidiMeta(Midi midi) {
        var parameters = new MapSqlParameterSource()
            .addValue("midiId", midi.midiId())
            .addValue("blobRef", midi.blobRef())
            .addValue("userRef", midi.userRef())
            .addValue("private", midi.isPrivate())
            .addValue("filename", midi.filename())
            .addValue("artist", midi.artist())
            .addValue("title", midi.title())
            .addValue("created", convertDate(midi.dateCreated()))
            .addValue("edited", convertDate(midi.dateEdited()));

        var sql =
            """
            INSERT INTO midi (
                midi_id, blob_ref, user_ref, 
                private, filename, artist, 
                title, date_created, date_edited
                ) 
            VALUES (
                :midiId, :blobRef, :userRef,
                :private, :filename, :artist,
                :title, :created, :edited
                )
            """;

        var result = metaJdbcTemplate.update(sql, parameters);

        if (result == 0) {
            throw new RuntimeException("Error when saving midi");
        }
    }

    public void editMidiMeta(Midi midi) {
        var parameters = new MapSqlParameterSource()
            .addValue("id", midi.midiId())
            .addValue("private", midi.isPrivate())
            .addValue("filename", midi.filename())
            .addValue("artist", midi.artist())
            .addValue("title", midi.title())
            .addValue("edited", convertDate(midi.dateEdited()));

        var sql =
            """
            UPDATE midi 
            SET private = :private,
                filename = :filename, 
                artist = :artist,
                title = :title, 
                date_edited = :edited
            WHERE midi_id = :id
            """;
        var result = metaJdbcTemplate.update(sql, parameters);

        if (result == 0) {
            throw new RuntimeException("Error, could not update");
        }
    }

    public void deleteMidiMetaById(UUID deleteId) {
        var parameters = new MapSqlParameterSource()
            .addValue("id", deleteId);

        var sql =
            """
            DELETE FROM midi
            WHERE midi_id = :id
            """;
        var result = metaJdbcTemplate.update(sql, parameters);

        if (result == 0) {
            throw new RuntimeException("Error, could not delete");
        }
    }

    private Midi toMidi(ResultSet rs) throws SQLException {
        var id = UUID.fromString(rs.getString("midi_id"));
        var blobRef = UUID.fromString(rs.getString("blob_ref"));
        var userRef = UUID.fromString(rs.getString("user_ref"));
        var isPrivate = rs.getBoolean("private");
        var filename = rs.getString("filename");
        var artist = rs.getString("artist");
        var title = rs.getString("title");
        var dateCreated = rs.getTimestamp("date_created");
        var dateEdited = rs.getTimestamp("date_edited");

        return new Midi(id, blobRef, userRef, isPrivate, filename, artist, title,
            convertDate(dateCreated), convertDate(dateEdited));
    }

}
