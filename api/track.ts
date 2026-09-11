import { supabaseAdmin } from './_lib/supabaseAdmin';

export const config = {
  runtime: 'edge'
};

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const body = await request.json();

    const {
      type,
      path,
      device,
      referrer,
      duration_ms,
      scroll_depth,
      chat_length,
      analysis_score,
      issues_count,
      session_id
    } = body;

    if (!type || !path) {
      return new Response('Missing fields', { status: 400 });
    }

    const { error } = await supabaseAdmin.from('interaction_events').insert({
      kind: type === 'pageview' ? 'pageview' : 'action',
      event_name: type,
      path,
      session_id: session_id ?? `ops-${crypto.randomUUID()}`,
      metadata: {
        source: 'ops',
        device,
        referrer,
        duration_ms,
        scroll_depth,
        chat_length,
        analysis_score,
        issues_count
      }
    });

    if (error) {
      console.error(error);
      return new Response('Error inserting event', { status: 500 });
    }

    return new Response('OK', { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response('Server error', { status: 500 });
  }
}
