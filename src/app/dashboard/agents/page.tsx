"use client";

import { SpecialistDirectory } from "@/components/agents/SpecialistDirectory";
import { useEffect, useState } from "react";

type AgentItem = {
  id: string;
  name: string;
  rep: string;
  calls: number;
  status: string;
  onChainAgentId: string;
};

type AgentsResponse = {
  source: "database" | "demo";
  agents: AgentItem[];
};

export default function AgentsPage() {
  const [data, setData] = useState<AgentsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const response = await fetch("/api/agents/list", { cache: "no-store" });
        const json = (await response.json()) as AgentsResponse;
        if (!active) return;
        setData(json);
      } catch {
        if (!active) return;
        setError("Could not load agents.");
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <section className="glass overflow-hidden rounded-[2rem] p-6 sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-700">
              Agentic Economy
            </p>
            <h1 className="mt-3 font-serif text-3xl font-semibold text-slate-900 sm:text-5xl">
              Specialist directory for ERC-8004 agents
            </h1>
            <p className="mt-3 max-w-xl text-slate-600">
              Discover live reputation snapshots and premium specialist tiers on Arc testnet.
            </p>
            {data ? (
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-sky-700">
                Data source: {data.source}
              </p>
            ) : null}
            {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-700 shadow-sm backdrop-blur">
            <p className="font-semibold text-slate-900">Live Agent Registry</p>
            <p className="mt-1">Updated from the database when connected, demo data when offline.</p>
          </div>
        </div>

        <div className="mt-8">
          <SpecialistDirectory />
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {(data?.agents ?? []).slice(0, 3).map((agent, index) => (
            <article
              key={agent.id}
              className={`glass elevate fade-in rounded-2xl p-5 ${index > 0 ? `stagger-${Math.min(index, 3)}` : ""}`}
            >
              <p className="text-sm text-slate-500">{agent.name}</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{agent.rep}%</p>
              <p className="mt-2 text-sm font-semibold text-sky-700">{agent.calls.toLocaleString()} calls</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">{agent.status}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
