import { track } from './track';

export function trackAnalysisStart(path: string, url: string) {
  track('analysis_start', path, {
    device: getDevice(),
    referrer: url,
    stage: 'analysis'
  });
}

export function trackAnalysisComplete(
  path: string,
  score: number,
  issuesCount: number
) {
  track('analysis_complete', path, {
    device: getDevice(),
    analysisScore: score,
    issuesCount,
    stage: 'analysis'
  });
}

function getDevice(): string {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}
