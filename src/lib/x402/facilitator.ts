import { createThirdwebClient } from "thirdweb";
import { facilitator } from "thirdweb/x402";

type X402FacilitatorInstance = ReturnType<typeof facilitator>;

let cachedFacilitator: X402FacilitatorInstance | null = null;

export function getX402Facilitator(): X402FacilitatorInstance {
  if (cachedFacilitator) {
    return cachedFacilitator;
  }

  const secretKey = process.env.THIRDWEB_SECRET_KEY;
  const serverWalletAddress = process.env.PLATFORM_WALLET_ADDRESS;

  if (!secretKey) {
    throw new Error("THIRDWEB_SECRET_KEY is required");
  }

  if (!serverWalletAddress) {
    throw new Error("PLATFORM_WALLET_ADDRESS is required");
  }

  const thirdwebClient = createThirdwebClient({
    secretKey,
  });

  cachedFacilitator = facilitator({
    client: thirdwebClient,
    serverWalletAddress: serverWalletAddress as `0x${string}`,
    waitUntil: "submitted",
  });

  return cachedFacilitator;
}

export const x402Facilitator = new Proxy({} as X402FacilitatorInstance, {
  get(_target, prop) {
    const instance = getX402Facilitator() as unknown as Record<PropertyKey, unknown>;
    return instance[prop];
  },
}) as X402FacilitatorInstance;
