// Mirrors the PrismWave Studio Supabase schema (studio/supabase/schema.sql).
// The Ops Hub only reads interaction_events and audits, and updates leads.status.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type LeadStatus = 'new' | 'contacted' | 'booked' | 'qualified' | 'won' | 'lost';

export type InteractionEventRow = {
  id: string;
  kind: string;
  event_name: string;
  path: string | null;
  intent: string | null;
  session_id: string;
  metadata: Json;
  ip_hash: string | null;
  user_agent: string | null;
  created_at: string;
}

export type LeadRow = {
  id: string;
  intent: string;
  name: string;
  email: string;
  business: string | null;
  site_url: string | null;
  idea: string | null;
  message: string;
  session_id: string | null;
  audit_score: number | null;
  audit_findings: Json;
  scope_estimate: string | null;
  attribution: Json;
  status: string;
  created_at: string;
  updated_at: string;
}

export type AuditRow = {
  id: string;
  url: string;
  final_url: string;
  overall_score: number;
  categories: Json;
  signals: Json;
  session_id: string | null;
  created_at: string;
}

export type Database = {
  public: {
    Tables: {
      interaction_events: {
        Row: InteractionEventRow;
        Insert: Partial<InteractionEventRow>;
        Update: Partial<InteractionEventRow>;
        Relationships: [];
      };
      leads: {
        Row: LeadRow;
        Insert: Partial<LeadRow>;
        Update: Partial<LeadRow>;
        Relationships: [];
      };
      audits: {
        Row: AuditRow;
        Insert: Partial<AuditRow>;
        Update: Partial<AuditRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
