type EventKind =
  | "pageview"
  | "action"
  | "session_start"
  | "session_end"
  | "scroll"
  | "analysis_start"
  | "analysis_complete"
  | "chat_open"
  | "chat_message"
  | "chat_close";

interface TrackOptions {
  path?: string;
  device?: string;
  referrer?: string;
  durationMs?: number;
  scrollDepth?: number;
  chatLength?: number;
  analysisScore?: number;
  issuesCount?: number;
  stage?: string;
}

export function track(kind: EventKind, eventName: string, options: TrackOptions = {}): void {
  const body = JSON.stringify({
    type: kind === "action" ? eventName : kind,
    path: options.path ?? window.location.pathname,
    device: options.device,
    referrer: options.referrer,
    duration_ms: options.durationMs,
    scroll_depth: options.scrollDepth,
    chat_length: options.chatLength,
    analysis_score: options.analysisScore,
    issues_count: options.issuesCount
  });

  // sendBeacon fires-and-forgets even during page unload/navigation, which
  // matters for pageview-on-route-change in an SPA. Fall back to a
  // keepalive fetch for browsers/environments without sendBeacon
  if (typeof navigator !== "undefined" && "sendBeacon" in navigator) {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon("/api/track", blob);
    return;
  }

  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {
    // Tracking is best-effort — never let a failed beacon affect the visitor
  });
}

export function trackPageview(path?: string): void {
  track("pageview", "pageview", { path });
}

export function trackAction(
  eventName:
    | "contact_submitted"
    | "audit_run"
    | "audit_completed"
    | "audit_teardown_requested"
    | "chat_opened"
    | "chat_message_sent"
    | "cta_click",
  options: TrackOptions = {}
): void {
  track("action", eventName, options);
}