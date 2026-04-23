import { createPublicClient, createWalletClient, http } from "viem";
import { ViemAdapter } from "@circle-fin/adapter-viem-v2";
import * as BridgeKitPackage from "@circle-fin/bridge-kit";

type BridgeKitInstance = {
  bridge: (params: {
    from: { chain: string; address: string };
    to: { adapter: ViemAdapter; chain: string };
    amount: string;
  }) => Promise<{ txHash?: string; fee?: string }>;
};

type BridgeKitConstructor = new () => BridgeKitInstance;

type BridgeKitModule = {
  BridgeKit?: BridgeKitConstructor;
  default?: BridgeKitConstructor;
};

const arcTestnet = {
  id: Number(process.env.ARC_CHAIN_ID ?? 482),
  name: "Arc Testnet",
  network: "arc-testnet",
  nativeCurrency: { name: "USDC", symbol: "USDC", decimals: 6 },
  rpcUrls: {
    default: { http: [process.env.ARC_RPC_URL ?? ""] },
    public: { http: [process.env.ARC_RPC_URL ?? ""] },
  },
} as const;

export interface BridgeRequest {
  fromChain: "ethereum" | "base" | "polygon" | "solana";
  userAddress: string;
  destinationAddress: string;
  amountUsdc: string;
}

export interface BridgeResult {
  txHash: string;
  estimatedTimeMs: number;
  bridgeFee: string;
}

function mapSourceChain(fromChain: BridgeRequest["fromChain"]): string {
  if (fromChain === "base") return "BASE_SEPOLIA";
  if (fromChain === "polygon") return "MATIC_AMOY";
  if (fromChain === "solana") return "SOLANA_DEVNET";
  return "ETH_SEPOLIA";
}

export async function bridgeToArc(params: BridgeRequest): Promise<BridgeResult> {
  const arcPublicClient = createPublicClient({
    chain: arcTestnet,
    transport: http(process.env.ARC_RPC_URL),
  });

  const arcWalletClient = createWalletClient({
    chain: arcTestnet,
    transport: http(process.env.ARC_RPC_URL),
  });

  const adapterOptions: ConstructorParameters<typeof ViemAdapter>[0] = {
    getPublicClient: () => arcPublicClient,
    getWalletClient: () => arcWalletClient,
  };

  const adapterCapabilities = {
    addressContext: "developer-controlled",
    supportedChains: [arcTestnet],
  } as unknown as ConstructorParameters<typeof ViemAdapter>[1];

  const arcAdapter = new ViemAdapter(adapterOptions, adapterCapabilities);

  const bridgeModule = BridgeKitPackage as unknown as BridgeKitModule;
  const BridgeKitCtor =
    bridgeModule.BridgeKit ?? bridgeModule.default;

  if (!BridgeKitCtor) {
    throw new Error("BridgeKit constructor not available");
  }

  const kit = new BridgeKitCtor();

  const result = await kit.bridge({
    from: {
      chain: mapSourceChain(params.fromChain),
      address: params.userAddress,
    },
    to: {
      adapter: arcAdapter,
      chain: "Arc_Testnet",
    },
    amount: params.amountUsdc,
  });

  return {
    txHash: result?.txHash ?? "",
    estimatedTimeMs: 30_000,
    bridgeFee: result?.fee ?? "0.00",
  };
}
