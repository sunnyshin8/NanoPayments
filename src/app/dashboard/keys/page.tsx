export default function KeysPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl font-semibold text-slate-900 sm:text-4xl">API Keys</h1>
      <p className="mt-2 text-slate-600">Generate and rotate access keys for metered endpoints.</p>
      <section className="glass mt-6 rounded-2xl p-6">
        <p className="text-sm text-slate-600">Primary key</p>
        <div className="mt-2 overflow-x-auto rounded-xl border border-slate-200 bg-white px-3 py-2">
          <p className="min-w-max font-mono text-xs text-slate-700 sm:text-sm">
            np_live_xxx_xxxxxxxxxxxxxxxxxxx
          </p>
        </div>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <button className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Copy</button>
          <button className="btn-primary rounded-xl px-4 py-2 text-sm font-semibold">Rotate</button>
        </div>
      </section>
    </main>
  );
}
