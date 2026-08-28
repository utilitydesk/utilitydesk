export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: { message: 'Method not allowed' } }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await req.json();
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: { message: 'AI service is not configured. Add OPENROUTER_API_KEY to the deployment environment.' } }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const messages = Array.isArray(body.messages) ? [...body.messages] : [];
    if (body.system && !messages.some((m) => m?.role === 'system')) {
      messages.unshift({ role: 'system', content: body.system });
    }

    if (!messages.length) {
      return new Response(JSON.stringify({ error: { message: 'No AI messages were supplied.' } }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://utilitydesk.in',
        'X-Title': 'UtilityDesk'
      },
      body: JSON.stringify({
        model: body.model || 'google/gemini-2.5-flash',
        messages,
        temperature: body.temperature ?? 0.7,
        max_tokens: body.max_tokens ?? 1200
      })
    });

    const data = await response.json();

    if (!response.ok) {
      const message = data?.error?.message || `AI provider returned HTTP ${response.status}`;
      return new Response(JSON.stringify({ error: { message } }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const text = data?.choices?.[0]?.message?.content || '';

    return new Response(JSON.stringify({
      ...data,
      content: text ? [{ type: 'text', text }] : []
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({
      error: { message: err?.message || 'Unexpected AI service error' }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
