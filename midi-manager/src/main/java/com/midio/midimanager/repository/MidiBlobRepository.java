package com.midio.midimanager.repository;

import com.midio.midimanager.model.Blob;
import com.midio.midimanager.model.BlobId;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Optional;
import java.util.UUID;

@Repository
public class MidiBlobRepository {

    private final NamedParameterJdbcTemplate blobJdbcTemplate;

    public MidiBlobRepository(@Qualifier("blobNamedParameterJdbcTemplate") NamedParameterJdbcTemplate blobJdbcTemplate) {
        this.blobJdbcTemplate = blobJdbcTemplate;
    }

    public Optional<Blob> getBlobById(BlobId blobId) {
        var parameters = new MapSqlParameterSource()
            .addValue("id", blobId.id());

        var sql =
            """
            SELECT blob_id, midi_data FROM midi_blob
            WHERE blob_id = :id
            """;
        var result = blobJdbcTemplate.query(sql, parameters, (rs, rowNum) -> toBlob(rs));

        return result.isEmpty() ?
            Optional.empty() :
            Optional.ofNullable(result.getFirst());
    }

    public void saveBlob(Blob midiBlob) {
        var parameters = new MapSqlParameterSource()
            .addValue("blobId", midiBlob.blobId().id())
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
            .addValue("blobId", updateBlob.blobId().id())
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

    public void deleteBlob(BlobId deleteId) {
        var parameters = new MapSqlParameterSource()
            .addValue("blobId", deleteId.id());

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
        return new Blob(new BlobId(id), bytes);
    }

}
