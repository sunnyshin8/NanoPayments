import { createUserWallet } from "@/lib/circle/wallets";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const [user] = await db.insert(users).values({ email }).returning();

    const wallet = await createUserWallet(user.id);

    await db
      .update(users)
      .set({
        circleWalletId: wallet.id,
        circleWalletSetId: wallet.walletSetId ?? null,
        walletAddress: wallet.address,
      })
      .where(eq(users.id, user.id));

    return NextResponse.json({
      userId: user.id,
      walletAddress: wallet.address,
      message: "Account created with Arc wallet",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Registration failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
