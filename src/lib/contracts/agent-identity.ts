import AgentIdentityABI from "@/contracts/AgentIdentity_abi.json";
import {
  createPublicClient,
  createWalletClient,
  getContract,
  http,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";

const arcTestnet = {
  id: Number(process.env.ARC_CHAIN_ID ?? 5042002),
  name: "Arc Testnet",
  nativeCurrency: { name: "USDC", symbol: "USDC", decimals: 6 },
  rpcUrls: { default: { http: [process.env.ARC_RPC_URL ?? ""] } },
} as const;

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required`);
  }

  return value;
}

function getAgentIdentityContract() {
  const rpcUrl = requireEnv("ARC_RPC_URL");
  const serverPrivateKey = requireEnv("SERVER_PRIVATE_KEY");
  const contractAddress = requireEnv("AGENT_IDENTITY_CONTRACT");

  const publicClient = createPublicClient({
    chain: arcTestnet,
    transport: http(rpcUrl),
  });

  const account = privateKeyToAccount(serverPrivateKey as `0x${string}`);

  const walletClient = createWalletClient({
    chain: arcTestnet,
    transport: http(rpcUrl),
    account,
  });

  return getContract({
    address: contractAddress as `0x${string}`,
    abi: AgentIdentityABI,
    client: { public: publicClient, wallet: walletClient },
  });
}

export async function registerAgentOnChain(
  metadataUri: string,
): Promise<`0x${string}`> {
  const agentIdentityContract = getAgentIdentityContract();
  const hash = await agentIdentityContract.write.registerAgent([metadataUri]);
  return hash as `0x${string}`;
}

export async function updateAgentReputation(
  agentId: `0x${string}`,
  rating: number,
): Promise<void> {
  const agentIdentityContract = getAgentIdentityContract();
  await agentIdentityContract.write.updateReputation([
    agentId,
    BigInt(Math.max(0, Math.min(10_000, rating))),
  ]);
}

export async function getAgentReputation(agentId: `0x${string}`): Promise<{
  score: number;
  totalRatings: number;
}> {
  const agentIdentityContract = getAgentIdentityContract();
  const [score, total] =
    (await agentIdentityContract.read.getAgentReputation([
      agentId,
    ])) as readonly [bigint, bigint];

  return {
    score: Number(score) / 100,
    totalRatings: Number(total),
  };
}

export async function getSpecialistReputation(agentId?: string): Promise<{
  score: number;
  totalRatings: number;
} | null> {
  if (!agentId || !agentId.startsWith("0x") || agentId.length !== 42) {
    return null;
  }

  try {
    return await getAgentReputation(agentId as `0x${string}`);
  } catch {
    return null;
  }
}
