CREATE DATABASE IF NOT EXISTS mysql;
USE mysql;

CREATE TABLE IF NOT EXISTS greeting (
    greeting_id CHAR(36) PRIMARY KEY,
    greeting_value VARCHAR(255) NOT NULL
);

INSERT INTO greeting (greeting_id, greeting_value)
SELECT '550e8400-e29b-41d4-a716-446655440000', 'Hello from MySQL'
WHERE NOT EXISTS (
    SELECT greeting_id FROM greeting WHERE greeting_id = '550e8400-e29b-41d4-a716-446655440000'
);

INSERT INTO greeting (greeting_id, greeting_value)
SELECT '660e9511-e29b-51d5-a716-546655440001', 'Hello again from MySQL'
WHERE NOT EXISTS (
    SELECT greeting_id FROM greeting WHERE greeting_id = '660e9511-e29b-51d5-a716-546655440001'
);

CREATE TABLE IF NOT EXISTS food (
    food_id CHAR(36) PRIMARY KEY,
    food_name VARCHAR(255) NOT NULL,
    food_rating DECIMAL(3,1) CHECK (food_rating >= 1 AND food_rating <= 10 AND food_rating % 0.5 = 0)
);

INSERT INTO food (food_id, food_name, food_rating)
SELECT '550e8400-e29b-41d4-a716-446655440000', 'Pizza', 8.5
WHERE NOT EXISTS (
    SELECT food_id FROM food WHERE food_id = '550e8400-e29b-41d4-a716-446655440000'
);

INSERT INTO food (food_id, food_name, food_rating)
SELECT '660e9511-e29b-51d5-a716-546655440001', 'Burger', 7.0
WHERE NOT EXISTS (
    SELECT food_id FROM food WHERE food_id = '660e9511-e29b-51d5-a716-546655440001'
);

GRANT ALL PRIVILEGES ON mysql.* TO 'user'@'%';
FLUSH PRIVILEGES;
