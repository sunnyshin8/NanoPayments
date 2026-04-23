import { verifyNanopayment } from "@/lib/circle/nanopayments";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const paymentData =
      req.headers.get("x-payment") ??
      req.headers.get("payment-signature") ??
      body.paymentData;

    if (!paymentData || !body.resourceUrl || !body.expectedAmount || !body.payerAddress) {
      return NextResponse.json({ error: "Missing verification fields" }, { status: 400 });
    }

    const result = await verifyNanopayment({
      paymentData,
      resourceUrl: body.resourceUrl,
      expectedAmount: body.expectedAmount,
      payerAddress: body.payerAddress,
    });

    return NextResponse.json(result, { status: result.success ? 200 : 402 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Verification failed" },
      { status: 500 },
    );
  }
}
