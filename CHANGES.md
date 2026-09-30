# What changed and why

## Root causes found in the previous hub
1. Read a table (`events`) and columns (`device`, `duration_ms`, `scroll_depth`, `country`, ...) that do not exist in the Studio schema. The Studio writes `interaction_events` with `metadata` JSON.
2. No login at all, while RLS only lets authenticated users read, so every query came back empty.
3. The hub tracked its own visits into the Studio's `interaction_events`, polluting real traffic.
4. `tsc` was not part of the build and failed anyway (missing `../types/audit`, missing `@types/node`); `any` in queries, charts and pages; strict mode off.
5. `api/` serverless functions imported the service role at module load (crash if env missing) and duplicated the Studio's tracker.
6. Dead/mock code: AWS/Azure IncidentsTable, unrouted Segments/Journeys/Retention/Geo/LiveVisitors pages, `@tremor/react` (unused).

## Hub changes
- Removed: `api/`, `src/routes/api/`, hub-side tracking (`track.ts`, `session.ts`, `chatTrack.ts`, `analysisTrack.ts`, `identity.ts`, `geo.ts`, `queries.ts` RPC calls), `auditScoring.ts`, IncidentsTable, KpiCard, LineChart, 5 unrouted pages, `@tremor/react`, `.code-workspace` file.
- Added: Supabase email+password login, route guard, sign out; typed `Database`; paginated event loader (past the 1000-row cap); Realtime subscription; time-range picker; period-over-period deltas; bot filtering; safe CSV export.
- Rewritten on real data: Overview, Traffic, Engagement, Sources, Pages, Interactions, Funnels, Leads, Reports, Live Feed, System Health (audit stats come from the `audits` table).
- Config: TypeScript strict, `build` = `tsc -b && vite build`, ESM config files, `no-explicit-any` as an error, `.env.example`, Vercel headers (noindex, frame deny), `supabase/ops-setup.sql`.

## Platform (PrismWave-Studio) change
- `api/track.ts`: the client sends `audit_report_viewed` and `audit_report_link_copied`, but the server allow-list rejected them silently. Two lines added (see `studio-track-allowlist.patch`).

## Security note
Studio's `schema.sql` lets any authenticated user of the Supabase project read leads. `supabase/ops-setup.sql` restricts this to an `allowed_operators` list. Re-running the Studio's `schema.sql` recreates the permissive policies, so re-run `ops-setup.sql` afterwards.
