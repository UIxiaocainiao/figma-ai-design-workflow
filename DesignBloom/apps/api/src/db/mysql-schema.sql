CREATE TABLE IF NOT EXISTS users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  avatar_url TEXT,
  nickname VARCHAR(255) NOT NULL,
  username VARCHAR(64) NOT NULL,
  email VARCHAR(255) NOT NULL,
  verification_code VARCHAR(6),
  verification_sent_at VARCHAR(40),
  verification_verified_at VARCHAR(40),
  password_hash VARCHAR(255) NOT NULL,
  password_salt VARCHAR(255) NOT NULL,
  created_at VARCHAR(40) NOT NULL,
  updated_at VARCHAR(40) NOT NULL,
  last_login_at VARCHAR(40),
  UNIQUE KEY uq_users_username (username),
  UNIQUE KEY uq_users_email (email)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS verification_codes (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL,
  code VARCHAR(6) NOT NULL,
  status VARCHAR(32) NOT NULL,
  created_at VARCHAR(40) NOT NULL,
  expires_at VARCHAR(40) NOT NULL,
  consumed_at VARCHAR(40),
  INDEX idx_verification_codes_email_status (email, status)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS music (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  filename VARCHAR(255) NOT NULL,
  src VARCHAR(512) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at VARCHAR(40) NOT NULL,
  updated_at VARCHAR(40) NOT NULL,
  UNIQUE KEY uq_music_filename (filename),
  UNIQUE KEY uq_music_src (src),
  INDEX idx_music_sort_order (sort_order, id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
