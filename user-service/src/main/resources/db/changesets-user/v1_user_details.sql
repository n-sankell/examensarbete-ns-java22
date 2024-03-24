-- v1_user_details

CREATE TABLE user_details (
    details_id      UUID                        PRIMARY KEY,
    username        VARCHAR(100)                UNIQUE NOT NULL,
    email           VARCHAR(100)                UNIQUE NOT NULL,
    date_edited     TIMESTAMP WITH TIME ZONE    NOT NULL
);