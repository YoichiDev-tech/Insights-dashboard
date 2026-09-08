import { createClient } from '@supabase/supabase-js';

export const config = {
  runtime: 'edge'
};

// Server-side Supabase client for this Edge Function.
// Uses the same public URL/anon key the frontend uses (RLS-protected insert).
const supabase = createClient(
  process.env.VITE_SUPABASE_URL as string,
  process.env.VITE_SUPABASE_ANON_KEY as string
);

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
      issues_count
    } = body;

    if (!type || !path) {
      return new Response('Missing fields', { status: 400 });
    }

    const { error } = await supabase.from('events').insert({
      type,
      path,
      device,
      referrer,
      duration_ms,
      scroll_depth,
      chat_length,
      analysis_score,
      issues_count
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
