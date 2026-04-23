import Link from "next/link";

export default function Home() {
  const mvpCards = [
    {
      title: "Instant wallet onboarding",
      body: "Provision Circle wallets for users and agents so they can start paying or earning immediately.",
    },
    {
      title: "USDC bridge flow",
      body: "Move funds from Ethereum, Base, Polygon, or Solana into Arc without stitching together multiple tools.",
    },
    {
      title: "x402 payment gating",
      body: "Protect premium endpoints with micropayments that settle before the response is released.",
    },
    {
      title: "Agent reputation",
      body: "Track specialist status and trust signals so the best agents can surface for higher-value tasks.",
    },
    {
      title: "Transaction visibility",
      body: "Inspect every payment, split, and settlement event in one control surface.",
    },
    {
      title: "Developer playground",
      body: "Experiment with paid endpoints and validation flows before wiring them into production.",
    },
  ];

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
      <section className="hero-grid glass fade-in overflow-hidden rounded-3xl p-8 sm:p-12">
        <p className="inline-flex rounded-full border border-sky-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
          Arc Chain + Circle + x402
        </p>
        <h1 className="mt-6 max-w-4xl font-serif text-5xl font-semibold leading-[1.08] text-slate-900 sm:text-6xl">
          Micropayments infrastructure with a <span className="title-gradient">premium developer surface</span>.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600">
          NanoPay combines Circle wallets, Gateway splitting, Bridge Kit deposits, and x402 facilitator settlement into a single Arc-native platform.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/playground" className="btn-primary rounded-full px-5 py-2.5 text-sm font-semibold transition">
            Open Playground
          </Link>
          <Link href="/dashboard" className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700">
            View Dashboard
          </Link>
          <Link href="/about" className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700">
            About NanoPay
          </Link>
        </div>
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="glass elevate fade-in rounded-3xl p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-700">What NanoPay does</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-slate-900">
            It turns AI, API, and agent payments into a single fast flow.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
            NanoPay combines wallet creation, bridge deposits, micropayment verification, and settlement tracking so teams can
            charge for usage without building a custom payments stack.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              ["For builders", "Meter usage and gate endpoints with paid access."],
              ["For agents", "Receive and spend funds with automated settlement."],
              ["For ops teams", "See live balances, splits, and transaction history."],
              ["For users", "Pay only for the exact action or output they need."],
            ].map(([title, body]) => (
              <div key={title} className="rounded-2xl border border-slate-200 bg-white/85 p-4 shadow-sm">
                <p className="text-sm font-semibold text-slate-900">{title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="glass elevate fade-in rounded-3xl p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-700">How it works</p>
          <h2 className="mt-3 font-serif text-2xl font-semibold text-slate-900">
            Simple enough for demos, structured enough for production.
          </h2>
          <ol className="mt-5 space-y-4 text-sm leading-6 text-slate-600">
            <li className="rounded-2xl border border-slate-200 bg-white/85 p-4">
              <span className="block font-semibold text-slate-900">1. Create wallets</span>
              Users and agents are provisioned with Circle-compatible wallets during signup.
            </li>
            <li className="rounded-2xl border border-slate-200 bg-white/85 p-4">
              <span className="block font-semibold text-slate-900">2. Move funds</span>
              Bridge USDC from supported chains into Arc so balances stay usable for paid actions.
            </li>
            <li className="rounded-2xl border border-slate-200 bg-white/85 p-4">
              <span className="block font-semibold text-slate-900">3. Verify payments</span>
              Gate requests with x402 and record each nanopayment for accounting and observability.
            </li>
          </ol>
        </article>
      </section>

      <section className="mt-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-700">MVPs</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold text-slate-900">Core product surfaces to ship first</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-600">
            These are the first boxes we’d ship for the NanoPay platform: wallet onboarding, bridging, payment gating, and
            operational visibility.
          </p>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {mvpCards.map((card, index) => (
            <article
              key={card.title}
              className={`glass elevate fade-in rounded-2xl p-5 ${index > 0 ? `stagger-${Math.min(index, 3)}` : ""}`}
            >
              <h3 className="text-lg font-semibold text-slate-900">{card.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{card.body}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
