import { getSecureItem } from '@/utils/storage';

// ============================================================
// SECURITY AUDIT NOTE (Phase 5)
// ============================================================
// GROQ_API_KEY is a HIGH-RISK credential. The EXPO_PUBLIC_ prefix
// embeds it into the JS bundle where it can be extracted via
// reverse engineering (e.g., `strings app.bundle.js | grep gsk_`).
//
// CURRENT MITIGATION: SecureStore takes priority over .env.
// PRODUCTION RECOMMENDATION: Route Groq calls through a
// Supabase Edge Function so the bearer token never ships to clients.
//   Example: POST /functions/v1/groq-proxy
// ============================================================

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

let _cachedApiKey: string | null = null;

export const queryGroq = async (messages: ChatMessage[], model = 'llama-3.3-70b-versatile') => {
  // Use the secure store key if available, otherwise fallback to .env for dev
  if (!_cachedApiKey) {
    _cachedApiKey = await getSecureItem('GROQ_API_KEY');
    if (!_cachedApiKey) {
      _cachedApiKey = process.env.EXPO_PUBLIC_GROQ_API_KEY || '';
    }
  }

  const apiKey = _cachedApiKey;

  if (!apiKey) {
    throw new Error('Groq API Key not found. Please set EXPO_PUBLIC_GROQ_API_KEY in .env or SecureStore.');
  }

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch from Groq');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Groq Query Error: An unexpected error occurred');
    throw error;
  }
};

/**
 * Specialized function for RAG-based hardware recommendation
 */

export const getHardwareRecommendation = async (userContext: string, retrievedContext: string) => {
  const systemPrompt = `You are the SolarX AI Expert. 
  Use these TECHNICAL SPECIFICATIONS: ${retrievedContext}
  
  RESPONSE RULES:
  - Be EXTREMELY concise. Use bullet points.
  - Structure: 1. Recommended Hardware, 2. Why it fits, 3. Estimated Cost (in Philippine Pesos ₱).
  - Use Philippine Pesos (₱) for ALL costs. Assume 1 USD = 56 PHP if needed.
  - Do not use conversational filler (e.g., "I recommend...", "Based on the context...").
  - Use bolding for key specs.`;

  return await queryGroq([
    { role: "system", content: systemPrompt },
    { role: "user", content: `Conditions: ${userContext}` }
  ]);
};
