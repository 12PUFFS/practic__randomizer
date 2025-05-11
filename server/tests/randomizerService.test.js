const RandomizerService = require('../services/randomizerService');
const ParticipantModel = require('../models/participantModel');
const WinnerModel = require('../models/winnerModel');

jest.mock('../models/participantModel');
jest.mock('../models/winnerModel');

describe('RandomizerService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('drawWinners', () => {
    it('should draw winners successfully', async () => {
      const participants = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' }
      ];
      ParticipantModel.getAll.mockResolvedValue(participants);
      WinnerModel.addWinner.mockImplementation(id => 
        Promise.resolve({ id: 1, participant_id: id, draw_date: new Date() })
      );

      const result = await RandomizerService.drawWinners(2);
      expect(result.length).toBe(2);
      expect(ParticipantModel.getAll).toHaveBeenCalled();
      expect(WinnerModel.addWinner).toHaveBeenCalledTimes(2);
    });

    it('should throw error when no participants', async () => {
      ParticipantModel.getAll.mockResolvedValue([]);
      await expect(RandomizerService.drawWinners(1)).rejects.toThrow('No participants available');
    });

    it('should throw error when not enough participants', async () => {
      ParticipantModel.getAll.mockResolvedValue([{ id: 1, name: 'Alice' }]);
      await expect(RandomizerService.drawWinners(2)).rejects.toThrow('Not enough participants');
    });
  });

  describe('getWinnersHistory', () => {
    it('should return winners history', async () => {
      const winners = [
        { id: 1, name: 'Alice', draw_date: new Date() },
        { id: 2, name: 'Bob', draw_date: new Date() }
      ];
      WinnerModel.getWinners.mockResolvedValue(winners);

      const result = await RandomizerService.getWinnersHistory();
      expect(result).toEqual(winners);
      expect(WinnerModel.getWinners).toHaveBeenCalled();
    });
  });
});