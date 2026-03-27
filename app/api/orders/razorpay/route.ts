import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { amount } = await request.json();

    const keyId = process.env.RAZORPAY_KEY_ID || "rzp_test_YOUR_KEY_HERE";
    const keySecret = process.env.RAZORPAY_KEY_SECRET || "YOUR_SECRET_HERE";

    // Create Razorpay order via their REST API
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic " +
          Buffer.from(`${keyId}:${keySecret}`).toString("base64"),
      },
      body: JSON.stringify({
        amount: amount * 100, // Razorpay expects paise
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      }),
    });

    if (!response.ok) {
      // Return a mock order for test/demo mode
      return NextResponse.json({
        key: keyId,
        amount: amount * 100,
        currency: "INR",
        orderId: `order_mock_${Date.now()}`,
      });
    }

    const order = await response.json();

    return NextResponse.json({
      key: keyId,
      amount: order.amount,
      currency: order.currency,
      orderId: order.id,
    });
  } catch (error) {
    console.error("Razorpay error:", error);
    // Graceful fallback for demo/development
    return NextResponse.json({
      key: "rzp_test_demo",
      amount: 0,
      currency: "INR",
      orderId: `order_demo_${Date.now()}`,
    });
  }
}
