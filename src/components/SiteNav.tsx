import Link from "next/link";

const links = [
  { href: "/playground", label: "Playground" },
  { href: "/about", label: "About" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/wallet", label: "Wallet" },
  { href: "/dashboard/agents", label: "Agents" },
];

export function SiteNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/40 bg-white/65 backdrop-blur-xl">
      <nav className="mx-auto w-full max-w-6xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
            NanoPay
            <span className="ml-2 hidden rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-700 sm:inline-flex">
              Arc + USDC
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-full border border-slate-300/80 px-3 py-1.5 text-xs font-semibold text-slate-700 sm:px-4 sm:py-2 sm:text-sm"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="btn-primary rounded-full px-3 py-1.5 text-xs font-semibold transition sm:px-4 sm:py-2 sm:text-sm"
            >
              Start Free
            </Link>
          </div>
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 text-sm font-medium text-slate-700 md:hidden">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-full border border-slate-200 bg-white px-3 py-1.5"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="mt-1 hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
          {links.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-slate-900">
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
