import { supabase } from '../../lib/supabaseClient';

export async function POST({ request }: { request: Request }) {
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
