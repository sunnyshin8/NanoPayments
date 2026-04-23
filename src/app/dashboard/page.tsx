"use client";

import { EconomyTicker } from "@/components/dashboard/EconomyTicker";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type OverviewResponse = {
  source: "database" | "demo";
  metrics: {
    totalRequests: number;
    usdcSpent: number;
    activeSessions: number;
    avgLatencyMs: number;
    requestsDeltaPct: number;
    spentDeltaPct: number;
    sessionsDeltaPct: number;
    latencyDeltaPct: number;
  };
};

export default function DashboardPage() {
  const [overview, setOverview] = useState<OverviewResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const response = await fetch("/api/dashboard/overview", { cache: "no-store" });
        const data = (await response.json()) as OverviewResponse;
        if (!active) return;
        setOverview(data);
      } catch {
        if (!active) return;
        setError("Unable to load overview metrics.");
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const cards = useMemo(() => {
    if (!overview) {
      return [
        { label: "Total Requests", value: "...", delta: "..." },
        { label: "USDC Spent", value: "...", delta: "..." },
        { label: "Active Sessions", value: "...", delta: "..." },
        { label: "Avg Latency", value: "...", delta: "..." },
      ];
    }

    return [
      {
        label: "Total Requests",
        value: overview.metrics.totalRequests.toLocaleString(),
        delta: `${overview.metrics.requestsDeltaPct > 0 ? "+" : ""}${overview.metrics.requestsDeltaPct}%`,
      },
      {
        label: "USDC Spent",
        value: `$${overview.metrics.usdcSpent.toFixed(2)}`,
        delta: `${overview.metrics.spentDeltaPct > 0 ? "+" : ""}${overview.metrics.spentDeltaPct}%`,
      },
      {
        label: "Active Sessions",
        value: overview.metrics.activeSessions.toString(),
        delta: `${overview.metrics.sessionsDeltaPct > 0 ? "+" : ""}${overview.metrics.sessionsDeltaPct}%`,
      },
      {
        label: "Avg Latency",
        value: `${overview.metrics.avgLatencyMs}ms`,
        delta: `${overview.metrics.latencyDeltaPct > 0 ? "+" : ""}${overview.metrics.latencyDeltaPct}%`,
      },
    ];
  }, [overview]);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <section className="glass overflow-hidden rounded-[2rem] p-6 sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-700">
              Control Center
            </p>
            <h1 className="mt-3 font-serif text-3xl font-semibold text-slate-900 sm:text-5xl">
              Live Arc transaction economy
            </h1>
            <p className="mt-3 max-w-2xl text-slate-600">
              Track gateway splits, wallet health, and inference economics in one place.
            </p>
            {overview ? (
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-sky-700">
                Data source: {overview.source}
              </p>
            ) : null}
            {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}
          </div>

          <div className="grid gap-2 rounded-2xl border border-slate-200 bg-white/80 p-4 text-sm text-slate-700 shadow-sm backdrop-blur sm:grid-cols-2">
            <Link href="/dashboard/wallet" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 hover:bg-slate-50">
              Wallet + Bridge
            </Link>
            <Link href="/dashboard/agents" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 hover:bg-slate-50">
              Agent Reputation
            </Link>
            <Link href="/dashboard/history" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 hover:bg-slate-50 sm:col-span-2">
              Transaction History
            </Link>
          </div>
        </div>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card, index) => (
            <article
              key={card.label}
              className={`glass elevate fade-in rounded-2xl p-5 ${index > 0 ? `stagger-${Math.min(index, 3)}` : ""}`}
            >
              <p className="text-sm text-slate-500">{card.label}</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{card.value}</p>
              <p className="mt-2 text-sm font-semibold text-sky-700">{card.delta} this week</p>
            </article>
          ))}
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
          <article className="glass rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-slate-900">Live Throughput</h2>
            <div className="mt-6 h-48 rounded-xl bg-[linear-gradient(180deg,#ebf4ff,#ffffff)] p-4">
              <div className="h-full w-full rounded-lg border border-sky-100 bg-[repeating-linear-gradient(90deg,transparent,transparent_34px,rgba(14,77,146,0.06)_34px,rgba(14,77,146,0.06)_35px)]" />
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-slate-950/95 p-4 text-white shadow-2xl sm:p-6">
            <EconomyTicker />
          </article>
        </section>
      </section>
    </main>
  );
}
