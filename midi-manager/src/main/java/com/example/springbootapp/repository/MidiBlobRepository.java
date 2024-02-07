package com.example.springbootapp.repository;

import com.example.springbootapp.model.Blob;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public class MidiBlobRepository {

    private final NamedParameterJdbcTemplate blobJdbcTemplate;

    public MidiBlobRepository(@Qualifier("blobNamedParameterJdbcTemplate") NamedParameterJdbcTemplate blobJdbcTemplate) {
        this.blobJdbcTemplate = blobJdbcTemplate;
    }

    public List<Blob> getAllBlobs() {
        var sql =
            """
            SELECT blob_id, midi_data FROM midi_blob
            """;
        return blobJdbcTemplate.query(sql, (rs, rowNum) -> toBlob(rs));
    }

    public Optional<Blob> getBlobById(UUID blobId) {
        var parameters = new MapSqlParameterSource()
            .addValue("id", blobId);

        var sql =
            """
            SELECT blob_id, midi_data FROM midi_blob
            WHERE blob_id = :id
            """;
        var result = blobJdbcTemplate.query(sql, parameters, (rs, rowNum) -> toBlob(rs));

        return Optional.ofNullable(result.getFirst());
    }

    public void saveBlob(Blob midiBlob) {
        var parameters = new MapSqlParameterSource()
            .addValue("blobId", midiBlob.blobId())
            .addValue("midiData", midiBlob.midiData());

        var sql =
            """
            INSERT INTO midi_blob (blob_id, midi_data) 
            VALUES (:blobId, :midiData)
            """;

        var result = blobJdbcTemplate.update(sql, parameters);

        if (result == 0) {
            throw new RuntimeException("Error when saving blob");
        }
    }

    public void updateMidiData(Blob updateBlob) {
        var parameters = new MapSqlParameterSource()
            .addValue("blobId", updateBlob.blobId())
            .addValue("midiData", updateBlob.midiData());

        var sql =
            """
            UPDATE midi_blob 
            SET midi_data = :midiData 
            WHERE blob_id = :blobId
            """;

        var result = blobJdbcTemplate.update(sql, parameters);

        if (result == 0) {
            throw new RuntimeException("Error when updating");
        }
    }

    public void deleteBlob(UUID deleteId) {
        var parameters = new MapSqlParameterSource()
            .addValue("blobId", deleteId);

        var sql =
            """
            DELETE FROM midi_blob
            WHERE blob_id = :blobId
            """;

        var result = blobJdbcTemplate.update(sql, parameters);

        if (result == 0) {
            throw new RuntimeException("Error deleting blob");
        }
    }

    private Blob toBlob(ResultSet rs) throws SQLException {
        var id = UUID.fromString(rs.getString("blob_id"));
        var bytes = rs.getBytes("midi_data");
        return new Blob(id, bytes);
    }

}
