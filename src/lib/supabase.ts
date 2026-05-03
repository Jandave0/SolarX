import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { getSecureItem } from '../utils/storage';

// ============================================================
// SECURITY AUDIT NOTE (Phase 5)
// ============================================================
// EXPO_PUBLIC_* keys are baked into the JS bundle at build time.
// They are visible to anyone who reverse-engineers the app bundle.
// 
// RISK LEVEL:
//   - SUPABASE_URL          → LOW  (URL is not sensitive)
//   - SUPABASE_ANON_KEY     → LOW  (Protected by Supabase RLS policies)
//   - GROQ_API_KEY          → HIGH (Direct bearer token - see groq.ts)
//
// MITIGATION:
//   1. The Settings screen lets users replace .env keys with SecureStore keys.
//   2. For production: proxy GROQ requests through a Supabase Edge Function
//      so the GROQ key never ships in the client bundle.
// ============================================================

let _client: SupabaseClient | null = null;

/**
 * Returns a Supabase client, preferring SecureStore keys over .env
 * for enhanced security on device.
 */
export const getSupabaseClient = async (): Promise<SupabaseClient> => {
  if (_client) return _client;

  const [secureUrl, secureKey] = await Promise.all([
    getSecureItem('SUPABASE_URL'),
    getSecureItem('SUPABASE_ANON_KEY'),
  ]);

  const url = secureUrl || process.env.EXPO_PUBLIC_SUPABASE_URL!;
  const key = secureKey || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

  _client = createClient(url, key, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });

  return _client;
};

// Synchronous client for backward compatibility (uses .env at init time)
// Components that need the SecureStore version should call getSupabaseClient()
export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

/**
 * Re-creates the Supabase client with the latest SecureStore credentials.
 * Call this after updating keys in the Settings screen.
 */
export const refreshSupabaseClient = async (): Promise<SupabaseClient> => {
  _client = null; // invalidate cache
  return getSupabaseClient();
};
