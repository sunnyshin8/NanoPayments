import { db } from "@/lib/db";
import { nanopayments } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const recent = await db
      .select()
      .from(nanopayments)
      .orderBy(desc(nanopayments.createdAt))
      .limit(10);

    return NextResponse.json(recent);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
