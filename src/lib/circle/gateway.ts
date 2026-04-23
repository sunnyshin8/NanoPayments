import * as CircleSDK from "@circle-fin/developer-controlled-wallets";

type CircleGatewayClient = {
  createTransaction: (params: {
    idempotencyKey: string;
    walletId?: string;
    tokenAddress?: string;
    destinationAddress: string;
    amounts: string[];
    fee: { type: "level"; config: { feeLevel: "MEDIUM" } };
  }) => Promise<{ data?: { transaction?: { txHash?: string } } }>;
};

type CircleInitializer = (params: {
  apiKey?: string;
  entitySecret?: string;
}) => CircleGatewayClient;

type CircleModule = {
  initiateUserControlledWalletsClient?: CircleInitializer;
  initiateDeveloperControlledWalletsClient?: CircleInitializer;
};

function getClient(): CircleGatewayClient {
  const sdkModule = CircleSDK as unknown as CircleModule;
  const initClient =
    sdkModule.initiateUserControlledWalletsClient ??
    sdkModule.initiateDeveloperControlledWalletsClient;

  if (!initClient) {
    throw new Error("Circle gateway client initializer not found in SDK");
  }

  return initClient({
    apiKey: process.env.CIRCLE_API_KEY,
    entitySecret: process.env.CIRCLE_ENTITY_SECRET,
  });
}

export async function gatewayRevenueSplit(params: {
  totalAmount: number;
  transactionId: string;
  providerAddress: string;
  ossAddress: string;
  platformAddress: string;
}): Promise<{ txHashes: string[] }> {
  const client = getClient();

  const providerAmt = (params.totalAmount * 0.8).toFixed(8);
  const ossAmt = (params.totalAmount * 0.1).toFixed(8);
  const platformAmt = (params.totalAmount * 0.1).toFixed(8);

  const transfers = await Promise.all([
    client.createTransaction({
      idempotencyKey: `split-provider-${params.transactionId}`,
      walletId: process.env.PLATFORM_WALLET_ID,
      tokenAddress: process.env.ARC_USDC_CONTRACT,
      destinationAddress: params.providerAddress,
      amounts: [providerAmt],
      fee: { type: "level", config: { feeLevel: "MEDIUM" } },
    }),
    client.createTransaction({
      idempotencyKey: `split-oss-${params.transactionId}`,
      walletId: process.env.PLATFORM_WALLET_ID,
      tokenAddress: process.env.ARC_USDC_CONTRACT,
      destinationAddress: params.ossAddress,
      amounts: [ossAmt],
      fee: { type: "level", config: { feeLevel: "MEDIUM" } },
    }),
    client.createTransaction({
      idempotencyKey: `split-platform-${params.transactionId}`,
      walletId: process.env.PLATFORM_WALLET_ID,
      tokenAddress: process.env.ARC_USDC_CONTRACT,
      destinationAddress: params.platformAddress,
      amounts: [platformAmt],
      fee: { type: "level", config: { feeLevel: "MEDIUM" } },
    }),
  ]);

  return {
    txHashes: transfers.map((t) => t.data?.transaction?.txHash ?? ""),
  };
}
