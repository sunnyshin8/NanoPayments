import { getUser } from "@/lib/auth/jwt";
import { bridgeToArc } from "@/lib/circle/bridge";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const user = await getUser(req);
  if (!user?.walletAddress) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { fromChain, amountUsdc, userAddress } = await req.json();

    const result = await bridgeToArc({
      fromChain,
      userAddress: userAddress ?? user.walletAddress,
      destinationAddress: user.walletAddress,
      amountUsdc,
    });

    return NextResponse.json({
      message: `Bridging $${amountUsdc} USDC from ${fromChain} to Arc`,
      txHash: result.txHash,
      estimatedTimeMs: result.estimatedTimeMs,
      bridgeFee: result.bridgeFee,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Bridge failed" },
      { status: 500 },
    );
  }
}
