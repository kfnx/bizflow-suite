-- Initialize database
CREATE DATABASE IF NOT EXISTS bizdocgen_santraktor CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Grant permissions to the application user
GRANT ALL PRIVILEGES ON bizdocgen_santraktor.* TO 'bizdocgen_user'@'%';
FLUSH PRIVILEGES;

-- Use the database
USE bizdocgen_santraktor; 