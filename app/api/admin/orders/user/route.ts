import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";

function getOrderModel() {
  if (mongoose.models.Order) return mongoose.models.Order;
  const schema = new mongoose.Schema({
    id: String, items: Array, total: Number, customer: Object,
    paymentMethod: String, paymentId: String,
    status: { type: String, default: "confirmed" },
    userId: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
  });
  return mongoose.model("Order", schema);
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();
    const Order = getOrderModel();

    // Match by userId OR by customer email (for guest orders placed before signup)
    const orders = await Order.find({
      $or: [
        { userId: user.id },
        { "customer.email": user.email },
      ],
    }).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ orders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
