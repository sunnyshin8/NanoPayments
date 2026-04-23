import { createUserWallet } from "@/lib/circle/wallets";
import { getUser } from "@/lib/auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const user = await getUser(req);

  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const wallet = await createUserWallet(user.id);
    return NextResponse.json(wallet);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Wallet creation failed" },
      { status: 500 },
    );
  }
}
