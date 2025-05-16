const RandomizerService = require('../services/randomizerService');

class WinnerController {
  static async drawWinners(req, res) {
    try {
      const { count } = req.body;
      const winners = await RandomizerService.drawWinners(count || 1);
      res.json(winners);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getWinnersHistory(req, res) {
  try {
    const winners = await RandomizerService.getWinnersHistory();
    res.json(winners);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
}

module.exports = WinnerController;