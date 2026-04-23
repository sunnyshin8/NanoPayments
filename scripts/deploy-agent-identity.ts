import "dotenv/config";
import { readFileSync } from "node:fs";
import { existsSync } from "node:fs";
import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required`);
  }

  return value;
}

const arcTestnet = {
  id: Number(process.env.ARC_CHAIN_ID ?? 5042002),
  name: "Arc Testnet",
  nativeCurrency: { name: "USDC", symbol: "USDC", decimals: 6 },
  rpcUrls: { default: { http: [requireEnv("ARC_RPC_URL")] } },
} as const;

async function deployAgentIdentity() {
  const bytecodePath = "./contracts/AgentIdentity_bytecode.txt";
  if (!existsSync(bytecodePath)) {
    throw new Error(
      "Missing contracts/AgentIdentity_bytecode.txt. Run `npm run contract:compile` first.",
    );
  }

  const bytecode = readFileSync(bytecodePath, "utf8").trim();
  const abi = JSON.parse(
    readFileSync("./src/contracts/AgentIdentity_abi.json", "utf8"),
  );

  const account = privateKeyToAccount(requireEnv("DEPLOYER_PRIVATE_KEY") as `0x${string}`);
  const rpcUrl = requireEnv("ARC_RPC_URL");

  const walletClient = createWalletClient({
    chain: arcTestnet,
    transport: http(rpcUrl),
    account,
  });

  const publicClient = createPublicClient({
    chain: arcTestnet,
    transport: http(rpcUrl),
  });

  const hash = await walletClient.deployContract({
    abi,
    bytecode: bytecode as `0x${string}`,
    args: [],
  });

  console.log(`AgentIdentity deployment transaction: ${hash}`);

  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  if (!receipt.contractAddress) {
    throw new Error("Deployment confirmed, but no contract address was returned");
  }

  console.log(`AgentIdentity deployed at: ${receipt.contractAddress}`);
  console.log(`Set AGENT_IDENTITY_CONTRACT=${receipt.contractAddress}`);
}

deployAgentIdentity().catch((error) => {
  console.error(error);
  process.exit(1);
});
