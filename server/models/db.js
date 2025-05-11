const { Pool } = require('pg');
require('dotenv').config();

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