import * as CircleSDK from "@circle-fin/developer-controlled-wallets";

type CircleWalletClient = {
  createWalletSet: (params: {
    idempotencyKey: string;
    name: string;
  }) => Promise<{ data?: { walletSet?: { id?: string } } }>;
  createWallets: (params: {
    idempotencyKey: string;
    blockchains: string[];
    count: number;
    walletSetId?: string;
  }) => Promise<{
    data?: {
      wallets?: Array<{
        id?: string;
        address?: string;
        blockchain?: string;
        state?: string;
      }>;
    };
  }>;
  getWalletTokenBalance: (params: { id: string }) => Promise<{
    data?: { tokenBalances?: Array<{ token?: { symbol?: string }; amount?: string }> };
  }>;
  createTransaction: (params: {
    idempotencyKey: string;
    walletId: string;
    tokenAddress?: string;
    destinationAddress: string;
    amounts: string[];
    fee: { type: "level"; config: { feeLevel: "MEDIUM" } };
  }) => Promise<{ data?: { transaction?: { txHash?: string; id?: string } } }>;
};

type CircleInitializer = (params: {
  apiKey?: string;
  entitySecret?: string;
}) => CircleWalletClient;

type CircleModule = {
  initiateUserControlledWalletsClient?: CircleInitializer;
  initiateDeveloperControlledWalletsClient?: CircleInitializer;
};

export interface CircleWallet {
  id: string;
  walletSetId?: string;
  address: string;
  blockchain: string;
  state: string;
}

function getCircleClient(): CircleWalletClient {
  const sdkModule = CircleSDK as unknown as CircleModule;
  const initClient =
    sdkModule.initiateUserControlledWalletsClient ??
    sdkModule.initiateDeveloperControlledWalletsClient;

  if (!initClient) {
    throw new Error("Circle wallet client initializer not found in SDK");
  }

  return initClient({
    apiKey: process.env.CIRCLE_API_KEY,
    entitySecret: process.env.CIRCLE_ENTITY_SECRET,
  });
}

export async function createUserWallet(userId: string): Promise<CircleWallet> {
  const circleClient = getCircleClient();

  const walletSetResp = await circleClient.createWalletSet({
    idempotencyKey: `walletset-${userId}`,
    name: `NanoPay User ${userId}`,
  });
  const walletSetId = walletSetResp.data?.walletSet?.id;

  const walletResp = await circleClient.createWallets({
    idempotencyKey: `wallet-${userId}`,
    blockchains: ["ARC-TESTNET"],
    count: 1,
    walletSetId,
  });

  const wallet = walletResp.data?.wallets?.[0];
  if (!wallet?.id || !wallet?.address) {
    throw new Error("Failed to create Circle wallet");
  }

  return {
    id: wallet.id,
    walletSetId,
    address: wallet.address,
    blockchain: wallet.blockchain ?? "ARC-TESTNET",
    state: wallet.state ?? "LIVE",
  };
}

export async function createAgentWallet(agentId: string): Promise<CircleWallet> {
  const circleClient = getCircleClient();

  const walletSetResp = await circleClient.createWalletSet({
    idempotencyKey: `walletset-agent-${agentId}`,
    name: `NanoPay Agent ${agentId}`,
  });
  const walletSetId = walletSetResp.data?.walletSet?.id;

  const walletResp = await circleClient.createWallets({
    idempotencyKey: `wallet-agent-${agentId}`,
    blockchains: ["ARC-TESTNET"],
    count: 1,
    walletSetId,
  });

  const wallet = walletResp.data?.wallets?.[0];
  if (!wallet?.id || !wallet?.address) {
    throw new Error("Failed to create Circle agent wallet");
  }

  return {
    id: wallet.id,
    walletSetId,
    address: wallet.address,
    blockchain: wallet.blockchain ?? "ARC-TESTNET",
    state: wallet.state ?? "LIVE",
  };
}

export async function getWalletBalance(walletId: string): Promise<{
  usdc: string;
  walletId: string;
}> {
  const circleClient = getCircleClient();

  const resp = await circleClient.getWalletTokenBalance({ id: walletId });
  const usdcToken = resp.data?.tokenBalances?.find(
    (t) => t.token?.symbol === "USDC",
  );

  return {
    usdc: usdcToken?.amount ?? "0.00",
    walletId,
  };
}

export async function transferFromWallet(params: {
  sourceWalletId: string;
  destinationAddress: string;
  amount: string;
  idempotencyKey: string;
}): Promise<{ txHash: string; transactionId: string }> {
  const circleClient = getCircleClient();

  const resp = await circleClient.createTransaction({
    idempotencyKey: params.idempotencyKey,
    walletId: params.sourceWalletId,
    tokenAddress: process.env.ARC_USDC_CONTRACT,
    destinationAddress: params.destinationAddress,
    amounts: [params.amount],
    fee: { type: "level", config: { feeLevel: "MEDIUM" } },
  });

  return {
    txHash: resp.data?.transaction?.txHash ?? "",
    transactionId: resp.data?.transaction?.id ?? "",
  };
}
