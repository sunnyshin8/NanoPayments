import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 items-start px-4 py-6 sm:items-center sm:py-10 sm:px-6 lg:px-8">
      <section className="glass fade-in mx-auto grid w-full max-w-4xl overflow-hidden rounded-3xl lg:grid-cols-[1fr,1.1fr]">
        <div className="bg-white p-6 sm:p-10">
          <h1 className="text-2xl font-bold text-slate-900">Create your NanoPay account</h1>
          <p className="mt-2 text-sm text-slate-600">Registration will provision your Circle Arc wallet automatically.</p>
          <form className="mt-6 space-y-4">
            <label className="block text-sm text-slate-600">
              Work email
              <input
                type="email"
                placeholder="you@company.com"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none ring-sky-200 focus:ring"
              />
            </label>
            <label className="block text-sm text-slate-600">
              Password
              <input
                type="password"
                placeholder="At least 8 characters"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none ring-sky-200 focus:ring"
              />
            </label>
            <button type="button" className="btn-primary w-full rounded-xl px-4 py-2.5 text-sm font-semibold">
              Create account
            </button>
          </form>
          <p className="mt-5 text-sm text-slate-600">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-sky-700 hover:text-sky-800">
              Log in
            </Link>
          </p>
        </div>
        <div className="hero-grid bg-[linear-gradient(145deg,#ebf5ff,#f2fdff)] p-6 sm:p-10">
          <p className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">
            Wallets + Gateway + x402
          </p>
          <h2 className="mt-5 font-serif text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">
            Launch with instant Circle wallet infrastructure.
          </h2>
          <ul className="mt-5 space-y-2 text-sm text-slate-600">
            <li>Arc testnet wallet generated during signup.</li>
            <li>Bridge from Base, Ethereum, Polygon, and Solana.</li>
            <li>Gasless facilitator settlement with x402 middleware.</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
