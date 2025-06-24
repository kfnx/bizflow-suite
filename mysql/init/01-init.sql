-- Initialize database
CREATE DATABASE IF NOT EXISTS bizdocgen CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Grant permissions to the application user
GRANT ALL PRIVILEGES ON bizdocgen.* TO 'user'@'%';
FLUSH PRIVILEGES;

-- Use the database
USE bizdocgen; 