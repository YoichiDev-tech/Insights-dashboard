# PrismWave Ops — Roadmap & Setup

## What this is

A private, unlinked dashboard + AI agent system for running PrismWave Studio.
It lives in its own Vercel project and remains unlinked from the public site,
but it reads the Studio's shared Supabase event and lead tables. Authentication
and the operator allowlist still gate every dashboard view.

## Roadmap

### Phase A — Tracking foundation (BrightWave Studio repo) ✅ built
- `interaction_events` table + RLS
- `api/track.ts` — server-side write endpoint
- `src/lib/track.ts` + `usePageTracking` — client-side firing
- Wired into pageviews, contact form submits, audit runs, Crisp chat open/message

### Phase B — Ops dashboard (this repo) ✅ built
- Supabase Auth (magic link), gated by an `allowed_operators` allowlist
  checked server-side on every API call
- `api/reports.ts` — morning / evening / night / daily windows
- Dashboard UI showing all four report cards

### Phase C — Agent approval queue ✅ built (drafting + approval, not yet auto-sending)
- `agent_actions` table — every proposed action sits here as `pending`
  until you approve, edit-then-approve, or reject it
- `api/agent-propose.ts` — internal endpoint a trusted backend job calls to
  draft an action via Claude and queue it
- `api/agent-actions.ts` + Dashboard UI — your approval queue

### Phase D — Not yet built (next steps, in order)
1. **The actual outreach trigger job.** Right now `agent-propose.ts` can
   draft and queue an action, but nothing calls it yet, and nothing sends
   an approved action anywhere. You need:
   - A Vercel Cron job (or a script you run) that scans for new leads
     (from `interaction_events` — e.g. someone who ran an audit but never
     submitted the contact form) and calls `/api/agent-propose` with a
     drafted follow-up.
   - A second job/endpoint that watches for `status = 'approved'` rows in
     `agent_actions` and actually sends them (via Resend for email; a new
     integration for anything else) — then marks them `sent`.
2. **Which outreach channels beyond email.** Instagram DMs, ad platform
   changes, etc. each need their own OAuth setup and, per the compliance
   note in memory, official Graph/Ads APIs only — no automation that
   violates platform ToS.
3. **Alerting.** Right now you only see the queue when you open the
   dashboard. Consider a daily email/Slack ping when items are pending.
4. **`yoichi-digital` consolidation** — once this dashboard is stable, decide
   whether that becomes a copy/UX pass into BrightWave Studio itself, or a
   feature inside this ops dashboard. Recommend deciding after Phase D.1
   ships, so you're choosing with real usage data in hand.

## Deploy steps

1. Use the same Supabase project as PrismWave Studio, separate from anything
   ServeSync uses.
2. Run `../PrismWave Studio/supabase/schema.sql` in the SQL editor.
3. Insert yourself: `insert into allowed_operators (email) values ('you@yourdomain.com');`
4. **Push this folder as its own GitHub repo**, import it into a **new**
   Vercel project (not the BrightWave Studio one).
5. In that Vercel project's env vars, set everything from `.env.example`.
   `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` come from Supabase's API
   settings page — copy the `service_role` key, not `anon`.
6. Deploy. Visit the Vercel-assigned URL (don't set up a friendly custom
   domain that's discoverable/guessable — a random-looking subdomain adds a
   small extra layer, on top of the auth that actually protects the data).
7. Sign in with your allow-listed email via the magic link.

## Why a separate Vercel project instead of a hidden route

Client-side JS bundles ship to every visitor's browser, including code for
routes nobody's supposed to visit. A `/admin` route "hidden" inside
PrismWave Studio is still sitting in the bundle anyone can open in
DevTools. A genuinely separate project means the dashboard's code — and
its secrets — never leave Vercel's servers for BrightWave Studio's
visitors, because it isn't part of that build at all.
