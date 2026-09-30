import type { LeadRow, LeadStatus } from './database.types';
import { asRecord, asString, asStringArray } from './events';

export const LEAD_STATUSES: LeadStatus[] = ['new', 'contacted', 'booked', 'qualified', 'won', 'lost'];

export function toLeadStatus(value: string): LeadStatus {
  return LEAD_STATUSES.find((status) => status === value) ?? 'new';
}

export function leadFindings(lead: LeadRow): string[] {
  return asStringArray(lead.audit_findings);
}

export function leadAttribution(lead: LeadRow): { source: string; medium: string; campaign: string } {
  const attribution = asRecord(lead.attribution);
  return {
    source: asString(attribution.source) || 'unknown',
    medium: asString(attribution.medium),
    campaign: asString(attribution.campaign),
  };
}
