-- v1_blob_table

CREATE TABLE midi_blob (
    blob_id         UUID      PRIMARY KEY,
    midi_data       BYTEA     NOT NULL
);