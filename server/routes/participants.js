const express = require('express');
const router = express.Router();
const ParticipantController = require('../controllers/participantController');

// Все роуты должны использовать статические методы класса
router.post('/', ParticipantController.addParticipants);
router.get('/', ParticipantController.getParticipants);
router.delete('/', ParticipantController.clearParticipants);

module.exports = router;