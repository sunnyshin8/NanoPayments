"use client";

import React, { useState } from "react";
import { Check, Cpu, Zap, Search, PieChart } from "lucide-react";

type Specialist = {
  id: string;
  name: string;
  description: string;
  task: "chat" | "summarize" | "analyze" | "extract";
  tier: "standard" | "premium";
  price: string;
  model: string;
  icon: React.ReactNode;
};

const specialists: Specialist[] = [
  {
    id: "chat-std",
    name: "Standard Chat",
    description: "Fast, versatile conversational assistant for daily tasks.",
    task: "chat",
    tier: "standard",
    price: "$0.001",
    model: "Llama 3.1 8B",
    icon: <Zap className="w-5 h-5" />,
  },
  {
    id: "chat-pro",
    name: "Elite Chat",
    description: "High-reasoning intelligence for complex problem solving.",
    task: "chat",
    tier: "premium",
    price: "$0.01",
    model: "GPT-4o Mini",
    icon: <Cpu className="w-5 h-5 text-purple-400" />,
  },
  {
    id: "sum-std",
    name: "Quick Summarizer",
    description: "Instantly condense long documents into key highlights.",
    task: "summarize",
    tier: "standard",
    price: "$0.0005",
    model: "Phi-3 Mini",
    icon: <Search className="w-5 h-5 text-blue-400" />,
  },
  {
    id: "ana-pro",
    name: "Elite Analyst",
    description: "Deep data extraction and logical trend analysis.",
    task: "analyze",
    tier: "premium",
    price: "$0.015",
    model: "Claude 3.5 Sonnet",
    icon: <PieChart className="w-5 h-5 text-pink-400" />,
  },
];

export function SpecialistDirectory({ 
  onSelect 
}: { 
  onSelect?: (s: Specialist) => void 
}) {
  const [selected, setSelected] = useState(specialists[0].id);

  const handleSelect = (s: Specialist) => {
    setSelected(s.id);
    onSelect?.(s);
  };

  return (
    <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
      {specialists.map((s) => {
        const isSelected = selected === s.id;

        return (
          <button
            key={s.id}
            onClick={() => handleSelect(s)}
            className={`relative cursor-pointer rounded-2xl border p-4 text-left transition-all duration-300 sm:p-5 ${
              isSelected
                ? "bg-slate-950 border-sky-400/40 shadow-[0_0_24px_rgba(14,165,233,0.2)]"
                : "bg-white/80 border-slate-200 hover:border-sky-200"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className={`rounded-xl p-3 bg-gradient-to-br ${
                s.tier === "premium" ? "from-fuchsia-500/20 to-rose-500/20" : "from-blue-500/10 to-emerald-500/10"
              }`}>
                {s.icon}
              </div>
              {isSelected ? (
                <div className="rounded-full bg-sky-500 p-0.5">
                  <Check className="h-3 w-3 text-white" />
                </div>
              ) : null}
            </div>

            <div className="mt-4">
              <h3 className={`flex items-center gap-2 font-semibold ${isSelected ? "text-white" : "text-slate-900"}`}>
                {s.name}
                <span className={`rounded px-1.5 py-0.5 text-[10px] uppercase tracking-wider ${
                  s.tier === "premium"
                    ? isSelected
                      ? "bg-fuchsia-500/30 text-fuchsia-200"
                      : "bg-fuchsia-500/10 text-fuchsia-700"
                    : isSelected
                      ? "bg-sky-500/30 text-sky-100"
                      : "bg-sky-500/10 text-sky-700"
                }`}>
                  {s.tier}
                </span>
              </h3>
              <p className={`mt-1 text-sm leading-relaxed ${isSelected ? "text-white/70" : "text-slate-600"}`}>
                {s.description}
              </p>
            </div>

            <div className={`mt-5 flex items-center justify-between border-t pt-4 ${isSelected ? "border-white/10" : "border-slate-200"}`}>
              <div className={`font-mono text-xs ${isSelected ? "text-white/50" : "text-slate-500"}`}>
                {s.model}
              </div>
              <div className="font-mono font-bold text-emerald-500">
                {s.price}
              </div>
            </div>

            {isSelected ? (
              <div className="absolute -bottom-px left-6 right-6 h-px bg-gradient-to-r from-transparent via-sky-400 to-transparent" />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
