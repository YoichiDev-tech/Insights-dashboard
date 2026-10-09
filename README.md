# PrismWave Ops Hub

Private analytics dashboard for the PrismWave Studio platform. It reads **only real data**
from the Studio's Supabase project (`interaction_events`, `leads`, `audits`). There are no
mock values, no seed data and no hub-side tracking.

Stack: React 18 + TypeScript (strict) + Vite + Tailwind + Supabase (Auth, Realtime, RLS) + Recharts.

## Requirements

- Node.js 20 or newer
- npm (this repository uses `package-lock.json`; do not use pnpm unless the project is deliberately migrated)

## Local development

1. Install Node.js 20+.
2. Copy `.env.example` to `.env.local`.
   - Windows PowerShell: `Copy-Item .env.example .env.local`
   - macOS/Linux: `cp .env.example .env.local`
3. In `.env.local`, set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` using the public project URL and anon/publishable key from the Studio's Supabase project. Do not use the service-role key.
4. Install and run:

   ```sh
   npm ci
   npm run dev
   ```

   Open http://localhost:4173. Sign in with the operator account configured for the dashboard.

To validate the production bundle and lint rules:

```sh
npm run build
npm run lint
```

**Important:** the app can compile without Supabase environment variables, but it cannot display real analytics or authenticate until both variables are configured. Never commit `.env.local` or put secrets in Vite variables. Only the public anon/publishable key belongs in this client app.

## Deploy (Vercel)

1. In the **PrismWave-Studio** repository, run `supabase/schema.sql` in the same Supabase project used by the Studio. Then run this repository's `supabase/ops-setup.sql` (edit the operator email in it first).
2. In Supabase Authentication, disable public sign-ups and create the operator user (email + password).
3. Create/select the Vercel project for this repository. Framework preset: Vite. Build command: `npm run build`. Output directory: `dist`.
4. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel for Production and Preview. The service-role key must never be set here.
5. Deploy, then sign in at the deployment URL.

## What each number means

- Bots are detected from the user agent and excluded from every metric (System Health shows their share).
- Visitors = distinct hashed IPs. Sessions = distinct `session_id` (one per browser tab session).
- Session duration = last minus first event of a session; only sessions with 2+ events count.
- Bounce = a session with one pageview and no action.
- Source/medium/campaign = the first-touch attribution the Studio stores with each event.
- Deltas compare the selected range with the equally long period before it.
- Not collected by the platform, therefore not shown: scroll depth, geography, revenue.
