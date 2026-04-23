import {
  getAgentReputation,
  updateAgentReputation,
} from "@/lib/contracts/agent-identity";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const agentId = req.nextUrl.searchParams.get("agentId") as `0x${string}` | null;
  if (!agentId) {
    return NextResponse.json({ error: "Missing agentId" }, { status: 400 });
  }

  try {
    const result = await getAgentReputation(agentId);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Read reputation failed" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { agentId, rating } = await req.json();
    if (!agentId || typeof rating !== "number") {
      return NextResponse.json({ error: "agentId and rating required" }, { status: 400 });
    }

    await updateAgentReputation(agentId, rating);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Update reputation failed" },
      { status: 500 },
    );
  }
}
