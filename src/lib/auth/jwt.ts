import { jwtVerify } from "jose";
import type { NextRequest } from "next/server";

export interface SessionUser {
  id: string;
  email?: string;
  walletAddress?: string;
  circleWalletId?: string;
}

export async function getUser(req: NextRequest): Promise<SessionUser | null> {
  const authHeader = req.headers.get("authorization") ?? "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : req.cookies.get("session")?.value;

  if (!token) {
    return null;
  }

  const secret = process.env.SESSION_JWT_SECRET;
  if (!secret) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret),
    );

    return {
      id: String(payload.sub ?? ""),
      email: payload.email ? String(payload.email) : undefined,
      walletAddress: payload.walletAddress
        ? String(payload.walletAddress)
        : undefined,
      circleWalletId: payload.circleWalletId
        ? String(payload.circleWalletId)
        : undefined,
    };
  } catch {
    return null;
  }
}
