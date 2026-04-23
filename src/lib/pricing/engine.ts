import { getAgentReputation } from "@/lib/contracts/agent-identity";

type Tier = "low" | "medium" | "high";

export interface SpotPrice {
  amount: number;
  tier: Tier;
  validForMs: number;
  loadFactor: number;
  reputationMultiplier: number;
}

const PRICE_TABLE: Record<Tier, number> = {
  low: 0.008,
  medium: 0.01,
  high: 0.016,
};

function resolveTier(loadFactor: number): Tier {
  if (loadFactor < 0.4) return "low";
  if (loadFactor < 0.8) return "medium";
  return "high";
}

export async function getSpotPrice(
  endpoint: string,
  agentId?: `0x${string}`,
): Promise<SpotPrice> {
  const hashSeed = endpoint.length % 10;
  const loadFactor = Math.min(1, Math.max(0, hashSeed / 10));
  const tier = resolveTier(loadFactor);
  const basePrice = PRICE_TABLE[tier];

  let reputationMultiplier = 1;
  if (agentId) {
    const rep = await getAgentReputation(agentId);
    if (rep.score >= 90) reputationMultiplier = 0.85;
    else if (rep.score >= 75) reputationMultiplier = 0.95;
    else if (rep.score < 40) reputationMultiplier = 1.25;
  }

  return {
    amount: Number((basePrice * reputationMultiplier).toFixed(8)),
    tier,
    validForMs: 10_000,
    loadFactor,
    reputationMultiplier,
  };
}
