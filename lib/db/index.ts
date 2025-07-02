import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

import * as schema from './schema';

console.log('DB_HOST', process.env.DB_HOST);
console.log('DB_PORT', process.env.DB_PORT);
console.log('DB_USER', process.env.DB_USER);
console.log('DB_PASSWORD', process.env.DB_PASSWORD);
console.log('DB_NAME', process.env.DB_NAME);
console.log('DB_SSL', process.env.DB_SSL);

// Database connection configuration
const connectionConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'rootpassword',
  database: process.env.DB_NAME || 'bizdocgen',
};

console.log(connectionConfig);

// Create connection pool for better performance
const pool = mysql.createPool({
  ...connectionConfig,
  connectionLimit: 10,
  queueLimit: 0,
});

// Create and export Drizzle instance
export const db = drizzle(pool, { schema, mode: 'default' });

// Create connection function for scripts that need direct connection
export async function createConnection() {
  return await mysql.createConnection(connectionConfig);
}

// Legacy functions for backward compatibility
export async function initDB() {
  return db;
}

export async function getDB() {
  return db;
}

// Export schema for migrations
export * from './schema';
