import { getX402Facilitator } from "@/lib/x402/facilitator";
import { paymentMiddleware } from "x402-next";

export const x402Config = {
  "/api/inference/summarize": {
    price: "$0.010",
    network: "arc-testnet",
    config: {
      description: "AI text summarization - powered by NanoPay",
    },
  },
  "/api/inference/analyze": {
    price: "$0.008",
    network: "arc-testnet",
    config: {
      description: "AI text analysis - powered by NanoPay",
    },
  },
} as const;

export default paymentMiddleware(
  process.env.PLATFORM_WALLET_ADDRESS as `0x${string}`,
  x402Config as unknown as Parameters<typeof paymentMiddleware>[1],
  getX402Facilitator(),
);

export const config = {
  matcher: ["/api/inference/:path*"],
};
