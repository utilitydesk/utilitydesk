export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const body = await req.json();

    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://utilitydesk.in',
          'X-Title': 'UtilityDesk'
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: body.messages,
          temperature: body.temperature ?? 0.7,
          max_tokens: body.max_tokens ?? 1000
        })
      }
    );

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (err) {
    return new Response(
      JSON.stringify({
        error: err.message
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}