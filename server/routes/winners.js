const express = require('express');
const router = express.Router();
const WinnerController = require('../controllers/winnerController');

router.post('/draw', WinnerController.drawWinners);
router.get('/history', WinnerController.getWinnersHistory);

module.exports = router;