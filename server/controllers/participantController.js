const { pool } = require('../models/db');
const RandomizerService = require('../services/randomizerService');

class ParticipantController {
  static async addParticipants(req, res) {
    try {
      const { names } = req.body;
      const participants = await RandomizerService.addParticipants(names);
      res.status(201).json(participants);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getParticipants(req, res) {
    try {
      const participants = await RandomizerService.getParticipants();
      res.json(participants);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async clearParticipants(req, res) {
    try {
      await pool.query('TRUNCATE participants, winners RESTART IDENTITY CASCADE');
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = ParticipantController;