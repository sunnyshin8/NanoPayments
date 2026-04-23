import { getUser } from "@/lib/auth/jwt";
import { getWalletBalance } from "@/lib/circle/wallets";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const user = await getUser(req);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const walletId = user.circleWalletId ?? req.nextUrl.searchParams.get("walletId");
  if (!walletId) {
    return NextResponse.json({ error: "Missing walletId" }, { status: 400 });
  }

  try {
    const balance = await getWalletBalance(walletId);
    return NextResponse.json(balance);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Balance query failed" },
      { status: 500 },
    );
  }
}
