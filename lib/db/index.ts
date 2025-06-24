import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

import * as schema from './schema';

// Database connection configuration
const connectionConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'bizdocgen',
};

// Create connection function
async function createConnection() {
  return await mysql.createConnection(connectionConfig);
}

// Create Drizzle instance
let db: ReturnType<typeof drizzle>;

// Initialize database connection
export async function initDB() {
  if (!db) {
    const connection = await createConnection();
    db = drizzle(connection, { schema, mode: 'default' });
  }
  return db;
}

// Get database instance
export async function getDB() {
  if (!db) {
    return await initDB();
  }
  return db;
}

// Export schema for migrations
export * from './schema';
