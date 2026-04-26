import * as SQLite from 'expo-sqlite';

export interface AssessmentRecord {
  id: number;
  date: string;
  location: string;
  avg_usage: number;
  roof_area: number;
  recommendation: string;
}

/**
 * Called by <SQLiteProvider onInit={migrateDbIfNeeded}> in _layout.tsx.
 * Runs ONCE before any screen mounts — guaranteed safe.
 */
export const migrateDbIfNeeded = async (db: SQLite.SQLiteDatabase) => {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS assessments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      location TEXT,
      avg_usage REAL,
      roof_area REAL,
      recommendation TEXT
    );
    CREATE TABLE IF NOT EXISTS panel_configs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      target_tilt REAL,
      target_azimuth REAL,
      date TEXT
    );
    CREATE TABLE IF NOT EXISTS hardware (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      status TEXT NOT NULL,
      health INTEGER NOT NULL,
      specs TEXT,
      price REAL
    );
  `);
};

/**
 * Re-export the hook so screens import from one place.
 * Usage: const db = useSQLiteContext();
 */
export { useSQLiteContext } from 'expo-sqlite';

// ---------------------------------------------------------------------------
// Data access helpers — receive db as a parameter (no openDatabaseAsync here)
// ---------------------------------------------------------------------------

export const saveAssessment = async (
  db: SQLite.SQLiteDatabase,
  assessment: Omit<AssessmentRecord, 'id'>
) => {
  const result = await db.runAsync(
    'INSERT INTO assessments (date, location, avg_usage, roof_area, recommendation) VALUES (?, ?, ?, ?, ?)',
    [
      assessment.date,
      assessment.location,
      assessment.avg_usage,
      assessment.roof_area,
      assessment.recommendation,
    ]
  );
  return result.lastInsertRowId;
};

export const getAssessments = async (
  db: SQLite.SQLiteDatabase
): Promise<AssessmentRecord[]> => {
  return db.getAllAsync<AssessmentRecord>(
    'SELECT * FROM assessments ORDER BY date DESC'
  );
};
