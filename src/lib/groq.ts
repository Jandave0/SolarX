import { getSecureItem } from '@/utils/storage';

// ============================================================
// SECURITY AUDIT NOTE (Phase 5)
// ============================================================
// GROQ_API_KEY is a HIGH-RISK credential. To prevent it from being
// embedded into the JS bundle, the EXPO_PUBLIC_ fallback has been
// removed.
//
// CURRENT MITIGATION: Only SecureStore is supported for client-side keys.
// PRODUCTION RECOMMENDATION: Route Groq calls through a
// Supabase Edge Function so the bearer token never ships to clients.
//   Example: POST /functions/v1/groq-proxy
// ============================================================

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export const queryGroq = async (messages: ChatMessage[], model = 'llama-3.3-70b-versatile') => {
  // Use the secure store key if available. Fallback to .env is removed for security.
  const apiKey = await getSecureItem('GROQ_API_KEY');

  if (!apiKey) {
    throw new Error('Groq API Key not found. Please set it in Settings (SecureStore).');
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
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to fetch from Groq');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Groq Query Error:', error);
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
