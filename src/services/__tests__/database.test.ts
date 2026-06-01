import { getAssessments, saveAssessment, AssessmentRecord } from '../database';
import * as SQLite from 'expo-sqlite';

// Mock expo-sqlite
jest.mock('expo-sqlite', () => ({
  useSQLiteContext: jest.fn(),
}));

describe('database service', () => {
  let mockDb: {
    getAllAsync: jest.Mock;
    runAsync: jest.Mock;
    execAsync: jest.Mock;
  };

  beforeEach(() => {
    mockDb = {
      getAllAsync: jest.fn(),
      runAsync: jest.fn(),
      execAsync: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('getAssessments', () => {
    it('should call getAllAsync with the correct SQL query', async () => {
      const mockAssessments: AssessmentRecord[] = [
        {
          id: 1,
          date: '2023-10-01',
          location: 'Test Location',
          avg_usage: 100,
          roof_area: 50,
          recommendation: 'Test Recommendation',
        },
      ];
      mockDb.getAllAsync.mockResolvedValue(mockAssessments);

      const result = await getAssessments(mockDb as any);

      expect(mockDb.getAllAsync).toHaveBeenCalledWith(
        'SELECT * FROM assessments ORDER BY date DESC'
      );
      expect(result).toEqual(mockAssessments);
    });

    it('should handle empty results', async () => {
      mockDb.getAllAsync.mockResolvedValue([]);

      const result = await getAssessments(mockDb as any);

      expect(result).toEqual([]);
    });
  });

  describe('saveAssessment', () => {
    it('should call runAsync with the correct SQL and parameters', async () => {
      const assessment: Omit<AssessmentRecord, 'id'> = {
        date: '2023-10-01',
        location: 'Test Location',
        avg_usage: 100,
        roof_area: 50,
        recommendation: 'Test Recommendation',
      };
      mockDb.runAsync.mockResolvedValue({ lastInsertRowId: 123 });

      const result = await saveAssessment(mockDb as any, assessment);

      expect(mockDb.runAsync).toHaveBeenCalledWith(
        'INSERT INTO assessments (date, location, avg_usage, roof_area, recommendation) VALUES (?, ?, ?, ?, ?)',
        [
          assessment.date,
          assessment.location,
          assessment.avg_usage,
          assessment.roof_area,
          assessment.recommendation,
        ]
      );
      expect(result).toBe(123);
    });
  });
});
