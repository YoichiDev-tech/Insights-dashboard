import { track } from './track';

export function trackChatOpen(path: string) {
  track('chat_open', path, {
    device: getDevice(),
    stage: 'chat'
  });
}

export function trackChatMessage(path: string, message: string) {
  track('chat_message', path, {
    device: getDevice(),
    chatLength: message.length,
    stage: 'chat'
  });
}

export function trackChatClose(path: string, durationMs: number) {
  track('chat_close', path, {
    device: getDevice(),
    durationMs,
    stage: 'chat'
  });
}

function getDevice(): string {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}
