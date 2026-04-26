import { supabase } from '../lib/supabase';

export interface HardwareComponent {
  id: string;
  name: string;
  category: 'panel' | 'inverter' | 'battery';
  manufacturer: string;
  technical_specs: any;
  description: string;
}

/**
 * Searches hardware components using vector similarity
 */
export const searchHardwareByEmbedding = async (embedding: number[], matchThreshold = 0.5, matchCount = 5) => {
  const { data, error } = await supabase.rpc('match_hardware', {
    query_embedding: embedding,
    match_threshold: matchThreshold,
    match_count: matchCount,
  });

  if (error) {
    console.error('Vector Search Error:', error);
    return [];
  }

  return data as HardwareComponent[];
};

/**
 * Basic text search fallback
 */
export const searchHardwareByText = async (query: string) => {
  const { data, error } = await supabase
    .from('hardware_components')
    .select('*')
    .ilike('name', `%${query}%`);

  if (error) {
    console.error('Text Search Error:', error);
    return [];
  }

  return data as HardwareComponent[];
};
