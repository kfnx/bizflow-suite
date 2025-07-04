import fs from 'fs';
import type { Config } from 'drizzle-kit';

console.table({
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  DB_SSL: process.env.DB_SSL,
});

const dbCredentials = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'user',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'bizdocgen',
};

if (process.env.DB_SSL === 'required') {
  (dbCredentials as any).ssl = {
    ca: fs.readFileSync('ca.pem'),
    cert: fs.readFileSync('client-cert.pem'),
    key: fs.readFileSync('client-key.pem'),
    rejectUnauthorized: true,
  };
}

if (process.env.DB_SSL === 'preferred') {
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
