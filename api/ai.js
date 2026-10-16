export const config = { runtime: 'edge' };

const MODEL = 'google/gemini-2.5-flash';
const MAX_BODY_BYTES = 120000;
const MAX_MESSAGES = 40;
const MAX_MESSAGE_CHARS = 24000;
const MAX_TOKENS = 2000;
const MAX_TOTAL_MESSAGE_CHARS = 60000;
const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 10;
const RATE_BUCKET_TTL_MS = 10 * 60_000;
const rateBuckets = new Map();

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...extraHeaders
    }
  });
}

function clientKey(req) {
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp.trim().slice(0, 128);

  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim().slice(0, 128);

  return 'anonymous';
}

function checkRateLimit(key) {
  const now = Date.now();
  const bucket = rateBuckets.get(key);
  if (!bucket || now - bucket.startedAt >= RATE_WINDOW_MS) {
    rateBuckets.set(key, { startedAt: now, count: 1 });
    return { allowed: true, retryAfter: 0 };
  }
  if (bucket.count >= RATE_LIMIT) {
    return {
      allowed: false,
      retryAfter: Math.max(1, Math.ceil((RATE_WINDOW_MS - (now - bucket.startedAt)) / 1000))
    };
  }
  bucket.count += 1;
  return { allowed: true, retryAfter: 0 };
}

function pruneRateBuckets() {
  const cutoff = Date.now() - RATE_BUCKET_TTL_MS;
  for (const [key, bucket] of rateBuckets) {
    if (bucket.startedAt < cutoff) rateBuckets.delete(key);
  }
}

export default async function handler(req) {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204 });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405, { Allow: 'POST' });

  pruneRateBuckets();
  const limit = checkRateLimit(clientKey(req));
  if (!limit.allowed) {
    return json({ error: 'Too many AI requests. Please try again shortly.' }, 429, {
      'Retry-After': String(limit.retryAfter)
    });
  }

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

    if (!response.ok) {
      return json({ error: 'AI provider request failed. Please try again.' }, response.status >= 400 && response.status < 600 ? response.status : 502);
    }

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return json({ error: 'AI provider returned an invalid response.' }, 502);
    }

    return json(data, 200);
  } catch (err) {
    console.error('AI endpoint error:', err);
    return json({ error: 'Unexpected AI service error.' }, 500);
  }
}
