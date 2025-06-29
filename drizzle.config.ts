import fs from 'fs';
import type { Config } from 'drizzle-kit';

console.log('DB_HOST', process.env.DB_HOST);
console.log('DB_PORT', process.env.DB_PORT);
console.log('DB_USER', process.env.DB_USER);
console.log('DB_PASSWORD', process.env.DB_PASSWORD);
console.log('DB_NAME', process.env.DB_NAME);
console.log('DB_SSL', process.env.DB_SSL);

const dbCredentials = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'user',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'bizdocgen',
};

if (process.env.DB_SSL === 'secure') {
  (dbCredentials as any).ssl = {
    ca: fs.readFileSync('ca.pem'),
    cert: fs.readFileSync('client-cert.pem'),
    key: fs.readFileSync('client-key.pem'),
    rejectUnauthorized: true,
  };
}

if (process.env.DB_SSL === 'insecure') {
  (dbCredentials as any).ssl = {
    rejectUnauthorized: false,
  };
}

export default {
  schema: './lib/db/schema.ts',
  out: './lib/db/migrations',
  dialect: 'mysql',
  dbCredentials: dbCredentials,
  verbose: true,
  strict: true,
} satisfies Config;
