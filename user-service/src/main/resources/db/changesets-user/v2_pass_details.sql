-- v2_pass_details

CREATE TABLE pass_details (
    pass_id         UUID                        PRIMARY KEY,
    password        VARCHAR(255)                NOT NULL,
    date_edited     TIMESTAMP WITH TIME ZONE    NOT NULL
);