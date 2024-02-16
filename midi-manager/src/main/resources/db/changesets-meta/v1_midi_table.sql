-- v1_midi_table

CREATE TABLE midi (
    midi_id         UUID                        PRIMARY KEY,
    blob_ref        UUID                        NOT NULL,
    user_ref        UUID                        NOT NULL,
    private         BOOLEAN                     DEFAULT false,
    filename        VARCHAR(255)                NOT NULL,
    artist          VARCHAR(255)                NOT NULL,
    title           VARCHAR(255)                NOT NULL,
    date_created    TIMESTAMP WITH TIME ZONE    NOT NULL,
    date_edited     TIMESTAMP WITH TIME ZONE    NOT NULL
);