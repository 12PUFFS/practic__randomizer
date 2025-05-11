const { pool } = require('../models/db');

class ParticipantModel {
  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS participants (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(query);
  }

  static async addParticipants(names) {
  const query = `
    INSERT INTO participants (name)
    SELECT unnest($1::text[])
    ON CONFLICT (name) DO NOTHING
    RETURNING *;
  `;
  const result = await pool.query(query, [names]);
  return result.rows;
}

  static async getAll() {
    const result = await pool.query('SELECT * FROM participants ORDER BY created_at DESC');
    return result.rows;
  }

  static async clearAll() {
    await pool.query('TRUNCATE participants RESTART IDENTITY');
  }
}

module.exports = ParticipantModel;