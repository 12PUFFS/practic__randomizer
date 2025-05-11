const express = require('express');
const router = express.Router();
const ParticipantController = require('../controllers/participantController');

router.post('/', ParticipantController.addParticipants);
router.get('/', ParticipantController.getParticipants);
router.delete('/', ParticipantController.clearParticipants);

module.exports = router;