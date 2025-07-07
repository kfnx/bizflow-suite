import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

import * as schema from './schema';

// Database connection configuration
const connectionConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'rootpassword',
  database: process.env.DB_NAME || 'bizdocgen',
};

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

export function getDB() {
  return db;
}

// Export schema for migrations
export * from './schema';
