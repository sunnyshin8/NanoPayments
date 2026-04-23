"use client";

import { useEffect, useState } from "react";

type HistoryRow = {
  id: string;
  amount: string;
  split: string;
  state: string;
  createdAt: string;
};

export default function HistoryPage() {
  const [rows, setRows] = useState<HistoryRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const response = await fetch("/api/transactions/history", { cache: "no-store" });
        const data = (await response.json()) as { rows: HistoryRow[] };
        if (!active) return;
        setRows(data.rows ?? []);
      } catch {
        if (!active) return;
        setError("Could not load history.");
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl font-semibold text-slate-900 sm:text-4xl">Transaction History</h1>
      <p className="mt-2 text-slate-600">Every x402 payment and Circle gateway split in one ledger.</p>
      {error ? <p className="mt-2 text-sm text-rose-600">{error}</p> : null}
      <div className="mt-6 grid gap-3">
        {rows.map((row) => (
          <article key={row.id} className="glass rounded-2xl p-4">
            <div className="grid gap-2 text-sm sm:flex sm:flex-wrap sm:items-center sm:justify-between">
              <p className="font-semibold text-slate-900">{row.id}</p>
              <p className="text-sm text-slate-600">{row.amount}</p>
              <p className="text-sm text-slate-600">Split {row.split}</p>
              <span className="rounded-full bg-sky-100 px-2 py-1 text-xs font-semibold text-sky-700">{row.state}</span>
              <p className="text-xs text-slate-500">
                {new Date(row.createdAt).toLocaleTimeString()}
              </p>
            </div>
          </article>
        ))}
        {!rows.length ? (
          <article className="glass rounded-2xl p-4 text-sm text-slate-500">Loading transactions...</article>
        ) : null}
      </div>
    </main>
  );
}
