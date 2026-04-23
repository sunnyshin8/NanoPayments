import "dotenv/config";

async function testPayChat() {
  console.log("🧪 Testing Nanopayment Chat API...");
  
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const url = `${baseUrl}/api/chat`;

  console.log(`Target: ${url}`);

  const payload = {
    message: "Explain the concept of an agentic economy in 2 sentences.",
    task: "chat",
    budgetUsd: 0.01
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Simulating the x402 payment header (Normally handled by the client-side facilitator)
        "x-payment": "demo-signature-for-testing",
        "x-payment-amount-usdc": "0.01"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (response.ok) {
      console.log("✅ Success!");
      console.log(`Provider: ${data.provider} (${data.model})`);
      console.log(`Output: ${data.output}`);
      console.log(`Settlement TX: ${data.settlementTxHash}`);
      console.log(`Split TXs: ${data.splitTxHashes?.join(", ") || "None (Demo Mode?)"}`);
    } else {
      console.error(`❌ API Error (${response.status}):`, data.error);
      if (response.status === 402) {
        console.log("ℹ️ This is expected if x402 settlement logic requires a real signature.");
      }
    }
  } catch (err) {
    console.error("❌ Network Error:", err);
  }
}

testPayChat();
