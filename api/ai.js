export const config = { runtime: 'edge' };

const MODEL = 'google/gemini-2.5-flash';
const MAX_BODY_BYTES = 120000;
const MAX_MESSAGES = 40;
const MAX_MESSAGE_CHARS = 24000;
const MAX_TOKENS = 2000;
const MAX_TOTAL_MESSAGE_CHARS = 60000;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    }
  });
}

export default async function handler(req) {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204 });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return json({ error: 'AI service is not configured.' }, 503);

  try {
    const contentLength = Number(req.headers.get('content-length') || 0);
    if (contentLength > MAX_BODY_BYTES) return json({ error: 'Request is too large.' }, 413);

    const body = await req.json();
    const messages = Array.isArray(body?.messages) ? body.messages : null;
    if (!messages || messages.length === 0 || messages.length > MAX_MESSAGES) {
      return json({ error: 'A valid messages array is required.' }, 400);
    }

    let totalMessageChars = 0;
    for (const message of messages) {
      if (!message || typeof message !== 'object' || !['system', 'user', 'assistant'].includes(message.role)) {
        return json({ error: 'Invalid message format.' }, 400);
      }
      if (typeof message.content !== 'string' || message.content.length > MAX_MESSAGE_CHARS) {
        return json({ error: 'Message content is missing or too large.' }, 400);
      }
      totalMessageChars += message.content.length;
      if (totalMessageChars > MAX_TOTAL_MESSAGE_CHARS) {
        return json({ error: 'Combined message content is too large.' }, 413);
      }
    }

    const temperature = Number(body.temperature);
    const safeTemperature = Number.isFinite(temperature) ? Math.min(1.5, Math.max(0, temperature)) : 0.7;
    const requestedTokens = Number(body.max_tokens);
    const safeMaxTokens = Number.isFinite(requestedTokens) ? Math.min(MAX_TOKENS, Math.max(1, Math.floor(requestedTokens))) : 1000;
    const requestBody = JSON.stringify({ model: MODEL, messages, temperature: safeTemperature, max_tokens: safeMaxTokens });

    if (new TextEncoder().encode(requestBody).byteLength > MAX_BODY_BYTES) {
      return json({ error: 'Request is too large.' }, 413);
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 45000);
    let response;
    try {
      response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://utilitydesk.in',
          'X-Title': 'UtilityDesk'
        },
        body: requestBody,
        signal: controller.signal
      });
    } catch (err) {
      if (err?.name === 'AbortError') return json({ error: 'AI provider timed out. Please try again.' }, 504);
      return json({ error: 'Unable to reach the AI provider.' }, 502);
    } finally {
      clearTimeout(timer);
    }

    const text = await response.text();
    let data;
    try { data = JSON.parse(text); }
    catch { data = { error: 'AI provider returned an invalid response.' }; }

    if (!response.ok) {
      return json({ error: data?.error?.message || data?.error || 'AI provider request failed.' }, response.status >= 400 && response.status < 600 ? response.status : 502);
    }
    return json(data, 200);
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : 'Unexpected AI service error.' }, 500);
  }
}
