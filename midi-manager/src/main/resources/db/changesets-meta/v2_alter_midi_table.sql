-- v2_alter_midi_table
-- the values of "artist" and "title" does not need to be non-null

ALTER TABLE midi
  ALTER COLUMN artist DROP NOT NULL;

ALTER TABLE midi
  ALTER COLUMN title DROP NOT NULL;