# PrismWave Ops Hub

Private analytics dashboard for the PrismWave Studio platform. It reads **only real data**
from the Studio's Supabase project (`interaction_events`, `leads`, `audits`). There are no
mock values, no seed data and no hub-side tracking.

Stack: React 18 + TypeScript (strict) + Vite + Tailwind + Supabase (Auth, Realtime, RLS) + Recharts.

## Deploy (Vercel)

1. Supabase SQL editor, same project as the Studio: run `studio/supabase/schema.sql`, then `supabase/ops-setup.sql`
   (edit the operator email in it first).
2. Supabase, Authentication: disable public sign-ups, create your operator user (email + password).
3. New Vercel project from this repo. Framework preset: Vite (auto). Build: `npm run build`. Output: `dist`.
4. Environment variables (Production + Preview): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
   Anon key only. The service-role key must never be set here.
5. Deploy, then sign in at the deployment URL.

## Local

    cp .env.example .env.local   # fill in the two values
    npm ci
    npm run dev                  # http://localhost:4173
    npm run build                # tsc -b && vite build (same as Vercel)
    npm run lint

## What each number means

- Bots are detected from the user agent and excluded from every metric (System Health shows their share).
- Visitors = distinct hashed IPs. Sessions = distinct `session_id` (one per browser tab session).
- Session duration = last minus first event of a session; only sessions with 2+ events count.
- Bounce = a session with one pageview and no action.
- Source/medium/campaign = the first-touch attribution the Studio stores with each event.
- Deltas compare the selected range with the equally long period before it.
- Not collected by the platform, therefore not shown: scroll depth, geography, revenue.
