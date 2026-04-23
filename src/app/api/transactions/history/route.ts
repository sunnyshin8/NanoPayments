import { NextResponse } from "next/server";

export async function GET() {
  const now = Date.now();
  const rows = [
    {
      id: "tx_001",
      amount: "$0.010",
      split: "80/10/10",
      state: "Settled",
      createdAt: new Date(now - 4 * 60_000).toISOString(),
    },
    {
      id: "tx_002",
      amount: "$0.008",
      split: "80/10/10",
      state: "Settled",
      createdAt: new Date(now - 12 * 60_000).toISOString(),
    },
    {
      id: "tx_003",
      amount: "$0.011",
      split: "80/10/10",
      state: "Pending",
      createdAt: new Date(now - 25 * 60_000).toISOString(),
    },
  ];

  return NextResponse.json({ rows });
}
