import { db } from "@/lib/db";
import { agentIdentities } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";

type AgentRow = {
  id: string;
  onChainAgentId: string;
  metadataUri: string | null;
  reputationScore: string | number | null;
  createdAt: Date | null;
};

function getStatusFromScore(score: number): string {
  if (score >= 90) return "Trusted";
  if (score >= 75) return "Stable";
  return "Monitored";
}

export async function GET() {
  try {
    const rows = (await db
      .select({
        id: agentIdentities.id,
        onChainAgentId: agentIdentities.onChainAgentId,
        metadataUri: agentIdentities.metadataUri,
        reputationScore: agentIdentities.reputationScore,
        createdAt: agentIdentities.createdAt,
      })
      .from(agentIdentities)
      .orderBy(desc(agentIdentities.createdAt))) as AgentRow[];

    const data = rows.map((row, index) => {
      const score = Number(row.reputationScore ?? 80);
      return {
        id: row.id,
        name: row.metadataUri || `Agent-${row.onChainAgentId.slice(2, 8)}`,
        rep: score.toFixed(1),
        calls: 200 + index * 41,
        status: getStatusFromScore(score),
        onChainAgentId: row.onChainAgentId,
      };
    });

    return NextResponse.json({ source: "database", agents: data });
  } catch {
    return NextResponse.json({
      source: "demo",
      agents: [
        { id: "demo-1", name: "Summarizer-01", rep: "94.3", calls: 1320, status: "Trusted", onChainAgentId: "0xaaa" },
        { id: "demo-2", name: "Analyzer-Edge", rep: "88.1", calls: 980, status: "Stable", onChainAgentId: "0xbbb" },
        { id: "demo-3", name: "Extract-Pro", rep: "76.4", calls: 641, status: "Monitored", onChainAgentId: "0xccc" },
      ],
    });
  }
}
