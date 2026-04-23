import "dotenv/config";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { nanopayments } from "@/lib/db/schema";

type ChatResponse = {
  settlementTxHash?: string;
  splitTxHashes?: string[];
  splitWarning?: string | null;
  output?: unknown;
  error?: string;
};

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required`);
  }

  return value;
}

async function main() {
  const baseUrl = process.env.APP_BASE_URL ?? "http://localhost:3000";
  const paymentData = requireEnv("X402_PAYMENT_DATA");
  const payerAddress = requireEnv("X402_PAYER_ADDRESS");
  const resourceUrl = process.env.X402_RESOURCE_URL ?? `${baseUrl}/api/chat`;
  const message = process.env.X402_MESSAGE ?? "Run a paid x402 verification request.";
  const task = (process.env.X402_TASK ?? "chat") as "chat" | "summarize" | "analyze" | "extract";
  const budgetUsd = Number(process.env.X402_BUDGET_USD ?? "0.05");

  console.log(`Submitting paid request to ${resourceUrl}...`);

  const response = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-payment": paymentData,
    },
    body: JSON.stringify({
      message,
      task,
      budgetUsd,
      resourceUrl,
    }),
  });

  const payload = (await response.json()) as ChatResponse;

  if (!response.ok) {
    throw new Error(`Chat request failed (${response.status}): ${payload.error ?? JSON.stringify(payload)}`);
  }

  const settlementTxHash = payload.settlementTxHash;
  if (!settlementTxHash) {
    throw new Error("Missing settlementTxHash in chat response");
  }

  if (!Array.isArray(payload.splitTxHashes) || payload.splitTxHashes.length !== 3) {
    throw new Error("Expected 3 Circle split transactions for the 80/10/10 revenue split");
  }

  const ledgerRow = await db
    .select()
    .from(nanopayments)
    .where(eq(nanopayments.settlementTxHash, settlementTxHash))
    .orderBy(desc(nanopayments.createdAt))
    .limit(1);

  if (!ledgerRow.length) {
    throw new Error(`No NanoLedger entry found for settlement ${settlementTxHash}`);
  }

  const entry = ledgerRow[0];
  console.log("Settlement confirmed on Arc:", settlementTxHash);
  console.log("Circle split tx hashes:", payload.splitTxHashes.join(", "));
  console.log("NanoLedger entry:", {
    id: entry.id,
    task: entry.task,
    amountUsdc: entry.amountUsdc,
    status: entry.status,
    providerAddress: entry.providerAddress,
  });
  console.log(`Paid request verified for ${payerAddress}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});