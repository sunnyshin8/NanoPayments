"use client";

import { useState } from "react";

export default function WalletDashboardPage() {
  const [walletId, setWalletId] = useState("");
  const [balance, setBalance] = useState<string | null>(null);
  const [fromChain, setFromChain] = useState("ethereum");
  const [amountUsdc, setAmountUsdc] = useState("10.00");
  const [bridgeResult, setBridgeResult] = useState<string | null>(null);

  async function loadBalance() {
    const response = await fetch(`/api/wallets/balance?walletId=${walletId}`);
    const data = await response.json();
    setBalance(data.usdc ?? null);
  }

  async function bridgeFunds() {
    const response = await fetch("/api/wallets/bridge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fromChain, amountUsdc }),
    });

    const data = await response.json();
    setBridgeResult(data.txHash ? `Bridge tx: ${data.txHash}` : data.error);
  }

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <section className="fade-in">
        <h1 className="font-serif text-3xl font-semibold text-slate-900 sm:text-4xl">Wallet + Bridge</h1>
        <p className="mt-2 text-slate-600">Monitor Circle wallet balances and bridge USDC into Arc in one flow.</p>
      </section>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="glass rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-slate-900">Balance</h2>
          <p className="mt-2 text-sm text-slate-600">Query Circle USDC balance by wallet ID.</p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <input
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none ring-sky-200 focus:ring"
              value={walletId}
              onChange={(event) => setWalletId(event.target.value)}
              placeholder="Circle wallet ID"
            />
            <button className="btn-primary rounded-xl px-4 py-2 text-sm font-semibold" onClick={loadBalance}>
              Load
            </button>
          </div>
          {balance !== null ? (
            <p className="mt-4 rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-sm font-semibold text-sky-700">
              USDC: {balance}
            </p>
          ) : null}
        </section>

        <section className="glass rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-slate-900">Bridge to Arc</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <select
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none ring-sky-200 focus:ring"
              value={fromChain}
              onChange={(event) => setFromChain(event.target.value)}
            >
              <option value="ethereum">Ethereum</option>
              <option value="base">Base</option>
              <option value="polygon">Polygon</option>
              <option value="solana">Solana</option>
            </select>
            <input
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none ring-sky-200 focus:ring"
              value={amountUsdc}
              onChange={(event) => setAmountUsdc(event.target.value)}
              placeholder="Amount in USDC"
            />
          </div>
          <button className="btn-primary mt-4 w-full rounded-xl px-4 py-2 text-sm font-semibold sm:w-auto" onClick={bridgeFunds}>
            Bridge
          </button>
          {bridgeResult ? (
            <p className="mt-4 rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-sm text-sky-700">
              {bridgeResult}
            </p>
          ) : null}
        </section>
      </div>
    </main>
  );
}
