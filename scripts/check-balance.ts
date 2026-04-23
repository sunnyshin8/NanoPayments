
import { createPublicClient, http, formatUnits } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import "dotenv/config";

const arcTestnet = {
  id: Number(process.env.ARC_CHAIN_ID ?? 5042002),
  name: "Arc Testnet",
  nativeCurrency: { name: "USDC", symbol: "USDC", decimals: 6 },
  rpcUrls: { default: { http: [process.env.ARC_RPC_URL ?? "https://rpc.testnet.arc.network"] } },
} as const;

async function checkBalance() {
  const privateKey = process.env.DEPLOYER_PRIVATE_KEY as `0x${string}`;
  if (!privateKey) {
    console.error("Missing DEPLOYER_PRIVATE_KEY");
    return;
  }
  const account = privateKeyToAccount(privateKey);
  console.log(`Checking balance for: ${account.address}`);

  const publicClient = createPublicClient({
    chain: arcTestnet,
    transport: http(),
  });

  const balance = await publicClient.getBalance({ address: account.address });
  console.log(`Balance: ${formatUnits(balance, 6)} USDC`);
}

checkBalance();
