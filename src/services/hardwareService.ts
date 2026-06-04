import { supabase } from '../lib/supabase';
import * as SQLite from 'expo-sqlite';
import * as Crypto from 'expo-crypto';

export interface HardwareItem {
  id: string;
  name: string;
  type: 'Panel' | 'Inverter' | 'Battery';
  status: 'optimal' | 'warning' | 'critical';
  health: number;
  specs?: string;
  price?: number;
}

export const getHardwareInventory = async (
  db: SQLite.SQLiteDatabase
): Promise<HardwareItem[]> => {
  try {
    const localData = await db.getAllAsync<HardwareItem>('SELECT * FROM hardware ORDER BY name');

    // Try to sync from Supabase if table exists (silently fail if not)
    try {
      const { data, error } = await supabase.from('hardware').select('*');
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (e) {
      // Supabase table missing or network error
    }

    return localData || [];
  } catch (error) {
    console.error('Error fetching hardware:', error);
    return [];
  }
};

export const registerHardware = async (
  db: SQLite.SQLiteDatabase,
  item: Omit<HardwareItem, 'id'>
) => {
  // Use Crypto.randomUUID() for secure, collision-resistant identifier generation
  const id = Crypto.randomUUID();
  const newItem = { ...item, id };

  try {
    await db.runAsync(
      'INSERT INTO hardware (id, name, type, status, health, specs, price) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, newItem.name, newItem.type, newItem.status, newItem.health, newItem.specs || '', newItem.price || 0]
    );

    // Try to sync to Supabase
    try {
      await supabase.from('hardware').insert([newItem]);
    } catch (e) {
      // Ignore Supabase errors (offline mode)
    }

    return newItem;
  } catch (error) {
    console.error('Error registering hardware:', error);
    throw error;
  }
};

export const deleteHardware = async (db: SQLite.SQLiteDatabase, id: string) => {
  try {
    await db.runAsync('DELETE FROM hardware WHERE id = ?', [id]);

    // Try to sync to Supabase
    try {
      await supabase.from('hardware').delete().eq('id', id);
    } catch (e) {
      // Ignore Supabase errors
    }
  } catch (error) {
    console.error('Error deleting hardware:', error);
    throw error;
  }
};
