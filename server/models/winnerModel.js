const { pool } = require('../models/db');

class WinnerModel {
  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS winners (
        id SERIAL PRIMARY KEY,
        participant_id INTEGER REFERENCES participants(id),
        draw_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(query);
  }

  static async addWinner(participantId) {
    const query = `
      INSERT INTO winners (participant_id)
      VALUES ($1)
      RETURNING *;
    `;
    const result = await pool.query(query, [participantId]);
    return result.rows[0];
  }

  static async getWinners() {
    const query = `
      SELECT w.id, p.name, w.draw_date
      FROM winners w
      JOIN participants p ON w.participant_id = p.id
      ORDER BY w.draw_date DESC;
    `;
    const result = await pool.query(query);
    return result.rows;
  }
}

module.exports = WinnerModel;