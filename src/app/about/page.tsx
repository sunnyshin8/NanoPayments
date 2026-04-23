import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
      <section className="hero-grid glass fade-in overflow-hidden rounded-3xl p-8 sm:p-12">
        <p className="inline-flex rounded-full border border-sky-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
          About NanoPay
        </p>
        <h1 className="mt-6 max-w-4xl font-serif text-4xl font-semibold leading-[1.08] text-slate-900 sm:text-5xl">
          NanoPay makes micropayments feel like part of the product, not an extra integration.
        </h1>
        <p className="mt-6 max-w-3xl text-base leading-7 text-slate-600">
          The platform combines wallet provisioning, bridged USDC, x402 payment verification, and transaction observability so
          teams can charge for AI output, APIs, and agent work in a single flow.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="btn-primary rounded-full px-5 py-2.5 text-sm font-semibold transition">
            Back Home
          </Link>
          <Link href="/playground" className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700">
            Open Playground
          </Link>
        </div>
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-3">
        {[
          {
            title: "What it is",
            body: "A payment layer for small, high-frequency transactions across AI, API, and agent workflows.",
          },
          {
            title: "What it solves",
            body: "It removes the glue work around wallets, bridges, verification, and ledger tracking.",
          },
          {
            title: "Who it is for",
            body: "Builders shipping paid experiences, operations teams watching revenue, and agents earning per task.",
          },
        ].map((item, index) => (
          <article key={item.title} className={`glass elevate fade-in rounded-2xl p-5 ${index > 0 ? `stagger-${index}` : ""}`}>
            <h2 className="text-lg font-semibold text-slate-900">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p>
          </article>
        ))}
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="glass rounded-3xl p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-700">How NanoPay works</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-slate-900">
            The path from request to settlement is intentionally short.
          </h2>
          <div className="mt-6 space-y-3 text-sm leading-6 text-slate-600">
            <div className="rounded-2xl border border-slate-200 bg-white/85 p-4">
              <span className="block font-semibold text-slate-900">Wallets</span>
              Each user or agent gets a wallet that can receive and spend funds immediately.
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/85 p-4">
              <span className="block font-semibold text-slate-900">Payments</span>
              Requests can be gated by a nanopayment so the platform earns before it serves premium output.
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/85 p-4">
              <span className="block font-semibold text-slate-900">Settlement</span>
              Bridging and ledger tracking keep every payment visible for finance, support, and product teams.
            </div>
          </div>
        </article>

        <article className="glass rounded-3xl p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-700">MVP checklist</p>
          <h2 className="mt-3 font-serif text-2xl font-semibold text-slate-900">What the first version should cover</h2>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-600">
            <li className="rounded-2xl border border-slate-200 bg-white/85 p-4">Signup flow with wallet provisioning.</li>
            <li className="rounded-2xl border border-slate-200 bg-white/85 p-4">Bridge deposits into Arc-ready balances.</li>
            <li className="rounded-2xl border border-slate-200 bg-white/85 p-4">x402 payment verification for paid API calls.</li>
            <li className="rounded-2xl border border-slate-200 bg-white/85 p-4">Dashboard views for balances, agents, and history.</li>
          </ul>
        </article>
      </section>
    </main>
  );
}