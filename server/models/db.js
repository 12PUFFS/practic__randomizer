const { Pool } = require('pg');
require('dotenv').config();


console.log('Current DB config:', {
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT
});

// Добавьте метод для проверки подключения
const testConnection = async () => {
  try {
    await pool.query('SELECT 1');
    console.log('Database connected');
    return true;
  } catch (err) {
    console.error('Database connection error:', err);
    return false;
  }
};

module.exports = {
  query: (text, params) => pool.query(text, params),
  testConnection
};

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'randomayz_db',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 5432
});

const connect = async () => {
  try {
    const client = await pool.connect();
    console.log('PostgreSQL connected successfully');
    client.release();
    return true;
  } catch (err) {
    console.error('PostgreSQL connection error:', err);
    throw err;
  }
};

module.exports = {
  pool,
  connect
};