"use client";

import React, { useEffect, useState } from "react";
import { Activity, ArrowRight, ExternalLink, ShieldCheck, User } from "lucide-react";

type Transaction = {
  id: string;
  task: string;
  amountUsdc: string;
  settlementTxHash: string;
  splitTxHashes: string[];
  providerAddress: string;
  createdAt: string;
};

export function EconomyTicker() {
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTxs = async () => {
    try {
      const res = await fetch("/api/dashboard/transactions");
      const data = await res.json();
      if (Array.isArray(data)) {
        setTxs(data);
      }
    } catch (err) {
      console.error("Failed to fetch economy data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTxs();
    const interval = setInterval(fetchTxs, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading && txs.length === 0) {
    return <div className="animate-pulse h-40 bg-white/5 rounded-2xl" />;
  }

  return (
    <div className="space-y-4">
      <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-white font-medium flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          Live Economy Feed
        </h3>
        <span className="self-start rounded bg-white/5 px-2 py-1 text-[10px] uppercase tracking-widest text-white/40">
          Syncing with Arc Testnet
        </span>
      </div>

      <div className="space-y-3 overflow-hidden">
        {txs.map((tx, idx) => (
          <div
            key={tx.id}
            className={`animate-in fade-in slide-in-from-top-4 rounded-xl border border-white/10 bg-black/40 p-3 transition-all duration-500 backdrop-blur-sm sm:p-4`}
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <span className="text-white/90 font-medium capitalize">{tx.task}</span>
                  <div className="flex items-center gap-1 text-[10px] text-white/40">
                    <span>{new Date(tx.createdAt).toLocaleTimeString()}</span>
                    <span>•</span>
                    <a 
                      href={`https://explorer.testnet.arc.network/tx/${tx.settlementTxHash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-emerald-400 flex items-center gap-0.5"
                    >
                      Settlement <ExternalLink className="w-2 h-2" />
                    </a>
                  </div>
                </div>
              </div>
              <div className="text-emerald-400 font-mono font-bold">
                +${parseFloat(tx.amountUsdc).toFixed(4)}
              </div>
            </div>

            {/* Split Visualization */}
            <div className="mt-4 flex flex-col gap-2 border-t border-white/5 pt-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className={`w-5 h-5 rounded-full border border-black bg-white/10 flex items-center justify-center`}>
                      <ShieldCheck className="w-2.5 h-2.5 text-white/60" />
                    </div>
                  ))}
                </div>
                <span className="text-[10px] text-white/30 uppercase tracking-tighter">
                  80/10/10 Split Verified
                </span>
              </div>
              <div className="flex items-center gap-1">
                <ArrowRight className="w-3 h-3 text-white/20" />
                <span className="text-[10px] font-mono text-white/40">
                  {tx.splitTxHashes?.length || 3} Distributions
                </span>
              </div>
            </div>
          </div>
        ))}

        {txs.length === 0 && (
          <div className="text-center py-8 text-white/40 text-sm italic">
            Waiting for first nanopayment...
          </div>
        )}
      </div>
    </div>
  );
}
