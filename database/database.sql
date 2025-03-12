-- Drop the database if it exists and then create it
DROP DATABASE IF EXISTS TaskQuestDB;
CREATE DATABASE TaskQuestDB;
USE TaskQuestDB;


CREATE TABLE UserLevels (
    level_id INT AUTO_INCREMENT PRIMARY KEY,
    level_name VARCHAR(50) NOT NULL
);

CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    user_level_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_level_id) REFERENCES UserLevels(level_id)
);

CREATE TABLE UserStats (
    user_id INT UNIQUE,
    user_exp INT NOT NULL,
    user_level INT NOT NULL,
    user_points INT NOT NULL,
    user_int INT NOT NULL,
    user_str INT NOT NULL,
    user_dex INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE ProfilePick (
    media_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    filename VARCHAR(255) NOT NULL,
    filesize INT NOT NULL,
    media_type VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Quests (
    quest_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(50) NOT NULL,
    quest_text TEXT NOT NULL,
    reward_type VARCHAR(50) NOT NULL,
    reward_count INT NOT NULL,
    reset_time TINYINT UNSIGNED NOT NULL,
    selected TINYINT UNSIGNED NOT NULL DEFAULT 0,
    is_done TINYINT UNSIGNED NOT NULL,
    is_public TINYINT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

INSERT INTO UserLevels (level_name) VALUES ('Admin'), ('User'), ('Guest');

INSERT INTO Users (username, password, email, user_level_id) VALUES
('JohnDoe', 'to-be-hashed-pw1', 'johndoe@example.com', 2);


INSERT INTO UserStats (user_id, user_exp, user_level, user_points, user_int, user_str, user_dex) VALUES
(1, 120, 15, 2, 5, 3, 2);

INSERT INTO Quests (user_id, title, quest_text, reward_type, reward_count, reset_time, is_done, is_public, selected) VALUES
(1, "Test1", "Long text of the quest description for you to read", "exp", 15, 30, 0, 0, 0),
(1, "Test2", "Long text of the quest description for you to read", "exp", 15, 30, 0, 0, 0),
(1, "Test3", "Long text of the quest description for you to read, Long text of the quest description for you to read", "exp", 15, 20, 1, 1, 0),
(1, "Test_card", "Long text of the quest description for you to read, Long text of the quest description for you to read, Long text of the quest description for you to read, Long text of the quest description for you to read", "exp", 15, 1, 0, 1, 1),
(1, "Test long tilttle with spacing", "Long text of the quest description for you to read", "exp", 15, 60, 0, 0, 1),
(1, "Test for card", "Long text of the quest description for you to read", "exp", 15, 1, 1, 0, 0),
(1, "Testing", "Long text of the quest description for you to read", "exp", 15, 45, 0, 0, 0);