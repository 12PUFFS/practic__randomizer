const httpMocks = require('node-mocks-http');
const ParticipantController = require('../controllers/participantController');
const RandomizerService = require('../services/randomizerService');

jest.mock('../services/randomizerService');

describe('ParticipantController', () => {
  describe('addParticipants', () => {
    it('should return 201 and participants on success', async () => {
      const req = httpMocks.createRequest({
        body: { names: ['Alice', 'Bob'] }
      });
      const res = httpMocks.createResponse();
      
      const mockParticipants = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' }
      ];
      RandomizerService.addParticipants.mockResolvedValue(mockParticipants);

      await ParticipantController.addParticipants(req, res);
      
      expect(res.statusCode).toBe(201);
      expect(res._getJSONData()).toEqual(mockParticipants);
    });

    it('should return 400 on error', async () => {
      const req = httpMocks.createRequest({
        body: { names: [] }
      });
      const res = httpMocks.createResponse();
      
      RandomizerService.addParticipants.mockRejectedValue(new Error('Invalid participants list'));

      await ParticipantController.addParticipants(req, res);
      
      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({ error: 'Invalid participants list' });
    });
  });

  describe('getParticipants', () => {
    it('should return participants on success', async () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      
      const mockParticipants = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' }
      ];
      RandomizerService.getParticipants.mockResolvedValue(mockParticipants);

      await ParticipantController.getParticipants(req, res);
      
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual(mockParticipants);
    });
  });
});