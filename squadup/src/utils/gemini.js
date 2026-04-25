// Gemini API wrapper for all AI agent calls
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

export async function callGemini(systemPrompt, userMessage, jsonMode = true) {
  if (!GEMINI_API_KEY) {
    console.warn('No Gemini API key set — using fallback responses');
    return null;
  }

  try {
    const body = {
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: [{ parts: [{ text: userMessage }] }],
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 400,
      },
    };
    if (jsonMode) {
      body.generationConfig.responseMimeType = 'application/json';
    }

    const res = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      console.error('Gemini API error:', res.status);
      return null;
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return null;

    if (jsonMode) {
      try {
        return JSON.parse(text);
      } catch {
        // Try to extract JSON from markdown code blocks
        const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch) return JSON.parse(jsonMatch[1].trim());
        return null;
      }
    }
    return text;
  } catch (err) {
    console.error('Gemini call failed:', err);
    return null;
  }
}
