import { x402Facilitator } from "@/lib/x402/facilitator";
import { getSmartRouter } from "@/lib/ai/orchestrator";
import { gatewayRevenueSplit } from "@/lib/circle/gateway";
import { nanoPayLimiter } from "@/lib/security/rate-limit";
import { settlePayment } from "thirdweb/x402";
import { NextRequest, NextResponse } from "next/server";
import { defineChain } from "thirdweb";
import { db } from "@/lib/db";
import { nanopayments } from "@/lib/db/schema";

const arcChain = defineChain(Number(process.env.ARC_CHAIN_ID ?? 5042002));

type ChatRequestBody = {
  message?: string;
  task?: "chat" | "summarize" | "analyze" | "extract";
  budgetUsd?: number;
  resourceUrl?: string;
};

function parsePaidAmountUsdc(req: NextRequest): number | undefined {
  const raw =
    req.headers.get("x-x402-amount-usdc") ??
    req.headers.get("x-payment-amount-usdc") ??
    req.headers.get("x-payment-amount") ??
    req.headers.get("x-price-usdc");

  if (!raw) {
    return undefined;
  }

  const parsed = Number(raw.replace(/[^0-9.]/g, ""));
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return undefined;
  }

  return Number(parsed.toFixed(6));
}

function parseBudget(task: ChatRequestBody["task"], rawBudget?: number) {
  if (typeof rawBudget === "number" && Number.isFinite(rawBudget) && rawBudget > 0) {
    return Number(rawBudget.toFixed(6));
  }

  switch (task) {
    case "summarize":
      return 0.01;
    case "analyze":
      return 0.008;
    case "extract":
      return 0.002;
    default:
      return 0.05;
  }
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "anonymous";
  const paymentData = req.headers.get("payment-signature") ?? req.headers.get("x-payment");
  const isPaid = !!paymentData;

  const rateLimit = await nanoPayLimiter.check(ip, isPaid);
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please include payment for higher throughput." },
      { 
        status: 429,
        headers: {
          "x-ratelimit-limit": rateLimit.limit.toString(),
          "x-ratelimit-remaining": rateLimit.remaining.toString(),
          "x-ratelimit-reset": rateLimit.reset.toString(),
        }
      }
    );
  }

  let body: ChatRequestBody;

  try {
    body = (await req.json()) as ChatRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const prompt = body.message?.trim();
  if (!prompt) {
    return NextResponse.json({ error: "message is required" }, { status: 400 });
  }

  const task = body.task ?? "chat";
  const priceUsd = parseBudget(task, body.budgetUsd);
  const paidAmountUsdc = parsePaidAmountUsdc(req) ?? priceUsd;
  const resourceUrl = body.resourceUrl ?? req.url;

  const paymentArgs = {
    resourceUrl,
    method: "POST" as const,
    paymentData,
    payTo: process.env.PLATFORM_WALLET_ADDRESS as `0x${string}`,
    network: arcChain,
    price: `$${priceUsd.toFixed(6)}`,
    facilitator: x402Facilitator,
    routeConfig: {
      description: `NanoPay ${task} request`,
      mimeType: "application/json",
    },
  };

  const settlement = await settlePayment({
    ...paymentArgs,
    waitUntil: "submitted",
  });

  if (settlement.status !== 200) {
    return NextResponse.json(settlement.responseBody, {
      status: settlement.status,
      headers: settlement.responseHeaders,
    });
  }

  const settlementTxHash =
    (settlement.responseHeaders as Record<string, string> | undefined)?.[
      "x-transaction-hash"
    ] ?? "";

  const router = getSmartRouter();

  try {
    const result = await router.generate({
      task,
      prompt,
      budgetUsd: priceUsd,
      paidAmountUsdc,
    });

    const platformAddress = process.env.PLATFORM_WALLET_ADDRESS ?? "";
    const ossAddress = process.env.OSS_DEPENDENCY_WALLET_ADDRESS ?? platformAddress;

    let splitTxHashes: string[] = [];
    let splitWarning: string | undefined;

    if (platformAddress && ossAddress && result.providerPayoutAddress) {
      try {
        const splitResult = await gatewayRevenueSplit({
          totalAmount: paidAmountUsdc,
          transactionId: settlementTxHash || crypto.randomUUID(),
          providerAddress: result.providerPayoutAddress,
          ossAddress,
          platformAddress,
        });
        splitTxHashes = splitResult.txHashes;
      } catch {
        splitWarning = "Revenue split failed but payment settlement succeeded";
      }
    } else {
      splitWarning = "Revenue split skipped due to missing payout addresses";
    }

    // Record to NanoLedger for Observability
    try {
      await db.insert(nanopayments).values({
        task,
        amountUsdc: paidAmountUsdc.toString(),
        settlementTxHash,
        splitTxHashes,
        providerAddress: result.providerPayoutAddress || platformAddress,
        status: "settled",
      });
    } catch (dbError) {
      console.error("Ledger logging failed:", dbError);
      // We don't block the response if only logging fails
    }

    return NextResponse.json(
      {
        provider: result.provider,
        model: result.model,
        specialistId: result.specialistId,
        specialistName: result.specialistName,
        specialistReputation: result.reputation ?? null,
        priceUsd: result.priceUsd,
        paidAmountUsdc,
        settlementTxHash,
        splitTxHashes,
        splitWarning,
        output: result.output,
      },
      {
        status: 200,
        headers: settlement.responseHeaders,
      },
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Chat generation failed" },
      { status: 500 },
    );
  }
}
