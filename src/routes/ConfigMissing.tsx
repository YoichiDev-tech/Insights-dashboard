export default function ConfigMissing() {
  return (
    <div className="grid min-h-screen place-items-center p-4">
      <div className="max-w-md space-y-3 rounded-xl border border-red-200 bg-white/80 p-6 text-sm text-slate-700 dark:border-red-900 dark:bg-pw_panel dark:text-slate-200">
        <h1 className="text-lg font-semibold text-red-700 dark:text-red-300">Supabase is not configured</h1>
        <p>
          Set <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> in the Vercel project
          (Settings, Environment Variables), then redeploy. Vite inlines these at build time, so a redeploy is required.
        </p>
      </div>
    </div>
  );
}
