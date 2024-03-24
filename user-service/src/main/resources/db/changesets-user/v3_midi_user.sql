-- v3_midi_user

CREATE TABLE midi_user (
    user_id         UUID                        PRIMARY KEY,
    details_ref     UUID                        NOT NULL,
    pass_ref        UUID                        NOT NULL,
    last_login      TIMESTAMP WITH TIME ZONE    NOT NULL,
    last_edited     TIMESTAMP WITH TIME ZONE    NOT NULL,
    date_created    TIMESTAMP WITH TIME ZONE    NOT NULL
);