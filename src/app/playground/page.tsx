export default function PlaygroundPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <section className="fade-in">
        <h1 className="font-serif text-3xl font-semibold text-slate-900 sm:text-4xl">Inference Playground</h1>
        <p className="mt-2 text-slate-600">Try paid endpoints with x402 settlement and attestation headers.</p>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-[1.5fr,1fr]">
        <article className="glass rounded-2xl p-6">
          <label className="text-sm text-slate-600">Input text</label>
          <textarea
            className="mt-2 h-52 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none ring-sky-200 focus:ring"
            placeholder="Paste text for summarization or analysis"
          />
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <button className="btn-primary w-full rounded-xl px-4 py-2 text-sm font-semibold sm:w-auto">Run Summarize ($0.010)</button>
            <button className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 sm:w-auto">Run Analyze ($0.008)</button>
          </div>
        </article>

        <article className="glass rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-slate-900">Live Session</h2>
          <div className="mt-4 space-y-2 text-sm text-slate-600">
            <p>Requests: 12</p>
            <p>Spent: $0.108</p>
            <p>Current tier: medium</p>
            <p>Attestation: ready</p>
          </div>
        </article>
      </section>
    </main>
  );
}
