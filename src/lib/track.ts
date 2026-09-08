import { getUserId, getSessionId } from './identity';
import { getGeo } from './geo';

export async function track(
  type: string,
  path: string,
  options: {
    device?: string;
    referrer?: string;
    durationMs?: number;
    scrollDepth?: number;
    chatLength?: number;
    analysisScore?: number;
    issuesCount?: number;
    stage?: string;
    isLead?: boolean;
    isConversion?: boolean;
  } = {}
) {
  const user_id = getUserId();
  const session_id = getSessionId();
  const geo = await getGeo();

  const payload = {
    type,
    path,
    user_id,
    session_id,
    device: options.device,
    referrer: options.referrer,
    duration_ms: options.durationMs,
    scroll_depth: options.scrollDepth,
    chat_length: options.chatLength,
    analysis_score: options.analysisScore,
    issues_count: options.issuesCount,
    country: geo.country,
    city: geo.city,
    stage: options.stage,
    is_returning: localStorage.getItem('pw_has_visited') ? true : false,
    is_lead: options.isLead || false,
    is_conversion: options.isConversion || false
  };

  localStorage.setItem('pw_has_visited', 'true');

  try {
    await fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.error('Tracking failed:', err);
  }
}
