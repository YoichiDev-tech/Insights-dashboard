export default function ConfigMissing() {
  return (
    <main className="grid min-h-screen place-items-center p-4">
      <section className="max-w-lg space-y-4 rounded-xl border border-slate-200 bg-white/80 p-6 text-sm text-slate-700 dark:border-slate-700 dark:bg-pw_panel dark:text-slate-200">
        <div className="space-y-1">
          <h1 className="text-lg font-semibold text-slate-900 dark:text-white">Ops Hub needs its Supabase connection</h1>
          <p>
            The app has started, but it cannot load real analytics or sign you in until both client environment variables are configured.
          </p>
        </div>
        <div>
          <p className="font-semibold">For local development</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>Copy <code>.env.example</code> to <code>.env.local</code>.</li>
            <li>Fill in <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> with the Studio project's URL and public anon/publishable key.</li>
            <li>Restart <code>npm run dev</code>.</li>
          </ol>
        </div>
        <div>
          <p className="font-semibold">For Vercel</p>
          <p className="mt-1">
            Add the same two variables under Project Settings → Environment Variables, then redeploy. Vite embeds these values at build time.
          </p>
        </div>
        <p className="rounded-lg border border-amber-300/50 bg-amber-50/60 p-3 text-amber-950 dark:border-amber-700/50 dark:bg-amber-950/30 dark:text-amber-100">
          Use the public anon/publishable key only. Never place the Supabase service-role key in a Vite environment variable or commit any real credentials.
        </p>
        <p>
          Setup instructions: <a className="underline underline-offset-4" href="https://github.com/YoichiDev-tech/Insights-dashboard#local-development">Ops Hub README</a>
        </p>
      </section>
    </main>
  );
}
