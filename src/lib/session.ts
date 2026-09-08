import { track } from './track';

let sessionStart = Date.now();

export function startSession(path: string) {
  sessionStart = Date.now();

  track('session_start', path, {
    device: getDevice(),
    referrer: document.referrer || 'direct',
    stage: 'landing'
  });
}

export function endSession(path: string) {
  const durationMs = Date.now() - sessionStart;

  track('session_end', path, {
    device: getDevice(),
    durationMs,
    stage: 'exit'
  });
}

export function recordScroll(path: string, scrollDepth: number) {
  track('scroll', path, {
    device: getDevice(),
    scrollDepth,
    stage: 'scroll'
  });
}

function getDevice(): string {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}
