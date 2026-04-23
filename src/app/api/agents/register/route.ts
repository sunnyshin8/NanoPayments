import { createAgentWallet } from "@/lib/circle/wallets";
import { registerAgentOnChain } from "@/lib/contracts/agent-identity";
import { getUser } from "@/lib/auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const user = await getUser(req);
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { metadataUri } = await req.json();
    const wallet = await createAgentWallet(user.id);
    const registrationTxHash = await registerAgentOnChain(metadataUri ?? "");

    return NextResponse.json({
      wallet,
      registrationTxHash,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Agent registration failed" },
      { status: 500 },
    );
  }
}
