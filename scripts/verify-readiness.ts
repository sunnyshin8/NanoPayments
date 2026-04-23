import "dotenv/config";
import { createPublicClient, http, formatUnits } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import * as CircleSDK from "@circle-fin/developer-controlled-wallets";

const arcTestnet = {
  id: Number(process.env.ARC_CHAIN_ID ?? 5042002),
  name: "Arc Testnet",
  nativeCurrency: { name: "USDC", symbol: "USDC", decimals: 6 },
  rpcUrls: { default: { http: [process.env.ARC_RPC_URL ?? "https://rpc.testnet.arc.network"] } },
} as const;

async function verifyReadiness() {
  console.log("🚀 Starting Nanopayment Platform Readiness Check...");

  // 1. Check Deployer Balance
  const privateKey = process.env.DEPLOYER_PRIVATE_KEY as `0x${string}`;
  if (privateKey) {
    const account = privateKeyToAccount(privateKey);
    const publicClient = createPublicClient({
      chain: arcTestnet,
      transport: http(),
    });

    try {
      const balance = await publicClient.getBalance({ address: account.address });
      const balanceUsdc = formatUnits(balance, 6);
      console.log(`[1] Deployer Wallet: ${account.address}`);
      console.log(`    Balance: ${balanceUsdc} USDC`);
      
      if (Number(balanceUsdc) < 0.1) {
        console.warn("    ⚠️  Balance is low. Contract deployment may fail.");
      } else {
        console.log("    ✅ Funded and ready for deployment.");
      }
    } catch (e) {
      console.error("    ❌ Failed to check balance. Is ARC_RPC_URL correct?");
    }
  } else {
    console.error("[1] ❌ Missing DEPLOYER_PRIVATE_KEY in .env");
  }

  // 2. Check Circle Configuration
  if (process.env.CIRCLE_API_KEY && process.env.CIRCLE_ENTITY_SECRET) {
    console.log("[2] Circle Config: Keys found.");
    if (!process.env.PLATFORM_WALLET_ID) {
      console.warn("    ⚠️  Missing PLATFORM_WALLET_ID. Revenue splits will fail.");
    } else {
      console.log("    ✅ Platform Wallet ID set.");
    }
  } else {
    console.error("[2] ❌ Missing Circle API credentials in .env");
  }

  // 3. Check Contract Deployment Status
  if (process.env.AGENT_IDENTITY_CONTRACT) {
    console.log(`[3] Smart Contract: ${process.env.AGENT_IDENTITY_CONTRACT} (Configured)`);
  } else {
    console.warn("[3] ⚠️  AGENT_IDENTITY_CONTRACT not set. Agent registry UI will remain in demo mode.");
  }

  // 4. Check AI API Keys
  const hasAiml = !!process.env.AIML_API_KEY;
  const hasFeatherless = !!process.env.FEATHERLESS_API_KEY;
  console.log(`[4] AI Providers: AIML(${hasAiml ? "✅" : "❌"}) Featherless(${hasFeatherless ? "✅" : "❌"})`);

  console.log("\n--- Readiness Check Complete ---");
}

verifyReadiness();
