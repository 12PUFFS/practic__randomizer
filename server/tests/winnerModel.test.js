const { pool } = require('../../server/models/db');
const WinnerModel = require('../../server/models/winnerModel');

jest.mock('../../server/models/db', () => ({
  pool: {
    query: jest.fn(),
  },
}));

describe('WinnerModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addWinner', () => {
    it('should insert a winner and return the result', async () => {
      const mockWinner = { id: 1, participant_id: 5, draw_date: new Date() };
      pool.query.mockResolvedValueOnce({ rows: [mockWinner] });

      const result = await WinnerModel.addWinner(5);
      
      // Получаем аргументы, с которыми был вызван pool.query
      const [sqlQuery, params] = pool.query.mock.calls[0];
      
      // Удаляем лишние пробелы и переносы строк для сравнения
      const normalizedSqlQuery = sqlQuery.replace(/\s+/g, ' ').trim();
      const expectedSqlQuery = 'INSERT INTO winners (participant_id) VALUES ($1) RETURNING *;';
      
      expect(normalizedSqlQuery).toBe(expectedSqlQuery);
      expect(params).toEqual([5]);
      expect(result).toEqual(mockWinner);
    });
  });
});