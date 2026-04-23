import { defineChain } from "thirdweb";
import { settlePayment } from "thirdweb/x402";
import { getX402Facilitator } from "@/lib/x402/facilitator";

const arcTestnet = defineChain(Number(process.env.ARC_CHAIN_ID ?? 482));

export interface VerificationResult {
  success: boolean;
  txHash: string;
  userId: string;
  settledAmount?: number;
}

export async function verifyNanopayment(params: {
  paymentData: string;
  resourceUrl: string;
  expectedAmount: string;
  payerAddress: string;
}): Promise<VerificationResult> {
  try {
    const result = await settlePayment({
      resourceUrl: params.resourceUrl,
      method: "POST",
      paymentData: params.paymentData,
      payTo: process.env.PLATFORM_WALLET_ADDRESS as `0x${string}`,
      network: arcTestnet,
      price: `$${params.expectedAmount}`,
      facilitator: getX402Facilitator(),
    });

    if (result.status === 200) {
      const txHash =
        (result.responseHeaders as Record<string, string> | undefined)?.[
          "x-transaction-hash"
        ] ?? "";

      return {
        success: true,
        txHash,
        userId: params.payerAddress,
        settledAmount: Number(params.expectedAmount),
      };
    }

    return { success: false, txHash: "", userId: "" };
  } catch {
    return { success: false, txHash: "", userId: "" };
  }
}
