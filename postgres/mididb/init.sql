DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'midi_meta_db') THEN
        CREATE DATABASE midi_meta_db;
    END IF;
END $$;
\c midi_meta_db;

CREATE TABLE IF NOT EXISTS midi (
    midi_id UUID PRIMARY KEY,
    blob_ref UUID,
    user_ref UUID,
    private BOOLEAN DEFAULT false,
    filename VARCHAR(255) NOT NULL,
    artist VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    date_created TIMESTAMP WITH TIME ZONE,
    date_edited TIMESTAMP WITH TIME ZONE
);

INSERT INTO midi (midi_id, blob_ref, user_ref, private, filename, artist, title, date_created, date_edited)
SELECT 
    '550e8400-e29b-41d4-a716-446655440000'::UUID,
    '860e9511-e29b-81d5-a716-846655420002'::UUID,
    '960e9511-e29b-91d5-a716-946655430003'::UUID,
    true,
    'farmor-loop.mid',
    'Umarell',
    'Farmor',
    current_timestamp,
    current_timestamp
WHERE NOT EXISTS (
    SELECT 1 FROM midi WHERE midi_id = '550e8400-e29b-41d4-a716-446655440000'::UUID
);

INSERT INTO midi (midi_id, blob_ref, user_ref, private, filename, artist, title, date_created, date_edited)
SELECT 
    '660e9511-e29b-51d5-a716-546655440001'::UUID,
    '860e9511-e29b-81d5-a716-846655450005'::UUID,
    '960e9511-e29b-91d5-a716-946655460006'::UUID,
    true,
    'moog-madness.mid',
    'Rolf Moogman',
    'Under Broon',
    current_timestamp,
    current_timestamp
WHERE NOT EXISTS (
    SELECT 1 FROM midi WHERE midi_id = '660e9511-e29b-51d5-a716-546655440001'::UUID
);