import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 items-start px-4 py-6 sm:items-center sm:py-10 sm:px-6 lg:px-8">
      <section className="glass fade-in mx-auto grid w-full max-w-4xl overflow-hidden rounded-3xl lg:grid-cols-[1.1fr,1fr]">
        <div className="hero-grid bg-[linear-gradient(145deg,#ebf5ff,#f2fdff)] p-6 sm:p-10">
          <p className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">
            Welcome back
          </p>
          <h1 className="mt-5 font-serif text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">
            Continue building with instant Arc settlement.
          </h1>
          <p className="mt-4 max-w-md text-sm leading-6 text-slate-600">
            Log in to monitor sessions, trigger bridges, and inspect every x402 payment.
          </p>
        </div>
        <div className="bg-white p-6 sm:p-10">
          <h2 className="text-2xl font-bold text-slate-900">Log in</h2>
          <form className="mt-6 space-y-4">
            <label className="block text-sm text-slate-600">
              Email
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
                placeholder="••••••••"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none ring-sky-200 focus:ring"
              />
            </label>
            <button type="button" className="btn-primary w-full rounded-xl px-4 py-2.5 text-sm font-semibold">
              Log in
            </button>
          </form>
          <p className="mt-5 text-sm text-slate-600">
            New here?{" "}
            <Link href="/register" className="font-semibold text-sky-700 hover:text-sky-800">
              Create account
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
