const { pool } = require('../models/db'); // Добавьте в начало файла
const ParticipantModel = require('../models/participantModel');
const WinnerModel = require('../models/winnerModel');

class RandomizerService {
  static async addParticipants(names) {
  if (!names || !Array.isArray(names) || names.length === 0) {
    throw new Error('Invalid participants list');
  }
  
  // Добавляем новых участников БЕЗ очистки существующих
  const query = `
    INSERT INTO participants (name)
    SELECT unnest($1::text[])
    WHERE NOT EXISTS (
      SELECT 1 FROM participants WHERE name = ANY($1)
    )
    RETURNING *;
  `;
  
  const result = await pool.query(query, [names]);
  return result.rows;
}

  static async getParticipants() {
    return await ParticipantModel.getAll();
  }

  static async clearParticipants() {
    return await ParticipantModel.clearAll();
  }

  static async drawWinners(count = 1) {
    const participants = await ParticipantModel.getAll();
    if (participants.length === 0) {
      throw new Error('No participants available');
    }
    if (count > participants.length) {
      throw new Error('Not enough participants');
    }

    // алгоритм перетасовки фишера 
    const shuffled = [...participants];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const winners = shuffled.slice(0, count);
    const savedWinners = [];
    
    for (const winner of winners) {
      const saved = await WinnerModel.addWinner(winner.id);
      savedWinners.push({
        ...winner,
        draw_date: saved.draw_date
      });
    }

    return savedWinners;
  }

  static async getWinnersHistory() {
    return await WinnerModel.getWinners();
  }
}

module.exports = RandomizerService;