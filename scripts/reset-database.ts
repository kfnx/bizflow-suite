import mysql from 'mysql2/promise';

async function resetDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    console.log('Dropping database if exists...');
    await connection.execute(`DROP DATABASE IF EXISTS ${process.env.DB_NAME}`);

    console.log('Creating fresh database...');
    await connection.execute(`CREATE DATABASE ${process.env.DB_NAME}`);

    console.log('Database reset completed successfully!');
  } catch (error) {
    console.error('Error resetting database:', error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

resetDatabase();
